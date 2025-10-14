"use client";

import Image from "next/image";

export default function PageViewer() {
  return (
    <section id="pageviewer" className="galaxy-bg text-white ">
    <div className="w-full bg-transparent px-3 py-5">
    
  <h1 className="text-white text-center font-black text-5xl md:text-4xl lg:text-[70px] leading-snug md:leading-[75px] lg:leading-[82px] tracking-tight md:tracking-normal lg:tracking-[-3.84px] pb-3">
    The technology partner that <br />
    your business needs to thrive <br className="hidden lg:block" />
    in the digital economy.
  </h1>

  <h2 className="text-gray-400 text-center text-2xl md:text-3xl lg:text-[45px] font-extrabold leading-snug md:leading-[50px] pt-7 pb-7 tracking-tight md:tracking-[-0.7px]">
    We help real businesses grow by enabling <br className="hidden lg:block" />
    the right technologies for them.
  </h2>
      <div className="flex justify-evenly items-center relative perspective-[1200px] group">
  {[
    { src: "/assets/pageViewerImages/shobha.png", type: "dark", width: "17%" },
    { src: "/assets/pageViewerImages/h2h.png", type: "dark", width: "17%" ,  },
    { src: "/assets/pageViewerImages/connecthand.png", type: "light", width: "25%" },
    { src: "/assets/pageViewerImages/kashi.png", type: "dark", width: "17%" },
    { src: "/assets/pageViewerImages/DrKaur.png", type: "dark", width: "17%" },
  ].map((img, idx) => (
    <Image
      key={idx}
      src={img.src}
      alt="Digital Branding"
      width={200}
      height={200}
      className={`
        rounded-[50px] border
        transition-transform duration-400 ease-in-out transform-gpu
        opacity-100
        z-0
        group-hover:translate-z-[-80px] group-hover:scale-[0.9] group-hover:opacity-70
        hover:translate-z-[100px] hover:scale-[1.15] hover:rotate-x-[8deg] hover:rotate-y-[5deg]
        hover:opacity-100 hover:brightness-[1.1] hover:shadow-[0_15px_30px_rgba(255,255,255,0.3)] hover:z-10
      `}
      style={{
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
        width: img.width,
      }}
    />
  ))}
</div>

    </div>
    </section>
  )
}
