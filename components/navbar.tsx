'use client';

import React, { useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { buttonStyles, buttonHandlers } from "@/lib/theme/buttonstyle";
import { GRADIENTS } from "@/lib/theme/colours";
import Login from '@/components/Login';

interface NavbarProps {
  onLoginClick?: () => void;
}

export default function Navbar({ onLoginClick }: NavbarProps) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  const handleLoginClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonHandlers.onClick) {
      buttonHandlers.onClick(e);
    }
    
    if (onLoginClick) { 
      onLoginClick();
    } else {
      setShowAuthPopup(true);
      console.log("Login button clicked, showing Auth Popup.");
    }
    
    if (isNavOpen) {
      toggleNav();
    }
  };

  const handleClosePopup = () => {
    setShowAuthPopup(false);
  };

  const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (isNavOpen) {
      toggleNav();
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 text-white px-6 py-4 flex items-center justify-between">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-0" />

        <div className="relative z-10 w-full flex items-center justify-between">
          <Link href="/">
            <Image
              src="/assets/general/ThriberTransparent.ico"
              alt="Thriber Logo"
              width={80}
              height={50}
              className="object-contain"
            />
          </Link>

          <ul className="hidden md:flex gap-6 items-center text-lg">
            <li>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/#pageviewer" onClick={(e) => smoothScroll(e, 'pageviewer')} className="hover:text-blue-400 transition">Home</a>
            </li>
            <li>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/#thriberMode" onClick={(e) => smoothScroll(e, 'thriberMode')} className="hover:text-blue-400 transition">Thriber Mode</a>
            </li>
            <li>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/#about" onClick={(e) => smoothScroll(e, 'about')} className="hover:text-blue-400 transition">About Us</a>
            </li>
            <li>
              <Link href="/services" className="hover:text-blue-400 transition">Services</Link>
            </li>
            <li>
              <Link href="/ThriveRx" className="hover:text-blue-400 transition">ThriveRx</Link>
            </li>
          </ul>
          
          <div className="pt-5 lg:pt-5 right-2">
            <button 
              className={`${buttonStyles.base} text-xl py-3 lg:py-3 px-5 lg:px-5 font-black`}
              style={{ background: GRADIENTS.PRIMARY }}
              onMouseEnter={buttonHandlers.onMouseEnter}
              onMouseLeave={buttonHandlers.onMouseLeave}
              onClick={handleLoginClick}
            >
              <span className={buttonStyles.ripple} />
              <span className="relative z-10">Login</span>
            </button>
          </div>

          <button 
            className="md:hidden flex flex-col gap-1 z-20"
            onClick={toggleNav}
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-white transition-transform ${isNavOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`w-6 h-0.5 bg-white transition-opacity ${isNavOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-0.5 bg-white transition-transform ${isNavOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>

        {isNavOpen && (
          <ul className="absolute top-20 right-4 bg-black/90 backdrop-blur-md text-white rounded-xl flex flex-col gap-4 p-6 w-60 md:hidden z-50 border border-gray-700">
            <li>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/#pageviewer" onClick={(e) => smoothScroll(e, 'pageviewer')} className="hover:text-blue-400 transition">Home</a>
            </li>
            <li>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/#thriberMode" onClick={(e) => smoothScroll(e, 'thriberMode')} className="hover:text-blue-400 transition">Thriber Mode</a>
            </li>
            <li>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/#about" onClick={(e) => smoothScroll(e, 'about')} className="hover:text-blue-400 transition">About Us</a>
            </li>
            <li>
              <Link href="/services" className="hover:text-blue-400 transition" onClick={toggleNav}>Services</Link>
            </li>
            <li>
              <Link href="/ThriveRx" className="hover:text-blue-400 transition" onClick={toggleNav}>ThriveRx</Link>
            </li>
          </ul>
        )}
      </nav>

      {showAuthPopup && (
        <Login onClose={handleClosePopup} />
      )}
    </>
  );
}