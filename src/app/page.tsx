"use client";

import { useState, useCallback } from "react";
import LandingPage from "@/components/AiChatbot";
import PageViewer from "@/components/pageviewer";
import ThriberMode from "@/components/thriberMode";
import Contactus from "@/components/aboutUs";
import AuthContainer from "@/components/auth/AuthContainer";

export default function HomePage() {
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  const handleLoginClick = useCallback(() => {
    setShowAuthPopup(true);
  }, []);

  const handleClosePopup = useCallback(() => {
    setShowAuthPopup(false);
  }, []);

  return (
    <>
      <main>
        <PageViewer />
        <ThriberMode />
        <Contactus />
        <LandingPage />
      </main>

      {showAuthPopup && (
        <AuthContainer 
          onClose={handleClosePopup}
          initialView="login"
        />
      )}
    </>
  );
}