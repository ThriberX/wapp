'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Galaxy from "./Galaxy/Galaxy";
export default function LandingPage() {
  return (
    <>
      <Galaxy 
        className="fixed top-0 left-0 w-full h-full -z-10"
        hueShift={200}
        density={1.2}
        glowIntensity={0.4}
        starSpeed={0.3}
        transparent={true}
        mouseInteraction={true}
      />
      
      <div className="h-screen flex items-center justify-center relative">

        <div className="absolute top-5 left-5 z-50">
          <Image
            src="/logo.png"
            alt="Logo"
            width={80}
            height={80}
            className="object-contain"
            priority
          />
        </div>

        <div className="w-11/12 max-w-4xl bg-white rounded-2xl shadow-xl border-2 border-gray-300 flex flex-col md:flex-row overflow-hidden">

          <div className="md:w-1/2 bg-[#dadada] flex items-center justify-center p-4">
            <div className="relative w-full h-[300px] md:h-[500px]">
              <Image
                src="/welcome-character.png"
                alt="Welcome Character"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="md:w-1/2 flex items-center justify-center bg-black p-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-8 shadow-lg w-full max-w-md text-center space-y-5 transition-all duration-300 hover:backdrop-blur-lg">
              <h1 className="text-3xl font-bold text-white drop-shadow-sm">Welcome!</h1>
              <p className="text-gray-200 text-base drop-shadow-sm">
                We'd like to ask you a few questions to get started.
              </p>

              <Link href="/question">
                <button className="mt-2 px-6 py-2 rounded-lg bg-[#dadada] text-black font-semibold shadow-md hover:scale-105 active:scale-95 transition-transform duration-200">
                  Let's Go
                </button>
              </Link>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}