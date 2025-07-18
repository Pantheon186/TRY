import React, { useState } from 'react';
import { MessageCircle, X, Phone, Mail, Clock } from 'lucide-react';

const FloatingHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleHelp = () => {
    setIsOpen(!isOpen);
  };

  const handleWhatsApp = () => {
    // In a real application, this would open WhatsApp with a pre-filled message
    window.open('https://wa.me/1234567890?text=Hi! I need help with cruise booking.', '_blank');
  };

  const handleCall = () => {
    window.open('tel:+1234567890');
  };

  const handleEmail = () => {
    window.open('mailto:support@oceanlux.com?subject=Cruise Booking Inquiry');
  };

  return (
    <>
      {/* Help Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 bg-white/95 backdrop-blur-md rounded-2xl border border-white/30 shadow-2xl p-6 w-80 animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Need Help?</h3>
            <button
              onClick={toggleHelp}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <p className="text-gray-600 mb-6 text-sm">
            Our travel experts are here to help you plan the perfect cruise experience. 
            Get in touch with us through any of these channels:
          </p>

          {/* Contact Options */}
          <div className="space-y-3">
            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center gap-3 p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
            >
              <MessageCircle size={20} />
              <span>WhatsApp Chat</span>
            </button>

            <button
              onClick={handleCall}
              className="w-full flex items-center gap-3 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
            >
              <Phone size={20} />
              <span>Call Now</span>
            </button>

            <button
              onClick={handleEmail}
              className="w-full flex items-center gap-3 p-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors duration-200"
            >
              <Mail size={20} />
              <span>Email Support</span>
            </button>
          </div>

          {/* Business Hours */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Clock size={16} />
              <span className="font-medium">Business Hours:</span>
            </div>
            <p className="text-gray-600 text-sm mt-1">
              Mon-Fri: 9:00 AM - 8:00 PM<br />
              Sat-Sun: 10:00 AM - 6:00 PM
            </p>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={toggleHelp}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center group ${
          isOpen ? 'rotate-180' : 'hover:scale-110'
        }`}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <MessageCircle size={24} className="group-hover:animate-pulse" />
        )}
      </button>

      {/* Pulse Animation Ring */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-blue-500/30 animate-ping"></div>
      )}
    </>
  );
};

export default FloatingHelp;