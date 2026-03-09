import { motion, AnimatePresence } from 'framer-motion';
import { Search, Shield, Clock, Award, Star, TrendingUp, Users, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CarCard from '../components/CarCard';
import { carService } from '../services/carService';
import LoadingSkeleton from '../components/LoadingSkeleton';

const Home = () => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState({
    location: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchFeaturedCars();
  }, []);

  const fetchFeaturedCars = async () => {
    try {
      const data = await carService.getFeaturedCars();
      console.log('Featured cars response:', data);
      // Handle both array and object responses
      const carsArray = Array.isArray(data) ? data : (data.cars || data);
      setFeaturedCars(carsArray.slice(0, 6));
    } catch (error) {
      console.error('Error fetching featured cars:', error);
      // Set empty array on error
      setFeaturedCars([]);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { icon: Users, value: '50K+', label: 'Happy Customers' },
    { icon: TrendingUp, value: '200+', label: 'Premium Cars' },
    { icon: CheckCircle, value: '99%', label: 'Satisfaction Rate' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Enhanced */}
      <section className="relative bg-gradient-to-br from-primary via-emerald-600 to-emerald-700 text-white py-24 md:py-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span className="text-sm font-semibold">Premium Car Rental Experience</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-7xl font-heading font-black mb-6 leading-tight"
            >
              Find Your Perfect
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Dream Ride
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl md:text-2xl mb-12 text-emerald-50 max-w-3xl mx-auto"
            >
              Rent premium cars from trusted owners in your area. 
              <span className="font-semibold"> Best prices guaranteed.</span>
            </motion.p>

            {/* Search Bar - Enhanced */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="glass-effect rounded-3xl shadow-2xl p-6 md:p-8 max-w-5xl mx-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Where to?"
                    value={searchData.location}
                    onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-gray-900 font-medium"
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">
                    Pick-up Date
                  </label>
                  <input
                    type="date"
                    value={searchData.startDate}
                    onChange={(e) => setSearchData({ ...searchData, startDate: e.target.value })}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-gray-900 font-medium"
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={searchData.endDate}
                    onChange={(e) => setSearchData({ ...searchData, endDate: e.target.value })}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-gray-900 font-medium"
                  />
                </div>
                <div className="flex items-end">
                  <Link
                    to="/cars"
                    className="w-full bg-gradient-to-r from-secondary to-slate-800 text-white px-6 py-3.5 rounded-xl font-bold hover:from-slate-800 hover:to-secondary transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group"
                  >
                    <Search className="h-5 w-5" />
                    <span>Search Cars</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <stat.icon className="h-8 w-8 mx-auto mb-2 text-yellow-300" />
                  <div className="text-3xl font-black mb-1">{stat.value}</div>
                  <div className="text-sm text-emerald-100">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Cars - Enhanced Premium Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.span 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-emerald-600 text-white rounded-full text-sm font-bold mb-6 shadow-lg"
            >
              <Star className="h-4 w-4 fill-current" />
              FEATURED COLLECTION
              <Star className="h-4 w-4 fill-current" />
            </motion.span>
            <h2 className="text-5xl md:text-6xl font-heading font-black text-secondary mb-6">
              Premium <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">Vehicles</span>
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
              Handpicked selection of the finest luxury and performance cars. 
              <span className="block mt-2 text-primary font-semibold">Experience excellence on every journey.</span>
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <LoadingSkeleton type="card" count={8} />
            </div>
          ) : (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              >
                {featuredCars.map((car, index) => (
                  <motion.div
                    key={car._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <CarCard car={car} index={index} />
                  </motion.div>
                ))}
              </motion.div>

              {/* View All Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="text-center mt-16"
              >
                <Link 
                  to="/cars" 
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-secondary to-slate-800 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:from-slate-800 hover:to-secondary transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 group"
                >
                  <span>Explore All {featuredCars.length}+ Vehicles</span>
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </Link>
                <p className="text-gray-500 text-sm mt-4">
                  ✨ New cars added weekly • 🔒 Secure booking • 💯 Best price guarantee
                </p>
              </motion.div>
            </>
          )}

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { icon: Shield, label: 'Verified Cars', value: '100%' },
              { icon: Users, label: 'Happy Customers', value: '10K+' },
              { icon: Award, label: 'Rating', value: '4.9/5' },
              { icon: Clock, label: '24/7 Support', value: 'Always' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
              >
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                <div className="text-2xl font-black text-secondary mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us - Enhanced */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-heading font-black text-secondary mb-4">
              Why Choose DriveEasy
            </h2>
            <p className="text-gray-600 text-xl">Experience the difference</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Trusted & Safe',
                description: 'All vehicles are verified and insured for your peace of mind',
                color: 'from-blue-500 to-blue-600',
              },
              {
                icon: Clock,
                title: 'Instant Booking',
                description: 'Book your car in minutes with our seamless process',
                color: 'from-purple-500 to-purple-600',
              },
              {
                icon: Award,
                title: 'Best Prices',
                description: 'Competitive rates with no hidden fees',
                color: 'from-orange-500 to-orange-600',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ y: -8 }}
                className="card-premium p-8 text-center group hover-glow"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Enhanced */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-heading font-black text-secondary mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 text-xl">Three simple steps to your perfect ride</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-1/4 left-1/4 right-1/4 h-1 bg-gradient-to-r from-primary via-emerald-500 to-primary"></div>
            
            {[
              { step: '1', title: 'Search', description: 'Find the perfect car for your needs', icon: Search },
              { step: '2', title: 'Book', description: 'Reserve your car instantly online', icon: CheckCircle },
              { step: '3', title: 'Drive', description: 'Pick up and enjoy your journey', icon: Award },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="text-center relative"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-20 h-20 bg-gradient-to-br from-primary to-emerald-600 text-white rounded-2xl flex items-center justify-center text-3xl font-black mx-auto mb-6 shadow-xl relative z-10"
                >
                  {item.step}
                </motion.div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 text-lg">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Enhanced */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-heading font-black text-secondary mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 text-xl">Real experiences from real people</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'John Doe',
                role: 'Business Traveler',
                rating: 5,
                comment: 'Amazing service! The car was clean and the booking process was seamless. Highly recommend for business trips.',
                avatar: 'JD',
              },
              {
                name: 'Jane Smith',
                role: 'Weekend Explorer',
                rating: 5,
                comment: 'Great selection of cars at competitive prices. The customer support was outstanding!',
                avatar: 'JS',
              },
              {
                name: 'Mike Johnson',
                role: 'Family Vacationer',
                rating: 5,
                comment: 'Professional and reliable. Perfect for our family vacation. Will definitely use again!',
                avatar: 'MJ',
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -8 }}
                className="card-premium p-8 hover-glow"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.comment}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-emerald-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-secondary">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
