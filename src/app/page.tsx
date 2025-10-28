'use client'; 

import { useState, useCallback } from 'react';

import LandingPage from "@/components/AiChatbot"
import PageViewer from "@/components/pageviewer"
import ThriberMode from "@/components/thriberMode"
import Contactus from "@/components/aboutUs"

import Navbar from '@/components/navbar'; 
import Login from '@/components/Login';   
import Galaxy from '@/components/Galaxy/Galaxy';

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
        <Navbar onLoginClick={handleLoginClick} />

        <Galaxy
        transparent={true}
        hueShift={180}
        glowIntensity={0.5}
        saturation={0.3}
        mouseInteraction={true}
        mouseRepulsion={true}
        twinkleIntensity={0.4}
        rotationSpeed={0.05}
        speed={1.0}
        className="fixed inset-0 z-10 w-full h-full"
      />

        <main className="bg-black  z-0">
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
