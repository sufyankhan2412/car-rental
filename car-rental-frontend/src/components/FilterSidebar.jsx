import { useState } from 'react';
import { Sliders } from 'lucide-react';

const FilterSidebar = ({ filters, onFilterChange }) => {
  const [priceRange, setPriceRange] = useState(filters.priceRange || [0, 500]);

  const vehicleTypes = ['Sedan', 'SUV', 'Truck', 'Van', 'Luxury', 'Electric'];
  const transmissionTypes = ['Automatic', 'Manual'];
  const seatOptions = [2, 4, 5, 7, 8];

  const handlePriceChange = (e) => {
    const newRange = [priceRange[0], parseInt(e.target.value)];
    setPriceRange(newRange);
    onFilterChange({ ...filters, priceRange: newRange });
  };

  const handleVehicleTypeToggle = (type) => {
    const currentTypes = filters.vehicleType || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    onFilterChange({ ...filters, vehicleType: newTypes });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Sliders className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Filters</h2>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range
        </label>
        <input
          type="range"
          min="0"
          max="500"
          value={priceRange[1]}
          onChange={handlePriceChange}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      {/* Vehicle Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Vehicle Type
        </label>
        <div className="space-y-2">
          {vehicleTypes.map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                checked={(filters.vehicleType || []).includes(type)}
                onChange={() => handleVehicleTypeToggle(type)}
                className="rounded text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Seats */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Seats
        </label>
        <div className="flex flex-wrap gap-2">
          {seatOptions.map((seat) => (
            <button
              key={seat}
              onClick={() => onFilterChange({ ...filters, seats: seat })}
              className={`px-4 py-2 rounded-lg border transition ${
                filters.seats === seat
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
              }`}
            >
              {seat}
            </button>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Transmission
        </label>
        <div className="space-y-2">
          {transmissionTypes.map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="radio"
                name="transmission"
                checked={filters.transmission === type}
                onChange={() => onFilterChange({ ...filters, transmission: type })}
                className="text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset Filters */}
      <button
        onClick={() => onFilterChange({
          priceRange: [0, 500],
          vehicleType: [],
          seats: null,
          transmission: null,
        })}
        className="w-full btn-outline py-2"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
