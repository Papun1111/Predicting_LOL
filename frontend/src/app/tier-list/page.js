"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Sword, Shield, Sparkles, Crosshair, Heart, Dagger } from 'lucide-react';
import Image from 'next/image';
import Navbar from '../../components/Navbar';
import api from '../../lib/api';
import Link from 'next/link';

// High-End Neon Tier Colors Mapping
const TIER_STYLES = {
  'S+': { color: 'text-[#ef4444]', bg: 'bg-[#ef4444]/10', border: 'border-[#ef4444]/50', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]' },
  'S':  { color: 'text-[#f97316]', bg: 'bg-[#f97316]/10', border: 'border-[#f97316]/50', glow: 'shadow-[0_0_20px_rgba(249,115,22,0.4)]' },
  'A':  { color: 'text-[#a855f7]', bg: 'bg-[#a855f7]/10', border: 'border-[#a855f7]/50', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.3)]' },
  'B':  { color: 'text-[#00f2ff]', bg: 'bg-[#00f2ff]/10', border: 'border-[#00f2ff]/30', glow: '' },
  'C':  { color: 'text-[#22c55e]', bg: 'bg-[#22c55e]/10', border: 'border-[#22c55e]/30', glow: '' },
  'D':  { color: 'text-slate-500', bg: 'bg-slate-500/10', border: 'border-slate-600/30', glow: '' },
};

// Available Roles
const ROLES = ['All', 'Fighter', 'Tank', 'Mage', 'Assassin', 'Marksman', 'Support'];

