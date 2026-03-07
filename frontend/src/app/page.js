"use client";

import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Cpu, Target, Database, Activity, Feather, Sparkles } from "lucide-react";
import Image from "next/image";
import FaultyTerminal from "@/components/FaultyTerminal";

// --- INJECTED CSS FOR B&W THEME, DRAGON SCALES, AND VINES ---
const customStyles = `
  /* Force global monochrome scrollbar and selection */
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #050505; }
  ::-webkit-scrollbar-thumb { background: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(255,255,255,0.8); }
  ::selection { background: #ffffff; color: #000000; }

  @keyframes sway {
    0% { transform: rotate(0deg); }
    50% { transform: rotate(5deg); }
    100% { transform: rotate(0deg); }
  }
  .animate-sway { animation: sway 8s ease-in-out infinite alternate; }

  @keyframes floatScale {
    0% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-15px) scale(1.05); }
    100% { transform: translateY(0px) scale(1); }
  }
  .animate-float-scale { animation: floatScale 10s ease-in-out infinite; }

  .animation-delay-2000 { animation-delay: 2s; }
  .animation-delay-4000 { animation-delay: 4s; }

  .bg-dragon-scales {
    background-image: 
      radial-gradient(circle at center, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1px, transparent 1px),
      radial-gradient(circle at center, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1px, transparent 1px);
    background-size: 20px 20px;
    background-position: 0 0, 10px 10px;
  }
`;

// --- 1. UTILITY COMPONENTS ---

// A. Monochromatic Grunge Divider
function SlashDivider() {
  return (
    <div className="relative h-24 overflow-hidden -mt-10 z-20 pointer-events-none">
      <div className="absolute inset-0 bg-[#050505] transform -skew-y-3 origin-bottom-right border-t border-white/20" />
      <div className="absolute inset-0 bg-transparent transform -skew-y-3 origin-bottom-right border-t border-white/5 translate-y-2 blur-[2px]" />
    </div>
  );
}

// B. Infinite Scrolling Ticker (Monochrome)
function InfiniteTicker() {
  return (
    <div className="w-full bg-white/5 border-y border-white/10 py-3 overflow-hidden flex relative z-10 backdrop-blur-md">
      <motion.div 
        className="flex gap-12 whitespace-nowrap text-white/50 font-serif italic text-sm tracking-widest uppercase"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
      >
        {Array(10).fill("✧ THE CYCLE OF LIFE AND DEATH CONTINUES ✧ WE WILL LIVE ✧ THEY WILL DIE ✧").map((text, i) => (
          <span key={i}>{text}</span>
        ))}
      </motion.div>
    </div>
  );
}

// C. 3D Tilt Card (Monochrome & Elegant)
function TiltCard({ title, icon: Icon, desc, delay }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [20, -20]);
  const rotateY = useTransform(x, [-100, 100], [-20, 20]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay, duration: 0.8, ease: "easeOut" }}
      style={{ x, y, rotateX, rotateY, z: 100 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="relative group perspective-1000"
    >
      <div className="relative h-full bg-[#050505]/80 backdrop-blur-xl border border-white/10 p-10 rounded-2xl overflow-hidden hover:border-white/50 transition-all duration-500 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-overlay" />

        <div className="relative z-10 pt-4">
          <div className="w-14 h-14 bg-white/5 border border-white/20 rounded-full flex items-center justify-center mb-8 text-white group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <Icon size={24} />
          </div>
          <h3 className="text-2xl font-black text-white mb-4 font-serif uppercase tracking-widest">{title}</h3>
          <p className="text-gray-400 text-sm leading-loose font-light">{desc}</p>
        </div>

        <div className="absolute top-4 right-4 text-white/20 font-serif italic text-xs">I.</div>
        <div className="absolute bottom-4 left-4 w-8 h-[1px] bg-white/20 group-hover:w-16 transition-all duration-500" />
      </div>
    </motion.div>
  );
}

