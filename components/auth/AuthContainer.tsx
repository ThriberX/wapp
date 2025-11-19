"use client";

import { useState } from "react";
import AuthForm from "./AuthForm";

interface AuthContainerProps {
  onClose: () => void;
  initialView?: "login" | "signup";
}

const AuthContainer: React.FC<AuthContainerProps> = ({ onClose, initialView = "login" }) => {
  const [currentView, setCurrentView] = useState<"login" | "signup">(initialView);

  const switchMode = () => {
    setCurrentView(currentView === "login" ? "signup" : "login");
  };

  return (
    <AuthForm 
      mode={currentView}
      onClose={onClose}
      onSwitchMode={switchMode}
    />
  );
};

export default AuthContainer;