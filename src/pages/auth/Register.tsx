import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Check, X, Hotel, CheckCircle, AlertCircle } from 'lucide-react';
import authService from '../../services/auth';

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

  const PasswordRequirement = ({ met, label }: { met: boolean; label: string }) => (
    <div className="flex items-center gap-2 text-xs">
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
            transform: translateY(30px) scale(0.95); 
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
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
        }

        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }

        .animate-slide-up {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }

        .animate-slide-down {
          animation: slideDown 0.3s ease;
        }

        .animate-pulse-logo {
          animation: pulse 3s ease-in-out infinite;
        }

        .glass-card {
          backdrop-filter: blur(16px);
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
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
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .btn-gradient::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s;
        }

        .btn-gradient:hover:not(:disabled)::before {
          left: 100%;
        }

        .btn-gradient:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        .btn-gradient:active:not(:disabled) {
          transform: translateY(0);
        }

        .checkbox-custom:checked {
          background-color: #667eea;
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
        }

        .checkbox-custom:focus {
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.25);
          outline: none;
        }

        .checkbox-custom:hover:not(:disabled) {
          border-color: #667eea;
        }

        .text-link {
          text-decoration: none;
          color: #667eea;
          font-weight: 600;
          transition: all 0.2s;
          position: relative;
        }

        .text-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: #667eea;
          transition: width 0.3s ease;
        }

        .text-link:hover {
          color: #5568d3;
        }

        .text-link:hover::after {
          width: 100%;
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

        .form-floating.password-field {
          margin-bottom: 0;
        }

        .form-floating.password-field input {
          padding-right: 3rem;
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

          .form-floating.password-field input {
            padding-right: 3rem;
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
            <div className="hidden md:flex md:col-span-5 relative bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white flex-col items-center justify-center text-center p-10 overflow-hidden">
              {/* Decorative pattern overlay */}
              <div 
                className="absolute inset-0 pointer-events-none" 
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                                   radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)`
                }}
              ></div>
              
              <div className="relative z-10">
                {/* Logo */}
                <div className="w-20 h-20 bg-white/15 rounded-[20px] flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border-2 border-white/20 animate-pulse-logo">
                  <Hotel className="w-12 h-12 text-white" />
                </div>
                <h2 className="mb-3 opacity-100 text-white">Welcome to StayEase</h2>
                <p className="mb-0 opacity-90 text-white">Create your account to get started.</p>
                
                {/* Feature List */}
                <div className="mt-8 text-left max-w-[250px] mx-auto">
                  {[
                    { icon: CheckCircle, label: 'Easy registration' },
                    { icon: CheckCircle, label: 'Secure account' },
                    { icon: CheckCircle, label: 'Start booking' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center mb-4 text-[0.95rem] opacity-95">
                      <item.icon className="w-6 h-6 mr-3 text-white/90" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Section - Form */}
            <div className="md:col-span-7 bg-white p-8 md:p-14 relative">
              {/* Mobile Brand Badge */}
              <div className="text-center md:hidden mb-6">
                <div className="inline-flex items-center gap-2 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white px-4 py-2 rounded-full text-sm shadow-lg shadow-purple-500/30">
                  <Hotel className="w-4 h-4" />
                  <span>StayEase</span>
                </div>
              </div>

              {/* Header */}
              <h3 className="text-gray-900 mb-2">Create your account</h3>
              <p className="text-gray-500 mb-6">Sign up to start booking your perfect stay.</p>

              {/* Success Message */}
              {success && (
                <div className="mb-4 p-3 bg-gradient-to-r from-[#d1fae5] to-[#a7f3d0] rounded-xl border border-[#6ee7b7] animate-slide-down flex items-center gap-2" role="alert" aria-live="polite">
                  <CheckCircle className="w-5 h-5 text-[#065f46] flex-shrink-0" aria-hidden="true" />
                  <span className="text-[#065f46] text-sm">{success}</span>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-gradient-to-r from-[#fee2e2] to-[#fecaca] rounded-xl border-2 border-[#fca5a5] animate-slide-down" role="alert" aria-live="assertive">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 pt-0.5">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-red-900 font-semibold text-sm mb-1">Registration Error</h4>
                      <p className="text-red-700 text-sm leading-relaxed">
                        {error.includes('email')
                          ? 'This email is already registered. Please use a different email or sign in instead.'
                          : error.includes('weak') || error.includes('password')
                          ? 'Your password is too weak. Use uppercase, lowercase, numbers, and special characters.'
                          : error.includes('match')
                          ? 'The passwords you entered don\'t match. Please check and try again.'
                          : error.includes('required')
                          ? 'Please fill in all required fields.'
                          : error.includes('network') || error.includes('Network')
                          ? 'Network connection error. Please check your internet and try again.'
                          : error.includes('server')
                          ? 'Server error. Please try again later.'
                          : error}
                      </p>
                      <button
                        type="button"
                        onClick={() => setError('')}
                        className="mt-2 inline-flex items-center text-xs text-red-600 hover:text-red-700 font-medium transition-colors"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                
                {/* Name Field */}
                <div className="form-floating">
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder=" "
                    required
                    disabled={isLoading}
                    autoComplete="name"
                    className="w-full text-gray-900"
                  />
                  <label htmlFor="name">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name
                  </label>
                </div>

                {/* Email Field */}
                <div className="form-floating">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=" "
                    required
                    disabled={isLoading}
                    autoComplete="email"
                    className="w-full text-gray-900"
                  />
                  <label htmlFor="email">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                </div>

                {/* Password Field */}
                <div className="form-floating password-field relative mb-4">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=" "
                    required
                    disabled={isLoading}
                    autoComplete="new-password"
                    className="w-full text-gray-900"
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

                {/* Password Strength Indicator */}
                {password && (
                  <div className="ml-1 space-y-2 mb-4 -mt-4">
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
                      <span className={`text-xs font-semibold whitespace-nowrap ${
                        strengthColor === 'red' ? 'text-red-600' :
                        strengthColor === 'yellow' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {strengthLabel}
                      </span>
                    </div>

                    {/* Requirements */}
                    <div className="grid grid-cols-2 gap-2 p-2 bg-gray-50 rounded text-xs">
                      <PasswordRequirement met={passwordStrength.hasUppercase} label="Uppercase" />
                      <PasswordRequirement met={passwordStrength.hasLowercase} label="Lowercase" />
                      <PasswordRequirement met={passwordStrength.hasNumber} label="Number" />
                      <PasswordRequirement met={passwordStrength.hasSpecial} label="Special char" />
                    </div>
                  </div>
                )}

                {/* Confirm Password Field */}
                <div className="form-floating password-field relative mb-2">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder=" "
                    required
                    disabled={isLoading}
                    autoComplete="new-password"
                    className="w-full text-gray-900"
                  />
                  <label htmlFor="confirm-password">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Confirm Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                    className="password-toggle"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Password Match Validation */}
                {password && passwordConfirmation && (
                  <div className="mb-4">
                    {password === passwordConfirmation ? (
                      <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-[#d1fae5] to-[#a7f3d0] rounded-lg border border-[#6ee7b7]">
                        <CheckCircle className="w-5 h-5 text-[#065f46] flex-shrink-0" />
                        <span className="text-sm text-[#065f46] font-medium">Passwords match</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-[#fee2e2] to-[#fecaca] rounded-lg border border-[#fca5a5]">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <span className="text-sm text-red-700 font-medium">Passwords do not match</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Terms and Conditions */}
                <label className="flex items-center gap-2 cursor-pointer mb-6 mt-2">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    disabled={isLoading}
                    className="checkbox-custom w-4 h-4 rounded border-2 border-gray-300 text-[#667eea] cursor-pointer transition-all"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the{' '}
                    <button
                      type="button"
                      className="text-link text-sm"
                      disabled={isLoading}
                    >
                      Terms of Service
                    </button>
                    {' '}and{' '}
                    <button
                      type="button"
                      className="text-link text-sm"
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
                  className="btn-gradient w-full py-3 px-8 text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mb-4 min-h-12"
                >
                  {isLoading ? (
                    <>
                      <span className="spinner" aria-hidden="true"></span>
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <Check className="w-5 h-5" aria-hidden="true" />
                    </>
                  )}
                </button>

                {/* Sign In Link */}
                <div className="text-center">
                  <span className="text-gray-500 text-sm">Already have an account? </span>
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    disabled={isLoading}
                    className="text-link text-sm ml-1"
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
