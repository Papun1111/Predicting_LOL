"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import Navbar from "../../components/Navbar";
import GlassCard from "../../components/GlassCard";
import ChampionPicker from "../../components/ChampionPicker";
import PredictButton from "../../components/PredictButton";
import WinProbability from "../../components/WinProbability";
import PredictionResult from "../../components/PredictionResult";
import XRayDashboard from "../../components/XRayDashboard";
import api from "../../lib/api";

export default function PredictPage() {
  const [blueTeam, setBlueTeam] = useState([]);
  const [redTeam, setRedTeam] = useState([]);
  
  // Summoner Spells State
  const [availableSpells, setAvailableSpells] = useState([]);
  const [blueSpells, setBlueSpells] = useState([]);
  const [redSpells, setRedSpells] = useState([]);
  const [tacticalWarning, setTacticalWarning] = useState("");
  const [spellError, setSpellError] = useState("");

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch Spells on Component Mount
  useEffect(() => {
    const fetchSpells = async () => {
      try {
        const res = await api.get("/predict/spells"); 
        if (res.data && res.data.length > 0) {
          setAvailableSpells(res.data);
          setSpellError("");
        } else {
          setSpellError("Backend returned empty spell data.");
        }
      } catch (err) {
        console.error("Failed to load summoner spells:", err);
        try {
          const fallbackRes = await api.get("/spells");
          if (fallbackRes.data && fallbackRes.data.length > 0) {
            setAvailableSpells(fallbackRes.data);
            setSpellError(""); 
          }
        } catch (fallbackErr) {
          setSpellError("Could not connect to Spells API.");
        }
      }
    };
    fetchSpells();
  }, []);

  // Toggle Spell Selection (Unique Selection via UI)
  const toggleSpell = (spellId, isBlue) => {
    const currentSpells = isBlue ? blueSpells : redSpells;
    const setSpells = isBlue ? setBlueSpells : setRedSpells;

    if (currentSpells.includes(spellId)) {
      setSpells(currentSpells.filter(id => id !== spellId));
    } else {
      if (currentSpells.length < 10) {
        setSpells([...currentSpells, spellId]);
      }
    }
  };

  const handlePredict = async () => {
    // 1. Validation
    if (blueTeam.length !== 5 || redTeam.length !== 5) {
      setError("Please select exactly 5 champions for both teams.");
      return;
    }
    
    setError("");
    setTacticalWarning("");
    setLoading(true);
    setPrediction(null);

    // 2. Tactical Analysis (Missing Smite Check)
    const hasSmite = (spellIds) => spellIds.some(id => {
      const spell = availableSpells.find(s => String(s.id) === String(id) || String(s.key) === String(id));
      return spell && spell.name.toLowerCase().includes("smite");
    });

    const blueHasSmite = hasSmite(blueSpells);
    const redHasSmite = hasSmite(redSpells);

    if (availableSpells.length > 0) {
      if (!blueHasSmite && !redHasSmite) {
        setTacticalWarning("CRITICAL: Neither team has Smite! Jungle objectives will be uncontrolled.");
      } else if (!blueHasSmite) {
        setTacticalWarning("WARNING: Blue Team has no Smite. The Enemy Jungler will secure all Dragons.");
      } else if (!redHasSmite) {
        setTacticalWarning("WARNING: Red Team has no Smite. Blue Team has guaranteed objective control.");
      }
    }

    // 3. Data Formatting for the Python AI Engine
    // This expands the simple UI toggle into a full 5-player roster representation
    const formatSpellsForAI = (spellIds) => {
      let formatted = [];
      const includesFlash = spellIds.some(id => String(id) === "4");
      const includesSmite = spellIds.some(id => String(id) === "11");

      // If they clicked Flash, simulate the standard 5 flashes for the team math
      if (includesFlash) formatted.push("4", "4", "4", "4", "4");
      // If they clicked Smite, add 1 Smite
      if (includesSmite) formatted.push("11");

      // Include anything else they clicked
      spellIds.forEach(id => {
        if (String(id) !== "4" && String(id) !== "11") formatted.push(id);
      });
      return formatted;
    };

    try {
      // 4. API Call
      const res = await api.post("/predict", {
        team1: blueTeam,
        team2: redTeam,
        team1Spells: formatSpellsForAI(blueSpells),
        team2Spells: formatSpellsForAI(redSpells)
      });
      
      setPrediction(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to generate prediction. Server might be offline.");
    } finally {
      setLoading(false);
    }
  };

  // Helper component for rendering spell selectors with Names
  const SpellSelector = ({ isBlue }) => {
    const selectedSpells = isBlue ? blueSpells : redSpells;
    const themeColor = isBlue ? "border-[#00f2ff] shadow-[0_0_10px_rgba(0,242,255,0.5)]" : "border-[#ef4444] shadow-[0_0_10px_rgba(239,68,68,0.5)]";
    const textColor = isBlue ? "text-[#00f2ff]" : "text-[#ef4444]";

    return (
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Select Team Spells (Optional)
          </h4>
          <span className="text-xs font-mono text-slate-500">{selectedSpells.length}/10</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {availableSpells.map((spell) => {
            const isSelected = selectedSpells.includes(spell.id) || selectedSpells.includes(spell.key);
            return (
              <div 
                key={spell.id || spell.key} 
                onClick={() => toggleSpell(spell.key || spell.id, isBlue)}
                className="flex flex-col items-center gap-1 w-[48px] cursor-pointer group"
              >
                <img 
                  src={spell.image} 
                  alt={spell.name}
                  title={spell.name}
                  className={`w-8 h-8 rounded transition-all duration-200 group-hover:scale-110 ${
                    isSelected ? `border-2 ${themeColor} opacity-100` : 'opacity-40 group-hover:opacity-80 grayscale'
                  }`}
                />
                <span className={`text-[9px] text-center leading-tight transition-colors ${
                  isSelected ? `${textColor} font-bold` : 'text-slate-500 group-hover:text-slate-300'
                }`}>
                  {spell.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#010a13] text-white pb-20">
      <Navbar />

      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-black text-center mb-12 tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ff] to-[#0061ff]"
        >
          MATCH PREDICTOR
        </motion.h1>

        {/* The Draft Arena */}
        <div className="grid lg:grid-cols-2 gap-12 relative">
          
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 bg-[#010a13] border border-[#00f2ff] rounded-full items-center justify-center font-black italic text-[#00f2ff] shadow-[0_0_20px_#00f2ff]">
            VS
          </div>

          <GlassCard title="BLUE TEAM" className="border-t-4 border-t-[#00f2ff] flex flex-col h-full">
            <div className="flex-grow">
              <ChampionPicker teamName="Ally Draft" selectedIds={blueTeam} onSelect={setBlueTeam} color="#00f2ff" />
            </div>
            {availableSpells.length > 0 ? (
              <SpellSelector isBlue={true} />
            ) : (
              spellError && <div className="mt-4 text-[10px] text-red-500 font-mono text-center">⚠ {spellError}</div>
            )}
          </GlassCard>

          <GlassCard title="RED TEAM" className="border-t-4 border-t-[#ef4444] flex flex-col h-full">
            <div className="flex-grow">
              <ChampionPicker teamName="Enemy Draft" selectedIds={redTeam} onSelect={setRedTeam} color="#ef4444" />
            </div>
            {availableSpells.length > 0 ? (
              <SpellSelector isBlue={false} />
            ) : (
              spellError && <div className="mt-4 text-[10px] text-red-500 font-mono text-center">⚠ {spellError}</div>
            )}
          </GlassCard>
        </div>

        {/* Action Area */}
        <div className="mt-12 max-w-md mx-auto">
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-center mb-4 font-bold uppercase tracking-widest">
              ⚠ {error}
            </motion.div>
          )}
          
          <PredictButton onClick={handlePredict} loading={loading} />
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {prediction && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="mt-16 flex flex-col gap-8"
            >
              {tacticalWarning && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-xl flex items-center gap-4 text-orange-400 font-bold tracking-wide"
                >
                  <AlertTriangle className="animate-pulse shrink-0" />
                  {tacticalWarning}
                </motion.div>
              )}

              <div className="grid md:grid-cols-2 gap-8 items-start">
                <GlassCard>
                  <h3 className="text-center text-[#00f2ff] font-bold uppercase tracking-widest mb-4">Win Probability</h3>
                  <WinProbability probability={prediction.winProbability} />
                </GlassCard>

                <GlassCard>
                  <h3 className="text-center text-[#c8aa6e] font-bold uppercase tracking-widest mb-4">Analysis Details</h3>
                  <PredictionResult result={prediction} />
                </GlassCard>
              </div>

              {/* The Dashboard will automatically render the new Spell Advantages here! */}
              {prediction.explanations && prediction.explanations.length > 0 && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                  <XRayDashboard explanations={prediction.explanations} />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}