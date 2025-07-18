import React, { useState } from 'react';
import { X, Calendar, Users, Utensils, Bed, Ship, Star } from 'lucide-react';
import { Cruise } from '../data/cruises';

interface CruiseModalProps {
  cruise: Cruise;
  onClose: () => void;
}

interface BookingForm {
  departureDate: string;
  roomType: string;
  mealPlan: string;
  passengerCount: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

const CruiseModal: React.FC<CruiseModalProps> = ({ cruise, onClose }) => {
  // Booking flow state
  const [currentStep, setCurrentStep] = useState<'selection' | 'details' | 'confirmation'>('selection');
  
  // Form state
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    departureDate: cruise.departureDates[0],
    roomType: cruise.roomTypes[0],
    mealPlan: cruise.mealPlans[0],
    passengerCount: 2,
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Room type pricing multipliers
  const roomPricing = {
    'Interior': 1.0,
    'Ocean View': 1.3,
    'Balcony': 1.6,
    'Suite': 2.2,
    'Penthouse': 3.0
  };

  // Meal plan pricing
  const mealPricing = {
    'All Inclusive': 5000,
    'Premium Plus': 3000,
    'Basic Plus': 1500
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    const basePrice = cruise.pricePerPerson;
    const roomMultiplier = roomPricing[bookingForm.roomType as keyof typeof roomPricing] || 1.0;
    const mealPrice = mealPricing[bookingForm.mealPlan as keyof typeof mealPricing] || 0;
    
    return (basePrice * roomMultiplier + mealPrice) * bookingForm.passengerCount;
  };

  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Handle form field changes
  const handleFormChange = (field: keyof BookingForm, value: string | number) => {
    setBookingForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle next step
  const handleNext = () => {
    setCurrentStep('details');
  };

  // Handle booking submission
  const handleBookNow = () => {
    // Validate form
    if (!bookingForm.name || !bookingForm.email || !bookingForm.phone || !bookingForm.address) {
      alert('Please fill in all required fields.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingForm.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(bookingForm.phone.replace(/\D/g, ''))) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }

    // Show confirmation
    alert(`Booking confirmed for ${cruise.name}!\n\nBooking Details:\n- Passenger: ${bookingForm.name}\n- Date: ${bookingForm.departureDate}\n- Room: ${bookingForm.roomType}\n- Total: ${formatPrice(calculateTotalPrice())}\n\nA confirmation email will be sent to ${bookingForm.email}`);
    
    onClose();
  };

  // Handle modal backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-white/30 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{cruise.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Cruise Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Left Column - Image and Basic Info */}
            <div>
              <img
                src={cruise.image}
                alt={cruise.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <Ship size={20} />
                  <span><strong>Route:</strong> {cruise.from} → {cruise.to}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar size={20} />
                  <span><strong>Duration:</strong> {cruise.duration} nights</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Star size={20} />
                  <span><strong>Ship Type:</strong> {cruise.shipType}</span>
                </div>
              </div>
            </div>

            {/* Right Column - Amenities and Description */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              <p className="text-gray-700 mb-4">{cruise.description}</p>
              
              <h3 className="text-lg font-semibold mb-3">Ship Amenities</h3>
              <div className="grid grid-cols-2 gap-2">
                {cruise.amenities.map((amenity, index) => (
                  <span key={index} className="text-sm bg-blue-50 text-blue-800 px-2 py-1 rounded">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Selection Step */}
          {currentStep === 'selection' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Selection Options */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">Customize Your Booking</h3>
                
                {/* Departure Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar size={16} />
                    Departure Date
                  </label>
                  <select
                    value={bookingForm.departureDate}
                    onChange={(e) => handleFormChange('departureDate', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {cruise.departureDates.map((date) => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Room Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Bed size={16} />
                    Room Type
                  </label>
                  <select
                    value={bookingForm.roomType}
                    onChange={(e) => handleFormChange('roomType', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {cruise.roomTypes.map((type) => (
                      <option key={type} value={type}>
                        {type} - {Math.round((roomPricing[type as keyof typeof roomPricing] || 1) * 100 - 100)}% {(roomPricing[type as keyof typeof roomPricing] || 1) > 1 ? 'premium' : 'standard'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Meal Plan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Utensils size={16} />
                    Meal Plan
                  </label>
                  <select
                    value={bookingForm.mealPlan}
                    onChange={(e) => handleFormChange('mealPlan', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {cruise.mealPlans.map((plan) => (
                      <option key={plan} value={plan}>
                        {plan} - +{formatPrice(mealPricing[plan as keyof typeof mealPricing] || 0)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Passenger Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Users size={16} />
                    Number of Passengers
                  </label>
                  <select
                    value={bookingForm.passengerCount}
                    onChange={(e) => handleFormChange('passengerCount', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4, 5, 6].map((count) => (
                      <option key={count} value={count}>
                        {count} {count === 1 ? 'Passenger' : 'Passengers'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Right Column - Booking Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-teal-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Summary</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Cruise:</span>
                    <span className="font-medium">{cruise.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Departure:</span>
                    <span>{new Date(bookingForm.departureDate).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Room Type:</span>
                    <span>{bookingForm.roomType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Meal Plan:</span>
                    <span>{bookingForm.mealPlan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Passengers:</span>
                    <span>{bookingForm.passengerCount}</span>
                  </div>
                  
                  <hr className="my-3" />
                  
                  <div className="flex justify-between text-lg font-bold text-green-600">
                    <span>Total Price:</span>
                    <span>{formatPrice(calculateTotalPrice())}</span>
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium"
                >
                  Next: Passenger Details
                </button>
              </div>
            </div>
          )}

          {/* Details Step */}
          {currentStep === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Passenger Form */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={() => setCurrentStep('selection')}
                    className="text-blue-500 hover:text-blue-600 font-medium"
                  >
                    ← Back to Selection
                  </button>
                  <h3 className="text-xl font-semibold text-gray-800">Passenger Details</h3>
                </div>

                {/* Passenger Information Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={bookingForm.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={bookingForm.email}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter email address"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={bookingForm.phone}
                      onChange={(e) => handleFormChange('phone', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter 10-digit phone number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                    <textarea
                      value={bookingForm.address}
                      onChange={(e) => handleFormChange('address', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
                      placeholder="Enter complete address"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Booking Summary (Repeated) */}
              <div className="bg-gradient-to-br from-blue-50 to-teal-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Final Summary</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Cruise:</span>
                    <span className="font-medium">{cruise.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Departure:</span>
                    <span>{new Date(bookingForm.departureDate).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Room Type:</span>
                    <span>{bookingForm.roomType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Meal Plan:</span>
                    <span>{bookingForm.mealPlan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Passengers:</span>
                    <span>{bookingForm.passengerCount}</span>
                  </div>
                  
                  <hr className="my-3" />
                  
                  <div className="flex justify-between text-lg font-bold text-green-600">
                    <span>Total Price:</span>
                    <span>{formatPrice(calculateTotalPrice())}</span>
                  </div>
                </div>

                <button
                  onClick={handleBookNow}
                  className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium"
                >
                  Book Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CruiseModal;