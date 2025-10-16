"use client";

import Image from "next/image";
import Link from "next/link";
import { LINKS } from "@/lib/constants/links"; 
import { GRADIENT_CLASSES } from "@/lib/theme/colours";
import Galaxy from '@/components/Galaxy/Galaxy';

export default function ThriberMode() {
  return (
    <section id="thriberMode" className="relative text-white py-16 lg:py-20 min-h-screen">
     
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

      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
      
        <div className="text-center max-w-6xl mx-auto mb-12 lg:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[80px] font-bold mb-6 leading-tight">
            What is{" "}
            Thriber Mode?
          </h1>
          
          <p className="text-gray-300 text-lg sm:text-xl lg:text-3xl font-medium leading-relaxed max-w-5xl mx-auto">
            As the world moves from traditional forms of print media and television to digital platforms for reach, 
            your business needs the{" "}
            <span className={GRADIENT_CLASSES.TEXT_PRIMARY}>Thriber Mode</span> enabled.
          </p>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8 lg:gap-20 max-w-6xl mx-auto">
         
          <div className="group relative bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl p-8 lg:p-10 hover:from-gray-900/70 hover:to-gray-800/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 border border-gray-700/50 min-h-[400px] flex flex-col backdrop-blur-sm">
            <div className="flex flex-col items-center text-center flex-1">
              
              <div className="relative w-full max-w-[180px] h-[140px] lg:h-[160px] mb-6 lg:mb-8 overflow-hidden rounded-xl">
                <Image 
                  src="/assets/thriberModeImages/branding.png" 
                  alt="Digital Branding"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 180px, (max-width: 1200px) 160px, 180px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <Link 
                  href={LINKS.LINKEDIN_ARTICLE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mb-4"
                >
                  <h3 className="text-2xl lg:text-3xl xl:text-[32px] font-bold group-hover:text-sky-400 transition-colors duration-300">
                    Digital Branding
                  </h3>
                </Link>
                <p className="text-gray-400 text-lg lg:text-xl leading-relaxed">
                  Your business needs a handsome website, a beautiful logo, a succinct brochure? 
                  You name it. We got you covered.
                </p>
              </div>
            </div>
          </div>

        
          <div className="group relative bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl p-8 lg:p-10 hover:from-gray-900/70 hover:to-gray-800/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 border border-gray-700/50 min-h-[400px] flex flex-col backdrop-blur-sm">
            <div className="flex flex-col items-center text-center flex-1">
              
              <div className="relative w-full max-w-[180px] h-[140px] lg:h-[160px] mb-6 lg:mb-8 overflow-hidden rounded-xl">
                <Image
                  src="/assets/thriberModeImages/networking.png"
                  alt="Customer Reach"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 180px, (max-width: 1200px) 160px, 180px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <Link
                  href={LINKS.LINKEDIN_ARTICLE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mb-4"
                >
                  <h3 className="text-2xl lg:text-3xl xl:text-[32px] font-bold group-hover:text-sky-400 transition-colors duration-300">
                    Customer Reach
                  </h3>
                </Link>
                <p className="text-gray-400 text-lg lg:text-xl leading-relaxed">
                  We will look after your social media reach and get you the audience your business deserves.
                </p>
              </div>
            </div>
          </div>

        
          <div className="group relative bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl p-8 lg:p-10 hover:from-gray-900/70 hover:to-gray-800/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/10 border border-gray-700/50 min-h-[400px] flex flex-col backdrop-blur-sm">
            <div className="flex flex-col items-center text-center flex-1">
           
              <div className="relative w-full max-w-[180px] h-[140px] lg:h-[160px] mb-6 lg:mb-8 overflow-hidden rounded-xl">
                <Image
                  src="/assets/thriberModeImages/engage.png"
                  alt="Engagement"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 180px, (max-width: 1200px) 160px, 180px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <Link
                  href={LINKS.LINKEDIN_ARTICLE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mb-4"
                >
                  <h3 className="text-2xl lg:text-3xl xl:text-[32px] font-bold group-hover:text-sky-400 transition-colors duration-300">
                    Engagement
                  </h3>
                </Link>
                <p className="text-gray-400 text-lg lg:text-xl leading-relaxed">
                  Create engaging content around your business. Educate your customers on what your business can do for them.
                </p>
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl p-8 lg:p-10 hover:from-gray-900/70 hover:to-gray-800/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/10 border border-gray-700/50 min-h-[400px] flex flex-col backdrop-blur-sm">
            <div className="flex flex-col items-center text-center flex-1">
       
              <div className="relative w-full max-w-[180px] h-[140px] lg:h-[160px] mb-6 lg:mb-8 overflow-hidden rounded-xl">
                <Image
                  src="/assets/thriberModeImages/chart.png"
                  alt="Analysis"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 180px, (max-width: 1200px) 160px, 180px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <Link
                  href={LINKS.LINKEDIN_ARTICLE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mb-4"
                >
                  <h3 className="text-2xl lg:text-3xl xl:text-[32px] font-bold group-hover:text-sky-400 transition-colors duration-300">
                    Analysis
                  </h3>
                </Link>
                <p className="text-gray-400 text-lg lg:text-xl leading-relaxed">
                  Analyse your business performance through centralised data aggregation and metrics. 
                  Get intelligent insights to make better decisions for your business.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}