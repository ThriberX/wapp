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

      {/* Desktop Links  and routing needs to be done */}
      <ul className="hidden md:flex gap-6 items-center text-lg">
        <li>
          < Link href="/" className="hover:text-blue-600 transition">HOME</Link>
        </li>
        <li>
          <a href="" className="hover:text-blue-600 transition">Thriber Mode</a>
        </li>
        <li>
          <a href="" className="hover:text-blue-600 transition">About Us</a>
        </li>
        <li>
          <a href="/services" className="hover:text-blue-600 transition">Services</a>
        </li>
        <li>
          <a href="/ThriveRx" className="hover:text-blue-600 transition">ThriveRx</a>
        </li>
      
      </ul>
      <div className="pt-5 lg:pt-5 right-2">
            <a
              href="/*Needs to be discussed*/"
              className={`${buttonStyles.base} text-xl  py-3 lg:py-3 px-5 lg:px-5 font-black`}
              style={{ background: GRADIENTS.PRIMARY }}
              onMouseEnter={buttonHandlers.onMouseEnter}
              onMouseLeave={buttonHandlers.onMouseLeave}
              onClick={buttonHandlers.onClick}
            >
              <span className={buttonStyles.ripple} />
              <span className="relative z-10">Login</span>
            </a>
          </div>

      {isNavOpen && (
        <ul className="absolute top-20 right-4 bg-black/90 backdrop-blur-md text-white rounded-xl flex flex-col gap-4 p-6 w-60 md:hidden z-50 border border-gray-700">
          <li>
          < Link href="/" className="hover:text-blue-600 transition">HOME</Link>
          </li>
          <li>
            <a href="" className="hover:text-blue-600 transition" onClick={toggleNav}>Thriber Mode</a>
          </li>
          <li>
            <a href="" className="hover:text-blue-600 transition" onClick={toggleNav}>Contact Us</a>
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