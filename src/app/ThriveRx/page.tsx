'use client';
import Image from "next/image";
import { useRef } from "react";

export default function EMR() {
 

  return (
    <div className="text-white  bg-black">
      <section className="flex flex-wrap items-center justify-between px-5 py-10" data-aos="fade-up">
        <div className="flex-1 min-w-[300px] ml-5">
          <h1 className="text-5xl font-bold mb-3">Streamline Your Care:</h1>
          <h2 className="text-5xl font-semibold mb-3">
            Connecting <span className="text-[#B5F6FF]">Patients</span> and{" "}
            <span className="text-[#B5F6FF]">Doctors</span> Effortlessly
          </h2>
          <p className="text-2xl text-gray-400 mb-6">
            Effortlessly manage and update patient records with our system,
            designed exclusively for hospital staff. Ensure accurate and
            efficient care every step of the way.
          </p>
          <button
           /* onClick={}button work needs to be done*/
            className="bg-[#0048A5] text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-900 transition"
          >
            Get Started ➔
          </button>
        </div>
        <Image
          src="/assets/ThriveRX/Zlogin.png"
          alt="Home"
          width={550}
          height={550}
          className="rounded-3xl mx-auto"
        />
      </section>

      
      <section id="features" className="py-10" data-aos="fade-up">
        <div className="flex flex-wrap items-center justify-center gap-10">
          <Image
            src="/assets/ThriveRX/Zdocimage.png"
            alt="Doctor"
            width={550}
            height={550}
            className="rounded-lg"
          />
          <div className="text-white text-xl">
            <h1 className="text-4xl font-bold mb-5">Our Features</h1>
            <ul className="space-y-2">
              <li>• Centralized Data</li>
              <li>• Data Security</li>
              <li>• Real-time Updates</li>
              <li>• User-Friendly Interface</li>
              <li>• Seamless Integration</li>
            </ul>
          </div>
        </div>
      </section>

   
      <section
        id="add-patient"
        className="flex flex-wrap items-center justify-between px-5 py-10"
        data-aos="fade-up"
      >
        <div className="flex-1 text-left mb-10 lg:ml-40">
          <h1 className="text-5xl font-bold mb-4">Add Patient</h1>
          <p className="text-2xl text-gray-400">
            Quickly and easily add patient details to enhance personalized care.<br/>
            Reduce the hastle in your hospital 
          </p>
        </div>
        <Image
          src="/assets/ThriveRX/Zaddpatient.png"
          alt="Add Patient"
          width={550}
          height={550}
          className="rounded-3xl mx-auto"
        />
      </section>

 
      <section className="text-center py-10" data-aos="fade-up">
        <h1 className="text-5xl font-semibold mb-3">
          Electronic Medical Records (EMR) Management
        </h1>
        <p className="text-2xl text-gray-400 max-w-3xl mx-auto">
          Find all the medical records (prescriptions, reports, invoices, etc.)
          grouped together and sorted by date of creation in the application.
        </p>
      </section>

      <section id="records" className="py-10" data-aos="fade-up">
        <Image
          src="/assets/ThriveRX/Zrecords.png"
          alt="Records"
          width={750}
          height={550}
          className="mx-auto rounded-lg mb-8"
        />
        <div className="flex flex-wrap items-center justify-center gap-10">
          <div className="max-w-lg ">
            <h1 className="  sm:text-5xl text-5xl sm:text-center font-bold mb-4">Patient Details</h1>
            <p className="text-2xl sm:text-xl sm:text-center text-gray-400">
              Here are some details about the patient that may include medical
              history, current medications, and more.
            </p>
          </div>
          <Image
            src="/assets/ThriveRX/Zpatientdetail.png"
            alt="Patient Detail"
            width={550}
            height={550}
            className="rounded-xl"
          />
        </div>
      </section>
    </div>
  );
}
