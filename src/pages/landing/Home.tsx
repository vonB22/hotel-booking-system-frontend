import React, { useState, useEffect } from 'react';
import { MapPin, Star, Mail, Phone, MapPinIcon, Send } from 'lucide-react';
import apiService from '../../services/api';
import img1 from '../../assets/img/hotels/img1.jpg';
import img2 from '../../assets/img/hotels/img2.jpg';
import img3 from '../../assets/img/hotels/img3.jpg';
import img4 from '../../assets/img/hotels/img4.jpg';
import img5 from '../../assets/img/hotels/img5.jpg';
import img6 from '../../assets/img/hotels/img6.jpg';

interface Hotel {
  id: number;
  name: string;
  location: string;
  price: number;
  rating?: number;
  image?: string;
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

  useEffect(() => {
    fetchHotels();
    fetchReviews();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await apiService.getHotels();
      if (response.data && Array.isArray(response.data)) {
        setHotels(response.data.slice(0, 12));
      }
    } catch (error) {
      console.error('Failed to fetch hotels:', error);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await apiService.request('/api/reviews', { method: 'GET' });
      if (response.data && Array.isArray(response.data)) {
        setReviews(response.data.slice(0, 3));
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      setReviews([]);
    }
  };

  // UI features - these are not data-dependent and are static
  const features = [
    {
      id: 1,
      title: 'Safe',
      description: 'Secure booking and payment processing with industry-leading encryption'
    },
    {
      id: 2,
      title: 'Quality',
      description: 'Handpicked hotels verified for excellence and customer satisfaction'
    },
    {
      id: 3,
      title: 'Fast',
      description: 'Instant confirmation and quick booking process in just minutes'
    },
    {
      id: 4,
      title: '24/7',
      description: 'Round-the-clock customer support whenever you need assistance'
    }
  ];

  const displayedHotels = expandedHotels ? hotels : hotels.slice(0, 6);

  const hotelImages = [img1, img2, img3, img4, img5, img6];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setEmailSuccess(true);
      setEmail('');
      setTimeout(() => setEmailSuccess(false), 3000);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-800 flex items-center justify-center overflow-hidden pt-32 md:pt-0">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float animation-delay-2"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-3xl mx-auto text-center animate-slide-up">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-8 animate-scale-in">
              <div className="flex items-center -space-x-2">
                <img src="https://images.unsplash.com/photo-1711113456507-c88b3777bc12?w=100" alt="Traveler" className="w-6 h-6 rounded-full border-2 border-white" />
                <img src="https://images.unsplash.com/photo-1672685667592-0392f458f46f?w=100" alt="Traveler" className="w-6 h-6 rounded-full border-2 border-white" />
                <img src="https://images.unsplash.com/photo-1669689290695-7f0efe5d4c8e?w=100" alt="Traveler" className="w-6 h-6 rounded-full border-2 border-white" />
              </div>
              <span className="text-sm font-medium">Trusted by 1M+ travelers</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Stay. Relax. Book<br />
              <span className="bg-gradient-to-r from-yellow-200 via-white to-pink-200 bg-clip-text text-transparent">
                with ease.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto">
              Discover handpicked hotels, best rates, and instant booking for your perfect stay
            </p>

            {/* Hero Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button type="button" className="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 hover:scale-105 transition-all shadow-lg disabled:opacity-50" disabled>
                Browse Hotels
              </button>
              <button type="button" className="px-8 py-3 border-2 border-white/30 text-white rounded-lg font-semibold hover:bg-white/10 hover:scale-105 transition-all disabled:opacity-50" disabled>
                View Special Offers
              </button>
            </div>

            {/* Search Box */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 shadow-2xl animate-slide-up animation-delay-2">
              <form className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label htmlFor="destination" className="block text-sm font-medium text-white/70 mb-2">Destination</label>
                  <input id="destination" type="text" placeholder="Select country" title="Destination" className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:bg-white/20 focus:outline-none transition-all disabled:opacity-50" disabled />
                </div>
                <div>
                  <label htmlFor="checkin" className="block text-sm font-medium text-white/70 mb-2">Check-in</label>
                  <input id="checkin" type="date" title="Check-in date" className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:bg-white/20 focus:outline-none transition-all disabled:opacity-50" disabled />
                </div>
                <div>
                  <label htmlFor="checkout" className="block text-sm font-medium text-white/70 mb-2">Check-out</label>
                  <input id="checkout" type="date" title="Check-out date" className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:bg-white/20 focus:outline-none transition-all disabled:opacity-50" disabled />
                </div>
                <div>
                  <label htmlFor="guests" className="block text-sm font-medium text-white/70 mb-2">Guests</label>
                  <input id="guests" type="number" defaultValue="2" min="1" title="Number of guests" className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:bg-white/20 focus:outline-none transition-all disabled:opacity-50" disabled />
                </div>
                <div className="flex items-end">
                  <button type="submit" className="w-full px-4 py-2 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50" disabled>
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hotels Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-primary-text">Featured Hotels</h2>
            <p className="text-lg text-gray-600">Discover our handpicked selection of luxury hotels and resorts from around the world</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl h-96 skeleton-loading"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedHotels.map((hotel, index) => (
                <div key={hotel.id} className={`group card-elevated hover-lift overflow-hidden animate-scale-in animation-delay-${Math.min(index, 10)}`}>
                  <div className="relative h-48 overflow-hidden bg-gray-200">
                    <img 
                      src={hotel.image || hotelImages[index % hotelImages.length]} 
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </div>
                    <div className="absolute top-3 right-3 bg-yellow-400 text-white px-2 py-1 rounded flex items-center gap-1 text-sm font-semibold">
                      <Star className="w-4 h-4 fill-current" />
                      {hotel.rating?.toFixed(1) || 'N/A'}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{hotel.location}</span>
                    </div>
                    <div className="mb-4">
                      <div className="text-2xl font-bold text-gray-900">${hotel.price}</div>
                      <div className="text-sm text-gray-500">per night</div>
                    </div>
                    <button type="button" className="w-full px-4 py-2 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50" disabled>
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
                className="px-8 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-all disabled:opacity-50"
              >
                {expandedHotels ? 'See less' : 'See all'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-primary-text">What Our Guests Say</h2>
            <p className="text-lg text-gray-600">Read authentic reviews from travelers who stayed at our featured hotels</p>
          </div>

          {reviews.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {reviews.map((review, index) => (
                  <div key={review.id} className={`card-elevated p-6 hover-lift animate-scale-in animation-delay-${Math.min(index, 10)}`}>
                    <div className="flex items-start gap-4 mb-4">
                      <img src={review.avatar} alt={review.author} className="w-12 h-12 rounded-full" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{review.author}</h4>
                        <p className="text-sm text-gray-500">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
                    <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <button className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-all">
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

      {/* Features/About Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-primary-text">Why Choose StayEase</h2>
            <p className="text-lg text-gray-600">Why travelers worldwide trust us for their perfect accommodations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={feature.id} className={`text-center group hover-lift animate-scale-in animation-delay-${Math.min(index, 10)}`}>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">
                  {feature.id === 1 && '🔒'}
                  {feature.id === 2 && '⭐'}
                  {feature.id === 3 && '⚡'}
                  {feature.id === 4 && '📞'}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Stay Updated with StayEase</h2>
            <p className="text-lg mb-8 text-white/80">Subscribe to receive exclusive hotel deals, travel guides, and special offers straight to your inbox</p>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:bg-white/20 focus:outline-none transition-all"
                required
              />
              <button type="submit" className="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-all whitespace-nowrap disabled:opacity-50" disabled>
                Subscribe
              </button>
            </form>
            
            {emailSuccess && (
              <p className="text-green-200 mt-3 animate-slide-down">✓ Successfully subscribed!</p>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-primary-text">Get in Touch</h2>
            <p className="text-lg text-gray-600">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          </div>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { icon: Phone, title: 'Phone', text: '+1 (555) 123-4567', subtext: 'Mon-Fri 9am-6pm EST' },
              { icon: Mail, title: 'Email', text: 'support@stayease.com', subtext: '24/7 support available' },
              { icon: MapPinIcon, title: 'Office', text: '123 Travel Street', subtext: 'New York, NY 10001' }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className={`card-elevated p-8 text-center hover-lift animate-scale-in animation-delay-${Math.min(index, 10)}`}>
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h4 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-gray-900 font-semibold mb-1">{item.text}</p>
                  <p className="text-sm text-gray-600">{item.subtext}</p>
                </div>
              );
            })}
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <div className="card-elevated p-8">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Name</label>
                    <input type="text" placeholder="Your name" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-600 focus:outline-none transition-all" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                    <input type="email" placeholder="your.email@example.com" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-600 focus:outline-none transition-all" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Subject</label>
                  <input type="text" placeholder="How can we help?" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-600 focus:outline-none transition-all" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Message</label>
                  <textarea rows={5} placeholder="Tell us more about your inquiry..." className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-600 focus:outline-none transition-all resize-none" required></textarea>
                </div>
                <button type="submit" className="w-full px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50" disabled>
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
            <div>
              <h3 className="text-2xl font-bold gradient-primary-text mb-4">StayEase</h3>
              <p className="text-gray-400 mb-6">Your trusted partner for finding the perfect accommodation worldwide.</p>
              <div className="flex gap-4">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map((social, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:-translate-y-1">
                    {social === 'facebook' && '📘'}
                    {social === 'twitter' && '🐦'}
                    {social === 'instagram' && '📷'}
                    {social === 'linkedin' && '💼'}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h5 className="font-bold text-white mb-4">Company</h5>
              <ul className="space-y-3">
                {['About Us', 'Careers', 'Press', 'Blog'].map((item, i) => (
                  <li key={i}><a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white mb-4">Support</h5>
              <ul className="space-y-3">
                {['Help Center', 'Safety Information', 'Cancellation Options', 'Contact Us'].map((item, i) => (
                  <li key={i}><a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white mb-4">Resources</h5>
              <ul className="space-y-3">
                {['List Your Property', 'Partnerships', 'Terms of Service', 'Privacy Policy'].map((item, i) => (
                  <li key={i}><a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} StayEase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}