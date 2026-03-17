"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Search, User, Menu, Target as Aim, Layers3 } from "lucide-react";
import Image from "next/image";

// --- INJECTED CSS FOR B&W THEME, FILM STRIP & NEURAL GRID ---
const customStyles = `
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #050505; }
  ::-webkit-scrollbar-thumb { background: #333; border-radius: 0px; }
  ::-selection { background: #e60000; color: #ffffff; }

  @keyframes repeating-ribbon {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .animate-repeating-ribbon { animation: repeating-ribbon 20s linear infinite; }

  /* Neural Grid Background */
  .bg-neural-grid {
    background-size: 50px 50px;
    background-image: 
      linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
    -webkit-mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
  }
`;

export default function LandingPage() {
  const { scrollYProgress } = useScroll();

  // --- AUTHENTICATION STATE ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check your auth storage (localStorage or sessionStorage)
    const userStorage = localStorage.getItem('user'); // or sessionStorage.getItem('user')
    
    if (userStorage) {
      setIsLoggedIn(true);
    }
  }, []);

  // Scroll animations for parallax effects
  const scaleHero = useTransform(scrollYProgress, [0, 0.2], [1, 1.05]);
  const yParallaxFast = useTransform(scrollYProgress, [0, 1], [0, -300]);

  return (
    <main className="min-h-screen text-white overflow-x-hidden relative bg-[#050505] font-sans">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 z-[-2] w-full h-full pointer-events-none overflow-hidden">
        {/* Editorial Noise */}
        <div className="absolute inset-0 opacity-[0.25] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        {/* Neural Grid */}
        <div className="absolute inset-0 bg-neural-grid pointer-events-none" />

        {/* Ambient Glowing Nodes */}
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -50, 0], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full bg-white/5 blur-[120px]" 
        />
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, 50, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] rounded-full bg-[#e60000]/10 blur-[150px]" 
        />
      </div>

      <div className="relative z-10 w-full">

        {/* =========================================
            HERO SECTION
        ========================================= */}
        <section className="relative min-h-[100svh] flex flex-col pt-6 overflow-hidden">
          
          {/* Top Navigation Bar */}
          <nav className="container mx-auto px-6 max-w-7xl flex items-center justify-between mb-12 relative z-50">
            <div className="text-2xl font-black uppercase tracking-tighter flex items-center gap-1">
              Rift<span className="text-[#e60000]">+</span>Oracle
            </div>
            
            <div className="hidden md:flex gap-8 text-[11px] uppercase tracking-[0.2em] font-bold text-slate-400">
              <Link href="/research" className="hover:text-white cursor-pointer transition-colors relative text-white">
                RESEARCH
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#e60000] rotate-45" />
              </Link>
              <span className="text-slate-600">•</span>
              <Link href="/predict" className="hover:text-white cursor-pointer transition-colors">PREDICTOR</Link>
              <span className="text-slate-600">•</span>
              <Link href="/recommend" className="hover:text-white cursor-pointer transition-colors">DRAFT ASSISTANT</Link>
              <span className="text-slate-600">•</span>
              <Link href="/history" className="hover:text-white cursor-pointer transition-colors">HISTORY</Link>
            </div>
            
            <div className="flex gap-4 items-center">
              <div className="hidden md:flex w-10 h-10 rounded-full border border-white/20 items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer">
                <Search size={16} />
              </div>

              {/* AUTH LOGIC INTEGRATION */}
              {!isMounted ? (
                 // Loading skeleton to prevent layout shift while checking local storage
                 <div className="w-20 h-8 rounded-full bg-white/10 animate-pulse" />
              ) : !isLoggedIn ? (
                <Link href="/login" className="px-6 py-2 rounded-full border border-[#e60000] text-[#e60000] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#e60000] hover:text-white transition-colors">
                  Login
                </Link>
              ) : (
                <Link href="/dashboard" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer" title="Dashboard">
                  <User size={16} />
                </Link>
              )}

              <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors">
                <Menu size={20} />
              </div>
            </div>
          </nav>

          {/* Model Cast Bar */}
          <div className="container mx-auto px-6 max-w-7xl flex justify-between items-center text-xs md:text-xl font-mono uppercase tracking-[0.2em] text-slate-400 relative z-20 mb-[-4vh]">
            <span className="text-white">XGBOOST L.O.L</span>
            <span className="hidden md:block">RANDOM FOREST</span>
            <span className="text-4xl font-black text-white px-4">|||</span>
            <span className="hidden md:block">LOGISTIC REGRESSION</span>
            <span>SHAP AUTOPSY</span>
          </div>

          <div className="absolute right-10 top-1/2 -translate-y-1/2 text-white/80 text-sm font-black tracking-widest uppercase -rotate-90 origin-right pointer-events-none z-50">
            RELEASE [2024]
          </div>

          <div className="relative flex-1 flex flex-col justify-center items-center w-full">
            {/* Giant Background Text */}
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 1.5 }} 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12rem] md:text-[22rem] xl:text-[28rem] font-black tracking-tighter uppercase leading-[0.8] text-white/5 z-0 whitespace-nowrap"
            >
              PREDICT
            </motion.h1>

            {/* Red Circle Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-[#e60000] rounded-full z-10" />

            {/* Foreground Character (Jinx) */}
            <motion.div 
              style={{ scale: scaleHero }}
              initial={{ opacity: 0, y: 50 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 1.5, delay: 0.2 }}
              className="relative z-20 w-[350px] h-[550px] md:w-[600px] md:h-[800px]"
            >
              <Image 
                src="/jinx-lol.jpg" 
                alt="Jinx Protocol" 
                fill 
                className="object-cover object-top drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]" 
                priority 
                unoptimized 
              />
            </motion.div>

            {/* Bottom Left: Story Block */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 1, delay: 0.8 }}
              className="absolute bottom-10 left-6 md:left-20 max-w-[250px] md:max-w-xs z-30 hidden md:block"
            >
              <div className="flex items-center gap-2 text-[#e60000] font-black uppercase tracking-widest text-[10px] mb-4">
                <Aim size={14} /> HYBRID INTELLIGENT ARCHITECTURE
              </div>
              <p className="text-[11px] leading-relaxed font-mono text-slate-300 uppercase">
                PART A. The Stacking Ensemble (XGBoost + Random Forest) processes millions of data points, calibrated via Bayesian Log-Odds for strategic heuristic penalties.
              </p>
            </motion.div>

            {/* Bottom Right: Actions */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 1, delay: 0.8 }}
              className="absolute bottom-10 right-6 md:right-20 flex items-center gap-6 z-30"
            >
              <Link href="/predict" className="group flex items-center gap-3 px-8 py-3 rounded-full border border-white/20 text-white font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:text-black transition-colors backdrop-blur-md">
                INITIALIZE ↗
              </Link>
              <div className="hidden md:block w-16 h-16 rounded-full overflow-hidden border-2 border-[#e60000] relative bg-black">
                 <Image src="/jinx-logo.jpg" alt="Seal" fill className="object-cover opacity-80" unoptimized />
              </div>
            </motion.div>
          </div>
        </section>

        {/* =========================================
            DIVIDER & STATS
        ========================================= */}
        <section className="relative z-30 flex flex-col items-center overflow-hidden bg-[#0a0a0a]">
          
          {/* Top Half Giant Text (Cut off) */}
          <div className="w-full overflow-hidden h-24 md:h-48 relative flex justify-center bg-[#050505]">
            <h1 className="absolute top-0 text-[12rem] md:text-[22rem] xl:text-[28rem] font-black tracking-tighter uppercase leading-[0.8] text-white/5 z-0 whitespace-nowrap">
              PREDICT
            </h1>
          </div>

          {/* Repeating Film Strip / Pattern Band */}
          <div className="w-full bg-[#5a0505] border-y-[4px] md:border-y-[6px] border-[#0a0a0a] py-2 md:py-3 z-40 relative overflow-hidden flex items-center">
             <div className="flex animate-repeating-ribbon whitespace-nowrap">
              {Array(40).fill(0).map((_, i) => (
                <div key={i} className="flex items-center mx-2 md:mx-3">
                  <div className="w-6 h-3 md:w-8 md:h-4 bg-black rounded-full flex items-center justify-center relative overflow-hidden">
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-full absolute left-1.5"></div>
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-full absolute right-1.5"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats & Info Container */}
          <div className="container mx-auto px-6 max-w-7xl py-16 md:py-24 flex flex-col xl:flex-row justify-between items-center xl:items-start gap-16 relative">
            
            {/* Left: Architecture / Production */}
            <div className="flex flex-col items-center xl:items-start gap-4 flex-1 text-center xl:text-left">
              <div className="flex items-center gap-2 text-[#e60000] font-black uppercase tracking-widest text-[10px]">
                <Layers3 size={14} /> ARCHITECTURE
              </div>
              <div className="bg-[#e60000] text-white font-black tracking-tighter text-2xl md:text-3xl px-4 py-1 uppercase border-y-2 border-white/20">
                MACHINE LEARNING
              </div>
              
              <div className="hidden md:flex items-center gap-4 mt-12">
                <div className="w-10 h-10 rounded-full border border-white flex items-center justify-center font-bold text-sm">02</div>
                <div className="flex gap-1">
                  {[1,2,3].map(i => <div key={i} className="w-2 h-2 bg-[#e60000] rotate-45" />)}
                  <div className="w-2 h-2 bg-white/20 rotate-45" />
                </div>
              </div>
              <div className="hidden md:block w-16 h-16 rounded-full bg-[#1a0505] mt-8" />
            </div>

            {/* Center: Overlapping Stat Circles */}
            <div className="relative flex justify-center items-center h-[200px] md:h-[300px] flex-1">
               <div className="absolute inset-0 border border-white/5 rounded-full scale-150 pointer-events-none hidden md:block" />
               <div className="absolute inset-0 border border-white/5 rounded-full scale-110 pointer-events-none hidden md:block" />
               <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/5 pointer-events-none" />
               <div className="absolute left-0 right-0 top-1/2 h-px bg-white/5 pointer-events-none" />

               <div className="flex gap-1 md:gap-2 items-center relative z-20">
                 <div className="w-24 h-24 md:w-40 md:h-40 rounded-full bg-white flex flex-col items-center justify-center text-black shadow-2xl z-10 translate-x-4">
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-1">ACCURACY</span>
                    <span className="text-2xl md:text-5xl font-black tracking-tighter">66%</span>
                 </div>
                 <div className="w-28 h-28 md:w-40 md:h-40 rounded-full bg-[#e60000] flex flex-col items-center justify-center text-white shadow-2xl z-20 scale-110 border-4 border-[#0a0a0a]">
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-1">PATCH</span>
                    <span className="text-2xl md:text-5xl font-black tracking-tighter">14.12</span>
                 </div>
                 <div className="w-24 h-24 md:w-40 md:h-40 rounded-full bg-[#111] flex flex-col items-center justify-center text-white/50 shadow-2xl z-10 -translate-x-4">
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-1">FEATURES</span>
                    <span className="text-2xl md:text-5xl font-black tracking-tighter">42</span>
                 </div>
               </div>

               {/* Falling Cards Effect */}
               <motion.div style={{ y: yParallaxFast }} className="absolute -bottom-10 md:-bottom-32 z-30 shadow-2xl">
                 <Image 
                   src="/arcane.jpeg" 
                   alt="Card" 
                   width={220} 
                   height={300} 
                   className="w-[120px] md:w-[220px] rounded-xl object-cover rotate-[-10deg] shadow-[0_20px_40px_rgba(0,0,0,0.8)] border border-white/10" 
                   unoptimized 
                 />
               </motion.div>
            </div>

            {/* Right: Blockquote */}
            <div className="flex flex-col items-center xl:items-start flex-1 max-w-sm mx-auto xl:ml-auto mt-16 xl:mt-0">
              <blockquote className="border-l-[3px] border-[#e60000] pl-6 text-slate-300 text-[11px] md:text-sm leading-loose font-mono uppercase tracking-widest">
                "THE XGBOOST ALGORITHM CONFIRMED IT WAS DONE RELYING ON POST-MATCH TEMPORAL EVENTS AFTER THE 2024 DATA LEAKAGE AUDIT. THE DRAFT DICTATES ALL."
              </blockquote>
              <div className="text-[#e60000] mt-4 ml-6 self-start hidden md:block">↗</div>
              
              <div className="hidden md:flex gap-2 mt-16 ml-6">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px]">X</div>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px]">FB</div>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px]">IG</div>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================
            DRAFT ASSISTANT SECTION (jinx.jpg integration)
        ========================================= */}
        <section className="relative py-24 bg-[#050505] overflow-hidden border-t border-white/5">
           <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row items-center gap-16">
              <div className="flex-1 relative order-2 md:order-1">
                 <div className="absolute -top-10 -left-10 w-32 h-32 border-l-4 border-t-4 border-[#e60000] opacity-50" />
                 <motion.div 
                   whileHover={{ scale: 1.02 }}
                   className="relative z-10 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                 >
                    <Image 
                      src="/jinx.jpg" 
                      alt="Draft Assistant" 
                      width={600} 
                      height={400} 
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                      unoptimized 
                    />
                 </motion.div>
                 <div className="absolute -bottom-10 -right-10 w-32 h-32 border-r-4 border-bottom-4 border-[#e60000] opacity-50 flex items-end justify-end p-4">
                    <span className="text-[10px] font-mono text-[#e60000]">INTELLIGENCE_CORE</span>
                 </div>
              </div>

              <div className="flex-1 order-1 md:order-2">
                 <div className="flex items-center gap-2 text-[#e60000] font-black uppercase tracking-widest text-xs mb-6">
                    <Aim size={18} /> AI DRAFT ASSISTANT
                 </div>
                 <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-8 leading-tight">
                    OPTIMIZING THE <span className="text-[#e60000]">RIFT</span>
                 </h2>
                 <p className="text-slate-400 font-mono text-sm leading-relaxed mb-10 uppercase">
                    Beyond simple win predictions, our Hybrid Architecture offers real-time recommendation cycles. 
                    The Expert Strategy Layer monitors drafting errors, applying Bayesian updates to ensure 
                    mathematical rigor for Every single champion pick.
                 </p>
                 <div className="grid grid-cols-2 gap-8">
                    <div>
                       <div className="text-2xl font-black text-white mb-1 uppercase tracking-tighter">SHAP X-RAY</div>
                       <div className="text-[10px] text-slate-500 uppercase tracking-widest">Explainable AI Dashboard</div>
                    </div>
                    <div>
                       <div className="text-2xl font-black text-white mb-1 uppercase tracking-tighter">TEAM SYNERGY</div>
                       <div className="text-[10px] text-slate-500 uppercase tracking-widest">Meta-Score Integration</div>
                    </div>
                 </div>
              </div>
           </div>
        </section>
        
        {/* =========================================
            FINAL CTA BLOCK
        ========================================= */}
        <section className="py-24 bg-[#050505] border-t border-white/5 flex justify-center relative">
          <Link href={isLoggedIn ? "/dashboard" : "/login"} className="group px-10 md:px-16 py-5 md:py-6 border border-[#e60000]/50 text-[#e60000] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] hover:bg-[#e60000] hover:text-white transition-all duration-300 relative overflow-hidden text-sm md:text-base">
            <span className="relative z-10">
              {!isMounted ? "INITIALIZING..." : isLoggedIn ? "ACCESS DASHBOARD" : "LOGIN TO ACCESS"}
            </span>
            <div className="absolute inset-0 bg-[#e60000] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
          </Link>
        </section>

      </div>
    </main>
  );
}