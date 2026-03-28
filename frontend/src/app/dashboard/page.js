"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import Image from 'next/image';
import Navbar from '../../components/Navbar';

import api from '../../lib/api';
import Link from 'next/link';

export default function DashboardPage() {
  const [champions, setChampions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/predict/champions');
        const sorted = res.data.sort((a, b) => a.name.localeCompare(b.name));
        setChampions(sorted);
        setFiltered(sorted);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = champions;

    if (search) {
      result = result.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (roleFilter !== 'All') {
      result = result.filter(c => c.tags && c.tags.includes(roleFilter));
    }

    setFiltered(result);
  }, [search, roleFilter, champions]);

  const roles = ['All', 'Fighter', 'Tank', 'Mage', 'Assassin', 'Marksman', 'Support'];

  return (
    <main className="min-h-screen text-white pb-20 selection:bg-[#fbbf24]/30 relative overflow-hidden">
      {/* Contextual Route Background Glow (Gold) */}
      <div className="absolute top-0 right-0 w-full max-w-3xl h-[600px] bg-[#fbbf24]/5 blur-[150px] pointer-events-none z-[-1]" />

      <div className="relative z-10 w-full">
        <Navbar />

        <div className="container mx-auto px-4 py-10 max-w-7xl">
          
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-end gap-6 mb-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full lg:w-auto"
            >
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-2 relative">
                <span className="relative z-10 text-white drop-shadow-[0_0_30px_rgba(251,191,36,0.3)]">CHAMPION</span>
                <br className="md:hidden" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#d97706] ml-0 md:ml-4">
                  ROSTER
                </span>
              </h1>
              <p className="text-slate-400 mt-2 max-w-xl font-light text-sm md:text-base">
                Explore the <span className="text-[#fbbf24] font-bold">legends of Runeterra</span>. Search, filter, and analyze the heroes available for your draft.
              </p>
            </motion.div>

            {/* Search & Filter Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col w-full lg:w-auto gap-4"
            >
              <div className="relative group w-full lg:w-[400px]">
                <Search className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-[#fbbf24] transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Initialize search sequence..." 
                  className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl pl-12 pr-4 py-3 w-full focus:outline-none focus:border-[#fbbf24]/50 focus:shadow-[0_0_20px_rgba(251,191,36,0.2)] transition-all text-sm font-mono text-white"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
                {roles.map(role => (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-[0.1em] transition-all duration-300 border flex-shrink-0 ${
                      roleFilter === role 
                      ? 'bg-gradient-to-r from-[#fbbf24]/20 to-[#fbbf24]/5 border-[#fbbf24]/50 text-[#fbbf24] shadow-[0_0_15px_rgba(251,191,36,0.3)] scale-105' 
                      : 'bg-black/40 backdrop-blur-sm border-white/5 text-slate-400 hover:bg-white/10 hover:text-white hover:border-[#fbbf24]/30'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Grid Section */}
          {loading ? (
             <div className="flex flex-col items-center justify-center py-32 text-[#fbbf24]">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                 className="text-6xl mb-4"
                 style={{ filter: "drop-shadow(0 0 20px #fbbf24)" }}
               >
                 ❖
               </motion.div>
               <p className="font-mono text-xs tracking-[0.3em] animate-pulse">DECRYPTING ROSTER DATA...</p>
             </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              <AnimatePresence>
                {filtered.map((champ, index) => (
                  <motion.div
                    layout
                    key={champ.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }} // Cap delay
                  >
                    <Link href={`/dashboard/${champ.id}`} className="block h-full">
                      <motion.div 
                        whileHover={{ y: -10, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative h-full rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl transition-all duration-300 hover:border-[#fbbf24]/50 hover:shadow-[0_0_30px_rgba(251,191,36,0.2)] flex flex-col"
                      >
                        
                        {/* Image Container */}
                        <div className="h-64 w-full relative overflow-hidden bg-slate-900 border-b border-white/5">
                          <Image 
                            src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champ.key}_0.jpg`} 
                            alt={champ.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                          
                          {/* Inner Hover Glow */}
                          <div className="absolute inset-0 bg-[#fbbf24] mix-blend-overlay opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                        </div>

                        {/* Content Area */}
                        <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-2xl font-black text-white group-hover:text-[#fbbf24] transition-colors uppercase tracking-widest leading-none drop-shadow-md">
                            {champ.name}
                          </h3>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-3 truncate mt-1">
                            {champ.title}
                          </p>
                          
                          <div className="flex flex-wrap gap-2">
                            {champ.tags && champ.tags.map((tag) => (
                              <span key={tag} className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-black/60 border border-white/20 text-slate-300 group-hover:border-[#fbbf24]/30 transition-colors">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* ID Badge */}
                        <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white shadow-lg">
                          #{champ.key}
                        </div>

                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!loading && filtered.length === 0 && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }} 
               animate={{ opacity: 1, scale: 1 }} 
               className="text-center py-24 border border-dashed border-[#fbbf24]/20 rounded-2xl bg-[#fbbf24]/5 backdrop-blur-sm mt-10"
             >
              <div className="text-4xl text-[#fbbf24]/40 mb-4 font-light">∅</div>
              <p className="text-slate-400 text-sm uppercase tracking-widest font-mono">
                No intelligence found matching search criteria.
              </p>
            </motion.div>
          )}

        </div>
      </div>
    </main>
  );
}