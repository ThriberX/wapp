'use client'; 

import Image from "next/image";
import { useState, useCallback, useEffect, useRef } from 'react';
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
import {
  VALIDATION_REGEX,
  VALIDATION_RULES,
  TIMEOUTS,
  FIREBASE_ERROR_MESSAGES,
  UI_MESSAGES,
  PLACEHOLDERS,
} from '@/lib/constants/authConstants';

const isFirebaseError = (err: any): err is { code: string } => {
  return err && typeof err === 'object' && 'code' in err && typeof (err as { code: string }).code === 'string';
};

const getFirebaseErrorMessage = (errorCode: string, defaultMessage: string): string => {
  return FIREBASE_ERROR_MESSAGES[errorCode] || defaultMessage;
};

const handleError = (err: unknown, setError: (msg: string) => void, defaultMessage: string) => {
  if (isFirebaseError(err)) {
    const errorMessage = getFirebaseErrorMessage(err.code, defaultMessage);
    setError(errorMessage);
  } else {
    setError(UI_MESSAGES.UNEXPECTED_ERROR);
  }
};

interface LoginProps {
  onClose: () => void; 
  initialShow?: boolean;
}

interface FormState {
  email: string;
  password: string;
  fullName: string;
  signupEmail: string;
  signupPassword: string;
  confirmPassword: string;
  phoneNumber: string;
  otpCode: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  showOTPInput: boolean;
  unverifiedEmail: string;
  tempPassword: string;
}

const INITIAL_FORM_STATE: FormState = {
  email: '',
  password: '',
  fullName: '',
  signupEmail: '',
  signupPassword: '',
  confirmPassword: '',
  phoneNumber: '',
  otpCode: '',
  emailVerified: false,
  phoneVerified: false,
  showOTPInput: false,
  unverifiedEmail: '',
  tempPassword: '',
};

