"use client";

import Image from "next/image";
import { GRADIENTS } from "@/lib/theme/colours";
import { buttonStyles, buttonHandlers } from "@/lib/theme/buttonstyle";
import Galaxy from "@/components/Galaxy/Galaxy";

export default function AboutSection() {
  return (
    <section id="about" className="relative text-white py-16 lg:py-24 px-6 sm:px-8 lg:px-12 overflow-hidden">
      <div className="absolute inset-0 z-0">
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
        />
      </div>

      <div className="relative z-10 max-w-8xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-10">
        <div className="lg:w-1/2 w-full">
          <div className="flex justify-center relative group">
            <Image
              src="/assets/aboutUs/hero_about.png"
              alt="About Hero"
              width={600}
              height={600}
              className="rounded-3xl w-full max-w-[600px]"
              priority
            />
          </div>
        </div>

        <div className="lg:w-1/2 w-full flex flex-col justify-center gap-8 text-center lg:text-left">
          <div className="space-y-2">
            <h1 className="text-5xl sm:text-6xl lg:text-6xl font-black leading-tight">
              Thriber understands
              <br />
              your business.
            </h1>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black pt-4 lg:pt-6">
              It&apos;s needs
            </h2>
          </div>

          <p className="text-gray-300 text-xl sm:text-2xl lg:text-3xl leading-relaxed font-medium max-w-2xl mx-auto lg:mx-0">
            We chart the course for a smooth sailing of your business and your customers 
            in the stormy digital seas of today&apos;s time.
          </p>

          <div className="pt-8 lg:pt-10">
            <button
              className={`${buttonStyles.base} text-xl lg:text-2xl py-5 lg:py-6 px-10 lg:px-12 font-black`}
              style={{ background: GRADIENTS.PRIMARY }}
              onMouseEnter={buttonHandlers.onMouseEnter}
              onMouseLeave={buttonHandlers.onMouseLeave}
              onClick={buttonHandlers.onClick}
            >
              <span className={buttonStyles.ripple} />
              <span className="relative z-10">About us</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}