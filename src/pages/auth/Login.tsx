import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Hotel, CheckCircle, ArrowRight, AlertCircle, X } from 'lucide-react';
import authService from '../../services/auth';

interface ValidationErrors {
  email?: string;
  password?: string;
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [failedAttempts, setFailedAttempts] = useState(0);

  // Validation helpers
  const validateEmail = (emailValue: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const validatePassword = (passwordValue: string): boolean => {
    return passwordValue.length >= 6;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (validationErrors.email && validateEmail(value)) {
      setValidationErrors(prev => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (validationErrors.password && validatePassword(value)) {
      setValidationErrors(prev => ({ ...prev, password: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!validatePassword(password)) {
      errors.password = 'Password must be at least 6 characters';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const result = await authService.login(email, password);
      
      if (result.success) {
        setSuccess('Login successful! Redirecting...');
        setFailedAttempts(0);
        // Determine destination based on role
        const currentState = authService.getState();
        const isAdmin = currentState.user && Array.isArray(currentState.user.roles) && currentState.user.roles.includes('Admin');
        setTimeout(() => navigate(isAdmin ? '/dashboard' : '/landing'), 800);
      } else {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        if (newAttempts >= 5) {
          setError(`Too many failed attempts. Please try again later or reset your password.`);
        } else {
          setError('Oops! That email or password does not match our records.');
        }
      }
    } catch (err) {
      setError('Please check your email and password and try again.');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center p-4 relative overflow-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }

        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(30px) scale(0.96); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }

        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
          0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.5);
          }
          50% { 
            transform: scale(1.05); 
            box-shadow: 0 0 0 12px rgba(255, 255, 255, 0);
          }
        }

        @keyframes glow-green {
          0%, 100% { box-shadow: 0 0 0 2px #10b981, 0 0 8px rgba(16, 185, 129, 0.4); }
          50% { box-shadow: 0 0 0 2px #10b981, 0 0 12px rgba(16, 185, 129, 0.6); }
        }

        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }

        .animate-slide-up {
          animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slide-down {
          animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-pulse-logo {
          animation: pulse 3s ease-in-out infinite;
        }

        .glass-card {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.97);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.35),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset;
        }

        .sidebar-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
        }

        .sidebar-gradient::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .form-floating {
          position: relative;
          margin-bottom: 1.5rem;
          transition: transform 0.2s ease;
        }

        .form-floating:focus-within {
          transform: translateY(-2px);
        }

        .form-floating input {
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 1.5rem 1rem 0.5rem 1rem;
          font-size: 0.95rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: #f9fafb;
          height: 3.5rem;
          width: 100%;
        }

        .form-floating input:autofill {
          -webkit-autofill: none;
          -webkit-box-shadow: 0 0 0 1000px #f9fafb inset !important;
          -webkit-text-fill-color: #1f2937 !important;
        }

        .form-floating input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.12);
          background: #ffffff;
          outline: none;
        }

        .form-floating input:focus:autofill {
          -webkit-box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.12) inset, 0 0 0 1000px #ffffff inset !important;
        }

