'use client';

import Image from "next/image";
import Galaxy from "../../../components/Galaxy/Galaxy"; // Ye sahi path hai

export default function QuestionPage() {
  return (
    <>
      {/* Galaxy background */}
      <Galaxy 
        className="fixed top-0 left-0 w-full h-full -z-10"
        hueShift={200}
        density={1.2}
        glowIntensity={0.4}
        starSpeed={0.3}
        transparent={true}
        mouseInteraction={true}
      />
      
      {/* Tumhara existing content */}
      <div className="min-h-screen w-full flex items-center justify-center relative">
        <div className="absolute top-5 left-5 z-10">
          <Image src="/logo.png" alt="Logo" width={80} height={80} />
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-xl shadow-xl px-8 py-12 w-[90%] max-w-md text-center space-y-8 flex flex-col items-center justify-center min-h-[400px]">
          
          <h1 className="text-2xl font-semibold text-white leading-snug">
            Are you a business owner?
          </h1>

          <div className="flex flex-col gap-6 w-full px-4">
            <button className="relative group w-full active:scale-95 transform transition-all duration-150">
              <div className="absolute -inset-1 bg-[#00b7ff] rounded-full blur opacity-60 group-hover:opacity-80 group-active:opacity-100 transition duration-200"></div>
              <div className="relative w-full py-4 bg-black rounded-full border-2 border-cyan-400 font-bold text-lg tracking-wider hover:bg-cyan-900/20 active:bg-cyan-800/40 active:border-cyan-300 transition duration-200">
                <span className="text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] group-active:text-cyan-200 group-active:drop-shadow-[0_0_15px_rgba(34,211,238,1)]">
                  YES !
                </span>
              </div>
            </button>

            <button className="relative group w-full active:scale-95 transform transition-all duration-150">
              <div className="absolute -inset-1 bg-red-500 rounded-full blur opacity-60 group-hover:opacity-80 group-active:opacity-100 transition duration-200"></div>
              <div className="relative w-full py-4 bg-black rounded-full border-2 border-red-400 font-bold text-lg tracking-wider hover:bg-red-900/20 active:bg-red-800/40 active:border-red-300 transition duration-200">
                <span className="text-red-300 drop-shadow-[0_0_10px_rgba(248,113,113,0.8)] group-active:text-red-200 group-active:drop-shadow-[0_0_15px_rgba(248,113,113,1)]">
                  NO !
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}