const Login: React.FC<LoginProps> = ({ onClose }) => {
  const router = useRouter(); 
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);
  
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [emailVerifying, setEmailVerifying] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [verifyingOTP, setVerifyingOTP] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);

  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

 
  const updateFormField = useCallback(<K extends keyof FormState>(field: K, value: FormState[K]) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  }, []);

  const clearErrors = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const clearAllForms = useCallback(() => {
    setFormState(INITIAL_FORM_STATE);
    setEmailVerificationSent(false);
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
    updateFormField('unverifiedEmail', '');
    updateFormField('tempPassword', '');
    clearErrors();
  }, [clearErrors, updateFormField]);

  const initRecaptcha = useCallback((containerId: string) => {
    if (typeof window === 'undefined') return;
    
    if (recaptchaVerifierRef.current) return; 
    
    try {
      const verifier = new RecaptchaVerifier(getAuth(), containerId, {
        'size': 'invisible',
        'callback': () => { 
          console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired, please try again.');
        }
      });
      
      recaptchaVerifierRef.current = verifier;

      verifier.render().then((widgetId) => {
        console.log('reCAPTCHA initialized with widget ID:', widgetId);
      });
      
      return verifier;

    } catch (e) {
      console.error("Error initializing reCAPTCHA:", e);
      setError(UI_MESSAGES.RECAPTCHA_FAILED);
      return null;
    }
  }, []);

  useEffect(() => {
    if (showSignupForm) {
      initRecaptcha('recaptcha-container');
    }

    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (e) {
          console.error('Error clearing reCAPTCHA:', e);
        }
        recaptchaVerifierRef.current = null;
      }
    };
  }, [showSignupForm, initRecaptcha]);


  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearErrors();

    if (!VALIDATION_REGEX.EMAIL.test(formState.email)) {
      setError(UI_MESSAGES.INVALID_EMAIL);
      return;
    }
    
    if (formState.password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
      setError(UI_MESSAGES.PASSWORD_TOO_SHORT);
      return;
    }
    
    setLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formState.email, formState.password);
      const user: User = userCredential.user;
      await user.reload();

      if (!user.emailVerified) {
        updateFormField('unverifiedEmail', user.email ?? '');
        updateFormField('tempPassword', formState.password);
        await signOut(auth); 
        setShowEmailVerification(true);
        setLoading(false);
        return;
      }
      
      setSuccess(UI_MESSAGES.LOGIN_SUCCESS);
      updateFormField('email', '');
      updateFormField('password', '');
      
      setTimeout(() => {
        closePopup(); 
        router.push('/');
      }, TIMEOUTS.SUCCESS_REDIRECT);
      
    } catch (err: unknown) {
      handleError(err, setError, UI_MESSAGES.LOGIN_FAILED);
    } finally {
      setLoading(false);
    }
  };

 
  const sendEmailVerificationCode = async () => {
    if (!VALIDATION_REGEX.EMAIL.test(formState.signupEmail)) {
      setError(UI_MESSAGES.INVALID_EMAIL);
      return;
    }

    setEmailVerifying(true);
    clearErrors();

    try {
      const tempUserCredential = await createUserWithEmailAndPassword(auth, formState.signupEmail, 'TempPass123!@#');
      await sendEmailVerification(tempUserCredential.user);
      await signOut(auth); 
      
      setEmailVerificationSent(true);
      setSuccess(UI_MESSAGES.EMAIL_VERIFICATION_SENT);
      
    } catch (err: unknown) { 
      handleError(err, setError, UI_MESSAGES.SIGNUP_FAILED);
    } finally {
      setEmailVerifying(false);
    }
  };

  const sendPhoneOTP = async () => {
    const formattedPhone = formState.phoneNumber.replace(/\s/g, ''); 

    if (!VALIDATION_REGEX.PHONE.test(formattedPhone)) {
      setError(UI_MESSAGES.INVALID_PHONE);
      return;
    }

    setSendingOTP(true);
    clearErrors();

    try {
      if (!recaptchaVerifierRef.current) {
        initRecaptcha('recaptcha-container');
      }
      
      const appVerifier = recaptchaVerifierRef.current;

      if (!appVerifier) {
        setError(UI_MESSAGES.RECAPTCHA_FAILED);
        setSendingOTP(false);
        return;
      }
      
      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(result);
      
      updateFormField('showOTPInput', true);
      setSuccess(UI_MESSAGES.OTP_SENT_SUCCESS);
    } catch (err: unknown) { 
      handleError(err, setError, UI_MESSAGES.OTP_SEND_FAILED);
    } finally {
      setSendingOTP(false);
    }
  };

 
  const verifyPhoneOTP = async () => {
    if (formState.otpCode.length !== VALIDATION_RULES.OTP_LENGTH) {
      setError(UI_MESSAGES.INVALID_OTP);
      return;
    }

    if (!confirmationResult) {
      setError(UI_MESSAGES.OTP_NOT_INITIALIZED);
      return;
    }

    setVerifyingOTP(true);
    clearErrors();

    try {
      await confirmationResult.confirm(formState.otpCode);
      updateFormField('phoneVerified', true);
      updateFormField('showOTPInput', false);
      setSuccess(UI_MESSAGES.PHONE_VERIFIED_SUCCESS);
      
      await signOut(auth); 
    } catch (err: unknown) { 
      handleError(err, setError, UI_MESSAGES.OTP_VERIFY_FAILED);
    } finally {
      setVerifyingOTP(false);
    }
  };

  const signup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearErrors();

    if (!formState.phoneVerified) {
      setError(UI_MESSAGES.PHONE_NOT_VERIFIED);
      return;
    }
    
    if (!VALIDATION_REGEX.EMAIL.test(formState.signupEmail)) {
      setError(UI_MESSAGES.INVALID_EMAIL);
      return;
    }
    
    if (formState.fullName.trim().length < VALIDATION_RULES.NAME_MIN_LENGTH) {
      setError(UI_MESSAGES.NAME_TOO_SHORT);
      return;
    }
    
    if (formState.signupPassword !== formState.confirmPassword) {
      setError(UI_MESSAGES.PASSWORDS_MISMATCH);
      return;
    }
    
    if (formState.signupPassword.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
      setError(UI_MESSAGES.PASSWORD_TOO_SHORT);
      return;
    }
    
    setLoading(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formState.signupEmail, formState.signupPassword);
      const user = userCredential.user;
      
      await updateProfile(user, {
        displayName: formState.fullName.trim(),
      });
      
      await sendEmailVerification(user);
      await signOut(auth); 
      
      setSuccess(UI_MESSAGES.SIGNUP_SUCCESS);

      clearAllForms(); 
      setTimeout(() => {
        setSuccess(null);
        setShowSignupForm(false);
      }, TIMEOUTS.SUCCESS_MESSAGE);
      
    } catch (err: unknown) { 
      handleError(err, setError, UI_MESSAGES.SIGNUP_FAILED);
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    setResendLoading(true);
    clearErrors();
    
    try {
      const tempCredential = await signInWithEmailAndPassword(auth, formState.unverifiedEmail, formState.tempPassword);
      await sendEmailVerification(tempCredential.user);
      await signOut(auth); 
      
      setSuccess(UI_MESSAGES.EMAIL_VERIFICATION_RESENT);
    } catch (err: unknown) { 
      handleError(err, setError, UI_MESSAGES.VERIFICATION_RESEND_FAILED);
    } finally {
      setResendLoading(false);
    }
  };

  const checkVerificationStatus = async () => {
    setLoading(true);
    clearErrors();
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formState.unverifiedEmail, formState.tempPassword);
      await userCredential.user.reload(); 
      
      if (userCredential.user.emailVerified) {
        setSuccess(UI_MESSAGES.EMAIL_VERIFIED_SUCCESS);
        setShowEmailVerification(false);
        
        setTimeout(() => {
          closePopup();
          router.push('/');
        }, TIMEOUTS.SUCCESS_REDIRECT);
      } else {
        await signOut(auth); 
        setError(UI_MESSAGES.EMAIL_NOT_VERIFIED);
      }
    } catch (err: unknown) {
      handleError(err, setError, UI_MESSAGES.LOGIN_FAILED);
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
             <Image
              src="/assets/login/welcome-character.png" 
              alt="Welcome charachter"
              width={600} 
              height={400}
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
                          value={formState.email} 
                          onChange={(e) => updateFormField('email', e.target.value)} 
                          required 
                          className="w-full p-3 rounded-lg border border-gray-300 bg-white/90 text-gray-800 box-border focus:outline-none focus:ring-2 focus:ring-sky-400"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="password" className="block mb-2 font-medium">Password:</label>
                        <input 
                          type="password" 
                          id="password" 
                          value={formState.password} 
                          onChange={(e) => updateFormField('password', e.target.value)} 
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
                    Email: <strong>{formState.unverifiedEmail}</strong>
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
                      
                    
                      <div className="form-group">
                        <label htmlFor="fullName" className="block mb-2 font-medium">Full Name:</label>
                        <input 
                          type="text" 
                          id="fullName" 
                          value={formState.fullName} 
                          onChange={(e) => updateFormField('fullName', e.target.value)} 
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
                            value={formState.signupEmail} 
                            onChange={(e) => updateFormField('signupEmail', e.target.value)} 
                            disabled={formState.emailVerified}
                            required
                            className="flex-1 w-full sm:w-auto p-3 rounded-lg border border-gray-300 bg-white/90 text-gray-800 box-border focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:bg-gray-400/50 disabled:cursor-not-allowed"
                          />
                          <button 
                            type="button" 
                            className="p-3 px-4 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-bold cursor-pointer whitespace-nowrap transition-transform duration-200 hover:scale-[1.05] disabled:opacity-60 disabled:cursor-not-allowed"
                            onClick={sendEmailVerificationCode}
                            disabled={formState.emailVerified || emailVerifying}
                          >
                            {formState.emailVerified ? '✓ Verified' : emailVerifying ? 'Sending...' : 'Verify'}
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
                            value={formState.phoneNumber} 
                            onChange={(e) => updateFormField('phoneNumber', e.target.value)} 
                            placeholder={PLACEHOLDERS.PHONE}
                            disabled={formState.phoneVerified || formState.showOTPInput} 
                            required
                            className="flex-1 w-full sm:w-auto p-3 rounded-lg border border-gray-300 bg-white/90 text-gray-800 box-border focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:bg-gray-400/50 disabled:cursor-not-allowed"
                          />
                          <button 
                            type="button" 
                            className="p-3 px-4 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-bold cursor-pointer whitespace-nowrap transition-transform duration-200 hover:scale-[1.05] disabled:opacity-60 disabled:cursor-not-allowed"
                            onClick={sendPhoneOTP}
                            disabled={formState.phoneVerified || sendingOTP || formState.showOTPInput}
                          >
                            {formState.phoneVerified ? '✓ Verified' : sendingOTP ? 'Sending...' : 'Verify'}
                          </button>
                        </div>
                        <p className="text-red-400 text-xs italic mt-1">* This field is mandatory</p>
                        
                        {formState.showOTPInput && !formState.phoneVerified && (
                          <div className="flex gap-2 mt-3">
                            <input 
                              type="text" 
                              value={formState.otpCode} 
                              onChange={(e) => updateFormField('otpCode', e.target.value)} 
                              placeholder={PLACEHOLDERS.OTP}
                              maxLength={VALIDATION_RULES.OTP_LENGTH}
                              className="flex-1 p-3 rounded-lg border border-gray-300 bg-white/90 text-gray-800 text-lg tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-sky-400"
                            />
                            <button 
                              type="button" 
                              className="p-3 px-4 rounded-lg bg-emerald-500 text-white font-bold cursor-pointer whitespace-nowrap transition-transform duration-200 hover:scale
                              -[1.05] disabled:opacity-60 disabled:cursor-not-allowed"
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
                          value={formState.signupPassword} 
                          onChange={(e) => updateFormField('signupPassword', e.target.value)} 
                          required 
                          minLength={VALIDATION_RULES.PASSWORD_MIN_LENGTH}
                          className="w-full p-3 rounded-lg border border-gray-300 bg-white/90 text-gray-800 box-border focus:outline-none focus:ring-2 focus:ring-sky-400"
                        />
                      </div>
                      
                      
                      <div className="form-group">
                        <label htmlFor="confirmPassword" className="block mb-2 font-medium">Confirm Password:</label>
                        <input 
                          type="password" 
                          id="confirmPassword" 
                          value={formState.confirmPassword} 
                          onChange={(e) => updateFormField('confirmPassword', e.target.value)} 
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
                      disabled={loading || !formState.phoneVerified}
                    >
                      {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                    
                    {!formState.phoneVerified && (
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
