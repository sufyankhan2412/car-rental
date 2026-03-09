import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CarListing from './pages/CarListing';
import CarDetails from './pages/CarDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Booking from './pages/Booking';
import Dashboard from './pages/Dashboard';
import Checkout from './pages/Checkout';
import AdminCars from './pages/AdminCars';
import HowItWorks from './pages/HowItWorks';
import BookingSuccess from './pages/BookingSuccess';
import Verification from './pages/Verification';
import ContractSigning from './pages/ContractSigning';
import BookingDetails from './pages/BookingDetails';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminBookings from './pages/AdminBookings';
import AdminPayments from './pages/AdminPayments';
import AdminCustomerDetails from './pages/AdminCustomerDetails';
import AdminAnalytics from './pages/AdminAnalytics';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<CarListing />} />
            <Route path="/cars/:id" element={<CarDetails />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/booking-success" element={<BookingSuccess />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/sign-contract/:bookingId" element={<ContractSigning />} />
            <Route path="/bookings/:id" element={<BookingDetails />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/customers/:id" element={<AdminCustomerDetails />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
            <Route path="/admin/cars" element={<AdminCars />} />
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
