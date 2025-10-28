"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { buttonStyles , buttonHandlers} from "@/lib/theme/buttonstyle";
import { GRADIENTS } from "@/lib/theme/colours";

export default function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  return (
    <nav className="sticky top-0 z-50 bg-black text-white px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <Link href="/">
        <Image
          src="/assets/general/ThriberTransparent.png"
          alt="Thriber Logo"
          width={80}
          height={50}
          className="object-contain"
        />
      </Link>

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

      {/* Mobile Menu */}
      {isNavOpen && (
        <ul className="absolute top-20 right-4 bg-black text-white rounded-xl flex flex-col gap-4 p-6 w-60 md:hidden">
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
            <a href="/services" className="hover:text-blue-600 transition" onClick={toggleNav}>Services</a>
          </li>
          <li>
            <a href="/ThriveRx" className="hover:text-blue-600 transition" onClick={toggleNav}>ThriveRx</a>
          </li>
         
        </ul>
      )}
    </nav>
  );
}
