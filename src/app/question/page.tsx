'use client';

import Image from "next/image";
import { useEffect,useState } from "react";

export default function QuestionPage() {


  const [tree,setTree]=useState<any>(null);
  const [currentId, setcurrentId]=useState("q1");
  const [answers, setAnswer]= useState<string[]>([]);

  useEffect(()=>{
    fetch("/tree.json").then((res)=>res.json().then(setTree)) 
  },[]);

  const handleClick=(options:{lable:string ; next:string})=>{
    setAnswer((prev=>[...prev, options.lable]))
    setcurrentId(options.next);
  };
 if (!tree){ 
  return<div className="text-white text-center"> Loading....... ....</div>;
  
 }
   
 const currentNode= tree[currentId];

  return (
    <div className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center relative" style={{ backgroundImage: `url('/images/bg.jpg')` }}>

      <div className="absolute top-5 left-5 z-10">
        <Image src="/logo.png" alt="Logo" width={80} height={80} />
      </div>
      


      <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-xl shadow-xl px-8 py-12 w-[90%] max-w-md text-center space-y-8 flex flex-col items-center justify-center min-h-[400px]">
        


      {currentNode.result ? (
          <>
            <h1 className="text-xl font-semibold text-white leading-snug">
              Your Assessment Result
            </h1>
            <p className="text-cyan-200 text-lg">{currentNode.result}</p>

           
            
          </>
        ) :(
          <>
        <h1 className="text-2xl font-semibold text-white leading-snug">
          {currentNode.question}
        </h1>

        <div className="flex flex-col gap-6 w-full px-4">

         {currentNode.options.map((option:any , index:number)=>
        
           <button
            key={index}
            onClick={()=>handleClick(option)}
            className="relative group w-full active:scale-95 transform transition-all duration-150"
            >
                <div className={`absolute -inset-1 ${option.label === "Yes" ? "bg-[#00b7ff]" : "bg-red-500"} rounded-full blur opacity-60 group-hover:opacity-80 group-active:opacity-100 transition duration-200`}></div>
                  <div className={`relative w-full py-4 bg-black rounded-full border-2 ${option.label === "Yes" ? "border-cyan-400" : "border-red-400"} font-bold text-lg tracking-wider hover:bg-opacity-20 active:bg-opacity-40 transition duration-200`}>
                    <span className={`${option.label === "Yes" ? "text-cyan-300" : "text-red-300"} drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] group-active:drop-shadow-[0_0_15px_rgba(255,255,255,1)]`}>
                      {option.label.toUpperCase()} !
                    </span>
                  </div>
           </button>
        )}
           
         
        </div>
        </>
     )} 
      </div>
    </div>
  );
}