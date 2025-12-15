  'use client'; 
  import { useState, useCallback, useEffect, useRef } from 'react';
  import { PLACEHOLDERS,VALIDATION_RULES, } from '@/lib/constants/authConstants';
  import sendotp, {setuprecapcha} from '@/lib/authentication /signIn';
  import  otpverifcation from '@/lib/authentication /signIn';

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

  interface LoginProps {
    onClose: () => void; 
    initialShow?: boolean;
  }




  import Image from "next/image";


  export default function Login({onClose}:LoginProps){

    const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);

    

    const [sendingOTP, setSendingOTP] = useState(false);

    const [verifyingOTP, setVerifyingOTP] = useState(false);
    const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [showOTPScreen, setShowOTPScreen] = useState(false);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const otpInputRef = useRef<HTMLInputElement>(null);
    


  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingOTP(true);
    setError(null);
    setSuccess(null);

    try {
      const formatted = "+91" + formState.phoneNumber;
     await setuprecapcha();//spel correction
      await sendotp(formatted);
      
      setShowOTPScreen(true);
      setSuccess("OTP sent successfully!");
      
    
      setTimeout(() => {
        otpInputRef.current?.focus();
      }, 100);
      
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setSendingOTP(false);
    }
  };


  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyingOTP(true);
    setError(null);
    setSuccess(null);

    try {
      await otpverifcation(formState.otpCode);
      setSuccess("OTP verified successfully!");
      
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP");
   
    } finally {
      setVerifyingOTP(false);
    }
  };

  const handleBackToPhone = () => {
    setShowOTPScreen(false);
    setError(null);
    setSuccess(null);
    
    
    setTimeout(() => {
      phoneInputRef.current?.focus();
    }, 100);
  };


  useEffect(() => {
    if (phoneInputRef.current && !showOTPScreen) {
      phoneInputRef.current.focus();
    }
  }, [showOTPScreen]);

  const handleClose = useCallback(() => {
    onClose();
  },[onClose]);
  
  return (
    <div className="fixed inset-0 bg-[rgba(31,31,31,0.8)] bg-opacity-80 z-[9999] flex justify-center items-center p-2 sm:p-4">
      <div className="relative w-full max-w-[900px] font-sans">
        <button 
          type="button" 
          className="absolute right-2 top-2 z-10 w-8 h-8 md:w-10 md:h-10 text-white bg-gray-700/80 hover:bg-black/90 rounded-full font-bold text-xl flex items-center justify-center border-2 border-white transition-colors" 
          onClick={handleClose}
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
            <div className="bg-white/10 border border-white/30 rounded-2xl p-6 md:p-8 w-full max-w-sm shadow-xl text-white text-center relative overflow-hidden">
              
        
              <div 
                className={`transition-all duration-500 ease-in-out ${
                  !showOTPScreen 
                    ? 'translate-x-0 opacity-100' 
                    : '-translate-x-full opacity-0 absolute inset-0 p-6 md:p-8'
                }`}
              >
                <h2 className="text-3xl font-bold mb-6 text-white">Login</h2>
                <div id="recaptcha-container" className="mb-4"></div>
                
                <form onSubmit={handlePhoneSubmit}>
                  <div className="space-y-4 text-left">
                    <div className="form-group">
                      <label htmlFor="loginPhone" className="block mb-2 font-medium">Mobile Number:</label>
                      <input 
                        ref={phoneInputRef}
                        type="tel" 
                        id="loginPhone" 
                        value={formState.phoneNumber} 
                        onChange={(e) => setFormState({...formState, phoneNumber: e.target.value})}
                        placeholder={PLACEHOLDERS.PHONE}
                        disabled={sendingOTP}
                        required
                        className="w-full p-3 rounded-lg border border-gray-300 bg-white/90 text-gray-800 box-border focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:bg-gray-400/50 disabled:cursor-not-allowed"
                        maxLength={10}
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full p-3 rounded-lg text-lg font-bold cursor-pointer transition-transform duration-200 ease-in-out text-white 
                              bg-[linear-gradient(90deg,_#12DBE5_0%,_#1F5799_48.96%,_#F20000_100%)] 
                              hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                      disabled={sendingOTP}
                    >
                      {sendingOTP ? 'Sending OTP...' : 'Enter →'}
                    </button>
                  </div>
                </form>
              </div>

        
              <div 
                className={`transition-all duration-500 ease-in-out ${
                  showOTPScreen 
                    ? 'translate-x-0 opacity-100' 
                    : 'translate-x-full opacity-0 absolute inset-0 p-6 md:p-8'
                }`}
              >
                <h2 className="text-3xl font-bold mb-6 text-white">Verify OTP</h2>
                
                <form onSubmit={handleOTPSubmit}>
                  <div className="space-y-4 text-left">
                    <div className="form-group">
                      <label htmlFor="loginOTP" className="block mb-2 font-medium">
                        Enter OTP sent to <span className="font-bold">+91{formState.phoneNumber}</span>:
                      </label>
                      <input 
                        ref={otpInputRef}
                        type="text" 
                        id="loginOTP"
                        value={formState.otpCode} 
                        onChange={(e) => setFormState({...formState, otpCode: e.target.value})}
                        placeholder={PLACEHOLDERS.OTP}
                        maxLength={VALIDATION_RULES.OTP_LENGTH}
                        required
                        className="w-full p-3 rounded-lg border border-gray-300 bg-white/90 text-gray-800 text-lg tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-sky-400"
                      />
                      
                      <button 
                        type="button"
                        onClick={handleBackToPhone}
                        className="text-sm text-blue-300 hover:text-blue-400 mt-2 flex items-center gap-1"
                      >
                        <span>←</span> Change number
                      </button>
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
                </form>
              </div>
              
          
              <div className="mt-4 min-h-[40px]">
                {error && <p className="text-red-400 font-medium text-sm">{error}</p>}
                {success && <p className="text-green-400 font-medium text-sm">{success}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );


  };
