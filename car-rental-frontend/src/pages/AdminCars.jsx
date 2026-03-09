import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Save, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useStore from '../store/useStore';
import { carService } from '../services/carService';
import toast from 'react-hot-toast';

const AdminCars = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useStore();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
      toast.error('Admin access required');
      return;
    }
    fetchCars();
  }, [isAuthenticated, user]);

  const fetchCars = async () => {
    try {
      const data = await carService.getCars({});
      setCars(data.cars || data);
    } catch (error) {
      toast.error('Failed to load cars');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    Object.keys(car).forEach(key => {
      setValue(key, car[key]);
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;

    try {
      await carService.deleteCar(id);
      toast.success('Car deleted successfully');
      fetchCars();
    } catch (error) {
      toast.error('Failed to delete car');
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingCar) {
        await carService.updateCar(editingCar._id, data);
        toast.success('Car updated successfully');
      } else {
        await carService.createCar(data);
        toast.success('Car created successfully');
      }
      setShowModal(false);
      setEditingCar(null);
      reset();
      fetchCars();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const openCreateModal = () => {
    setEditingCar(null);
    reset();
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-heading font-black text-secondary">
              Manage Cars
            </h1>
            <p className="text-gray-600 mt-2">Add, edit, or remove vehicles from your fleet</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openCreateModal}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Car</span>
          </motion.button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="card-premium p-6 animate-pulse">
                <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car, index) => (
              <motion.div
                key={car._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-premium overflow-hidden hover-glow"
              >
                <div className="relative h-48">
                  <img
                    src={car.image || 'https://via.placeholder.com/400x300?text=Car'}
                    alt={car.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(car)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4 text-blue-600" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(car._id)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </motion.button>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-secondary mb-2">{car.name}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Price: <span className="font-semibold text-primary">${car.pricePerDay}/day</span></p>
                    <p>Location: {car.location}</p>
                    <p>Type: {car.vehicleType}</p>
                    <p>Status: <span className={car.available ? 'text-green-600' : 'text-red-600'}>
                      {car.available ? 'Available' : 'Unavailable'}
                    </span></p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-secondary">
                    {editingCar ? 'Edit Car' : 'Add New Car'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Car Name *
                      </label>
                      <input
                        {...register('name', { required: 'Name is required' })}
                        className="input-field"
                        placeholder="Tesla Model 3"
                      />
                      {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Brand *
                      </label>
                      <input
                        {...register('brand', { required: 'Brand is required' })}
                        className="input-field"
                        placeholder="Tesla"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Model *
                      </label>
                      <input
                        {...register('model', { required: 'Model is required' })}
                        className="input-field"
                        placeholder="Model 3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Year *
                      </label>
                      <input
                        type="number"
                        {...register('year', { required: 'Year is required' })}
                        className="input-field"
                        placeholder="2023"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Price Per Day ($) *
                      </label>
                      <input
                        type="number"
                        {...register('pricePerDay', { required: 'Price is required' })}
                        className="input-field"
                        placeholder="89"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Location *
                      </label>
                      <input
                        {...register('location', { required: 'Location is required' })}
                        className="input-field"
                        placeholder="San Francisco, CA"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Seats *
                      </label>
                      <input
                        type="number"
                        {...register('seats', { required: 'Seats is required' })}
                        className="input-field"
                        placeholder="5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Transmission *
                      </label>
                      <select {...register('transmission', { required: true })} className="input-field">
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Fuel Type *
                      </label>
                      <select {...register('fuelType', { required: true })} className="input-field">
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Vehicle Type *
                      </label>
                      <select {...register('vehicleType', { required: true })} className="input-field">
                        <option value="Sedan">Sedan</option>
                        <option value="SUV">SUV</option>
                        <option value="Truck">Truck</option>
                        <option value="Van">Van</option>
                        <option value="Luxury">Luxury</option>
                        <option value="Electric">Electric</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      {...register('description', { required: 'Description is required' })}
                      className="input-field"
                      rows="3"
                      placeholder="Describe the car..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Image URL
                    </label>
                    <input
                      {...register('image')}
                      className="input-field"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('available')}
                        className="rounded text-primary focus:ring-primary"
                      />
                      <span className="ml-2 text-sm font-medium">Available</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('featured')}
                        className="rounded text-primary focus:ring-primary"
                      />
                      <span className="ml-2 text-sm font-medium">Featured</span>
                    </label>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 btn-primary flex items-center justify-center space-x-2"
                    >
                      <Save className="h-5 w-5" />
                      <span>{editingCar ? 'Update' : 'Create'}</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminCars;