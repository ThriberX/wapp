"use client";

import Link from "next/link";
import Image from "next/image";
import { LINKS } from "@/lib/constants/links";

export default function Footer() {
  return (
    <footer className="bg-transparent text-white text-center py-8 galaxy-bg">
      <hr className="border-gray-700 mb-6" />

      <div className="flex flex-col md:flex-row justify-between items-center px-6">
        {/* Left: Copyright and Privacy */}
        <p className="text-sm text-gray-300 mb-4 md:mb-0">
          &copy; 2023, Thriberx Engineering Pvt Ltd. All rights reserved.{" "}
          <Link href={LINKS.PRIVACY_POLICY} className="text-white underline hover:text-gray-300">
            Privacy Policy
          </Link>
        </p>

        {/* Right: Social Media */}
        <div className="flex gap-3">
          <a href={LINKS.FACEBOOK} target="_blank" rel="noopener noreferrer">
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
              <Image
                src="/assets/general/Facebook.png"
                alt="Facebook"
                width={24}
                height={24}
              />
            </button>
          </a>

          <a href={LINKS.INSTAGRAM} target="_blank" rel="noopener noreferrer">
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
              <Image
                src="/assets/general/Instagram.png"
                alt="Instagram"
                width={24}
                height={24}
              />
            </button>
          </a>

          <a href={LINKS.LINKEDIN} target="_blank" rel="noopener noreferrer">
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
              <Image
                src="/assets/general/Linkedin(2).png"
                alt="LinkedIn"
                width={24}
                height={24}
              />
            </button>
          </a>
        </div>
      </div>
    </footer>
  );
}
