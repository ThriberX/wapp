'use client'; 

import { useState, useCallback } from 'react';

import LandingPage from "@/components/AiChatbot"
import PageViewer from "@/components/pageviewer"
import ThriberMode from "@/components/thriberMode"
import Contactus from "@/components/aboutUs"

import Login from '@/components/Login';   

export default function HomePage() {
   
    const [showAuthPopup, setShowAuthPopup] = useState(false);

    const handleLoginClick = useCallback(() => {
        setShowAuthPopup(true);
        console.log("Login button clicked, showing Auth Popup."); 
    }, []);

    const handleClosePopup = useCallback(() => {
        setShowAuthPopup(false);
    }, []);

    return (
      <>
        <main>
          <PageViewer/>
          <ThriberMode/>
          <Contactus/>
          <LandingPage/>
        </main>

        {showAuthPopup && (
          <Login 
            onClose={handleClosePopup} 
          />
        )}
      </>
    );
}