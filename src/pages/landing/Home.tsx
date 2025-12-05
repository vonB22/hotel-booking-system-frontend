import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapPin, Star, Mail, Phone, MapPinIcon, Send, RefreshCw, X, Sparkles, TrendingUp, Award, Shield, Zap } from 'lucide-react';
import apiService from '../../services/api';
import Navbar from '../../Components/Navbar';
import heroImage from '../../assets/img/hero.jpg';
import img1 from '../../assets/img/hotels/img1.jpg';
import img2 from '../../assets/img/hotels/img2.jpg';
import img3 from '../../assets/img/hotels/img3.jpg';
import img4 from '../../assets/img/hotels/img4.jpg';
import img5 from '../../assets/img/hotels/img5.jpg';
import img6 from '../../assets/img/hotels/img6.jpg';

interface Hotel {
  id: number;
  name: string;
  location?: string;
  detail?: string;
  price?: number;
  rating?: number;
  image?: string;
  rooms?: number;
  amenities?: string[];
}

interface Review {
  id: number;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
}

export default function LandingHome() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedHotels, setExpandedHotels] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [bookingForm, setBookingForm] = useState({ checkIn: '', checkOut: '', guests: 1 });
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  const observerRef = useRef<IntersectionObserver | null>(null);

  const fetchHotels = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const response = await apiService.getHotels();
      if (response.success && response.data && Array.isArray(response.data)) {
        const mappedHotels = response.data.map((hotel: any) => ({
          id: hotel.id,
          name: hotel.name || 'Unnamed Hotel',
          location: hotel.location || hotel.detail || 'Unknown Location',
          detail: hotel.detail || '',
          price: hotel.price || Math.floor(Math.random() * 300) + 50,
          rating: hotel.rating || (Math.random() * 2 + 3).toFixed(1),
          image: hotel.image,
          rooms: hotel.rooms,
          amenities: hotel.amenities || [],
        }));
        setHotels(mappedHotels.slice(0, 12));
      }
    } catch (error) {
      console.error('Failed to fetch hotels:', error);
      setHotels([]);
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  }, []);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await apiService.request('/reviews', { method: 'GET' });
      if (response.success && response.data && Array.isArray(response.data)) {
        setReviews(response.data.slice(0, 3));
      } else {
        setReviews(getMockReviews());
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      setReviews(getMockReviews());
    }
  }, []);

  const getMockReviews = (): Review[] => {
    return [
      {
        id: 1,
        author: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
        rating: 5,
        date: 'November 2024',
        title: 'Exceptional Service and Comfort',
        comment: 'Had an amazing stay! The staff was incredibly friendly and the room was exactly as described. Will definitely book again.'
      },
      {
        id: 2,
        author: 'Michael Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        rating: 5,
        date: 'October 2024',
        title: 'Perfect Location and Amenities',
        comment: 'Great hotel in the heart of the city. All amenities were top-notch. The booking process was smooth and hassle-free.'
      },
      {
        id: 3,
        author: 'Emma Davis',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
        rating: 5,
        date: 'September 2024',
        title: 'Best Travel Experience Yet',
        comment: 'From booking to checkout, everything was perfect. Great value for money and outstanding customer service throughout.'
      }
    ];
  };

  // Intersection Observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => {
      if (observerRef.current) {
        observerRef.current.observe(section);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    fetchHotels();
    fetchReviews();
    setTimeout(() => setIsVisible(true), 100);
  }, [fetchHotels, fetchReviews]);

  const features = [
    {
      id: 1,
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Industry-leading encryption protects your data',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      id: 2,
      icon: Award,
      title: 'Premium Quality',
      description: 'Handpicked hotels verified for excellence',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      id: 3,
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Instant confirmation in just minutes',
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      id: 4,
      icon: Sparkles,
      title: '24/7 Support',
      description: 'Always here when you need assistance',
      gradient: 'from-green-500 to-emerald-600'
    }
  ];

  const displayedHotels = expandedHotels ? hotels : hotels.slice(0, 6);
  const hotelImages = [img1, img2, img3, img4, img5, img6];

  const getImageUrl = (apiImage: string | undefined, fallbackIndex: number): string => {
    if (!apiImage) {
      return hotelImages[fallbackIndex % hotelImages.length];
    }
    if (apiImage.startsWith('http')) {
      return apiImage;
    }
    return `/api/storage/${apiImage}` || hotelImages[fallbackIndex % hotelImages.length];
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setEmailSuccess(true);
      setEmail('');
      setTimeout(() => setEmailSuccess(false), 3000);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess(false);

    // Validate form
    if (!bookingForm.checkIn || !bookingForm.checkOut || bookingForm.guests < 1) {
      setBookingError('Please fill in all fields');
      return;
    }

    // Calculate max guests based on rooms (assume 2 guests per room as standard)
    const maxGuests = selectedHotel.rooms ? selectedHotel.rooms * 2 : 12;
    
    // Validate guest count
    if (bookingForm.guests < 1) {
      setBookingError('At least 1 guest is required');
      return;
    }
    
    if (bookingForm.guests > maxGuests) {
      setBookingError(`Maximum ${maxGuests} guests allowed for this hotel (${selectedHotel.rooms} rooms × 2 guests/room)`);
      return;
    }
    
    if (bookingForm.guests > 100) {
      setBookingError('Invalid guest count. Please contact support for group bookings.');
      return;
    }

    // Check if user is authenticated
    const token = localStorage.getItem('api_token');
    if (!token) {
      setBookingError('Please log in to book a hotel');
      return;
    }

    // Validate dates
    const checkInDate = new Date(bookingForm.checkIn);
    const checkOutDate = new Date(bookingForm.checkOut);
    
    if (checkOutDate <= checkInDate) {
      setBookingError('Check-out date must be after check-in date');
      return;
    }

    if (selectedHotel) {
      setIsBooking(true);
      try {
        const bookingData = {
          product_id: selectedHotel.id,
          product_name: selectedHotel.name,
          check_in: bookingForm.checkIn,
          check_out: bookingForm.checkOut,
          guests: bookingForm.guests,
          price: selectedHotel.price || 0,
          notes: `Booking for ${bookingForm.guests} guest(s)`
        };

        const response = await apiService.createBooking(bookingData);
        
        if (response.success) {
          setBookingSuccess(true);
          setBookingForm({ checkIn: '', checkOut: '', guests: 1 });
          
          // Close modal after 2 seconds
          setTimeout(() => {
            setShowHotelModal(false);
            setSelectedHotel(null);
          }, 2000);
        } else {
          setBookingError(response.error || 'Failed to create booking. Please try again.');
        }
      } catch (error) {
        console.error('Booking error:', error);
        setBookingError('An error occurred while booking. Please try again.');
      } finally {
        setIsBooking(false);
      }
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
  };

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-slide-up {
          animation: slideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-scale-in {
          animation: scaleIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease;
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-slide-in-right {
          animation: slideInRight 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .skeleton-loading {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }

        .hotel-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hotel-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .hotel-card img {
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hotel-card:hover img {
          transform: scale(1.15);
        }

        .feature-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .feature-card:hover {
          transform: translateY(-12px) scale(1.05);
        }

        .review-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .review-card:hover {
          transform: translateY(-8px) rotate(-1deg);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .animation-delay-1 { animation-delay: 0.1s; }
        .animation-delay-2 { animation-delay: 0.2s; }
        .animation-delay-3 { animation-delay: 0.3s; }
        .animation-delay-4 { animation-delay: 0.4s; }
        .animation-delay-5 { animation-delay: 0.5s; }
        .animation-delay-6 { animation-delay: 0.6s; }

        input:focus, textarea:focus {
          transform: translateY(-2px);
        }

        .section-visible {
          animation: slideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-indigo-50/20">
        <Navbar />
        
        {/* Hero Section */}
        <section id="hero" className="relative min-h-screen bg-neutral-900/5 flex items-center justify-center overflow-hidden pt-32 md:pt-0" style={{backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
          {/* Enhanced Overlay */}
          <div className="absolute inset-0 bg-neutral-900/20"></div>
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float animation-delay-3"></div>
            <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-float animation-delay-5"></div>
          </div>

          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <div className="max-w-4xl mx-auto text-center">
              {/* Trust Badge */}
              <div className={`inline-flex items-center gap-3 glass-effect rounded-full px-5 py-3 mb-8 shadow-lg ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}>
                <div className="flex items-center -space-x-2">
                  <img src="https://images.unsplash.com/photo-1711113456507-c88b3777bc12?w=100" alt="Traveler" className="w-7 h-7 rounded-full border-2 border-white shadow-md" />
                  <img src="https://images.unsplash.com/photo-1672685667592-0392f458f46f?w=100" alt="Traveler" className="w-7 h-7 rounded-full border-2 border-white shadow-md" />
                  <img src="https://images.unsplash.com/photo-1669689290695-7f0efe5d4c8e?w=100" alt="Traveler" className="w-7 h-7 rounded-full border-2 border-white shadow-md" />
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="font-semibold text-gray-900">Trusted by 1M+ travelers</span>
                </div>
              </div>

              <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
                <span className="inline-block bg-gradient-to-r from-yellow-200 via-white to-pink-200 bg-clip-text text-transparent">
                  Stay. Relax. Book
                </span>
                <br />
                <span className="inline-block bg-gradient-to-r from-yellow-200 via-white to-pink-200 bg-clip-text text-transparent animation-delay-1 animate-slide-up">
                  with ease.
                </span>
              </h1>

              <p className={`text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-light ${isVisible ? 'animate-slide-up animation-delay-2' : 'opacity-0'}`}>
                Discover handpicked hotels, best rates, and instant booking for your perfect stay
              </p>

              {/* Hero Buttons */}
              <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 ${isVisible ? 'animate-scale-in animation-delay-3' : 'opacity-0'}`}>
                <button 
                  type="button" 
                  onClick={() => {
                    document.getElementById('hotels')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group px-8 py-4 bg-white text-purple-600 rounded-xl font-bold hover:bg-gray-50 hover:scale-105 transition-all shadow-2xl hover:shadow-white/20 relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Browse Hotels
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    alert('Special offers coming soon!');
                  }}
                  className="px-8 py-4 border-2 border-white/40 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-white/10 hover:border-white/60 hover:scale-105 transition-all shadow-lg"
                >
                  View Special Offers
                </button>
              </div>

              {/* Enhanced Search Box */}
              <div className={`glass-effect rounded-3xl p-6 md:p-8 border-2 border-white/30 shadow-2xl ${isVisible ? 'animate-slide-up animation-delay-4' : 'opacity-0'}`}>
                <form onSubmit={(e) => { e.preventDefault(); document.getElementById('hotels')?.scrollIntoView({ behavior: 'smooth' }); }} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="group">
                    <label htmlFor="destination" className="block text-sm font-semibold text-gray-800 mb-2">Destination</label>
                    <input id="destination" type="text" placeholder="Where to?" title="Destination" className="w-full px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-white/50 text-gray-900 placeholder-gray-500 focus:bg-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all shadow-sm" />
                  </div>
                  <div className="group">
                    <label htmlFor="checkin" className="block text-sm font-semibold text-gray-800 mb-2">Check-in</label>
                    <input id="checkin" type="date" title="Check-in date" className="w-full px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-white/50 text-gray-900 focus:bg-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all shadow-sm" />
                  </div>
                  <div className="group">
                    <label htmlFor="checkout" className="block text-sm font-semibold text-gray-800 mb-2">Check-out</label>
                    <input id="checkout" type="date" title="Check-out date" className="w-full px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-white/50 text-gray-900 focus:bg-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all shadow-sm" />
                  </div>
                  <div className="group">
                    <label htmlFor="guests" className="block text-sm font-semibold text-gray-800 mb-2">Guests</label>
                    <input id="guests" type="number" defaultValue="2" min="1" title="Number of guests" className="w-full px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-white/50 text-gray-900 focus:bg-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all shadow-sm" />
                  </div>
                  <div className="flex items-end">
                    <button type="submit" className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
                      Search Now
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Hotels Section */}
        <section id="hotels" className={`py-24 bg-gradient-to-br from-gray-50 via-white to-purple-50/30 ${visibleSections.has('hotels') ? 'section-visible' : 'opacity-0'}`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  <span className="gradient-text">Featured Hotels</span>
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl">Discover our handpicked selection of luxury hotels and resorts from around the world</p>
              </div>
              <button
                onClick={fetchHotels}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 font-semibold"
                title="Refresh hotel listings"
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="glass-effect rounded-2xl h-96 skeleton-loading shadow-lg"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedHotels.map((hotel, index) => (
                  <div key={hotel.id} className={`hotel-card group glass-effect rounded-2xl overflow-hidden shadow-xl animate-scale-in animation-delay-${Math.min(index % 6 + 1, 6)}`}>
                    <div className="relative h-56 overflow-hidden bg-gray-200">
                      <img 
                        src={getImageUrl(hotel.image, index)} 
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = hotelImages[index % hotelImages.length];
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute top-3 left-3 flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                        <Sparkles className="w-3 h-3" />
                        Featured
                      </div>
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg">
                        <Star className="w-4 h-4 fill-current" />
                        {hotel.rating?.toFixed(1) || 'N/A'}
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">{hotel.name}</h3>
                      <div className="flex items-center gap-2 text-gray-600 mb-4">
                        <MapPin className="w-4 h-4 text-purple-600" />
                        <span className="text-sm">{hotel.location}</span>
                      </div>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">${hotel.price}</span>
                        <span className="text-sm text-gray-500">per night</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          setSelectedHotel(hotel);
                          setShowHotelModal(true);
                        }}
                        className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg transition-all active:scale-95"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {hotels.length > 6 && (
              <div className="text-center mt-12">
                <button
                  type="button"
                  onClick={() => setExpandedHotels(!expandedHotels)}
                  className="px-8 py-4 glass-effect border-2 border-indigo-600 text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  {expandedHotels ? 'See less' : 'See all hotels'}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Reviews Section */}
        <section id="about" className={`py-24 bg-white ${visibleSections.has('about') ? 'section-visible' : 'opacity-0'}`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">What Our Guests Say</span>
              </h2>
              <p className="text-lg text-gray-600">Read authentic reviews from travelers who stayed at our featured hotels</p>
            </div>

            {reviews.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  {reviews.map((review, index) => (
                    <div key={review.id} className={`review-card glass-effect p-8 rounded-2xl shadow-xl animate-scale-in animation-delay-${index + 1}`}>
                      <div className="flex items-start gap-4 mb-4">
                        <img src={review.avatar} alt={review.author} className="w-14 h-14 rounded-full ring-4 ring-purple-100" />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-lg">{review.author}</h4>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 mb-4">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <h5 className="font-bold text-gray-900 mb-3 text-lg">{review.title}</h5>
                      <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <button className="px-8 py-4 glass-effect border-2 border-indigo-600 text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl hover:scale-105">
                    View All Reviews
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No reviews available yet</p>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className={`py-24 bg-gradient-to-br from-gray-50 via-purple-50/30 to-indigo-50/30 ${visibleSections.has('hotels') ? 'section-visible' : 'opacity-0'}`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">Why Choose StayEase</span>
              </h2>
              <p className="text-lg text-gray-600">Why travelers worldwide trust us for their perfect accommodations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.id} className={`feature-card text-center group animate-scale-in animation-delay-${index + 1}`}>
                    <div className="relative inline-block mb-6">
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity`}></div>
                      <div className={`relative w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform`}>
                        <Icon className="w-10 h-10" />
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-float animation-delay-3"></div>
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center text-white">
              <Sparkles className="w-12 h-12 mx-auto mb-4 animate-pulse" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Stay Updated with StayEase</h2>
              <p className="text-xl mb-10 text-white/90">Subscribe to receive exclusive hotel deals, travel guides, and special offers straight to your inbox</p>

              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-xl glass-effect border-2 border-white/30 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all shadow-lg font-medium"
                  required
                />
                <button type="submit" className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 whitespace-nowrap">
                  Subscribe
                </button>
              </form>
              
              {emailSuccess && (
                <div className="mt-6 glass-effect text-green-700 p-4 rounded-xl animate-scale-in font-semibold flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Successfully subscribed!
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className={`py-24 bg-white ${visibleSections.has('contact') ? 'section-visible' : 'opacity-0'}`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">Get in Touch</span>
              </h2>
              <p className="text-lg text-gray-600">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                { icon: Phone, title: 'Phone', text: '+1 (555) 123-4567', subtext: 'Mon-Fri 9am-6pm EST', gradient: 'from-blue-500 to-indigo-600' },
                { icon: Mail, title: 'Email', text: 'support@stayease.com', subtext: '24/7 support available', gradient: 'from-purple-500 to-pink-600' },
                { icon: MapPinIcon, title: 'Office', text: '123 Travel Street', subtext: 'New York, NY 10001', gradient: 'from-green-500 to-emerald-600' }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className={`glass-effect p-8 text-center rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 animate-scale-in animation-delay-${index + 1}`}>
                    <div className="relative inline-block mb-4">
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-xl blur opacity-50`}></div>
                      <div className={`relative w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h4 className="font-bold text-xl text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-gray-900 font-semibold mb-1">{item.text}</p>
                    <p className="text-sm text-gray-600">{item.subtext}</p>
                  </div>
                );
              })}
            </div>

            {/* Contact Form */}
            <div className="max-w-3xl mx-auto">
              <div className="glass-effect p-8 md:p-10 rounded-3xl shadow-2xl">
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Name</label>
                      <input type="text" placeholder="Your name" className="w-full px-5 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all bg-white shadow-sm" required />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Email</label>
                      <input type="email" placeholder="your.email@example.com" className="w-full px-5 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all bg-white shadow-sm" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Subject</label>
                    <input type="text" placeholder="How can we help?" className="w-full px-5 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all bg-white shadow-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Message</label>
                    <textarea rows={6} placeholder="Tell us more about your inquiry..." className="w-full px-5 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all resize-none bg-white shadow-sm" required></textarea>
                  </div>
                  <button type="submit" className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 active:scale-95">
                    <Send className="w-5 h-5" />
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-neutral-900 text-gray-300 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
              <div>
                <h3 className="text-2xl font-bold gradient-text mb-4">StayEase</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">Your trusted partner for finding the perfect accommodation worldwide.</p>
                <div className="flex gap-4">
                  {['📘', '🐦', '📷', '💼'].map((emoji, i) => (
                    <a key={i} href="#" className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:-translate-y-1 text-xl shadow-lg">
                      {emoji}
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-bold text-white mb-4 text-lg">Company</h5>
                <ul className="space-y-3">
                  {['About Us', 'Careers', 'Press', 'Blog'].map((item, i) => (
                    <li key={i}><a href="#" className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 inline-block">{item}</a></li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-white mb-4 text-lg">Support</h5>
                <ul className="space-y-3">
                  {['Help Center', 'Safety Information', 'Cancellation Options', 'Contact Us'].map((item, i) => (
                    <li key={i}><a href="#" className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 inline-block">{item}</a></li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-white mb-4 text-lg">Resources</h5>
                <ul className="space-y-3">
                  {['List Your Property', 'Partnerships', 'Terms of Service', 'Privacy Policy'].map((item, i) => (
                    <li key={i}><a href="#" className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 inline-block">{item}</a></li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 text-center">
              <p className="text-gray-500">&copy; {new Date().getFullYear()} StayEase. All rights reserved. Made with ❤️ for travelers.</p>
            </div>
          </div>
        </footer>

        {/* Enhanced Hotel Details Modal */}
        {showHotelModal && selectedHotel && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="glass-effect rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
              <div className="sticky top-0 glass-effect flex items-center justify-between p-6 border-b border-gray-200 rounded-t-3xl">
                <h2 className="text-2xl font-bold gradient-text">{selectedHotel.name}</h2>
                <button
                  onClick={() => setShowHotelModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all hover:scale-110 active:scale-95"
                  title="Close modal"
                  aria-label="Close hotel details modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <img 
                    src={getImageUrl(selectedHotel.image, 0)} 
                    alt={selectedHotel.name}
                    className="w-full md:w-48 h-48 object-cover rounded-2xl shadow-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = hotelImages[0];
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-5 h-5 text-purple-600" />
                      <p className="text-gray-700 font-medium">{selectedHotel.location}</p>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <p className="font-bold text-gray-900">{selectedHotel.rating} out of 5</p>
                    </div>
                    <p className="text-4xl font-bold gradient-text">${selectedHotel.price}<span className="text-lg text-gray-600 font-normal">/night</span></p>
                  </div>
                </div>

                {selectedHotel.detail && (
                  <div>
                    <h3 className="font-bold text-xl mb-3 text-gray-900">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedHotel.detail}</p>
                  </div>
                )}

                {selectedHotel.rooms && (
                  <div className="glass-effect p-4 rounded-xl">
                    <p className="text-gray-700"><span className="font-bold text-gray-900">Rooms Available:</span> {selectedHotel.rooms}</p>
                  </div>
                )}

                {selectedHotel.amenities && selectedHotel.amenities.length > 0 && (
                  <div>
                    <h3 className="font-bold text-xl mb-3 text-gray-900">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedHotel.amenities.map((amenity, idx) => (
                        <span key={idx} className="px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 rounded-xl text-sm font-semibold border border-purple-200">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Booking Form */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-200/50">
                  <h3 className="font-bold text-xl mb-4 text-gray-900">Book Your Stay</h3>
                  
                  {bookingError && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-xl text-sm">
                      {bookingError}
                    </div>
                  )}
                  
                  {bookingSuccess && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-xl text-sm">
                      ✓ Booking confirmed! You'll be redirected shortly.
                    </div>
                  )}

                  <form onSubmit={handleBooking} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Check-in Date</label>
                        <input
                          type="date"
                          value={bookingForm.checkIn}
                          onChange={(e) => setBookingForm({ ...bookingForm, checkIn: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Check-out Date</label>
                        <input
                          type="date"
                          value={bookingForm.checkOut}
                          onChange={(e) => setBookingForm({ ...bookingForm, checkOut: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                          min={bookingForm.checkIn || new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Number of Guests {selectedHotel.rooms && <span className="text-gray-500 font-normal">(Max: {selectedHotel.rooms * 2})</span>}
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={selectedHotel.rooms ? selectedHotel.rooms * 2 : 100}
                        value={bookingForm.guests}
                        onChange={(e) => {
                          const value = Math.max(1, Math.min(parseInt(e.target.value) || 1, selectedHotel.rooms ? selectedHotel.rooms * 2 : 100));
                          setBookingForm({ ...bookingForm, guests: value });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                        title="Enter number of guests"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedHotel.rooms ? `Based on ${selectedHotel.rooms} available room(s) (2 guests per room)` : 'Enter number of guests'}
                      </p>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-purple-200">
                      <button
                        type="button"
                        onClick={() => setShowHotelModal(false)}
                        className="flex-1 px-6 py-3 bg-gray-100 text-gray-900 rounded-xl font-bold hover:bg-gray-200 transition-all active:scale-95"
                        disabled={isBooking}
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        disabled={isBooking || bookingSuccess}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isBooking ? 'Processing...' : bookingSuccess ? 'Booking Confirmed!' : 'Confirm Booking'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