// --- 2. MAIN PAGE ---

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -600]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const scale1 = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const fadeOut = useTransform(scrollYProgress, [0, 0.5], [0.15, 0]);

  return (
    <main className="min-h-screen text-white overflow-x-hidden relative" style={{ isolation: 'isolate', backgroundColor: '#050505' }}>
      
      {/* ⚠️ THIS STYLE BLOCK OVERRIDES THE CYAN BACKGROUND FROM LAYOUT.JS ⚠️ */}
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      
      {/* SOLID BACKGROUND BLOCKER TO HIDE LAYOUT.JS */}
      <div className="fixed inset-0 z-[-2] bg-[#050505] w-full h-full pointer-events-none" />

      {/* === BACKGROUND LAYER (FIXED & AESTHETIC) === */}
      <div className="fixed inset-0 z-[-1] w-full h-full pointer-events-none">
        
        {/* 1. Global Dragon Scales Texture */}
        <div className="absolute inset-0 bg-dragon-scales opacity-60 mix-blend-screen" />
        
        {/* 2. Global Grainy Noise */}
        <div className="absolute inset-0 opacity-[0.25] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        {/* 3. Terminal Faults (Black and White mode) */}
        <div className="absolute inset-0 w-full h-full opacity-40 mix-blend-screen scale-110">
            <FaultyTerminal
                scale={2}
                gridMul={[2, 1]}
                digitSize={1.5}
                timeScale={0.3}
                pause={false}
                scanlineIntensity={0.8}
                glitchAmount={0.5} 
                flickerAmount={0.8} 
                noiseAmp={0.8}     
                chromaticAberration={0} 
                dither={0}
                curvature={0.2}
                tint="#ffffff"
                mouseReact={false}
                pageLoadAnimation={true}
                brightness={0.4}
            />
        </div>

        {/* 4. Heavy Vignette for dramatic focus */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)] opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/70 via-transparent to-[#050505]" />
      </div>

      {/* === ANIMATED VINES & OBJECTS (Absolute positioned, Parallax) === */}
      <motion.div 
        style={{ y: y2, rotate: -10 }} 
        className="fixed -top-10 -left-10 w-[600px] h-[600px] opacity-70 mix-blend-lighten z-0 pointer-events-none animate-sway"
      >
        <Image src="https://images.unsplash.com/photo-1596489393184-7a9117173e65?q=80&w=2070&auto=format&fit=crop" style={{filter: 'grayscale(100%) contrast(200%) brightness(50%)', maskImage: 'radial-gradient(black,transparent)', WebkitMaskImage: 'radial-gradient(black,transparent)'}} alt="vine" fill className="object-cover rounded-full blur-[2px] opacity-70" unoptimized />
      </motion.div>

      <motion.div 
        style={{ y: y3, rotate: 15 }} 
        className="fixed top-20 -right-20 w-[500px] h-[500px] opacity-50 mix-blend-lighten z-0 pointer-events-none animate-sway animation-delay-2000"
      >
        <Image src="https://images.unsplash.com/photo-1596489393184-7a9117173e65?q=80&w=2070&auto=format&fit=crop" style={{filter: 'grayscale(100%) contrast(150%) brightness(40%)', maskImage: 'radial-gradient(black,transparent)', WebkitMaskImage: 'radial-gradient(black,transparent)'}} alt="vine 2" fill className="object-cover rounded-full blur-[1px] opacity-80" unoptimized />
      </motion.div>

      {/* Floating Particles/Feathers */}
      <motion.div 
        style={{ y: y1, rotate: rotate1 }} 
        className="fixed top-2/3 right-10 z-0 pointer-events-none opacity-50 animate-float-scale"
      >
        <Feather size={200} strokeWidth={0.5} className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]" />
      </motion.div>

      <motion.div 
        style={{ y: y2, rotate: rotate1 }} 
        className="fixed top-1/3 left-10 z-0 pointer-events-none opacity-30 animate-float-scale animation-delay-4000 scale-x-[-1]"
      >
        <Feather size={150} strokeWidth={0.5} className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]" />
      </motion.div>

       <motion.div 
        style={{ scale: scale1, opacity: fadeOut }} 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/20 rounded-full z-0 pointer-events-none animate-[pulse_10s_ease-in-out_infinite]"
      />

      {/* === CONTENT LAYER === */}
      <div className="relative z-10 w-full">
       
        {/* === HERO SECTION === */}
        <section className="relative min-h-[100svh] flex items-center justify-center pt-20 overflow-hidden">
          
          <div className="container mx-auto px-4 text-center relative z-20">
            
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/20 bg-black/60 mb-10 backdrop-blur-xl shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              <Sparkles size={14} className="text-white animate-pulse" />
              <span className="text-white text-[10px] font-serif tracking-[0.4em] uppercase">The Monochrome Archive</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              className="text-7xl md:text-[9rem] xl:text-[12rem] font-black tracking-tighter mb-6 relative drop-shadow-2xl leading-[0.8] uppercase flex flex-col items-center"
            >
              <span className="text-white mix-blend-exclusion">ALTER</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-transparent italic">
                FATE
              </span>
              
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl md:text-5xl text-white/10 font-serif tracking-[1em] whitespace-nowrap z-[-1] pointer-events-none">
                運命を変える
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="max-w-2xl mx-auto text-lg md:text-2xl text-slate-400 mb-14 leading-relaxed font-light font-serif italic"
            >
              Transcend human limitation. The <span className="text-white font-bold not-italic font-mono uppercase tracking-widest text-sm mx-2 px-2 py-1 bg-white/10 rounded border border-white/20">XGBoost Protocol</span> parses reality to guarantee victory before the battle begins.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="flex flex-col md:flex-row gap-6 justify-center items-center"
            >
              <Link href="/predict" className="group relative px-10 py-5 bg-white text-black font-black uppercase tracking-[0.2em] overflow-hidden hover:scale-105 transition-all duration-500 shadow-[0_0_40px_rgba(255,255,255,0.4)]">
                <div className="absolute inset-0 bg-black translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
                <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-500">
                  Begin Divination <ArrowRight size={18} />
                </span>
              </Link>
              
              <Link href="/dashboard" className="group flex items-center gap-3 px-10 py-5 border border-white/40 text-white font-bold uppercase tracking-[0.2em] hover:bg-white/20 transition-all duration-500 backdrop-blur-md">
                <Database size={18} className="group-hover:animate-spin" />
                Access Records
              </Link>
            </motion.div>
          </div>
          
          <motion.div 
            animate={{ height: ["0vh", "10vh", "0vh"], opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-white pointer-events-none shadow-[0_0_10px_rgba(255,255,255,1)]"
          />
        </section>

        <InfiniteTicker />

        {/* === FEATURES GRID === */}
        <section className="py-40 relative z-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="mb-24 text-center">
               <h2 className="text-sm text-white/50 tracking-[0.5em] uppercase font-mono mb-4">Core Principles</h2>
               <div className="w-px h-16 bg-gradient-to-b from-white/80 to-transparent mx-auto shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <TiltCard 
                delay={0.1}
                icon={Cpu}
                title="Cognitive Engine"
                desc="A brutalist machine-learning algorithm trained on countless sacrifices. It perceives victory patterns invisible to human sight."
              />
              <TiltCard 
                delay={0.3}
                icon={Activity}
                title="SHAP Autopsy"
                desc="Dissect the black box. We expose the raw anatomy of a match—layer by layer—revealing why compositions fail or succeed."
              />
              <TiltCard 
                delay={0.5}
                icon={Target}
                title="Vanguard Counter"
                desc="Pre-emptive retaliation. The engine autonomously calculates the exact entity required to neutralize your greatest threat."
              />
            </div>
          </div>
        </section>

        <SlashDivider />

        {/* === HOW IT WORKS === */}
        <section className="py-40 relative z-20 bg-[#020202]/90 backdrop-blur-3xl overflow-hidden border-t border-white/10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
            <Feather size={800} strokeWidth={0.2} />
          </div>

          <div className="container mx-auto px-4 max-w-5xl relative z-10">
            <div className="text-center mb-28">
              <h2 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-widest font-serif drop-shadow-lg">
                The Protocol
              </h2>
              <p className="text-white/50 italic font-serif text-xl max-w-xl mx-auto">Three phases. Infinite possibilities. Total domination.</p>
            </div>

            <div className="space-y-24">
              {[
                { id: "I", title: "Establish Paradigm", desc: "Input the known variables. Solidify your allies and mark your enemies within the simulation matrix.", align: "left" },
                { id: "II", title: "Execute Algorithm", desc: "The engine runs thousands of parallel simulations, drawing upon historical bloodshed to calculate outcomes.", align: "right" },
                { id: "III", title: "Achieve Supremacy", desc: "Receive absolute clarity. The path to victory is mathematically defined and presented for execution.", align: "left" },
              ].map((step, i) => (
                <motion.div 
                  key={step.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`flex flex-col ${step.align === 'right' ? 'md:flex-row-reverse text-right' : 'md:flex-row text-left'} gap-12 items-center group`}
                >
                  <div className="text-8xl md:text-[10rem] font-black text-white/5 font-serif group-hover:text-white/30 transition-colors duration-700 select-none drop-shadow-xl">
                    {step.id}
                  </div>
                  <div className="flex-1 max-w-xl">
                    <h3 className="text-3xl font-black text-white uppercase tracking-widest mb-6 border-b border-white/20 pb-4">{step.title}</h3>
                    <p className="text-slate-300 text-lg leading-loose font-light italic">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* === CTA SECTION === */}
        <section className="py-40 relative flex items-center justify-center overflow-hidden border-y border-white/20 bg-black z-20">
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)]" />
          
          <div className="relative z-10 text-center px-4 max-w-4xl">
            <h2 className="text-5xl md:text-8xl font-black text-white mb-10 tracking-tighter uppercase font-serif drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              Embrace The <br/><span className="italic text-white/70">Inevitable</span>
            </h2>
            <Link href="/register">
              <button className="px-16 py-6 border-2 border-white/40 text-white font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_80px_rgba(255,255,255,0.8)] backdrop-blur-md">
                Initialize Sequence
              </button>
            </Link>
          </div>
          
          <motion.div 
            animate={{ width: ["0%", "100%", "0%"], left: ["0%", "0%", "100%"] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute top-0 h-[2px] bg-white pointer-events-none shadow-[0_0_15px_rgba(255,255,255,1)]"
          />
        </section>
      </div>
    </main>
  );
}