        .form-floating input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #f3f4f6;
        }

        .form-floating input.ring-2 {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .form-floating input.ring-2:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
        }

        .form-floating label {
          position: absolute;
          top: 1.25rem;
          left: 1rem;
          color: #6b7280;
          font-size: 0.95rem;
          pointer-events: none;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 0;
          line-height: 1;
          transform-origin: left top;
        }

        .form-floating input:focus ~ label {
          color: #667eea;
          top: 0.375rem;
          font-size: 0.75rem;
        }

        .form-floating input:not(:focus):not(:placeholder-shown) ~ label {
          color: #6b7280;
          top: 0.375rem;
          font-size: 0.75rem;
        }

        .form-floating input:not(:focus) ~ label {
          color: #6b7280;
        }

        .btn-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          font-weight: 600;
          letter-spacing: 0.3px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.35);
        }

        .btn-gradient::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent);
          transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-gradient::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent 50%, rgba(255, 255, 255, 0.1));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .btn-gradient:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.45),
                      0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .btn-gradient:hover:not(:disabled)::before {
          left: 100%;
        }

        .btn-gradient:hover:not(:disabled)::after {
          opacity: 1;
        }

        .btn-gradient:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.35);
        }

        .btn-gradient:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .checkbox-custom {
          appearance: none;
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid #d1d5db;
          border-radius: 0.25rem;
          background: white;
          cursor: pointer;
          position: relative;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .checkbox-custom:hover:not(:disabled) {
          border-color: #667eea;
        }

        .checkbox-custom:checked {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: #667eea;
        }

        .checkbox-custom:checked::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(45deg) scale(1);
          width: 0.25rem;
          height: 0.5rem;
          border: solid white;
          border-width: 0 2px 2px 0;
          animation: checkmark 0.2s ease forwards;
        }

        @keyframes checkmark {
          0% { transform: translate(-50%, -50%) rotate(45deg) scale(0); }
          100% { transform: translate(-50%, -50%) rotate(45deg) scale(1); }
        }

        .checkbox-custom:focus {
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.25);
          outline: none;
        }

        .text-link {
          text-decoration: none;
          color: #667eea;
          font-weight: 600;
          transition: all 0.2s ease;
          position: relative;
          display: inline-block;
        }

        .text-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .text-link:hover {
          color: #5568d3;
        }

        .text-link:hover::after {
          width: 100%;
        }

        .text-link:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          color: #9ca3af;
        }

        .password-toggle {
          position: absolute;
          top: 50%;
          right: 1rem;
          transform: translateY(-50%);
          color: #9ca3af;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 10;
          padding: 0.5rem;
          border-radius: 0.375rem;
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          touch-action: manipulation;
        }

        .password-toggle:hover:not(:disabled) {
          color: #667eea;
          background: rgba(102, 126, 234, 0.08);
          transform: translateY(-50%) scale(1.08);
        }

        .password-toggle:active:not(:disabled) {
          transform: translateY(-50%) scale(1);
        }

        .password-toggle:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Loading spinner */
        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Feature items animation */
        .feature-item {
          opacity: 0;
          animation: fadeInUp 0.6s ease forwards;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .feature-item:nth-child(1) { animation-delay: 0.1s; }
        .feature-item:nth-child(2) { animation-delay: 0.2s; }
        .feature-item:nth-child(3) { animation-delay: 0.3s; }

        .feature-item:hover {
          transform: translateX(4px);
        }

        /* Success and error styles */
        .success-message {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          border: 1px solid #6ee7b7;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
          padding: 0.75rem !important;
        }

        .success-message span {
          font-size: 0.875rem;
        }

        .error-message {
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          border: 2px solid #fca5a5;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
          padding: 0.75rem !important;
        }

        .error-message h4 {
          font-size: 0.875rem;
          margin-bottom: 0.25rem !important;
          font-weight: 600;
        }

        .error-message p {
          margin-bottom: 0.5rem !important;
          font-size: 0.85rem;
          line-height: 1.4;
        }

        .error-message button {
          font-size: 0.75rem;
          padding: 0 !important;
          margin-top: 0.25rem !important;
        }

        .validation-error {
          font-size: 0.75rem;
          color: #dc2626;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin-top: 0.25rem;
          animation: slideDown 0.2s ease;
        }

        .validation-error svg {
          flex-shrink-0;
        }

        /* Mobile badge shimmer */
        .mobile-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.35);
          animation: subtle-shimmer 3s ease-in-out infinite;
        }

        @keyframes subtle-shimmer {
          0%, 100% { box-shadow: 0 4px 12px rgba(102, 126, 234, 0.35); }
          50% { box-shadow: 0 6px 16px rgba(102, 126, 234, 0.45); }
        }

        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Mobile Optimizations */
        @media (max-width: 768px) {
          .form-floating input {
            font-size: 16px;
            height: 3.25rem;
            padding: 1.25rem 0.875rem 0.5rem 0.875rem;
          }

          .form-floating label {
            left: 0.875rem;
          }

          .password-toggle {
            right: 0.5rem;
            width: 2.25rem;
            height: 2.25rem;
          }

          .password-toggle svg {
            width: 1.25rem;
            height: 1.25rem;
          }

          .checkbox-custom {
            width: 1.375rem;
            height: 1.375rem;
            min-width: 1.375rem;
            min-height: 1.375rem;
          }

          .btn-gradient {
            padding: 0.875rem 1rem;
            font-size: 1rem;
            border-radius: 0.625rem;
            min-height: 3rem;
          }

          .spinner {
            width: 14px;
            height: 14px;
            border-width: 2px;
          }

          .error-message,
          .success-message {
            border-radius: 0.5rem;
          }

          .glass-card {
            border-radius: 2rem;
          }
        }

        @media (max-width: 640px) {
          .form-floating {
            margin-bottom: 1.25rem;
          }

          .form-floating input {
            border-radius: 0.5rem;
          }

          .text-link {
            font-size: 0.875rem;
          }

          .error-message h4,
          .error-message p {
            font-size: 0.8rem;
          }
        }
      `}</style>

      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[250px] -right-[100px] w-[500px] h-[500px] bg-white/10 rounded-full animate-float-slow" style={{ animationDelay: '-5s' }}></div>
        <div className="absolute -bottom-[200px] -left-[100px] w-[400px] h-[400px] bg-white/10 rounded-full animate-float-slow" style={{ animationDelay: '-10s' }}></div>
      </div>

      {/* Main container */}
      <div className="relative z-10 w-full max-w-[900px] px-4">
        <div className="glass-card rounded-3xl overflow-hidden animate-slide-up">
          <div className="grid md:grid-cols-12 gap-0">
            
            {/* Left Section - Branding */}
            <div className="hidden md:flex md:col-span-5 relative sidebar-gradient text-white flex-col items-center justify-center text-center p-10 overflow-hidden">
              
              <div className="relative z-10">
                {/* Logo */}
                <div className="w-20 h-20 bg-white/15 rounded-[20px] flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border-2 border-white/20 animate-pulse-logo">
                  <Hotel className="w-12 h-12 text-white drop-shadow-lg" />
                </div>
                <h2 className="mb-3 opacity-100 text-white">Welcome to StayEase</h2>
                <p className="mb-0 opacity-90 text-white">Book your perfect stay with ease.</p>
                
                {/* Feature List */}
                <div className="mt-8 text-left max-w-[250px] mx-auto">
                  {[
                    { icon: CheckCircle, label: 'Easy booking' },
                    { icon: CheckCircle, label: 'Great deals' },
                    { icon: CheckCircle, label: 'Secure & reliable' }
                  ].map((item, idx) => (
                    <div key={idx} className="feature-item flex items-center mb-4 text-[0.95rem] opacity-95">
                      <item.icon className="w-6 h-6 mr-3 text-white/90 flex-shrink-0" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative corner gradient */}
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-white/10 to-transparent rounded-tl-full"></div>
            </div>

            {/* Right Section - Form */}
            <div className="md:col-span-7 bg-white p-8 md:p-14 relative">
              {/* Mobile Brand Badge */}
              <div className="text-center md:hidden mb-6">
                <div className="mobile-badge inline-flex items-center gap-2 text-white px-4 py-2 rounded-full text-sm">
                  <Hotel className="w-4 h-4" />
                  <span>StayEase</span>
                </div>
              </div>

              {/* Header */}
              <h3 className="text-gray-900 mb-2">Sign in to your account</h3>
              <p className="text-gray-500 mb-6">Enter your credentials to access your account easily.</p>

              {/* Success Message */}
              {success && (
                <div 
                  className="success-message mb-4 p-3 rounded-xl animate-slide-down flex items-center gap-2"
                  role="alert"
                  aria-live="polite"
                >
                  <CheckCircle className="w-5 h-5 text-[#065f46] flex-shrink-0" />
                  <span className="text-[#065f46] text-sm">{success}</span>
                </div>
              )}

              {/* Error Summary */}
              {(error || Object.keys(validationErrors).length > 0) && (
                <div 
                  className="error-message mb-6 p-4 rounded-xl animate-slide-down"
                  role="alert"
                  aria-live="assertive"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 pt-0.5">
                      <AlertCircle className="w-6 h-6 text-red-600" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-red-900 text-sm mb-2">
                        {error ? 'Login Failed' : 'Please fix the following errors'}
                      </h4>
                      {error && (
                        <p className="text-red-700 text-sm leading-relaxed mb-3">
                          {error}
                        </p>
                      )}
                      {Object.keys(validationErrors).length > 0 && (
                        <ul className="text-red-700 text-sm space-y-1 mb-3">
                          {Object.entries(validationErrors).map(([field, message]) => (
                            <li key={field} className="flex items-start gap-2">
                              <span className="text-red-600 mt-0.5">•</span>
                              <span>{message}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setError('');
                          setValidationErrors({});
                        }}
                        className="mt-2 inline-flex items-center text-xs text-red-600 hover:text-red-700 transition-colors"
                      >
                        <X className="w-3 h-3 mr-1" aria-hidden="true" />
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate aria-label="Login form">
                
                {/* Email Field */}
                <div className="form-floating">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder=" "
                    required
                    disabled={isLoading}
                    autoComplete="email"
                    className="text-gray-900"
                  />
                  <label htmlFor="email">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                </div>
                {validationErrors.email && (
                  <p className="text-red-600 text-xs mt-1 mb-3 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.email}
                  </p>
                )}

                {/* Password Field */}
                <div className="form-floating relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder=" "
                    required
                    disabled={isLoading}
                    autoComplete="current-password"
                    className="text-gray-900"
                  />
                  <label htmlFor="password">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="password-toggle"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-red-600 text-xs mt-1 mb-3 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.password}
                  </p>
                )}

                {/* Remember & Forgot */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={isLoading}
                      className="checkbox-custom"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Remember me</span>
                  </label>
                  <span className="text-sm text-gray-500">Forgot password?</span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-gradient w-full py-3 px-8 text-white rounded-xl flex items-center justify-center gap-2 group min-h-12"
                >
                  {isLoading ? (
                    <>
                      <span className="spinner" aria-hidden="true"></span>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </>
                  )}
                </button>

                {/* Sign Up Link */}
                <div className="text-center mt-4">
                  <span className="text-gray-500 text-sm">Don't have an account? </span>
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    disabled={isLoading}
                    className="text-link text-sm ml-1"
                  >
                    Create one
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
