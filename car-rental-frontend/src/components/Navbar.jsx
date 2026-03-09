import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Car } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { authService } from '../services/authService';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, setUser, logout } = useStore();
  const navigate = useNavigate();

  // Check for stored user on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token && !user) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
        }
      }
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-primary" />
            <span className="text-2xl font-heading font-bold text-secondary">
              DriveEasy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary transition">
              Home
            </Link>
            <Link to="/cars" className="text-gray-700 hover:text-primary transition">
              Browse Cars
            </Link>
            <Link to="/how-it-works" className="text-gray-700 hover:text-primary transition">
              How It Works
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-gray-700 hover:text-primary transition">
                  Dashboard
                </Link>
                {user?.role === 'admin' && (
                  <div className="relative group">
                    <button className="text-gray-700 hover:text-primary transition flex items-center gap-1">
                      Admin
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all">
                      <Link to="/admin/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Dashboard
                      </Link>
                      <Link to="/admin/analytics" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Analytics
                      </Link>
                      <Link to="/admin/bookings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Bookings
                      </Link>
                      <Link to="/admin/payments" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Payments
                      </Link>
                      <Link to="/admin/users" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Users
                      </Link>
                      <Link to="/admin/cars" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Cars
                      </Link>
                    </div>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary transition"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-primary transition">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-4 py-4 space-y-3">
              <Link
                to="/"
                className="block text-gray-700 hover:text-primary transition"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/cars"
                className="block text-gray-700 hover:text-primary transition"
                onClick={() => setIsOpen(false)}
              >
                Browse Cars
              </Link>
              <Link
                to="/how-it-works"
                className="block text-gray-700 hover:text-primary transition"
                onClick={() => setIsOpen(false)}
              >
                How It Works
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block text-gray-700 hover:text-primary transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {user?.role === 'admin' && (
                    <>
                      <Link
                        to="/admin/dashboard"
                        className="block text-gray-700 hover:text-primary transition pl-4"
                        onClick={() => setIsOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                      <Link
                        to="/admin/bookings"
                        className="block text-gray-700 hover:text-primary transition pl-4"
                        onClick={() => setIsOpen(false)}
                      >
                        Manage Bookings
                      </Link>
                      <Link
                        to="/admin/payments"
                        className="block text-gray-700 hover:text-primary transition pl-4"
                        onClick={() => setIsOpen(false)}
                      >
                        Manage Payments
                      </Link>
                      <Link
                        to="/admin/users"
                        className="block text-gray-700 hover:text-primary transition pl-4"
                        onClick={() => setIsOpen(false)}
                      >
                        Manage Users
                      </Link>
                      <Link
                        to="/admin/cars"
                        className="block text-gray-700 hover:text-primary transition pl-4"
                        onClick={() => setIsOpen(false)}
                      >
                        Manage Cars
                      </Link>
                    </>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left text-gray-700 hover:text-primary transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-gray-700 hover:text-primary transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block btn-primary text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
