'use client'; 

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation'; 
import Image from "next/image";
import { 
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  getAuth,
} from 'firebase/auth';
import { auth } from '@/src/firebase'; 
import {
  VALIDATION_REGEX,
  VALIDATION_RULES,
  TIMEOUTS,
  UI_MESSAGES,
  PLACEHOLDERS,
} from '@/lib/constants/authConstants';

const isFirebaseError = (err: any): err is { code: string } => {
  return err && typeof err === 'object' && 'code' in err && typeof (err as { code: string }).code === 'string';
};

const handleError = (err: unknown, setError: (msg: string) => void, defaultMessage: string) => {
  if (isFirebaseError(err)) {
    setError(defaultMessage);
  } else {
    setError(UI_MESSAGES.UNEXPECTED_ERROR);
  }
};

interface LoginProps {
  onClose: () => void; 
  initialShow?: boolean;
}

interface FormState {
  phoneNumber: string;
  otpCode: string;
  showOTPInput: boolean;
}

const INITIAL_FORM_STATE: FormState = {
  phoneNumber: '',
  otpCode: '',
  showOTPInput: false,
};

const Login: React.FC<LoginProps> = ({ onClose }) => {
  const router = useRouter();
  const pathname = usePathname(); // Current page path
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [verifyingOTP, setVerifyingOTP] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);

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
    clearErrors();
  }, [clearErrors]);

  const closePopup = useCallback(() => {
    clearAllForms();
    onClose(); 
  }, [clearAllForms, onClose]);

  const toggleToSignup = useCallback(() => {
    setShowSignupForm(true);
    setFormState(prev => ({ ...prev, phoneNumber: '', otpCode: '', showOTPInput: false }));
    clearErrors();
  }, [clearErrors]);

  const toggleToLogin = useCallback(() => {
    setShowSignupForm(false);
    setFormState(prev => ({ ...prev, phoneNumber: '', otpCode: '', showOTPInput: false }));
    clearErrors();
  }, [clearErrors]);

  const saveRegisteredPhone = (phone: string) => {
    try {
      if (typeof window !== 'undefined') {
        const registeredPhones = localStorage.getItem('registeredPhones');
        let phonesArray: string[] = [];
        
        if (registeredPhones) {
          phonesArray = JSON.parse(registeredPhones);
        }
        
        if (!phonesArray.includes(phone)) {
          phonesArray.push(phone);
          localStorage.setItem('registeredPhones', JSON.stringify(phonesArray));
        }
      }
    } catch (error) {
      
    }
  };

  const initRecaptcha = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    if (recaptchaVerifierRef.current) return recaptchaVerifierRef.current; 
    
    try {
      const container = document.getElementById('recaptcha-container');
      if (!container) {
        return null;
      }

      const verifier = new RecaptchaVerifier(getAuth(), 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {},
        'expired-callback': () => {}
      });
      
      recaptchaVerifierRef.current = verifier;
      
      return verifier;

    } catch (e) {
      return null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (e) {
        
        }
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);

  const sendLoginOTP = async () => {
    const formattedPhone = formState.phoneNumber.replace(/\s/g, ''); 

    if (!VALIDATION_REGEX.PHONE.test(formattedPhone)) {
      setError(UI_MESSAGES.INVALID_PHONE);
      return;
    }

    setSendingOTP(true);
    clearErrors();

    try {
      let appVerifier = recaptchaVerifierRef.current;
      
      if (!appVerifier) {
        appVerifier = initRecaptcha();
        if (!appVerifier) {
          setError(UI_MESSAGES.RECAPTCHA_FAILED);
          setSendingOTP(false);
          return;
        }
      }
      
      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(result);
      
      updateFormField('showOTPInput', true);
      setSuccess(UI_MESSAGES.OTP_SENT_SUCCESS);
    } catch (err: unknown) {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (e) {
          
        }
        recaptchaVerifierRef.current = null;
      }
      
      handleError(err, setError, UI_MESSAGES.OTP_SEND_FAILED);
    } finally {
      setSendingOTP(false);
    }
  };

  const verifyLoginOTP = async () => {
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
      
      setSuccess(UI_MESSAGES.LOGIN_SUCCESS);
      
      setTimeout(() => {
        closePopup();
        
        router.refresh();
      }, TIMEOUTS.SUCCESS_REDIRECT);
      
    } catch (err: unknown) { 
      handleError(err, setError, UI_MESSAGES.OTP_VERIFY_FAILED);
    } finally {
      setVerifyingOTP(false);
    }
  };

  const sendSignupOTP = async () => {
    const formattedPhone = formState.phoneNumber.replace(/\s/g, ''); 

    if (!VALIDATION_REGEX.PHONE.test(formattedPhone)) {
      setError(UI_MESSAGES.INVALID_PHONE);
      return;
    }

    setSendingOTP(true);
    clearErrors();

    try {
      let appVerifier = recaptchaVerifierRef.current;
      
      if (!appVerifier) {
        appVerifier = initRecaptcha();
        if (!appVerifier) {
          setError(UI_MESSAGES.RECAPTCHA_FAILED);
          setSendingOTP(false);
          return;
        }
      }
      
      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(result);
      
      updateFormField('showOTPInput', true);
      setSuccess(UI_MESSAGES.OTP_SENT_SUCCESS);
    } catch (err: unknown) {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (e) {
          
        }
        recaptchaVerifierRef.current = null;
      }
      
      handleError(err, setError, UI_MESSAGES.OTP_SEND_FAILED);
    } finally {
      setSendingOTP(false);
    }
  };

  const verifySignupOTP = async () => {
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
  
      const formattedPhone = formState.phoneNumber.replace(/\s/g, '');
      saveRegisteredPhone(formattedPhone);
      
      setSuccess(UI_MESSAGES.SIGNUP_SUCCESS);
      
      setTimeout(() => {
        closePopup();

        router.refresh();
      }, TIMEOUTS.SUCCESS_REDIRECT);
      
    } catch (err: unknown) { 
      handleError(err, setError, UI_MESSAGES.OTP_VERIFY_FAILED);
    } finally {
      setVerifyingOTP(false);
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
              alt="Welcome Character"
              width={400} 
              height={400} 
              className="max-w-[40%] md:max-w-[90%] h-auto rounded-[10px] object-contain"
            />
          </div>

          <div className="md:w-1/2 bg-black/80 backdrop-blur-md flex justify-center items-center p-5 max-h-[70vh] md:max-h-[90vh] overflow-y-auto">
            <div className="bg-white/10 border border-white/30 rounded-2xl p-6 md:p-8 w-full max-w-sm shadow-xl text-white text-center">
            
              {!showSignupForm && (
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-white">Login</h2>
                 
                  <div id="recaptcha-container" className="mb-4"></div>
                  
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!formState.showOTPInput) {
                      sendLoginOTP();
                    } else {
                      verifyLoginOTP();
                    }
                  }}>
                    <div className="space-y-4 text-left">
                      <div className="form-group">
                        <label htmlFor="loginPhone" className="block mb-2 font-medium">Mobile Number:</label>
                        <input 
                          type="tel" 
                          id="loginPhone" 
                          value={formState.phoneNumber} 
                          onChange={(e) => updateFormField('phoneNumber', e.target.value)} 
                          placeholder={PLACEHOLDERS.PHONE}
                          disabled={formState.showOTPInput} 
                          required
                          className="w-full p-3 rounded-lg border border-gray-300 bg-white/90 text-gray-800 box-border focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:bg-gray-400/50 disabled:cursor-not-allowed"
                        />
                      </div>

                      {!formState.showOTPInput && (
                        <button 
                          type="submit"
                          className="w-full p-3 rounded-lg text-lg font-bold cursor-pointer transition-transform duration-200 ease-in-out text-white 
                                     bg-[linear-gradient(90deg,_#12DBE5_0%,_#1F5799_48.96%,_#F20000_100%)] 
                                     hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                          disabled={sendingOTP}
                        >
                          {sendingOTP ? 'Sending OTP...' : 'Enter →'}
                        </button>
                      )}

                      {formState.showOTPInput && (
                        <div className="space-y-3">
                          <div className="form-group">
                            <label htmlFor="loginOTP" className="block mb-2 font-medium">Enter OTP:</label>
                            <input 
                              type="text" 
                              id="loginOTP"
                              value={formState.otpCode} 
                              onChange={(e) => updateFormField('otpCode', e.target.value)} 
                              placeholder={PLACEHOLDERS.OTP}
                              maxLength={VALIDATION_RULES.OTP_LENGTH}
                              required
                              className="w-full p-3 rounded-lg border border-gray-300 bg-white/90 text-gray-800 text-lg tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-sky-400"
                            />
                          </div>
                          <button 
                            type="submit"
                            className="w-full p-3 rounded-lg text-lg font-bold cursor-pointer transition-transform duration-200 ease-in-out text-white 
                                       bg-[linear-gradient(90deg,_#12DBE5_0%,_#1F5799_48.96%,_#F20000_100%)] 
                                       hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                            disabled={verifyingOTP}
                          >
                            {verifyingOTP ? 'Verifying...' : 'Verify & Login'}
                          </button>
                        </div>
                      )}
                    </div>
                  </form>
                  
                  {error && <p className="text-red-400 mt-4 font-medium text-sm">{error}</p>}
                  {success && <p className="text-green-400 mt-4 font-medium text-sm">{success}</p>}
                  
                  <p className="mt-5 text-gray-300 text-base md:text-lg">
                    Don&apos;t have an account? 
                    <a href="#" onClick={toggleToSignup} className="text-cyan-400 hover:text-sky-400 font-extrabold transition-colors ml-1">Sign Up</a>
                  </p>
                </div>
              )}

              {showSignupForm && (
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-white">Sign Up</h2>
                  
                  <div id="recaptcha-container" className="mb-4"></div>
                  
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!formState.showOTPInput) {
                      sendSignupOTP();
                    } else {
                      verifySignupOTP();
                    }
                  }}>
                    <div className="space-y-4 text-left">
                      <div className="form-group">
                        <label htmlFor="signupPhone" className="block mb-2 font-medium">Mobile Number:</label>
                        <input 
                          type="tel" 
                          id="signupPhone" 
                          value={formState.phoneNumber} 
                          onChange={(e) => updateFormField('phoneNumber', e.target.value)} 
                          placeholder={PLACEHOLDERS.PHONE}
                          disabled={formState.showOTPInput}
                          required
                          className="w-full p-3 rounded-lg border border-gray-300 bg-white/90 text-gray-800 box-border focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:bg-gray-400/50 disabled:cursor-not-allowed"
                        />
                      </div>

                      {!formState.showOTPInput && (
                        <button 
                          type="submit"
                          className="w-full p-3 rounded-lg text-lg font-bold cursor-pointer transition-transform duration-200 ease-in-out text-white 
                                     bg-[linear-gradient(90deg,_#12DBE5_0%,_#1F5799_48.96%,_#F20000_100%)] 
                                     hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                          disabled={sendingOTP}
                        >
                          {sendingOTP ? 'Sending OTP...' : 'Enter →'}
                        </button>
                      )}

                      {formState.showOTPInput && (
                        <div className="space-y-3">
                          <div className="form-group">
                            <label htmlFor="signupOTP" className="block mb-2 font-medium">Enter OTP:</label>
                            <input 
                              type="text" 
                              id="signupOTP"
                              value={formState.otpCode} 
                              onChange={(e) => updateFormField('otpCode', e.target.value)} 
                              placeholder={PLACEHOLDERS.OTP}
                              maxLength={VALIDATION_RULES.OTP_LENGTH}
                              required
                              className="w-full p-3 rounded-lg border border-gray-300 bg-white/90 text-gray-800 text-lg tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-sky-400"
                            />
                          </div>
                          <button 
                            type="submit"
                            className="w-full p-3 rounded-lg text-lg font-bold cursor-pointer transition-transform duration-200 ease-in-out text-white 
                                       bg-[linear-gradient(90deg,_#12DBE5_0%,_#1F5799_48.96%,_#F20000_100%)] 
                                       hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                            disabled={verifyingOTP}
                          >
                            {verifyingOTP ? 'Verifying...' : 'Verify & Sign Up'}
                          </button>
                        </div>
                      )}
                    </div>
                  </form>
                  
                  {error && <p className="text-red-400 mt-4 font-medium text-sm">{error}</p>}
                  {success && <p className="text-green-400 mt-4 font-medium text-sm">{success}</p>}
                  
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