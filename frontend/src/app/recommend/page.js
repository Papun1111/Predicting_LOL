"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import Navbar from "../../components/Navbar";
import GlassCard from "../../components/GlassCard";
import ChampionPicker from "../../components/ChampionPicker";
import PredictButton from "../../components/PredictButton";
import api from "../../lib/api";

export default function RecommendPage() {
  const [myTeam, setMyTeam] = useState([]);
  const [enemyTeam, setEnemyTeam] = useState([]);
  const [suggestions, setSuggestions] = useState([]); // Must remain an array
  const [loading, setLoading] = useState(false);

  const handleRecommend = async () => {
    if (myTeam.length === 0) {
      alert("Select at least one champion for your team.");
      return;
    }
    if (myTeam.length === 5) {
      alert("Your team is full! Remove a champion to get suggestions.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/recommend", {
        myTeam,
        enemyTeam
      });

      // FIX: Check if res.data is an array. If it's an object, extract the array.
      // Adjust 'recommendations' to match the key your Python/Backend script sends.
      const data = Array.isArray(res.data) ? res.data : (res.data.recommendations || []);
      setSuggestions(data);
      
    } catch (err) {
      console.error("Recommendation Error:", err);
      setSuggestions([]); // Reset on error to prevent .map crash
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#010a13] text-white pb-20">
      <Navbar />

      <div className="container mx-auto px-4 py-10 grid lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Draft Input */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <h1 className="text-3xl font-black mb-6 tracking-widest text-[#00f2ff]">
              SMART DRAFTER
            </h1>
            <p className="text-slate-400 mb-8">
              Select your current teammates and the enemy team. The AI will recommend the perfect counter-pick or synergy pick.
            </p>
          </div>

          <GlassCard title="YOUR TEAM (Select 1-4)">
            <ChampionPicker 
              teamName="Allies" 
              selectedIds={myTeam} 
              onSelect={setMyTeam} 
              color="#00f2ff"
            />
          </GlassCard>

          <GlassCard title="ENEMY TEAM (Optional)">
            <ChampionPicker 
              teamName="Enemies" 
              selectedIds={enemyTeam} 
              onSelect={setEnemyTeam} 
              color="#ef4444"
            />
          </GlassCard>

          <PredictButton 
            onClick={handleRecommend} 
            loading={loading} 
            label="ANALYZE SYNERGY" 
          />
        </div>

        {/* RIGHT COLUMN: Suggestions Output */}
        <div className="lg:col-span-7">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="text-[#c8aa6e]" />
            <span className="tracking-widest text-[#c8aa6e]">AI RECOMMENDATIONS</span>
          </h2>

          <div className="space-y-4">
            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center text-cyan-400 gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
                <p className="animate-pulse">AI is calculating counters...</p>
              </div>
            ) : (
              <AnimatePresence>
                {/* Safe access using suggestions?.map */}
                {suggestions && suggestions.length > 0 ? (
                  suggestions.map((champ, index) => (
                    <motion.div
                      key={champ.id || index}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <GlassCard className="flex items-center gap-6 hover:bg-white/5 transition-colors group">
                        <div className="text-4xl font-black text-[#ffffff]/10 group-hover:text-[#00f2ff]/20 transition-colors">
                          #{index + 1}
                        </div>

                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white group-hover:text-[#00f2ff] transition-colors">
                            {champ.name}
                          </h3>
                          <div className="flex gap-2 mt-2">
                            {champ.roles && champ.roles.map(role => (
                              <span key={role} className="text-xs px-2 py-1 rounded bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/20">
                                {role}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs uppercase text-slate-500 tracking-widest">Synergy Score</div>
                          <div className="text-3xl font-mono font-bold text-[#00f2ff]">
                            {typeof champ.score === 'number' ? champ.score.toFixed(1) : "N/A"}
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))
                ) : (
                  <div className="h-64 border border-dashed border-white/10 rounded flex items-center justify-center text-slate-600">
                    Waiting for input...
                  </div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}