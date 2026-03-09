import { Link } from 'react-router-dom';
import { Car, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Car className="h-8 w-8 text-primary" />
              <span className="text-2xl font-heading font-bold">DriveEasy</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted car rental marketplace. Find the perfect vehicle for your journey.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/cars" className="text-gray-400 hover:text-primary transition">
                  Browse Cars
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-400 hover:text-primary transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-primary transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-primary transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-primary transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-400 hover:text-primary transition">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-400">
                <Mail className="h-5 w-5" />
                <span>support@driveeasy.com</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <Phone className="h-5 w-5" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <MapPin className="h-5 w-5" />
                <span>123 Main St, City, State</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} DriveEasy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
