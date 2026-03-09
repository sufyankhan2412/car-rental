import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getContractStatus, signContract } from '../services/contractService';
import useStore from '../store/useStore';

const ContractSigning = () => {
  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useStore();
  
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState('');
  const [signature, setSignature] = useState('');
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    fetchContractStatus();
  }, [bookingId]);

  const fetchContractStatus = async () => {
    try {
      setLoading(true);
      const data = await getContractStatus(bookingId);
      setContract(data.contract);
      
      // If already signed, redirect
      if (data.status === 'signed') {
        navigate(`/booking-success?bookingId=${bookingId}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load contract');
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async () => {
    if (!agreed) {
      setError('Please agree to the terms and conditions');
      return;
    }

    if (!signature.trim()) {
      setError('Please enter your full name as signature');
      return;
    }

    try {
      setSigning(true);
      setError('');
      
      await signContract(bookingId, signature);
      
      // Redirect to success page
      navigate(`/booking-success?bookingId=${bookingId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign contract');
    } finally {
      setSigning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contract...</p>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Contract not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 text-blue-600 hover:underline"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Rental Agreement
          </h1>
          <p className="text-gray-600">
            Contract Number: {contract.contractNumber}
          </p>
          <p className="text-sm text-gray-500">
            Generated: {new Date(contract.generatedAt).toLocaleString()}
          </p>
        </div>

        {/* Contract Content */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-4">Terms and Conditions</h2>
            
            <div className="space-y-4 text-sm text-gray-700">
              <p>
                This Rental Agreement ("Agreement") is entered into between DriveEasy 
                ("Owner") and {user?.name} ("Renter") for the rental of the vehicle 
                described below.
              </p>

              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold mb-2">1. Rental Period</h3>
                <p>The rental period begins and ends at the times specified in the booking. 
                Late returns may incur additional charges.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold mb-2">2. Payment</h3>
                <p>Full payment must be received before vehicle pickup. The total rental 
                cost includes the daily rate, applicable taxes, and any selected extras.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold mb-2">3. Insurance</h3>
                <p>Basic insurance is included in the rental price. Additional coverage 
                options are available at checkout. Renter is responsible for any damages 
                not covered by insurance.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold mb-2">4. Fuel Policy</h3>
                <p>Vehicle must be returned with the same fuel level as at pickup. 
                Failure to do so will result in refueling charges.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold mb-2">5. Mileage</h3>
                <p>Unlimited mileage is included unless otherwise specified in the 
                booking details.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold mb-2">6. Vehicle Use</h3>
                <p>The vehicle must not be used for: illegal purposes, racing, towing, 
                off-road driving, or transporting hazardous materials. Only authorized 
                drivers may operate the vehicle.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold mb-2">7. Damages and Liability</h3>
                <p>Renter is responsible for any damages to the vehicle during the rental 
                period. All accidents must be reported immediately to the Owner and local 
                authorities.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold mb-2">8. Cancellation Policy</h3>
                <p>Free cancellation is available up to 24 hours before the scheduled 
                pickup time. Cancellations within 24 hours may incur charges.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold mb-2">9. Governing Law</h3>
                <p>This Agreement is governed by the laws of the jurisdiction where the 
                rental takes place.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Signature Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold mb-6">Electronic Signature</h2>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Agreement Checkbox */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="agree"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="agree" className="ml-3 text-sm text-gray-700">
                I have read and agree to the terms and conditions of this Rental Agreement. 
                I understand that by signing electronically, I am legally bound by this agreement.
              </label>
            </div>

            {/* Signature Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type your full name to sign
              </label>
              <input
                type="text"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!agreed}
              />
              <p className="mt-2 text-xs text-gray-500">
                By typing your name, you are creating a legally binding electronic signature.
              </p>
            </div>

            {/* Signature Preview */}
            {signature && (
              <div className="border-2 border-gray-300 rounded-lg p-6 bg-gray-50">
                <p className="text-sm text-gray-600 mb-2">Signature Preview:</p>
                <p className="text-2xl font-signature text-gray-900" style={{ fontFamily: 'cursive' }}>
                  {signature}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Date: {new Date().toLocaleDateString()}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleSign}
                disabled={!agreed || !signature.trim() || signing}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {signing ? 'Signing...' : 'Sign Agreement'}
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>🔒 Your signature is encrypted and securely stored</p>
        </div>
      </div>
    </div>
  );
};

export default ContractSigning;
