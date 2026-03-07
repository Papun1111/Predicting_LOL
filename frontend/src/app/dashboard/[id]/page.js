"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ArrowLeft, Shield, Sword, Sparkles, Activity, Crosshair, Skull } from 'lucide-react';
import Navbar from '../../../components/Navbar';
import GlassCard from '../../../components/GlassCard';
import api from '../../../lib/api';

export default function ChampionDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  // Safe ID extraction
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [champ, setChamp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChamp = async () => {
      if (!id) return;
      try {
        const res = await api.get(`/predict/champions/${id}`);
        setChamp(res.data);
      } catch (err) {
        console.error("Failed to load champion", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChamp();
  }, [id]);

  if (loading) return (
     <div className="min-h-screen flex flex-col items-center justify-center text-[#00f2ff]">
       <motion.div 
         animate={{ rotate: 360 }}
         transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
         className="text-6xl mb-4"
         style={{ filter: "drop-shadow(0 0 20px #00f2ff)" }}
       >
         ❖
       </motion.div>
       <p className="font-mono text-xs tracking-[0.3em] animate-pulse">DECRYPTING FILE DATA...</p>
     </div>
  );

  if (!champ) return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center">
      <h2 className="text-4xl font-black uppercase text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)] mb-4">File Corrupted</h2>
      <button onClick={() => router.back()} className="text-[#00f2ff] font-mono hover:underline uppercase tracking-widest text-sm">
        Return to Database
      </button>
    </div>
  );

  const winRate = champ.stats?.winRate || 0;
  const isGoodWinRate = winRate >= 0.5;

  return (
    <main className="min-h-screen text-white pb-20 relative overflow-hidden selection:bg-[#00f2ff]/30">
      
      {/* 1) Heavy Background Parallax Image */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30 mix-blend-screen overflow-hidden">
        <motion.div
           initial={{ scale: 1.1 }}
           animate={{ scale: 1 }}
           transition={{ duration: 1.5, ease: "easeOut" }}
           className="w-full h-full relative"
        >
          <Image
            src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ.key}_0.jpg`}
            alt={`${champ.name} Splash Art`}
            fill
            className="object-cover object-top"
            quality={60}
            priority
            unoptimized
          />
        </motion.div>
      </div>

      {/* 2) Dark Gradients & Blur to maintain readability */}
      <div className="fixed inset-0 bg-gradient-to-t from-[#010a13] via-[#010a13]/70 to-[#010a13]/20 z-0 pointer-events-none" />
      <div className="fixed inset-0 backdrop-blur-[2px] z-0 pointer-events-none" />

      <div className="relative z-10 w-full">
        <Navbar />

        <div className="container mx-auto px-4 py-8 lg:py-16 max-w-7xl">
          
          {/* Back Button */}
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="flex items-center gap-3 text-slate-300 hover:text-[#00f2ff] transition-colors mb-10 group uppercase text-xs font-bold tracking-[0.2em]"
          >
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-black/50 backdrop-blur-md group-hover:border-[#00f2ff] transition-colors shadow-lg">
              <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            </div>
            Back to Roster
          </motion.button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            
            {/* Left Column: Portrait & Stats Matrix */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] bg-black/80 backdrop-blur-xl relative group"
              >
                {/* Hero Portrait */}
                <div className="w-full aspect-[1/1.5] relative overflow-hidden">
                   <Image 
                     src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champ.key}_0.jpg`} 
                     alt={champ.name}
                     fill
                     className="object-cover object-top transition-transform duration-[2s] ease-out group-hover:scale-105"
                     priority
                     unoptimized
                   />
                   <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" />
                </div>
              </motion.div>

              {/* Holographic Stats Matrix */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-3 gap-3"
              >
                <div className="bg-black/60 backdrop-blur-xl border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
                  <div className={`absolute top-0 w-full h-[2px] ${isGoodWinRate ? 'bg-[#00f2ff]' : 'bg-[#ef4444]'} opacity-50 shadow-[0_0_10px_currentColor]`} />
                  <span className="text-[9px] uppercase tracking-widest text-slate-500 mb-1">Win Rate</span>
                  <span className={`text-2xl font-black ${isGoodWinRate ? 'text-[#00f2ff]' : 'text-[#ef4444]'} drop-shadow-[0_0_10px_currentColor]`}>
                    {(winRate * 100).toFixed(1)}%
                  </span>
                </div>
                
                <div className="bg-black/60 backdrop-blur-xl border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 w-full h-[2px] bg-white opacity-20 shadow-[0_0_10px_currentColor]" />
                  <span className="text-[9px] uppercase tracking-widest text-slate-500 mb-1">Pick Rate</span>
                  <span className="text-2xl font-black text-white relative z-10">
                    {((champ.stats?.pickRate || 0) * 100).toFixed(1)}%
                  </span>
                </div>
                
                <div className="bg-black/60 backdrop-blur-xl border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 w-full h-[2px] bg-[#f97316] opacity-50 shadow-[0_0_10px_currentColor]" />
                  <span className="text-[9px] uppercase tracking-widest text-slate-500 mb-1">Ban Rate</span>
                  <span className="text-2xl font-black text-[#f97316] drop-shadow-[0_0_10px_currentColor]">
                    {((champ.stats?.banRate || 0) * 100).toFixed(1)}%
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Information Data Terminal */}
            <div className="lg:col-span-8 flex flex-col">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                {/* Massive Typography Header */}
                <div className="mb-10 lg:mt-8">
                  <h2 className="text-[#00f2ff] font-mono text-xs tracking-[0.3em] uppercase mb-2">Subject ID: {champ.key}</h2>
                  <h1 className="text-7xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85] text-white drop-shadow-2xl">
                    {champ.name}
                  </h1>
                  <p className="text-xl lg:text-3xl font-light text-slate-400 mt-4 italic tracking-wide">
                    &quot;{champ.title}&quot;
                  </p>
                </div>

                {/* Cyberpunk Role Badges */}
                <div className="flex flex-wrap gap-3 mb-12">
                  {champ.tags && champ.tags.map((tag) => (
                    <div key={tag} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-white font-bold tracking-[0.1em] uppercase text-xs shadow-lg">
                      {tag === 'Fighter' && <Sword size={16} className="text-[#ef4444]" />}
                      {tag === 'Tank' && <Shield size={16} className="text-[#00f2ff]" />}
                      {tag === 'Mage' && <Sparkles size={16} className="text-[#a855f7]" />}
                      {tag === 'Assassin' && <Dagger size={16} className="text-[#ef4444]" />}
                      {tag === 'Marksman' && <Crosshair size={16} className="text-[#f97316]" />}
                      {tag === 'Support' && <Shield size={16} className="text-[#22c55e]" />}
                      <span>{tag}</span>
                    </div>
                  ))}
                </div>

                {/* Matchup Grids (Synergy vs Counter) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  
                  {/* Synergy Terminal */}
                  <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden group hover:border-[#00f2ff]/30 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#00f2ff]/5 to-transparent pointer-events-none" />
                    <h3 className="text-[#00f2ff] font-bold text-lg mb-4 flex items-center gap-2 border-b border-white/5 pb-4 uppercase tracking-widest">
                      <Sparkles size={18} /> High Synergy
                    </h3>
                    <div className="space-y-2">
                      {champ.stats?.synergies?.map((syn) => (
                        <div key={syn.id} className="flex justify-between items-center text-sm p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-default">
                          <div className="flex items-center gap-3">
                            <span className="text-white font-bold">{syn.id} <span className="text-slate-500 font-light text-xs ml-1">(Partner)</span></span>
                          </div>
                          <span className="text-[#00f2ff] font-mono font-bold">
                            {(syn.winRate * 100).toFixed(1)}% WR
                          </span>
                        </div>
                      )) || <div className="text-slate-500 font-mono text-xs p-4 bg-white/5 rounded-lg text-center">Insufficient Synergy Data</div>}
                    </div>
                  </div>

                  {/* Counter Terminal */}
                  <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden group hover:border-[#ef4444]/30 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#ef4444]/5 to-transparent pointer-events-none" />
                    <h3 className="text-[#ef4444] font-bold text-lg mb-4 flex items-center gap-2 border-b border-white/5 pb-4 uppercase tracking-widest">
                      <Skull size={18} /> Deep Threats
                    </h3>
                    <div className="space-y-2">
                      {champ.stats?.counters?.map((counter) => (
                        <div key={counter.id} className="flex justify-between items-center text-sm p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-default">
                          <div className="flex items-center gap-3">
                            <span className="text-white font-bold">{counter.id} <span className="text-slate-500 font-light text-xs ml-1">(Counter)</span></span>
                          </div>
                          <span className="text-[#ef4444] font-mono font-bold">
                            {(counter.winRate * 100).toFixed(1)}% WR
                          </span>
                        </div>
                      )) || <div className="text-slate-500 font-mono text-xs p-4 bg-white/5 rounded-lg text-center">Insufficient Counter Data</div>}
                    </div>
                  </div>
                </div>

                {/* System Specs Base */}
                <div className="bg-gradient-to-r from-black/80 to-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Activity size={100} />
                  </div>
                  
                  <h3 className="text-xl font-black text-white mb-8 border-b border-white/10 pb-4 uppercase tracking-widest inline-block">
                    System Architecture
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6 text-sm">
                    <div>
                      <span className="block text-slate-500 mb-2 uppercase tracking-[0.2em] text-[10px] font-bold">Internal Key</span>
                      <span className="text-white font-mono text-lg">{champ.key}</span>
                    </div>
                    <div>
                      <span className="block text-slate-500 mb-2 uppercase tracking-[0.2em] text-[10px] font-bold">Riot Node ID</span>
                      <span className="text-white font-mono text-lg inline-flex items-center gap-2">
                        {champ.id}
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] animate-pulse" />
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="block text-slate-500 mb-2 uppercase tracking-[0.2em] text-[10px] font-bold">Power Core</span>
                      <span className="text-[#a855f7] bg-[#a855f7]/10 px-3 py-1 rounded font-bold uppercase tracking-wider text-xs">
                          {champ.partype || "Mana / Energy Focus"} 
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/10">
                    <a 
                      href={`https://universe.leagueoflegends.com/en_US/champion/${champ.key.toLowerCase()}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#00f2ff] hover:text-white transition-colors uppercase font-bold text-xs tracking-[0.1em] px-6 py-3 border border-[#00f2ff]/30 rounded-full hover:bg-[#00f2ff]/10 hover:border-[#00f2ff]"
                    >
                      Authenticate Full Lore File <span>↗</span>
                    </a>
                  </div>
                </div>

              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}