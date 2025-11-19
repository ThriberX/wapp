"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  TIMEOUTS,
  UI_MESSAGES,
  PLACEHOLDERS,
} from "@/lib/constants/authConstants";
import { sendOTP, verifyOTP, cleanupRecaptcha, handleSuccessRedirect } from "./authUtils";

interface AuthFormProps {
  mode: "login" | "signup";
  onClose: () => void;
  onSwitchMode: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, onClose, onSwitchMode }) => {
  const router = useRouter();
  const recaptchaVerifierRef = useRef<any>(null);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [verifyingOTP, setVerifyingOTP] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  const isLogin = mode === "login";
  const heading = isLogin ? "Login" : "Sign Up";
  const buttonText = isLogin ? "Verify & Login" : "Verify & Sign Up";
  const successMessage = isLogin ? UI_MESSAGES.LOGIN_SUCCESS : UI_MESSAGES.SIGNUP_SUCCESS;
  const switchText = isLogin ? "Don't have an account?" : "Already have an account?";
  const switchLinkText = isLogin ? "Sign Up" : "Log In";
  const inputIdPrefix = isLogin ? "login" : "signup";

  useEffect(() => {
    setPhoneNumber("");
    setOtpCode("");
    setShowOTPInput(false);
    setError(null);
    setSuccess(null);
    setConfirmationResult(null);
  }, [mode]);

  useEffect(() => {
    return () => {
      cleanupRecaptcha(recaptchaVerifierRef);
    };
  }, []);

  const handleSendOTP = async () => {
    await sendOTP(
      phoneNumber,
      recaptchaVerifierRef,
      setSendingOTP,
      setError,
      setSuccess,
      setShowOTPInput,
      setConfirmationResult
    );
  };

  const handleVerifyOTP = async () => {
    await verifyOTP(
      otpCode,
      confirmationResult,
      setVerifyingOTP,
      setError,
      setSuccess,
      successMessage,
      () => handleSuccessRedirect(onClose, router, TIMEOUTS.SUCCESS_REDIRECT)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showOTPInput) {
      await handleSendOTP();
    } else {
      await handleVerifyOTP();
    }
  };

  return (
    <div className="fixed inset-0 bg-[rgba(31,31,31,0.8)] z-[9999] flex justify-center items-center p-2 sm:p-4">
      <div className="relative w-full max-w-[900px] font-sans">
        <button
          type="button"
          className="absolute right-2 top-2 z-10 w-8 h-8 md:w-10 md:h-10 text-white bg-gray-700/80 hover:bg-black/90 rounded-full font-bold text-xl flex items-center justify-center border-2 border-white transition-colors"
          onClick={onClose}
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
              <h2 className="text-3xl font-bold mb-6 text-white">{heading}</h2>

              <div id="recaptcha-container" className="mb-4"></div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4 text-left">
                  <div className="form-group">
                    <label htmlFor={`${inputIdPrefix}Phone`} className="block mb-2 font-medium">
                      Mobile Number:
                    </label>
                    <input
                      type="tel"
                      id={`${inputIdPrefix}Phone`}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder={PLACEHOLDERS.PHONE}
                      disabled={showOTPInput}
                      required
                      className="w-full p-3 rounded-lg border border-gray-300 bg-white/90 text-gray-800 box-border focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:bg-gray-400/50 disabled:cursor-not-allowed"
                    />
                  </div>

                  {!showOTPInput && (
                    <button
                      type="submit"
                      className="w-full p-3 rounded-lg text-lg font-bold cursor-pointer transition-transform duration-200 ease-in-out text-white bg-[linear-gradient(90deg,_#12DBE5_0%,_#1F5799_48.96%,_#F20000_100%)] hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                      disabled={sendingOTP}
                    >
                      {sendingOTP ? "Sending OTP..." : "Enter →"}
                    </button>
                  )}

                  {showOTPInput && (
                    <div className="space-y-3">
                      <div className="form-group">
                        <label htmlFor={`${inputIdPrefix}OTP`} className="block mb-2 font-medium">
                          Enter OTP:
                        </label>
                        <input
                          type="text"
                          id={`${inputIdPrefix}OTP`}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder={PLACEHOLDERS.OTP}
                          maxLength={6}
                          required
                          className="w-full p-3 rounded-lg border border-gray-300 bg-white/90 text-gray-800 text-lg tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-sky-400"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full p-3 rounded-lg text-lg font-bold cursor-pointer transition-transform duration-200 ease-in-out text-white bg-[linear-gradient(90deg,_#12DBE5_0%,_#1F5799_48.96%,_#F20000_100%)] hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        disabled={verifyingOTP}
                      >
                        {verifyingOTP ? "Verifying..." : buttonText}
                      </button>
                    </div>
                  )}
                </div>
              </form>

              {error && <p className="text-red-400 mt-4 font-medium text-sm">{error}</p>}
              {success && <p className="text-green-400 mt-4 font-medium text-sm">{success}</p>}

              <p className="mt-5 text-gray-300 text-base md:text-lg">
                {switchText}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onSwitchMode();
                  }}
                  className="text-cyan-400 hover:text-sky-400 font-extrabold transition-colors ml-1"
                >
                  {switchLinkText}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;