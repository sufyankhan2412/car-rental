import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, XCircle, Clock, Upload, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import api from '../services/api';
import toast from 'react-hot-toast';

const Verification = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useStore();
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchVerificationStatus();
  }, [isAuthenticated]);

  const fetchVerificationStatus = async () => {
    try {
      const response = await api.get('/verification/status');
      setVerificationStatus(response.data);
    } catch (error) {
      console.error('Error fetching verification status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartVerification = async () => {
    setCreating(true);
    try {
      const response = await api.post('/verification/create-session');
      
      // Redirect to Stripe Identity verification
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        toast.error('Failed to create verification session');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start verification');
      setCreating(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'pending':
        return <Clock className="h-16 w-16 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="h-16 w-16 text-red-500" />;
      default:
        return <Shield className="h-16 w-16 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'from-green-500 to-emerald-600';
      case 'pending':
        return 'from-yellow-500 to-orange-600';
      case 'rejected':
        return 'from-red-500 to-red-600';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'verified':
        return {
          title: 'Identity Verified',
          description: 'Your identity has been successfully verified. You can now book cars.',
        };
      case 'pending':
        return {
          title: 'Verification Pending',
          description: 'Your verification is being reviewed. This usually takes a few minutes.',
        };
      case 'rejected':
        return {
          title: 'Verification Failed',
          description: 'Your verification was not successful. Please try again with valid documents.',
        };
      default:
        return {
          title: 'Verify Your Identity',
          description: 'To book cars, you need to verify your identity. This helps keep our community safe.',
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading verification status...</p>
        </div>
      </div>
    );
  }

  const status = verificationStatus?.status || 'unverified';
  const statusInfo = getStatusMessage(status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium p-8 md:p-12"
        >
          {/* Status Icon */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="inline-block mb-6"
            >
              {getStatusIcon(status)}
            </motion.div>

            <h1 className="text-4xl font-heading font-black text-secondary mb-4">
              {statusInfo.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {statusInfo.description}
            </p>
          </div>

          {/* Status Details */}
          {status !== 'unverified' && (
            <div className={`bg-gradient-to-r ${getStatusColor(status)} rounded-xl p-6 mb-8 text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Verification Status</p>
                  <p className="text-2xl font-bold capitalize">{status}</p>
                </div>
                {verificationStatus?.verifiedAt && (
                  <div className="text-right">
                    <p className="text-sm opacity-90 mb-1">Verified On</p>
                    <p className="font-semibold">
                      {new Date(verificationStatus.verifiedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Why Verify Section */}
          {status === 'unverified' && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-lg mb-4 text-blue-900 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Why do I need to verify?
              </h3>
              <ul className="space-y-3 text-sm text-blue-800">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Ensures safety for all users in our community</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Protects car owners from fraud</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Required by law for car rentals</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Quick and secure process powered by Stripe</span>
                </li>
              </ul>
            </div>
          )}

          {/* What You Need Section */}
          {status === 'unverified' && (
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-lg mb-4">What you'll need:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-medium mb-1">Valid ID</p>
                  <p className="text-sm text-gray-600">Driver's license, passport, or national ID</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-medium mb-1">Clear Photos</p>
                  <p className="text-sm text-gray-600">Take clear photos of your document</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-medium mb-1">Selfie</p>
                  <p className="text-sm text-gray-600">Take a selfie for identity confirmation</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {status === 'unverified' || status === 'rejected' ? (
              <button
                onClick={handleStartVerification}
                disabled={creating}
                className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {creating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Starting verification...</span>
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5" />
                    <span>Start Verification</span>
                  </>
                )}
              </button>
            ) : status === 'verified' ? (
              <button
                onClick={() => navigate('/cars')}
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <span>Browse Cars</span>
              </button>
            ) : (
              <button
                onClick={fetchVerificationStatus}
                className="btn-outline flex items-center justify-center space-x-2"
              >
                <Clock className="h-5 w-5" />
                <span>Refresh Status</span>
              </button>
            )}

            <button
              onClick={() => navigate('/dashboard')}
              className="btn-outline flex items-center justify-center"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Security Note */}
          <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
            <p className="flex items-center justify-center">
              <Shield className="h-4 w-4 mr-2" />
              Your data is encrypted and securely processed by Stripe Identity
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Verification;
