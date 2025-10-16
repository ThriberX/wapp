'use client';

import React, { useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { buttonStyles, buttonHandlers } from "@/lib/theme/buttonstyle";
import { GRADIENTS } from "@/lib/theme/colours";
import Galaxy from '@/components/Galaxy/Galaxy';

interface NavbarProps {
  onLoginClick: () => void;
}

export default function Navbar({ onLoginClick }: NavbarProps) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  const handleLoginClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonHandlers.onClick) {
      buttonHandlers.onClick(e);
    }
    
    if (onLoginClick) { 
      onLoginClick();
    }
    
    if (isNavOpen) {
      toggleNav();
    }
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
    <nav className="sticky top-0 z-50 text-white px-6 py-4 flex items-center justify-between">
      <div className="absolute inset-0 z-0">
        <Galaxy 
          transparent={true}
          hueShift={180}
          glowIntensity={0.3}
          saturation={0.2}
          mouseInteraction={false}
          mouseRepulsion={false}
          twinkleIntensity={0.3}
          rotationSpeed={0.03}
          speed={0.8}
        />
      </div>

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
            <a href="/#pageviewer" onClick={(e) => smoothScroll(e, 'pageviewer')} className="hover:text-blue-400 transition">Home</a>
          </li>
          <li>
            <a href="/#thriberMode" onClick={(e) => smoothScroll(e, 'thriberMode')} className="hover:text-blue-400 transition">Thriber Mode</a>
          </li>
          <li>
            <a href="/#about" onClick={(e) => smoothScroll(e, 'about')} className="hover:text-blue-400 transition">About Us</a>
          </li>
          <li>
            <a href="/services" className="hover:text-blue-400 transition">Services</a>
          </li>
          <li>
            <a href="/ThriveRx" className="hover:text-blue-400 transition">ThriveRx</a>
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
            <a href="/#pageviewer" onClick={(e) => smoothScroll(e, 'pageviewer')} className="hover:text-blue-400 transition">Home</a>
          </li>
          <li>
            <a href="/#thriberMode" onClick={(e) => smoothScroll(e, 'thriberMode')} className="hover:text-blue-400 transition">Thriber Mode</a>
          </li>
          <li>
            <a href="/#about" onClick={(e) => smoothScroll(e, 'about')} className="hover:text-blue-400 transition">About Us</a>
          </li>
          <li>
            <a href="/services" className="hover:text-blue-400 transition" onClick={toggleNav}>Services</a>
          </li>
          <li>
            <a href="/ThriveRx" className="hover:text-blue-400 transition" onClick={toggleNav}>ThriveRx</a>
          </li>
        </ul>
      )}
    </nav>
  );
}