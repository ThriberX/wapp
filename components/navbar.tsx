'use client';

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/navigation'; 
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/src/firebase';
import { buttonStyles, buttonHandlers } from "@/lib/theme/buttonstyle";
import { GRADIENTS } from "@/lib/theme/colours";
import AuthContainer from "@/components/auth/AuthContainer";

interface NavbarProps {
  onLoginClick?: () => void;
}

export default function Navbar({ onLoginClick }: NavbarProps) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  const handleLoginClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonHandlers.onClick) {
      buttonHandlers.onClick(e);
    }

    if (onLoginClick) { 
      onLoginClick();
    } else {
      setShowAuthPopup(true);
    }

    if (isNavOpen) {
      toggleNav();
    }
  };

  const handleClosePopup = () => {
    setShowAuthPopup(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowDropdown(false);
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const formatPhoneNumber = (phoneNumber: string | null) => {
    if (!phoneNumber) return '';

    if (phoneNumber.startsWith('+91')) {
      const number = phoneNumber.substring(3);
      return `+91 ${number.slice(0, 5)} ${number.slice(5)}`;
    }
    return phoneNumber;
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();

    if (window.location.pathname !== "/") {
      router.push(`/#${id}`);
      return;
    }

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
              <Link href="/#pageviewer" onClick={(e) => handleSmoothScroll(e, 'pageviewer')} className="hover:text-blue-400 transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/#thriberMode" onClick={(e) => handleSmoothScroll(e, 'thriberMode')} className="hover:text-blue-400 transition">
                Thriber Mode
              </Link>
            </li>
            <li>
              <Link href="/#about" onClick={(e) => handleSmoothScroll(e, 'about')} className="hover:text-blue-400 transition">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-blue-400 transition">Services</Link>
            </li>
            <li>
              <Link href="/ThriveRx" className="hover:text-blue-400 transition">ThriveRx</Link>
            </li>
          </ul>
          
          <div className="hidden md:block">
            {loading ? (
              <div className="w-12 h-12 rounded-full bg-gray-700 animate-pulse"></div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 lg:space-x-3 focus:outline-none hover:opacity-90 transition"
                >
                  <div 
                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center shadow-lg"
                    style={{ background: GRADIENTS.PRIMARY }}
                  >
                    <svg 
                      className="w-6 h-6 lg:w-7 lg:h-7 text-white" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  
                  <span className="text-sm lg:text-base text-white font-medium hidden lg:block">
                    {formatPhoneNumber(user.phoneNumber)}
                  </span>
                  
                  <span className="text-xs text-white font-medium lg:hidden">
                    {formatPhoneNumber(user.phoneNumber)}
                  </span>
                  
                  <svg 
                    className={`w-3 h-3 lg:w-4 lg:h-4 text-white transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-md rounded-lg shadow-xl py-2 z-50 border border-gray-700">
                    <button 
                      onClick={handleLogout}  
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                className={`${buttonStyles.base} text-base lg:text-xl py-2 lg:py-3 px-4 lg:px-5 font-black`}
                style={{ background: GRADIENTS.PRIMARY }}
                onMouseEnter={buttonHandlers.onMouseEnter}
                onMouseLeave={buttonHandlers.onMouseLeave}
                onClick={handleLoginClick}
              >
                <span className={buttonStyles.ripple} />
                <span className="relative z-10">Login</span>
              </button>
            )}
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
          <div className="absolute top-20 right-4 bg-black/90 backdrop-blur-md text-white rounded-xl flex flex-col gap-4 p-6 w-60 md:hidden z-50 border border-gray-700">
            {user ? (
              <div className="border-b border-gray-700 pb-4 mb-2">
                <div className="flex items-center space-x-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                    style={{ background: GRADIENTS.PRIMARY }}
                  >
                    <svg 
                      className="w-5 h-5 text-white" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Phone</p>
                    <p className="text-sm font-medium">
                      {formatPhoneNumber(user.phoneNumber)}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    handleLogout();
                    toggleNav();
                  }}
                  className="w-full text-left py-2 text-sm text-red-400 hover:text-red-300 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                className={`${buttonStyles.base} text-lg py-2 px-4 font-black mb-2`}
                style={{ background: GRADIENTS.PRIMARY }}
                onClick={handleLoginClick}
              >
                <span className="relative z-10">Login</span>
              </button>
            )}

            <ul className="flex flex-col gap-4">
              <li>
                <Link href="/#pageviewer" onClick={(e) => handleSmoothScroll(e, 'pageviewer')} className="hover:text-blue-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#thriberMode" onClick={(e) => handleSmoothScroll(e, 'thriberMode')} className="hover:text-blue-400 transition">
                  Thriber Mode
                </Link>
              </li>
              <li>
                <Link href="/#about" onClick={(e) => handleSmoothScroll(e, 'about')} className="hover:text-blue-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-blue-400 transition" onClick={toggleNav}>Services</Link>
              </li>
              <li>
                <Link href="/ThriveRx" className="hover:text-blue-400 transition" onClick={toggleNav}>ThriveRx</Link>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {showAuthPopup && (
        <AuthContainer 
          onClose={handleClosePopup} 
          initialView="login"
        />
      )}

      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        ></div>
      )}
    </>
  );
}