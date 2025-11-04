'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen py-30 sm:py-7 flex items-center justify-center overflow-hidden">

      <div className="relative z-10 w-11/12 max-w-6xl bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-gray-300 flex flex-col md:flex-row overflow-hidden">
        
        <div className="md:w-1/2 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-8 md:p-12">
          <div className="text-center md:text-left space-y-6 max-w-md">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
              Enable <span className="bg-gradient-to-r from-[#12DBE5] via-[#1F5799] to-[#F20000] bg-clip-text text-transparent">Thriber mode</span> for your business to thrive!
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed font-medium">
              Reach out to us for an engaging discussion on how we can help your business grow without bounds and realise its true potential.
            </p>
          </div>
        </div>

        <div className="md:w-1/2 bg-[#dadada] flex flex-col items-center justify-center p-6 md:p-8">
          <div className="relative w-full h-[250px] md:h-[400px] mb-6">
            <Image
              src="/assets/general/welcome-character.png"
              alt="Welcome Character"
              fill
              className="object-contain"
              priority
            />
          </div>
          
          <div className="bg-black/10 backdrop-blur-md border border-black/20 rounded-2xl p-6 shadow-lg w-full max-w-md text-center space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 drop-shadow-sm">Welcome!</h1>
            <p className="text-gray-700 text-base drop-shadow-sm">
              We&apos;d like to ask you a few questions to get started.
            </p>

            <Link href="/question">
              <button className="mt-2 px-8 py-3 rounded-lg bg-gray-900 text-white font-semibold shadow-md hover:scale-105 active:scale-95 transition-transform duration-200 hover:bg-gray-800">
                Let&apos;s Go
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}