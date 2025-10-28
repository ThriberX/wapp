'use client'; 

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  sendEmailVerification, 
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  User,
  getAuth,
} from 'firebase/auth';
import { auth } from '@/src/firebase'; 

declare global {
    interface Window {
        recaptchaVerifier: RecaptchaVerifier | null;
    }
}

const isFirebaseError = (err: any): err is { code: string } => {
    return err && typeof err === 'object' && 'code' in err && typeof (err as { code: string }).code === 'string';
};

const initRecaptcha = (containerId: string) => {
  if (typeof window === 'undefined') return;
  
  if (window.recaptchaVerifier) return; 
  
  try {
    const verifier = new RecaptchaVerifier(getAuth(), containerId, {
      'size': 'invisible',
      'callback': (response: any) => { 
        console.log('reCAPTCHA solved');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired, please try again.');
      }
    });
    
    window.recaptchaVerifier = verifier;

    verifier.render().then((widgetId) => {
        console.log('reCAPTCHA initialized with widget ID:', widgetId);
    });
    
    return verifier;

  } catch (e) {
    console.error("Error initializing reCAPTCHA:", e);
    return null;
  }
};

interface LoginProps {
    onClose: () => void; 
    initialShow?: boolean;
}

const Login: React.FC<LoginProps> = ({ onClose }) => {
  
  const router = useRouter(); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerifying, setEmailVerifying] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [verifyingOTP, setVerifyingOTP] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [tempPassword, setTempPassword] = useState('');

  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const clearErrors = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const clearAllForms = useCallback(() => {
    setEmail('');
    setPassword('');
    setFullName('');
    setSignupEmail('');
    setSignupPassword('');
    setConfirmPassword('');
    setPhoneNumber('');
    setOtpCode('');
    setEmailVerified(false);
    setPhoneVerified(false);
    setShowOTPInput(false);
    setUnverifiedEmail('');
    setTempPassword('');
    clearErrors();
  }, [clearErrors]);

  const closePopup = useCallback(() => {
    clearAllForms();
    onClose(); 
  }, [clearAllForms, onClose]);


  const toggleToSignup = useCallback(() => {
    setShowSignupForm(true);
    clearErrors();
  }, [clearErrors]);

  const toggleToLogin = useCallback(() => {
    setShowSignupForm(false);
    clearErrors();
  }, [clearErrors]);

  const backToLogin = useCallback(() => {
    setShowEmailVerification(false);
    setUnverifiedEmail('');
    setTempPassword('');
    clearErrors();
  }, [clearErrors]);

  useEffect(() => {
 
    if (showSignupForm) {
      initRecaptcha('recaptcha-container');
    }
  }, [showSignupForm]);


  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearErrors();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address (e.g. user@example.com)');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user: User = userCredential.user;
      await user.reload();

      if (!user.emailVerified) {
        setUnverifiedEmail(user.email ?? ''); 
        setTempPassword(password);
        await signOut(auth); 
        setShowEmailVerification(true);
        setLoading(false);
        return;
      }
      
      setSuccess('Login successful! Welcome back!');
      setEmail('');
      setPassword('');
      
      setTimeout(() => {
        closePopup(); 
        router.push('/');
      }, 1500);
      
    } catch (err: unknown) {
      console.error('Login failed:', err);
      
      if (isFirebaseError(err)) { 
        switch (err.code) {
          case 'auth/invalid-email':
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            setError('Invalid email or password. Please check your credentials.');
            break;
          case 'auth/user-disabled':
            setError('This user account has been disabled.');
            break;
          case 'auth/too-many-requests':
            setError('Too many failed attempts. Please try again later.');
            break;
          case 'auth/network-request-failed':
            setError('Network error. Please check your internet connection.');
            break;
          default:
            setError('Login failed. Please try again.');
        }
      } else {
        setError('An unexpected error occurred during login.');
      }
    } finally {
      setLoading(false);
    }
  };

  const sendEmailVerificationCode = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    setEmailVerifying(true);
    clearErrors();

    try {
      const tempUserCredential = await createUserWithEmailAndPassword(auth, signupEmail, 'TempPass123!@#');
      await sendEmailVerification(tempUserCredential.user);
      await signOut(auth); 
      
      setEmailVerificationSent(true);
      setSuccess('Verification email sent! Please check your inbox.');
      
    } catch (err: unknown) { 
      if (isFirebaseError(err)) { 
        if (err.code === 'auth/email-already-in-use') {
          setError('This email is already registered.');
        } else {
          console.error('Email verification error:', err);
          setError('Failed to send verification email. Please try logging in if you have already signed up.');
        }
      } else {
        setError('An unexpected error occurred during email verification.');
      }
    } finally {
      setEmailVerifying(false);
    }
  };

  const sendPhoneOTP = async () => {
    const phoneRegex = /^\+?[1-9]\d{6,14}$/;
    const formattedPhone = phoneNumber.replace(/\s/g, ''); 

    if (!phoneRegex.test(formattedPhone)) {
      setError('Please enter a valid phone number with country code (e.g., +91 XXXXXXXXXX)');
      return;
    }

    setSendingOTP(true);
    clearErrors();

    try {
      if (!window.recaptchaVerifier) {
        initRecaptcha('recaptcha-container');
      }
      
      const appVerifier = window.recaptchaVerifier;

      if (!appVerifier) {
        setError("reCAPTCHA initialization failed. Please try again.");
        setSendingOTP(false);
        return;
      }
      
      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(result);
      
      setShowOTPInput(true);
      setSuccess('OTP sent to your phone number!');
    } catch (err: unknown) { 
      console.error('OTP send error:', err);
      setError('Failed to send OTP. Please check your phone number and ensure reCAPTCHA is working.');
    } finally {
      setSendingOTP(false);
    }
  };

  const verifyPhoneOTP = async () => {
    if (otpCode.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    if (!confirmationResult) {
      setError('OTP process not initialized. Please resend OTP.');
      return;
    }

    setVerifyingOTP(true);
    clearErrors();

    try {
      await confirmationResult.confirm(otpCode);
      setPhoneVerified(true);
      setShowOTPInput(false);
      setSuccess('Phone number verified successfully!');
      
      await signOut(auth); 
    } catch (err: unknown) { 
      console.error('OTP verification error:', err);
      setError('Invalid OTP. Please try again.');
    } finally {
      setVerifyingOTP(false);
    }
  };

  const signup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearErrors();

    if (!phoneVerified) {
      setError('Please verify your phone number first.');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupEmail)) {
      setError('Please enter a valid email address (e.g. user@example.com)');
      return;
    }
    
    if (fullName.trim().length < 2) {
      setError('Please enter your full name (at least 2 characters)');
      return;
    }
    
    if (signupPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    
    setLoading(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      const user = userCredential.user;
      
      await updateProfile(user, {
        displayName: fullName.trim(),
      });
      
      await sendEmailVerification(user);
      await signOut(auth); 
      
      setSuccess('Account created successfully! Please check your email for the verification link before logging in.');

      clearAllForms(); 
      setTimeout(() => {
        setSuccess(null);
        setShowSignupForm(false);
      }, 4000);
      
    } catch (err: unknown) { 
      console.error('Signup error:', err);
      if (isFirebaseError(err)) { 
        switch (err.code) {
          case 'auth/email-already-in-use':
            setError('This email address is already registered.');
            break;
          case 'auth/invalid-email':
            setError('Invalid email address format.');
            break;
          case 'auth/weak-password':
            setError('Password is too weak. Must be at least 6 characters.');
            break;
          default:
            setError('Failed to create account. Please try again.');
        }
      } else {
        setError('An unexpected error occurred during signup.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    setResendLoading(true);
    clearErrors();
    
    try {
      const tempCredential = await signInWithEmailAndPassword(auth, unverifiedEmail, tempPassword);
      await sendEmailVerification(tempCredential.user);
      await signOut(auth); 
      
      setSuccess('Verification email re-sent! Please check your inbox.');
    } catch (err: unknown) { 
      setError('Failed to resend verification email. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const checkVerificationStatus = async () => {
    setLoading(true);
    clearErrors();
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, unverifiedEmail, tempPassword);
      await userCredential.user.reload(); 
      
      if (userCredential.user.emailVerified) {
        setSuccess('Email verified! Login successful!');
        setShowEmailVerification(false);
        
        setTimeout(() => {
          closePopup();
          router.push('/');
        }, 1500);
      } else {
        await signOut(auth); 
        setError('Email is still not verified. Please check your inbox and click the verification link.');
      }
    } catch (err: unknown) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

 
  return (
    <div className="fixed inset-0 bg-[rgba(31,31,31,0.8)] bg-opacity-80 z-[9999] flex justify-center items-center p-2 sm:p-4">
      <div className="relative w-full max-w-[900px] font-sans">
        
       
        <button 
          type="button" 
          className="absolute right-2 top-2 z-10 w-8 h-8 md:w-10 md:h-10 text-white bg-gray-700/80 hover:bg-black/90 rounded-full font-bold text-xl flex items-center justify-center border-2 border-white transition-colors" 
          onClick={closePopup}
          aria-label="Close"
        >
          &times;
        </button>
        
        <div className="flex flex-col md:flex-row rounded-xl overflow-hidden shadow-2xl border-2 border-white max-w-[900px] w-full">
          
    
          <div className="flex-1 bg-[#dadada] flex items-center justify-center p-5 md:p-10 h-[150px] md:h-auto">
            <img 
              src="/assets/login/welcome-character.png" 
              alt="Welcome Character" 
              className="max-w-[40%] md:max-w-[90%] h-auto rounded-[10px] object-contain"
            />
          </div>

      
          <div className={`md:w-1/2 bg-black/80 backdrop-blur-md flex justify-center p-5 max-h-[70vh] md:max-h-[90vh] overflow-y-auto ${showSignupForm ? 'items-start pt-8' : 'items-center'}`}>
            <div className="bg-white/10 border border-white/30 rounded-2xl p-6 md:p-8 w-full max-w-sm shadow-xl text-white text-center">
              
            
              {!showSignupForm && !showEmailVerification && (
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-white">Login</h2>
                  <form onSubmit={login}>
                    <div className="space-y-4 text-left">
                      <div className="form-group">
                        <label htmlFor="email" className="block mb-2 font-medium">Email:</label>
                        <input 
                          type="email" 
                          id="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          required 
                          className="w-full p-3 rounded-lg border border-gray-300 bg-white/90 text-gray-800 box-border focus:outline-none focus:ring-2 focus:ring-sky-400"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="password" className="block mb-2 font-medium">Password:</label>
                        <input 
                          type="password" 
                          id="password" 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          required 
                          className="w-full p-3 rounded-lg border border-gray-300 bg-white/90 text-gray-800 box-border focus:outline-none focus:ring-2 focus:ring-sky-400"
                        />
                      </div>
                    </div>
                    <button 
                      type="submit" 
                      className="w-full p-3 mt-5 rounded-lg text-lg font-bold cursor-pointer transition-transform duration-200 ease-in-out text-white 
                                 bg-[linear-gradient(90deg,_#12DBE5_0%,_#1F5799_48.96%,_#F20000_100%)] 
                                 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                      disabled={loading}
                    >
                      {loading ? 'Logging in...' : 'Log In'}
                    </button>
                  </form>
                  
                  {error && <p className="text-red-400 mt-4 font-medium">{error}</p>}
                  {success && <p className="text-green-400 mt-4 font-medium">{success}</p>}
                  
                  <p className="mt-5 text-gray-300 text-base md:text-lg">
                    Don`t have an account? 
                    <a href="#" onClick={toggleToSignup} className="text-cyan-400 hover:text-sky-400 font-extrabold transition-colors ml-1">Sign Up</a>
                  </p>
                </div>
              )}

          
              {showEmailVerification && (
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-white">Verify Email</h2>
                  <p className="text-gray-300 mb-5 leading-relaxed">
                    Please verify your email address before logging in. Check your inbox for the verification link.
                  </p>
                  <p className="text-gray-300 mb-5 text-sm">
                    Email: <strong>{unverifiedEmail}</strong>
                  </p>
                  
                  <button 
                    onClick={resendVerification} 
                    className="w-full p-3 rounded-lg text-lg font-bold cursor-pointer transition-transform duration-200 ease-in-out text-white 
                               bg-blue-600 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={resendLoading}
                  >
                    {resendLoading ? 'Sending...' : 'Resend Verification Email'}
                  </button>
                  
                  <button 
                    onClick={checkVerificationStatus} 
                    className="w-full p-3 mt-3 rounded-lg text-lg font-bold cursor-pointer transition-transform duration-200 ease-in-out text-white 
                               bg-[linear-gradient(90deg,_#12DBE5_0%,_#1F5799_48.96%,_#F20000_100%)] 
                               hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none" 
                    disabled={loading}
                  >
                    {loading ? 'Checking...' : 'I\'ve Verified, Let Me Login'}
                  </button>
                  
                  {error && <p className="text-red-400 mt-4 font-medium">{error}</p>}
                  {success && <p className="text-green-400 mt-4 font-medium">{success}</p>}
                  
                  <p className="mt-5 text-gray-300 text-lg">
                    <a href="#" onClick={backToLogin} className="text-cyan-400 hover:text-sky-400 font-extrabold transition-colors">Back to Login</a>
                  </p>
                </div>
              )}

              
              {showSignupForm && (
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-white">Sign Up</h2>
                  <form onSubmit={signup}>
                    <div className="space-y-4 text-left">
                      
                      {/* Full Name */}
                      <div className="form-group">
                        <label htmlFor="fullName" className="block mb-2 font-medium">Full Name:</label>
                        <input 
                          type="text" 
                          id="fullName" 
                          value={fullName} 
                          onChange={(e) => setFullName(e.target.value)} 
                          required 
                          className="w-full p-3 rounded-lg border border-gray-300 bg-white/90 text-gray-800 box-border focus:outline-none focus:ring-2 focus:ring-sky-400"
                        />
                      </div>
                      
                 
                      <div className="form-group">
                        <label htmlFor="signupEmail" className="block mb-2 font-medium">Email: *</label>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
                          <input 
                            type="email" 
                            id="signupEmail" 
                            value={signupEmail} 
                            onChange={(e) => setSignupEmail(e.target.value)} 
                            disabled={emailVerified}
                            required
                            className="flex-1 w-full sm:w-auto p-3 rounded-lg border border-gray-300 bg-white/90 text-gray-800 box-border focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:bg-gray-400/50 disabled:cursor-not-allowed"
                          />
                          <button 
                            type="button" 
                            className="p-3 px-4 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-bold cursor-pointer whitespace-nowrap transition-transform duration-200 hover:scale-[1.05] disabled:opacity-60 disabled:cursor-not-allowed"
                            onClick={sendEmailVerificationCode}
                            disabled={emailVerified || emailVerifying}
                          >
                            {emailVerified ? '✓ Verified' : emailVerifying ? 'Sending...' : 'Verify'}
                          </button>
                        </div>
                        {emailVerificationSent && <p className="text-green-400 text-sm mt-1">Verification email sent! Check your inbox and click the link.</p>}
                      </div>

                   
                      <div className="form-group">
                        <label htmlFor="phoneNumber" className="block mb-2 font-medium">Mobile Number: *</label>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
                          <input 
                            type="tel" 
                            id="phoneNumber" 
                            value={phoneNumber} 
                            onChange={(e) => setPhoneNumber(e.target.value)} 
                            placeholder="+91 XXXXXXXXXX"
                            disabled={phoneVerified || showOTPInput} 
                            required
                            className="flex-1 w-full sm:w-auto p-3 rounded-lg border border-gray-300 bg-white/90 text-gray-800 box-border focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:bg-gray-400/50 disabled:cursor-not-allowed"
                          />
                          <button 
                            type="button" 
                            className="p-3 px-4 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-bold cursor-pointer whitespace-nowrap transition-transform duration-200 hover:scale-[1.05] disabled:opacity-60 disabled:cursor-not-allowed"
                            onClick={sendPhoneOTP}
                            disabled={phoneVerified || sendingOTP || showOTPInput}
                          >
                            {phoneVerified ? '✓ Verified' : sendingOTP ? 'Sending...' : 'Verify'}
                          </button>
                        </div>
                        <p className="text-red-400 text-xs italic mt-1">* This field is mandatory</p>
                        
                        {showOTPInput && !phoneVerified && (
                          <div className="flex gap-2 mt-3">
                            <input 
                              type="text" 
                              value={otpCode} 
                              onChange={(e) => setOtpCode(e.target.value)} 
                              placeholder="Enter 6-digit OTP"
                              maxLength={6}
                              className="flex-1 p-3 rounded-lg border border-gray-300 bg-white/90 text-gray-800 text-lg tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-sky-400"
                            />
                            <button 
                              type="button" 
                              className="p-3 px-4 rounded-lg bg-emerald-500 text-white font-bold cursor-pointer whitespace-nowrap transition-transform duration-200 hover:scale-[1.05] disabled:opacity-60 disabled:cursor-not-allowed"
                              onClick={verifyPhoneOTP}
                              disabled={verifyingOTP}
                            >
                              {verifyingOTP ? 'Verifying...' : 'Verify OTP'}
                            </button>
                          </div>
                        )}
                      </div>

                    
                      <div className="form-group">
                        <label htmlFor="signupPassword" className="block mb-2 font-medium">Password:</label>
                        <input 
                          type="password" 
                          id="signupPassword" 
                          value={signupPassword} 
                          onChange={(e) => setSignupPassword(e.target.value)} 
                          required 
                          minLength={6}
                          className="w-full p-3 rounded-lg border border-gray-300 bg-white/90 text-gray-800 box-border focus:outline-none focus:ring-2 focus:ring-sky-400"
                        />
                      </div>
                      
                     
                      <div className="form-group">
                        <label htmlFor="confirmPassword" className="block mb-2 font-medium">Confirm Password:</label>
                        <input 
                          type="password" 
                          id="confirmPassword" 
                          value={confirmPassword} 
                          onChange={(e) => setConfirmPassword(e.target.value)} 
                          required 
                          className="w-full p-3 rounded-lg border border-gray-300 bg-white/90 text-gray-800 box-border focus:outline-none focus:ring-2 focus:ring-sky-400"
                        />
                      </div>
                      
                    </div>
                    
                    <button 
                      type="submit" 
                      className="w-full p-3 mt-5 rounded-lg text-lg font-bold cursor-pointer transition-transform duration-200 ease-in-out text-white 
                                 bg-[linear-gradient(90deg,_#12DBE5_0%,_#1F5799_48.96%,_#F20000_100%)] 
                                 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                      disabled={loading || !phoneVerified}
                    >
                      {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                    
                    {!phoneVerified && (
                      <p className="text-yellow-400 text-sm mt-3">
                        Please verify your phone number to sign up
                      </p>
                    )}
                  </form>
                  
               
                  <div id="recaptcha-container" className="mt-2"></div>
                  
                  {error && <p className="text-red-400 mt-4 font-medium">{error}</p>}
                  {success && <p className="text-green-400 mt-4 font-medium">{success}</p>}
                  
                  <p className="mt-5 text-gray-300 text-lg">
                    Already have an account? 
                    <a href="#" onClick={toggleToLogin} className="text-cyan-400 hover:text-sky-400 font-extrabold transition-colors ml-1">Log In</a>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
