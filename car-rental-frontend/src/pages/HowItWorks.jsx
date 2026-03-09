import { motion } from 'framer-motion';
import { Search, CheckCircle, Car, Shield, Clock, Award } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: 'Search & Browse',
      description: 'Find the perfect car by filtering through our extensive collection. Use location, price, type, and availability filters.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: CheckCircle,
      title: 'Select & Book',
      description: 'Choose your dates, pickup location, and any extras. Review the pricing breakdown and confirm your booking.',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Car,
      title: 'Pick Up & Drive',
      description: 'Collect your car at the scheduled time. Enjoy your journey with full insurance coverage and 24/7 support.',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Fully Insured',
      description: 'All vehicles come with comprehensive insurance coverage for your peace of mind.',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Our customer support team is available round the clock to assist you.',
    },
    {
      icon: Award,
      title: 'Best Price Guarantee',
      description: 'We offer competitive rates with no hidden fees. What you see is what you pay.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-emerald-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-heading font-black mb-6"
          >
            How It Works
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-emerald-100 max-w-3xl mx-auto"
          >
            Renting a car has never been easier. Follow these simple steps to get on the road.
          </motion.p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-1/4 left-1/4 right-1/4 h-1 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500"></div>

            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`w-24 h-24 bg-gradient-to-br ${step.color} text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl relative z-10`}
                  >
                    <step.icon className="h-12 w-12" />
                  </motion.div>
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl font-black text-secondary shadow-lg z-20">
                    {index + 1}
                  </div>
                  <h3 className="text-2xl font-bold text-secondary mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-heading font-black text-secondary mb-4">
              Why Choose DriveEasy
            </h2>
            <p className="text-gray-600 text-xl">Experience the difference with our premium service</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -8 }}
                className="card-premium p-8 text-center hover-glow"
              >
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 mb-6">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-emerald-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-heading font-black mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-emerald-100 mb-8">
              Browse our collection of premium vehicles and book your perfect ride today.
            </p>
            <motion.a
              href="/cars"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
            >
              Browse Cars
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
