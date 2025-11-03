"use client";
import { useState } from "react";
import { GRADIENTS } from "@/lib/theme/colours";
import { buttonStyles, buttonHandlers } from "@/lib/theme/buttonstyle";

export default function HealthServices() {
  const [showOptions, setShowOptions] = useState(false);

  const showContactOptions = () => setShowOptions(true);
  const closePopup = () => setShowOptions(false);

  const sendEmail = () => {
    const subject = "ThriveRx Get Started";
    const body = "Hi ThriberX I would like to know more about ThriveRx. Please contact me ASAP";
    const recipient = "achintye@thriber.com";
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const sendWhatsApp = () => {
    const message = "Hi ThriberX I would like to know more about ThriveRx. Please contact me ASAP";
    window.open("https://api.whatsapp.com/send?phone=918104531950&text=" + encodeURIComponent(message), "_blank");
  };

  const makeCall = () => {
    window.location.href = "tel:+918104531950";
  };

  return (
    <div className="relative text-white overflow-hidden">

    
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-5 gap-10 max-w-7xl mx-auto">
        {[
          {
            img: "/assets/services/Aicons8-roi-64.png",
            text: "ROI Driven Marketing to ensure High Returns on your Brand investments",
          },
          {
            img: "/assets/services/Aicons8-media-96.png",
            text: "Social Media Presence Management",
          },
          {
            img: "/assets/services/Aicons8-healthcare-64.png",
            text: "Healthcare performance Marketing",
          },
          {
            img: "/assets/services/Aicons8-hospital-sign-100.png",
            text: "Healthcare Personalised Branding",
          },
          {
            img: "/assets/services/Aicons8-window.png",
            text: "Reviews & Reputation Management",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 p-8 rounded-3xl flex flex-col items-center text-center hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 border border-gray-700/50"
          >
            <Image src={item.img} width={600} height={400} className="p-2 w-24 h-24 object-contain mb-6" alt={`icon-${index}`} />
            <p className="text-lg text-white/90 font-medium leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>


      
      <section id="clients" className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black mb-10">Join Our Growing List Of Indian</h1>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black mb-12">
            <span className="bg-gradient-to-r from-[#12DBE5] via-[#1F5799] to-[#F20000] bg-clip-text text-transparent">
              HEALTHCARE CLIENTS
            </span>
          </h1>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 items-center justify-items-center">
            {[
              "/assets/services/BDrKaur.png",
              "/assets/services/BKashiNetralaya.png",
              "/assets/services/BAeonClinic.png",
              "/assets/services/BDiabendocare.png",
            ].map((logo, idx) => (
              <Image
                key={idx}
                width={500}
                height={200} 
                src={logo} 
                alt={`client-${idx}`} 
            
              />
            ))}
          </div>
        </div>
      

      
        <div className=" rounded-3xl p-8 lg:p-10 mt-20 text-center relative overflow-hidden ">
          <div className="absolute inset-0 bg-[url('/assets/services/Cbg.png')] bg-cover bg-center opacity-70"></div>
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-black mb-4">
              We Know You Are Busy!
            </h2>
            <h4 className="text-xl sm:text-2xl text-white/80 font-medium mb-8">
              Let us call you at your preferred Time
            </h4>
            <button
              onClick={showContactOptions}
              className={`${buttonStyles.base} text-lg sm:text-xl py-4 px-8 font-bold`}
              style={{ background: GRADIENTS.PRIMARY }}
              onMouseEnter={buttonHandlers.onMouseEnter}
              onMouseLeave={buttonHandlers.onMouseLeave}
       
            >
              <span className={buttonStyles.ripple} />
              <span className="relative z-10">Get a Callback</span>
            </button>
          </div>
        </div>
      </section>

     

    
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

      <h1 className="text-5xl sm:text-5xl  text-center lg:text-7xl xl:text-7xl mb-7 font-black ">Services</h1>

          <h3 className="text-4xl sm:text-5xl lg:text-6xl xl:text-5xl font-black text-center mb-5">
            Patient-Centric Medical Website
          </h3>
          <Image width={600} height={400} src="/assets/services/DGroup.png" className="w-full max-w-10xl  mb-16 rounded-2xl" alt="Patient Centric" />
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                img: "/assets/services/Dicons8-web-96.png",
                text: "10+ years of experience in building websites",
              },
              {
                img: "/assets/services/Dicons8-design-90.png",
                text: "User Centric Design",
              },
              {
                img: "/assets/services/Dicons8-administrator-male-96.png",
                text: "100% Client Owned",
              },
              {
                img: "/assets/services/Dicons8-web-hosting-64(1).png",
                text: "Lowest Web Hosting Fees",
              },
              {
                img: "/assets/services/Dicons8-free-60(1).png",
                text: "Free Website redesign after every 2 years",
              },
              {
                img: "/assets/services/Dicons8-integration-64.png",
                text: "Integration with third-party tools",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 p-8 rounded-3xl flex flex-col items-center text-center hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300 border border-gray-700/50"
              >
                <Image width={600} height={400} src={item.img} alt={`pcmw-${idx}`} className="p-2 w-20 h-20 object-contain mb-6" />
                <p className="text-lg text-white/90 font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Marketing Section */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black mb-12">Social Media Marketing</h1>
          <div className="relative w-full max-w-4xl mx-auto h-96 lg:h-[600px] overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50">
            <div className="absolute inset-0 flex gap-8 animate-slide items-center">
              {[
                "/assets/services/EMyths&FactsEng24thnov.png",
                "/assets/services/Emainpg.png",
                "/assets/services/EZeissIOLMaster700.png",
                "/assets/services/E5.png",
                "/assets/services/E3.png",
                "/assets/services/EMyths&FactsEng24thnov.png",
                "/assets/services/Emainpg.png",
                "/assets/services/EZeissIOLMaster700.png",
              ].map((img, idx) => (
                <Image width={600} height={400} key={idx} src={img} alt={`smm-${idx}`} className="w-80 h-96 object-cover rounded-2xl shadow-2xl" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Google Ads PPC Section */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black mb-12">Google Ads, Facebook Ads PPC</h1>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[
              { img: "/assets/services/Ficons8-keywords-961.png", text: "Targeted Keywords" },
              { img: "/assets/services/Ficons8-country-1001.png", text: "Local Targeting" },
              { img: "/assets/services/Ficons8-copy-641.png", text: "Ad Copy" },
             { img: "/assets/services/Ficons8-landing-page-641.png", text: "Wesite SEO" },
              { img: "/assets/services/Ficons8-budget-961.png", text: "Budget & Bidding" },
              { img: "/assets/services/Ficons8-optimization-641.png", text: "Continuous Optimization" },
              { img: "/assets/services/Ficons8-analysis-901.png", text: "Tracking & Analytics for ROI" },
              { img: "/assets/services/Ficons8-keywords-961.png", text: "Meta marketing" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 p-8 rounded-3xl flex flex-col items-center text-center hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 border border-gray-700/50"
              >
                <Image width={600} height={400} src={item.img} alt={`ads-${idx}`} className="p-2 w-20 h-20 object-contain mb-6" />
                <p className="text-lg text-white/90 font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section id="hrm" className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto text-center">
    <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black mb-12">Healthcare Reputation Management</h2>
<div className="flex flex-col lg:flex-row   w-100% gap-8 lg:gap-12 items-center">
  <div className="lg:w-1/2 pt-20">
    <div className="grid grid-cols-2 w-[100%] items-center sm:grid-cols-2 gap-4 sm:gap-6">
      <Image
        src="/assets/services/GBestEyeCareHospitalinVaranasi.png"
        alt="HRM 1"
        width={600}
        height={400}
        className="rounded-2xl  shadow-2xl"
      />
      <Image
        src="/assets/services/GBestEyeCareHospitalinGoa.png"
        alt="HRM 2"
        width={600}
        height={500}
        className="rounded-2xl  shadow-2xl mt-0 sm:mt-8"
      />
    </div>
  </div>


      
      
      <div className="lg:w-1/2  pt-10 ">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4 items-center w-100% sm:gap-6">
          {[
            { img: "/assets/services/Gicons8-roi-642(1).png", text: "Improved ROI" },
            /*{ img: "/assets/services/Gicons8-reputation-641(1).png", text: "Excellent Patient Experience" },*/
            { img: "/assets/services/Gicons8-reliability-68(2).png", text: "Stellar Online Reputation" },
            { img: "/assets/services/Gicons8-monitoring-1001(1).png", text: "Reliability & Credibility" },
            { img: "/assets/services/Gicons8-loyalty-1001(1).png", text: "Monitoring" },
            { img: "/assets/services/Gicons8-listing-641(2).png", text: "Consistent Listings" },
            { img: "/assets/services/Gicons8-customer-insight-961(1).png", text: "Satisfied & Loyal Patient Base" },
          ].map((it, i) => (
            <div 
              key={i} 
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 p-4 sm:p-6 rounded-2xl flex flex-col items-center text-center hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 border border-gray-700/50 min-h-[140px] justify-center"
            >
              <Image width={600} height={400} src={it.img} alt={`hrm-${i}`} className="w-12 h-12 sm:w-14 sm:h-14 object-contain mb-3" />
              <p className="text-white/90 font-medium text-sm sm:text-base">{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>

    

<section id="featured" className="px-4 sm:px-6 lg:px-8 text-center">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black mb-12">
      Featured On
    </h2>
    <div className="flex flex-wrap justify-center gap-12 lg:gap-16 items-center">
      <Image
        src="/assets/services/HTOI.png"
        alt="TOI"
        width={256}
        height={128}
        className="w-48 lg:w-56 xl:w-64"
      />
      <Image
        src="/assets/services/HHT2.png"
        alt="HT"
        width={256}
        height={128}
        className="w-48 lg:w-56 xl:w-64"
      />
      <Image
        src="/assets/services/HTI.png"
        alt="Featured"
        width={256}
        height={128}
        className="w-48 lg:w-56 xl:w-64"
      />
    </div>
  </div>
</section>


    
      
      {showOptions && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 w-full max-w-md flex flex-col gap-6 items-center relative border border-gray-700/50">
            <button onClick={closePopup} className="absolute top-4 right-4 text-white text-3xl hover:text-gray-400 transition-colors">×</button>
            <h3 className="text-2xl font-black text-white mb-4">Contact Us</h3>
            {[
              { label: "Email Us", action: sendEmail },
              { label: "WhatsApp Us", action: sendWhatsApp },
              { label: "Call Us", action: makeCall },
            ].map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className={`${buttonStyles.base} w-full text-lg py-4 font-bold`}
                style={{ background: GRADIENTS.PRIMARY }}
                onMouseEnter={buttonHandlers.onMouseEnter}
                onMouseLeave={buttonHandlers.onMouseLeave}
           
              >
                <span className={buttonStyles.ripple} />
                <span className="relative z-10">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-slide {
          animation: slide 30s linear infinite;
        }
      `}</style>
    </div>
  );
}