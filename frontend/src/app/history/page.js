"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Clock, Crosshair, Activity, AlertCircle } from "lucide-react";
import Navbar from "../../components/Navbar";
import api from "../../lib/api";
import Link from "next/link";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [championMap, setChampionMap] = useState({});
  const [spellMap, setSpellMap] = useState({}); // ✅ NEW: Store Spell Data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch History
        const historyRes = await api.get("predict/history"); 
        
        // 2. Fetch Champions
        const champsRes = await api.get("/predict/champions");
        const champDict = {};
        champsRes.data.forEach((c) => { champDict[c.id] = c; });

        // 3. ✅ NEW: Fetch Spells (with fallback handling)
        let spellsData = [];
        try {
          const spellsRes = await api.get("/predict/spells");
          spellsData = spellsRes.data;
        } catch (err) {
          const fallbackRes = await api.get("/spells");
          spellsData = fallbackRes.data;
        }
        
        const sMap = {};
        spellsData.forEach((s) => { sMap[s.id] = s; });

        // Set all state
        setChampionMap(champDict);
        setSpellMap(sMap);
        setHistory(historyRes.data);
        
      } catch (err) {
        console.error("Failed to load history:", err);
        setError("Failed to synchronize combat logs from the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
    }).format(date);
  };

  return (
    <main className="min-h-screen text-white pb-20 selection:bg-[#10b981]/30 relative overflow-hidden">
      
      {/* Background Ambience / Route Glow (Emerald) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[20%] -left-[10%] w-[40vw] h-[40vw] rounded-full bg-[#10b981]/5 blur-[120px]" />
        <div className="absolute bottom-[10%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-blue-900/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />
      </div>

      <div className="relative z-10">
        <Navbar />

        <div className="container mx-auto px-4 py-10 max-w-5xl">
          
          {/* Header */}
          <div className="mb-12 flex items-end justify-between border-b border-white/10 pb-6">
            <div>
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] mb-4 text-xs font-bold tracking-widest uppercase"
              >
                <Activity size={14} className="animate-pulse" />
                Database Synchronized
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">
                Combat <span className="text-[#10b981]">Logs</span>
              </h1>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-3 mb-8">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-[#10b981]/20 border-t-[#10b981] rounded-full animate-spin" />
              <p className="text-[#10b981] font-mono text-sm uppercase tracking-widest animate-pulse">Decrypting Records...</p>
            </div>
          )}

          {!loading && !error && history.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-32 bg-white/5 border border-dashed border-white/10 rounded-2xl backdrop-blur-sm"
            >
              <Crosshair size={48} className="mx-auto text-slate-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-300 mb-2">No Drafts Analyzed</h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-6">You haven&apos;t run any predictions yet. Head to the Predictor to analyze your first match.</p>
              <Link href="/predict">
                <button className="px-6 py-3 bg-[#10b981] text-black font-bold uppercase tracking-wider rounded hover:bg-white transition-colors">
                  Initiate Draft
                </button>
              </Link>
            </motion.div>
          )}

          {/* History List */}
          <div className="space-y-4">
            <AnimatePresence>
              {!loading && history.map((record, index) => {
                const blueWinProb = (record.winProbability * 100).toFixed(1);
                const isBlueFavored = record.winProbability >= 0.5;
                const topFactor = record.explanations && record.explanations.length > 0 ? record.explanations[0] : null;

                return (
                  <motion.div
                    key={record._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`relative overflow-hidden rounded-xl bg-black/40 border backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-2xl ${
                      isBlueFavored 
                      ? "border-blue-500/30 hover:border-blue-400/60 shadow-[0_0_15px_rgba(59,130,246,0.1)]" 
                      : "border-red-500/30 hover:border-red-400/60 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                    }`}
                  >
                    <div className={`absolute top-0 bottom-0 left-0 w-1 ${isBlueFavored ? 'bg-blue-500' : 'bg-red-500'}`} />

                    <div className="p-5 flex flex-col md:flex-row items-center justify-between gap-6 pl-6">
                      
                      {/* Left: Timestamp & Probability */}
                      <div className="flex flex-col items-center md:items-start min-w-[140px]">
                        <div className="flex items-center gap-1 text-slate-500 text-[10px] font-mono uppercase tracking-widest mb-2">
                          <Clock size={12} />
                          {formatDate(record.createdAt)}
                        </div>
                        <div className={`text-4xl font-black tracking-tighter ${isBlueFavored ? "text-blue-400" : "text-red-400"}`}>
                          {blueWinProb}%
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">
                          {isBlueFavored ? "Blue Favored" : "Red Favored"}
                        </div>
                      </div>

                      {/* Middle: The Teams & ✅ SPELLS */}
                      <div className="flex-1 flex flex-col items-center gap-3 w-full">
                        
                        {/* Blue Team Row */}
                        <div className="flex justify-center items-center gap-4 w-full p-2 bg-blue-900/10 rounded-lg border border-blue-500/10">
                          <div className="flex gap-2">
                            {record.team1.map((champId, i) => {
                              const champ = championMap[champId];
                              return (
                                <div key={`b-${i}`} className="w-10 h-10 rounded-full border-2 border-blue-500/50 overflow-hidden relative bg-slate-800" title={champ?.name}>
                                  {champ && <Image src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champ.key}_0.jpg`} alt={champ.name} fill className="object-cover object-top" sizes="40px" />}
                                </div>
                              );
                            })}
                          </div>
                          {/* ✅ NEW: Blue Spells */}
                          {record.team1Spells && record.team1Spells.length > 0 && (
                            <div className="flex flex-wrap max-w-[50px] gap-1 border-l border-blue-500/30 pl-3">
                              {record.team1Spells.map((sId, idx) => {
                                const spell = spellMap[sId];
                                return spell ? <img key={idx} src={spell.image} className="w-5 h-5 rounded opacity-80" title={spell.name} alt={spell.name} /> : null;
                              })}
                            </div>
                          )}
                        </div>

                        {/* Red Team Row */}
                        <div className="flex justify-center items-center gap-4 w-full p-2 bg-red-900/10 rounded-lg border border-red-500/10">
                          <div className="flex gap-2">
                            {record.team2.map((champId, i) => {
                              const champ = championMap[champId];
                              return (
                                <div key={`r-${i}`} className="w-10 h-10 rounded-full border-2 border-red-500/50 overflow-hidden relative bg-slate-800" title={champ?.name}>
                                  {champ && <Image src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champ.key}_0.jpg`} alt={champ.name} fill className="object-cover object-top" sizes="40px" />}
                                </div>
                              );
                            })}
                          </div>
                          {/* ✅ NEW: Red Spells */}
                          {record.team2Spells && record.team2Spells.length > 0 && (
                            <div className="flex flex-wrap max-w-[50px] gap-1 border-l border-red-500/30 pl-3">
                              {record.team2Spells.map((sId, idx) => {
                                const spell = spellMap[sId];
                                return spell ? <img key={idx} src={spell.image} className="w-5 h-5 rounded opacity-80" title={spell.name} alt={spell.name} /> : null;
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Key Insight (From SHAP explanations) */}
                      <div className="w-full md:w-64 bg-white/5 border border-white/10 rounded-lg p-3 flex flex-col justify-center">
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Deciding Factor</span>
                        {topFactor ? (
                          <>
                            <span className="text-sm font-bold text-white truncate">{topFactor.factor}</span>
                            <span className={`text-xs font-mono font-bold ${topFactor.impact > 0 ? "text-[#10b981]" : "text-red-400"}`}>
                              {topFactor.impact > 0 ? '+' : ''}{topFactor.impact} Impact
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-slate-400 italic">No advanced data saved.</span>
                        )}
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}