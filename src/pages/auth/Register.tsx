import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Check, X } from 'lucide-react';
import authService from '../../services/auth';
import { useEffect } from 'react';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Password strength indicators
  const passwordStrength = {
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*]/.test(password),
    minLength: password.length >= 8
  };

  const strengthScore = Object.values(passwordStrength).filter(Boolean).length;
  const strengthColor = strengthScore <= 2 ? 'red' : strengthScore <= 3 ? 'yellow' : 'green';
  const strengthLabel = strengthScore <= 2 ? 'Weak' : strengthScore <= 3 ? 'Medium' : 'Strong';

  const isFormValid = name && email && password && passwordConfirmation && password === passwordConfirmation && acceptTerms;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (strengthScore < 3) {
      setError('Password is too weak. Please use a stronger password.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await authService.register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation
      });
      
      if (result.success) {
        setSuccess('Registration successful! Redirecting...');
        const currentState = authService.getState();
        const isAdmin = currentState.user && Array.isArray(currentState.user.roles) && currentState.user.roles.includes('Admin');
        setTimeout(() => navigate(isAdmin ? '/dashboard' : '/landing'), 1500);
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const state = authService.getState();
    if (state.isAuthenticated) {
      const isAdmin = state.user && Array.isArray(state.user.roles) && state.user.roles.includes('Admin');
      navigate(isAdmin ? '/dashboard' : '/landing');
    }
  }, [navigate]);

  const benefits = [
    'Easy hotel booking',
    'Exclusive deals',
    'Secure payments'
  ];

  const PasswordRequirement = ({ met, label }: { met: boolean; label: string }) => (
    <div className="flex items-center gap-2 text-sm">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
        met ? 'bg-green-100' : 'bg-gray-100'
      }`}>
        {met ? (
          <Check className="w-3 h-3 text-green-600" />
        ) : (
          <X className="w-3 h-3 text-gray-400" />
        )}
      </div>
      <span className={met ? 'text-gray-700' : 'text-gray-500'}>{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-800 flex items-center justify-center overflow-hidden relative p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-float animation-delay-negative-5s"></div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-5xl animate-slide-up">
        <div className="glass-effect rounded-3xl shadow-2xl border border-white/20 overflow-hidden backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
            
            {/* Left Section - Hidden on Mobile */}
            <div className="hidden md:flex md:col-span-2 bg-gradient-to-br from-indigo-500 to-purple-700 flex-col items-center justify-center relative p-10 overflow-hidden">
              {/* Decorative pattern overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10 text-center text-white">
                <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-lg border-2 border-white/30 flex items-center justify-center mx-auto mb-6 animate-pulse-custom">
                  <span className="text-5xl">🏨</span>
                </div>

                <h2 className="text-3xl font-bold mb-3">Join StayEase</h2>
                <p className="text-white/90 mb-8 text-lg">Start booking your dream stay today.</p>

                {/* Benefit List */}
                <div className="space-y-3 text-left">
                  {benefits.map((benefit, idx) => (
                    <div 
                      key={idx} 
                      className={`flex items-center gap-3 animate-slide-up animation-delay-${idx + 1}`}
                    >
                      <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-white/95">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="md:col-span-3 bg-white p-8 md:p-10 overflow-y-auto max-h-screen md:max-h-none">
              {/* Mobile Brand Badge */}
              <div className="md:hidden text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-gradient-primary text-white px-4 py-2 rounded-full font-semibold text-sm mb-4">
                  <span>🏨</span>
                  <span>StayEase</span>
                </div>
              </div>

              {/* Header */}
              <div className="mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Create your account</h3>
                <p className="text-gray-600">Join us and start booking amazing stays.</p>
              </div>

              {/* Messages */}
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-slide-down">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-green-800 font-semibold">Success</p>
                    <p className="text-green-700 text-sm">{success}</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-slide-down">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-red-800 font-semibold">Error</p>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Name Field */}
                <div className="relative">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                      disabled={isLoading}
                      autoComplete="name"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-indigo-600 focus:shadow-lg focus:shadow-indigo-600/10 focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="relative">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      disabled={isLoading}
                      autoComplete="email"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-indigo-600 focus:shadow-lg focus:shadow-indigo-600/10 focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                      required
                      disabled={isLoading}
                      autoComplete="new-password"
                      className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-indigo-600 focus:shadow-lg focus:shadow-indigo-600/10 focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-all duration-200 hover:scale-110 disabled:opacity-50"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="mt-3 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              strengthColor === 'red' ? 'w-1/3 bg-red-500' :
                              strengthColor === 'yellow' ? 'w-2/3 bg-yellow-500' :
                              'w-full bg-green-500'
                            }`}
                          ></div>
                        </div>
                        <span className={`text-xs font-semibold ${
                          strengthColor === 'red' ? 'text-red-600' :
                          strengthColor === 'yellow' ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {strengthLabel}
                        </span>
                      </div>

                      {/* Requirements */}
                      <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg">
                        <PasswordRequirement met={passwordStrength.hasUppercase} label="Uppercase letter" />
                        <PasswordRequirement met={passwordStrength.hasLowercase} label="Lowercase letter" />
                        <PasswordRequirement met={passwordStrength.hasNumber} label="Number" />
                        <PasswordRequirement met={passwordStrength.hasSpecial} label="Special character" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="relative">
                  <label htmlFor="confirm-password" className="block text-sm font-semibold text-gray-900 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      placeholder="Confirm your password"
                      required
                      disabled={isLoading}
                      autoComplete="new-password"
                      className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-indigo-600 focus:shadow-lg focus:shadow-indigo-600/10 focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-all duration-200 hover:scale-110 disabled:opacity-50"
                      aria-label="Toggle password visibility"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {password && passwordConfirmation && password !== passwordConfirmation && (
                    <p className="mt-2 text-sm text-red-600">Passwords do not match</p>
                  )}
                  {password && passwordConfirmation && password === passwordConfirmation && (
                    <p className="mt-2 text-sm text-green-600">Passwords match</p>
                  )}
                </div>

                {/* Terms and Conditions */}
                <label className="flex items-start gap-3 cursor-pointer group pt-2">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    disabled={isLoading}
                    className="w-5 h-5 rounded border-2 border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer disabled:opacity-50 mt-1 flex-shrink-0"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                    I agree to the{' '}
                    <button
                      type="button"
                      className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                      disabled={isLoading}
                    >
                      Terms of Service
                    </button>
                    {' '}and{' '}
                    <button
                      type="button"
                      className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                      disabled={isLoading}
                    >
                      Privacy Policy
                    </button>
                  </span>
                </label>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !isFormValid}
                  className="w-full py-3 px-4 bg-gradient-primary text-white rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-indigo-600/30 hover:scale-105 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 relative overflow-hidden group mt-6"
                >
                  {isLoading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin-custom" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>

                {/* Sign In Link */}
                <div className="text-center pt-2">
                  <span className="text-gray-600">Already have an account? </span>
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    disabled={isLoading}
                    className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors disabled:opacity-50 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 hover:after:w-full after:transition-all after:duration-300"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
