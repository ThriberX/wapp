import { RecaptchaVerifier, signInWithPhoneNumber, getAuth } from "firebase/auth";
import { auth } from "@/src/firebase";
import { VALIDATION_REGEX, UI_MESSAGES } from "@/lib/constants/authConstants";

export const initRecaptcha = (recaptchaVerifierRef: any) => {
  if (typeof window === "undefined") return null;
  if (recaptchaVerifierRef.current) return recaptchaVerifierRef.current;

  try {
    const container = document.getElementById("recaptcha-container");
    if (!container) return null;

    const verifier = new RecaptchaVerifier(getAuth(), "recaptcha-container", {
      size: "invisible",
      callback: () => {},
      "expired-callback": () => {},
    });

    recaptchaVerifierRef.current = verifier;
    return verifier;
  } catch (e) {
    return null;
  }
};

export const handleSuccessRedirect = (onClose: () => void, router: any, timeout: number) => {
  setTimeout(() => {
    onClose();
    router.refresh();
  }, timeout);
};

export const sendOTP = async (
  phoneNumber: string,
  recaptchaVerifierRef: any,
  setSendingOTP: (val: boolean) => void,
  setError: (msg: string | null) => void,
  setSuccess: (msg: string | null) => void,
  setShowOTPInput: (val: boolean) => void,
  setConfirmationResult: (res: any) => void
) => {
  const formattedPhone = phoneNumber.replace(/\s/g, "");
  if (!VALIDATION_REGEX.PHONE.test(formattedPhone)) {
    setError(UI_MESSAGES.INVALID_PHONE);
    return false;
  }

  setSendingOTP(true);
  setError(null);
  setSuccess(null);

  try {
    let appVerifier = recaptchaVerifierRef.current;
    if (!appVerifier) {
      appVerifier = initRecaptcha(recaptchaVerifierRef);
      if (!appVerifier) {
        setError(UI_MESSAGES.RECAPTCHA_FAILED);
        setSendingOTP(false);
        return false;
      }
    }

    const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
    setConfirmationResult(result);
    setShowOTPInput(true);
    setSuccess(UI_MESSAGES.OTP_SENT_SUCCESS);
    return true;
  } catch (err) {
    if (recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current.clear();
      } catch (e) {}
      recaptchaVerifierRef.current = null;
    }
    setError(UI_MESSAGES.OTP_SEND_FAILED);
    return false;
  } finally {
    setSendingOTP(false);
  }
};

export const verifyOTP = async (
  otpCode: string,
  confirmationResult: any,
  setVerifyingOTP: (val: boolean) => void,
  setError: (msg: string | null) => void,
  setSuccess: (msg: string | null) => void,
  successMessage: string,
  onSuccess: () => void
) => {
  if (!confirmationResult) {
    setError(UI_MESSAGES.OTP_NOT_INITIALIZED);
    return false;
  }

  setVerifyingOTP(true);
  setError(null);
  setSuccess(null);

  try {
    await confirmationResult.confirm(otpCode);
    setSuccess(successMessage);
    onSuccess();
    return true;
  } catch (err) {
    setError(UI_MESSAGES.OTP_VERIFY_FAILED);
    return false;
  } finally {
    setVerifyingOTP(false);
  }
};

export const cleanupRecaptcha = (recaptchaVerifierRef: any) => {
  if (recaptchaVerifierRef.current) {
    try {
      recaptchaVerifierRef.current.clear();
    } catch (e) {}
    recaptchaVerifierRef.current = null;
  }
};