export default function TierListPage() {
  const [tierData, setTierData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('All'); 

  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const res = await api.get('/predict/tierlist'); 
        setTierData(res.data);
      } catch (err) {
        console.error("Failed to load tier list", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTiers();
  }, []);

  // Filter data before grouping
  const filteredData = tierData.filter(champ => 
    roleFilter === 'All' ? true : champ.tags && champ.tags.includes(roleFilter)
  );

  // Group filtered champions by tier
  const groupedTiers = filteredData.reduce((acc, champ) => {
    if (!acc[champ.tier]) acc[champ.tier] = [];
    acc[champ.tier].push(champ);
    return acc;
  }, {});

  const tierOrder = ['S+', 'S', 'A', 'B', 'C', 'D'];

  if (loading) return (
    <div className="min-h-screen bg-[#010a13] flex flex-col items-center justify-center text-[#00f2ff]">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="text-6xl mb-4"
        style={{ filter: "drop-shadow(0 0 20px #00f2ff)" }}
      >
        ❖
      </motion.div>
      <p className="font-mono text-xs tracking-[0.3em] animate-pulse">ANALYZING META DATA...</p>
    </div>
  );

  return (
    <main className="min-h-screen text-white pb-20 selection:bg-[#00f2ff]/30 relative overflow-hidden">
      <div className="relative z-10 w-full">
        <Navbar />

        <div className="container mx-auto px-4 py-10 max-w-7xl">
          
          {/* === HEADER === */}
          <div className="text-center mb-16 relative">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/50 bg-orange-500/10 text-orange-400 mb-6 shadow-[0_0_20px_rgba(249,115,22,0.2)] backdrop-blur-sm"
            >
              <Flame size={16} className="animate-pulse" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase">Live Meta Intelligence</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 relative inline-block"
            >
              <span className="relative z-10 drop-shadow-[0_0_30px_rgba(0,242,255,0.3)]">Algorithm</span>
              <br className="md:hidden" />
              {/* === ANIMATED GRADIENT TEXT === */}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ff] via-[#a855f7] to-[#ef4444] ml-0 md:ml-4">
                Tier List
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 max-w-2xl mx-auto font-light leading-relaxed text-sm md:text-base"
            >
              Champions ranked mathematically using <strong className="text-white">Win Rate</strong>, <strong className="text-white">Pick Rate</strong>, and <strong className="text-white">Ban Rate</strong> from our live 50,000+ match database.
            </motion.p>
          </div>

          {/* === ROLE FILTER BAR === */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2 md:gap-4 mb-16"
          >
            {ROLES.map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 border ${
                  roleFilter === role 
                  ? 'bg-gradient-to-r from-[#00f2ff]/20 to-[#a855f7]/20 border-[#00f2ff]/50 text-white shadow-[0_0_20px_rgba(0,242,255,0.3)] scale-105' 
                  : 'bg-black/40 backdrop-blur-sm border-white/5 text-slate-400 hover:bg-white/10 hover:text-white hover:border-[#a855f7]/50'
                }`}
              >
                {role}
              </button>
            ))}
          </motion.div>

          {/* === TIER LIST BOARD === */}
          <div className="space-y-6">
            <AnimatePresence>
              {tierOrder.map((tierLabel, rowIndex) => {
                const champs = groupedTiers[tierLabel];
                if (!champs || champs.length === 0) return null;
                
                const style = TIER_STYLES[tierLabel];

                return (
                  <motion.div 
                    layout 
                    initial={{ opacity: 0, scale: 0.98, x: -50 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.5, type: "spring", bounce: 0.2, delay: rowIndex * 0.1 }}
                    key={tierLabel}
                    className="flex flex-col md:flex-row bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative group"
                  >
                    {/* Background sheen for the row */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    {/* Tier Label Box (The Big Letter) */}
                    <div className={`w-full md:w-40 flex flex-col items-center justify-center py-8 px-4 border-b md:border-b-0 md:border-r border-white/5 relative overflow-hidden`}>
                      <div className={`absolute inset-0 ${style.bg} opacity-50`} />
                      <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                      
                      <h2 className={`text-6xl font-black ${style.color} relative z-10`} style={{ textShadow: `0 0 30px ${style.color}` }}>
                        {tierLabel}
                      </h2>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 mt-2 font-bold text-center relative z-10">
                        {tierLabel === 'S+' ? 'God Tier' : tierLabel === 'S' ? 'Overpowered' : tierLabel === 'A' ? 'Excellent' : tierLabel === 'D' ? 'Avoid' : 'Balanced'}
                      </span>
                    </div>

                    {/* Champions Grid Area */}
                    <div className="flex-1 p-4 md:p-6 z-10">
                      <motion.div layout className="flex flex-wrap gap-4">
                        <AnimatePresence>
                          {champs.map((champ, champIndex) => (
                            <motion.div
                              layout
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0 }}
                              transition={{ duration: 0.3, delay: champIndex * 0.05 }}
                              key={champ.id}
                              className="relative"
                            >
                              <Link href={`/dashboard/${champ.id}`}>
                                <motion.div 
                                  whileHover={{ scale: 1.15, y: -5, zIndex: 50 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="group relative w-[70px] h-[70px] md:w-[85px] md:h-[85px] rounded-xl overflow-hidden cursor-pointer border border-white/10 transition-colors duration-300"
                                  style={{ 
                                    // Make border color match tier on hover
                                    borderColor: "rgba(255,255,255,0.1)"
                                  }}
                                >
                                  {/* Base Image */}
                                  <Image 
                                    src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champ.key}_0.jpg`} 
                                    alt={champ.name}
                                    width={85}
                                    height={85}
                                    className="w-full h-full object-cover object-top"
                                    unoptimized // Fixes NextJS external image loading
                                  />

                                  {/* Glass Overlay with Stats (Visible always, clearer on hover) */}
                                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-6 pb-1 px-1 flex flex-col items-center justify-end transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <span className="font-bold text-[9px] uppercase tracking-wider text-white truncate w-full text-center leading-none mb-0.5" style={{ textShadow: "0 2px 4px black" }}>
                                      {champ.name}
                                    </span>
                                    <span className={`text-[8px] font-mono font-bold leading-none ${champ.winRate >= 50 ? 'text-[#00f2ff]' : 'text-[#ef4444]'}`}>
                                      {champ.winRate}% WR
                                    </span>
                                  </div>

                                  {/* Dynamic Hover Border Glow */}
                                  <div className={`absolute inset-0 border-2 border-transparent group-hover:border-[${style.color}] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                                  {/* Hover Data Tooltip (Pops up above) */}
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-[#010a13]/95 backdrop-blur-xl border border-white/20 rounded-lg p-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 z-[100] shadow-2xl flex flex-col gap-1">
                                    <div className="text-[10px] font-bold text-white text-center border-b border-white/10 pb-1 mb-1">{champ.name}</div>
                                    <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                      <span>Win:</span> <span className={champ.winRate >= 50 ? "text-[#00f2ff]" : "text-[#ef4444]"}>{champ.winRate}%</span>
                                    </div>
                                    <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                      <span>Pick:</span> <span className="text-white">{champ.pickRate}%</span>
                                    </div>
                                    <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                      <span>Ban:</span> <span className="text-[#f97316]">{champ.banRate}%</span>
                                    </div>
                                    {/* Triangle pointer */}
                                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#010a13]/95 border-b border-r border-white/20 rotate-45" />
                                  </div>

                                </motion.div>
                              </Link>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Empty State Fallback */}
          {Object.keys(groupedTiers).length === 0 && !loading && (
             <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="text-center py-24 border border-dashed border-[#00f2ff]/20 rounded-2xl bg-[#00f2ff]/5 backdrop-blur-sm mt-10"
              >
               <div className="text-4xl text-[#00f2ff]/40 mb-4 font-light">∅</div>
               <p className="text-slate-400 text-sm uppercase tracking-widest font-mono">
                 Insufficient metadata for <span className="text-[#00f2ff] font-bold">{roleFilter}</span> role
               </p>
             </motion.div>
          )}

        </div>
      </div>
    </main>
  );
}