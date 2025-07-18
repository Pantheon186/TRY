import React, { useState } from 'react';
import Header from './common/Header';
import HeroSection from './landing/HeroSection';
import CarouselSection from './landing/CarouselSection';
import PerformanceSection from './landing/PerformanceSection';
import CTABanner from './landing/CTABanner';
import FloatingHelp from './common/FloatingHelp';
import LoginPage from './auth/LoginPage';
import SignUpPage from './auth/SignUpPage';
import Dashboard from './dashboards/Dashboard';

function App() {
  // Just useState('home') in JS, not useState<'home'|...>('home')
  const [currentPage, setCurrentPage] = useState('home');
  const [userRole, setUserRole] = useState('');

  // Handle navigation
  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  // Handle successful login
  const handleLoginSuccess = (role) => {
    setUserRole(role);
    setCurrentPage('dashboard');
  };

  // Handle logout
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      setUserRole('');
      setCurrentPage('home');
    }
  };

  // Render current page
  if (currentPage === 'login') {
    return (
      <LoginPage
        onNavigate={handleNavigation}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  if (currentPage === 'signup') {
    return (
      <SignUpPage
        onNavigate={handleNavigation}
      />
    );
  }

  if (currentPage === 'dashboard') {
    return (
      <Dashboard
        userRole={userRole}
        onLogout={handleLogout}
      />
    );
  }

  // Default: Home page render
  return (
    <div className="min-h-screen">
      {/* Fixed Header */}
      <Header onNavigate={handleNavigation} />

      {/* Main Content */}
      <main>
        {/* Hero Section with Background Video */}
        <HeroSection onNavigate={handleNavigation} />
        {/* Services Carousel */}
        <CarouselSection />
        {/* Performance & Awards Section */}
        <PerformanceSection />
        {/* CTA Banner */}
        <CTABanner />
      </main>

      {/* Floating Help Widget */}
      <FloatingHelp />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl font-bold">Yorker Holidays</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your gateway to unforgettable luxury travel experiences across the globe.
                Discover the world in comfort and style.
              </p>
            </div>
            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="hover:text-white transition-colors"
                  >
                    Destinations
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('login')}
                    className="hover:text-white transition-colors"
                  >
                    Cruise Lines
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('login')}
                    className="hover:text-white transition-colors"
                  >
                    Special Offers
                  </button>
                </li>
              </ul>
            </div>
            {/* Services */}
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button
                    onClick={() => handleNavigation('login')}
                    className="hover:text-white transition-colors"
                  >
                    Luxury Cruises
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('login')}
                    className="hover:text-white transition-colors"
                  >
                    Premium Flights
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('login')}
                    className="hover:text-white transition-colors"
                  >
                    5-Star Hotels
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('login')}
                    className="hover:text-white transition-colors"
                  >
                    Holiday Packages
                  </button>
                </li>
              </ul>
            </div>
            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="mailto:support@yorkeholidays.com" className="hover:text-white transition-colors">
                    📧 support@yorkeholidays.com
                  </a>
                </li>
                <li>
                  <a href="tel:+919876543210" className="hover:text-white transition-colors">
                    📞 +91 98765 43210
                  </a>
                </li>
                <li>📍 123 Luxury Ave, Mumbai, India</li>
                <li>🕒 24/7 Customer Support</li>
              </ul>
            </div>
          </div>
          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 Yorker Holidays. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <button
                onClick={() => alert('Privacy Policy would be displayed here')}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => alert('Terms of Service would be displayed here')}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Terms of Service
              </button>
              <button
                onClick={() => alert('Cookie Policy would be displayed here')}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;