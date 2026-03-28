"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Shield, Bot, User, RefreshCw, Terminal } from 'lucide-react';
import Navbar from '../../components/Navbar';
import GlassCard from '../../components/GlassCard';
import api from '../../lib/api';
import Image from 'next/image';

// --- HELPER: AI TAUNTS ---
const getAiTaunt = (champName) => {
  const taunts = [
    `I am picking ${champName}. Try not to cry.`,
    `${champName} is mathematically superior to your choice.`,
    `Analyzing your weakness... ${champName} locked.`,
    `You left ${champName} open? Big mistake.`,
    `Counter-protocol initiated: ${champName}.`,
    `Calculations indicate ${champName} will ensure your defeat.`
  ];
  return taunts[Math.floor(Math.random() * taunts.length)];
};

export default function DraftDojoPage() {
  // Game State
  const [gameState, setGameState] = useState('START'); // START, DRAFTING, FINISHED
  const [turn, setTurn] = useState('USER'); // USER, AI
  const [blueTeam, setBlueTeam] = useState([]); // User
  const [redTeam, setRedTeam] = useState([]);   // AI
  const [logs, setLogs] = useState([]);
  const [allChamps, setAllChamps] = useState([]);
  const [filteredChamps, setFilteredChamps] = useState([]);
  const [search, setSearch] = useState('');
  const [winProb, setWinProb] = useState(0.5);
  const logsEndRef = useRef(null);

  // 1. Load Champions on Mount
  useEffect(() => {
    const loadChamps = async () => {
      try {
        const res = await api.get('/predict/champions');
        const sorted = res.data.sort((a, b) => a.name.localeCompare(b.name));
        setAllChamps(sorted);
        setFilteredChamps(sorted);
      } catch (err) {
        console.error("Failed to load champs", err);
      }
    };
    loadChamps();
  }, []);

  // 2. Filter Logic
  useEffect(() => {
    setFilteredChamps(
      allChamps.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, allChamps]);

  // 3. Auto-Scroll Logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // --- HELPER: PAD TEAM ARRAYS WITH 0 ---
  // This prevents the "400 Bad Request" error by ensuring arrays are always length 5
  const padTeam = (team) => {
    const ids = team.map(c => c.id);
    while (ids.length < 5) {
      ids.push(0); 
    }
    return ids;
  };

  // --- 4. END GAME FUNCTION ---
  // Defined here so it can be called inside the AI loop
  const endGame = async (finalRed, finalBlue) => {
    setGameState('FINISHED');
    const b = finalBlue || blueTeam;
    const r = finalRed || redTeam;
    
    // Final Prediction
    try {
      const res = await api.post('/predict', {
        team1: padTeam(b), // Use padTeam here to ensure exactly 5 champs
        team2: padTeam(r)
      });
      setWinProb(res.data.winProbability);
    } catch (e) {
      console.error("Prediction failed at end game:", e.response?.data || e.message);
    }
  };

  // --- 5. CORE GAME LOOP: AI TURN ---
  useEffect(() => {
    if (gameState === 'DRAFTING' && turn === 'AI') {
      const makeAiMove = async () => {
        try {
          // A. Prepare Data (No padding required for recommendation)
          const payload = {
            myTeam: redTeam.map(c => c.id),    // AI's current team (unpadded)
            enemyTeam: blueTeam.map(c => c.id), // User's current team (unpadded)
            side: 'red'                        // Hint to backend (optional)
          };

          console.log("🤖 AI Thinking...", payload);

          // B. Call API
          const res = await api.post('/recommend', payload);
          
          // C. Process Result
          // Handle different API response formats
          let aiPickId = null;
          
          if (res.data.recommendation) {
             aiPickId = res.data.recommendation.id || res.data.recommendation;
          } else if (Array.isArray(res.data)) {
             aiPickId = res.data[0];
          }

          // Find full object from ID
          const aiPick = allChamps.find(c => c.id === Number(aiPickId));

          // D. Execute Move (with delay for realism)
          setTimeout(() => {
            if (aiPick) {
              // Duplicate check
              if (redTeam.some(c => c.id === aiPick.id) || blueTeam.some(c => c.id === aiPick.id)) {
                 console.warn("AI tried duplicate, skipping turn to prevent lock.");
                 setTurn('USER');
                 return;
              }

              const newRedTeam = [...redTeam, aiPick];
              setRedTeam(newRedTeam);
              
              const taunt = getAiTaunt(aiPick.name);
              setLogs(prev => [...prev, { type: 'AI', msg: `🤖 ${taunt}` }]);
              
              // Check for Game Over OR Pass Turn
              if (newRedTeam.length === 5 && blueTeam.length === 5) {
                endGame(newRedTeam, blueTeam);
              } else {
                setTurn('USER');
              }
            } else {
               // API returned something weird, fallback to random
               console.warn("AI returned invalid pick, falling back to random.");
               fallbackRandomPick();
            }
          }, 1500);

        } catch (err) {
          console.error("AI Brain Freeze:", err.response?.data || err.message);
          fallbackRandomPick();
        }
      };
      
      const fallbackRandomPick = () => {
          const avail = allChamps.filter(c => !blueTeam.some(b=>b.id===c.id) && !redTeam.some(r=>r.id===c.id));
          const random = avail[Math.floor(Math.random() * avail.length)];
          if (random) {
             const newRedTeam = [...redTeam, random];
             setRedTeam(newRedTeam);
             setLogs(prev => [...prev, { type: 'AI', msg: `🤖 *Randomly overrides optimal path, selects ${random.name}*` }]);
             
             if (newRedTeam.length === 5 && blueTeam.length === 5) {
                endGame(newRedTeam, blueTeam);
             } else {
                setTurn('USER');
             }
          }
      };

      makeAiMove();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn, gameState, blueTeam, redTeam, allChamps]); 

  // --- USER ACTION ---
  const handleUserPick = (champ) => {
    // Validation
    if (gameState !== 'DRAFTING' || turn !== 'USER') return;
    if (blueTeam.some(c => c.id === champ.id) || redTeam.some(c => c.id === champ.id)) return;

    const newBlueTeam = [...blueTeam, champ];
    setBlueTeam(newBlueTeam);
    setLogs(prev => [...prev, { type: 'USER', msg: `Protocol Accepted: ${champ.name} locked.` }]);

    if (newBlueTeam.length === 5 && redTeam.length === 5) {
      endGame(redTeam, newBlueTeam);
    } else {
      setTurn('AI');
    }
  };

  const resetGame = () => {
    setBlueTeam([]);
    setRedTeam([]);
    setLogs([]);
    setTurn('USER');
    setGameState('DRAFTING');
    setWinProb(0.5);
  };

  return (
    <main className="min-h-screen text-white pb-20 selection:bg-[#a855f7]/30 relative overflow-hidden">
      {/* Contextual Route Background Glow (Fuchsia) */}
      <div className="absolute top-[-10%] right-[10%] w-[600px] h-[600px] bg-[#a855f7]/10 rounded-full blur-[150px] pointer-events-none z-[-1]" />
      <div className="relative z-10 w-full h-full flex flex-col">
        <Navbar />

        <div className="container mx-auto px-4 py-8 flex-1 flex flex-col max-w-7xl">
          
          {/* HEADER / SCOREBOARD */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-center bg-black/50 p-6 rounded-3xl border border-white/10 mb-8 backdrop-blur-xl sticky top-20 z-30 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
          >
            {/* User Side (BLUE) */}
            <div className="flex flex-col items-center md:items-start w-full md:w-1/3">
              <h2 className={`font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2 mb-4 ${turn === 'USER' && gameState === 'DRAFTING' ? 'text-[#00f2ff] drop-shadow-[0_0_8px_rgba(0,242,255,0.8)]' : 'text-slate-500'}`}>
                <User size={16} /> YOU (BLUE TEAM) {turn === 'USER' && gameState === 'DRAFTING' && <span className="animate-pulse">_WAITING FOR INPUT</span>}
              </h2>
              <div className="flex gap-3">
                 {[...Array(5)].map((_, i) => (
                   <div key={`blue-${i}`} className={`w-14 h-14 rounded-xl border-2 overflow-hidden relative shadow-lg ${turn === 'USER' && gameState === 'DRAFTING' && i === blueTeam.length ? 'border-[#00f2ff] bg-[#00f2ff]/10 shadow-[0_0_15px_rgba(0,242,255,0.3)] animate-pulse' : blueTeam[i] ? 'border-[#00f2ff]/50 bg-black' : 'border-white/5 bg-black/40'}`}>
                      {blueTeam[i] && (
                        <Image src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${blueTeam[i].key}_0.jpg`} unoptimized fill className="object-cover object-top" alt="champ" />
                      )}
                      {!blueTeam[i] && turn === 'USER' && gameState === 'DRAFTING' && i === blueTeam.length && (
                         <div className="absolute inset-0 flex items-center justify-center text-[#00f2ff]/50 font-mono text-xl">+</div>
                      )}
                   </div>
                 ))}
              </div>
            </div>

            {/* VS Badge */}
            <div className="text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-[#00f2ff] to-[#ef4444] my-6 md:my-0 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] relative">
              <span className="relative z-10">VS</span>
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-[#00f2ff] via-transparent to-[#ef4444] w-[200px] left-1/2 -translate-x-1/2 -z-10 opacity-30 blur-[2px]" />
            </div>

            {/* AI Side (RED) */}
            <div className="flex flex-col items-center md:items-end w-full md:w-1/3">
              <h2 className={`font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2 mb-4 ${turn === 'AI' && gameState === 'DRAFTING' ? 'text-[#ef4444] drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'text-slate-500'}`}>
                 {turn === 'AI' && gameState === 'DRAFTING' && <span className="animate-pulse">CALCULATING_ </span>} AI (RED TEAM) <Bot size={16} /> 
              </h2>
              <div className="flex gap-3 justify-end">
                 {[...Array(5)].map((_, i) => (
                   <div key={`red-${i}`} className={`w-14 h-14 rounded-xl border-2 overflow-hidden relative shadow-lg ${turn === 'AI' && gameState === 'DRAFTING' && i === redTeam.length ? 'border-[#ef4444] bg-[#ef4444]/10 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse' : redTeam[i] ? 'border-[#ef4444]/50 bg-black' : 'border-white/5 bg-black/40'}`}>
                      {redTeam[i] && (
                        <Image src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${redTeam[i].key}_0.jpg`} unoptimized fill className="object-cover object-top" alt="champ" />
                      )}
                      {!redTeam[i] && turn === 'AI' && gameState === 'DRAFTING' && i === redTeam.length && (
                         <div className="absolute inset-0 flex items-center justify-center text-[#ef4444]/50 font-mono text-xs text-center leading-none">...</div>
                      )}
                   </div>
                 ))}
              </div>
            </div>
          </motion.div>

          {/* --- STATE 1: START SCREEN --- */}
          <AnimatePresence mode="wait">
            {gameState === 'START' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center flex-1 text-center py-20"
              >
                <div className="relative mb-8">
                   <div className="absolute -inset-10 bg-[#a855f7]/20 blur-[100px] rounded-full pointer-events-none" />
                   <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter text-white drop-shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                     DRAFT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] via-[#d946ef] to-[#ec4899]">DOJO</span>
                   </h1>
                </div>
                <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl font-light">
                  Test your drafting protocols against the <span className="text-white font-bold">Neural Network</span>. Assume the role of Blue Side and outsmart the machine.
                </p>
                <button 
                  onClick={() => setGameState('DRAFTING')}
                  className="group relative px-12 py-5 bg-transparent overflow-hidden rounded-full font-bold uppercase tracking-[0.2em] text-white border border-[#a855f7]/50 shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:shadow-[0_0_50px_rgba(168,85,247,0.4)] transition-all duration-500 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#a855f7]/20 to-[#ec4899]/20 group-hover:from-[#a855f7]/40 group-hover:to-[#ec4899]/40 transition-colors" />
                  <span className="relative z-10 flex items-center gap-3">
                    <Sword size={20} className="text-[#a855f7]" /> Initialize Simulation
                  </span>
                </button>
              </motion.div>
            )}

            {/* --- STATE 2: DRAFTING --- */}
            {gameState === 'DRAFTING' && (
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-[60vh] pb-10"
              >
                
                {/* LEFT: CHAMPION SELECTOR */}
                <div className="lg:col-span-8 flex flex-col h-full">
                   <div className="relative group mb-6">
                     <div className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-[#a855f7] transition-colors">
                       <Shield size={20} />
                     </div>
                     <input 
                        type="text"
                        placeholder="Scan champion database..."
                        className="w-full bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white font-mono text-sm focus:border-[#a855f7]/50 focus:shadow-[0_0_20px_rgba(168,85,247,0.2)] outline-none transition-all"
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                     />
                   </div>
                   
                   <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex-1 overflow-hidden flex flex-col shadow-2xl">
                     <div className="flex-1 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-3 overflow-y-auto pr-4 custom-scrollbar">
                        <AnimatePresence>
                          {filteredChamps.map((champ, i) => {
                            const isTaken = blueTeam.some(c => c.id === champ.id) || redTeam.some(c => c.id === champ.id);
                            return (
                              <motion.button
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: isTaken ? 0.3 : 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                                key={champ.id}
                                disabled={isTaken || turn === 'AI'}
                                onClick={() => handleUserPick(champ)}
                                className={`relative aspect-[1/1.2] rounded-xl overflow-hidden border transition-all duration-300 ${
                                  isTaken ? 'grayscale border-transparent pointer-events-none' : 
                                  turn === 'AI' ? 'cursor-not-allowed border-white/5' :
                                  'hover:-translate-y-1 hover:border-[#a855f7]/80 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] border-white/10 cursor-pointer group'
                                }`}
                              >
                                <Image 
                                  src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champ.key}_0.jpg`} 
                                  fill
                                  unoptimized
                                  className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                                  alt={champ.name}
                                />
                                <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent" />
                                <div className="absolute inset-0 bg-[#a855f7] opacity-0 group-hover:opacity-20 mix-blend-overlay transition-opacity" />
                                <div className="absolute bottom-2 inset-x-0 text-center text-[9px] uppercase tracking-widest font-black text-white px-1">
                                  {champ.name}
                                </div>
                              </motion.button>
                            )
                          })}
                        </AnimatePresence>
                     </div>
                   </div>
                </div>

                {/* RIGHT: BATTLE LOG & TERMINAL */}
                <div className="lg:col-span-4 flex flex-col h-full min-h-[400px]">
                  <GlassCard className="flex-1 flex flex-col bg-black/80 border-white/10 shadow-2xl p-0 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-20" />
                    
                    <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/50 z-10">
                      <div className="flex items-center gap-3">
                        <Terminal size={16} className="text-[#a855f7]" />
                        <span className="font-mono text-[10px] uppercase text-slate-400 tracking-[0.2em] font-bold">Terminal Link</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="font-mono text-[10px] uppercase text-green-500 tracking-widest">Live</span>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 space-y-4 font-mono text-[11px] z-10 custom-scrollbar">
                      {logs.length === 0 && <div className="text-slate-600 italic">SYSTEM READY. AWAITING BLUE SIDE INPUT...</div>}
                      <AnimatePresence initial={false}>
                        {logs.map((log, i) => (
                          <motion.div 
                            initial={{ opacity: 0, x: 20, height: 0 }}
                            animate={{ opacity: 1, x: 0, height: 'auto' }}
                            key={i} 
                            className={`p-3 rounded-md border-l-2 backdrop-blur-sm ${
                              log.type === 'AI' 
                              ? 'bg-[#ef4444]/5 border-[#ef4444]/50 text-red-100 shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
                              : 'bg-[#00f2ff]/5 border-[#00f2ff]/50 text-cyan-100 shadow-[0_0_15px_rgba(0,242,255,0.1)]'
                            }`}
                          >
                            <span className={`font-black uppercase tracking-widest mr-2 ${log.type === 'AI' ? 'text-[#ef4444]' : 'text-[#00f2ff]'}`}>
                              [{log.type}]
                            </span> 
                            <span className="opacity-90 leading-relaxed">{log.msg}</span>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      <div ref={logsEndRef} className="h-4" />
                    </div>
                  </GlassCard>
                </div>
              </motion.div>
            )}

            {/* --- STATE 3: GAME OVER --- */}
            {gameState === 'FINISHED' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                className="flex items-center justify-center flex-1 py-10 z-50 relative"
              >
                <div className={`bg-black/80 backdrop-blur-3xl border-2 ${winProb > 0.5 ? 'border-green-500/50 shadow-[0_0_100px_rgba(34,197,94,0.3)]' : 'border-red-500/50 shadow-[0_0_100px_rgba(239,68,68,0.3)]'} p-12 rounded-3xl text-center max-w-3xl w-full relative overflow-hidden`}
                >
                  {/* Bg Glow */}
                  <div className={`absolute inset-0 opacity-20 pointer-events-none bg-gradient-to-b ${winProb > 0.5 ? 'from-green-500' : 'from-red-500'} to-transparent`} />
                  
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />

                  <h1 className="text-6xl font-black mb-4 relative z-10 tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
                    SIMULATION COMPLETE
                  </h1>
                  
                  <div className="text-xl font-mono text-slate-400 mb-12 relative z-10 tracking-[0.3em] uppercase">
                    Analyzing Predictor Outcome
                  </div>

                  <div className="grid grid-cols-2 gap-8 mb-12 relative z-10">
                    <div className="p-6 bg-black/50 border border-white/5 rounded-2xl relative overflow-hidden group">
                      <div className={`absolute inset-0 bg-gradient-to-t ${winProb > 0.5 ? 'from-green-500/10' : 'from-transparent'} to-transparent`} />
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Blue Side Probability</div>
                      <div className={`text-6xl font-black ${winProb > 0.5 ? 'text-green-400 drop-shadow-[0_0_20px_rgba(74,222,128,0.5)]' : 'text-slate-500'}`}>
                        {(winProb * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="p-6 bg-black/50 border border-white/5 rounded-2xl relative overflow-hidden group">
                      <div className={`absolute inset-0 bg-gradient-to-t ${winProb <= 0.5 ? 'from-red-500/10' : 'from-transparent'} to-transparent`} />
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Red Side Probability</div>
                      <div className={`text-6xl font-black ${winProb <= 0.5 ? 'text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'text-slate-500'}`}>
                        {((1 - winProb) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div className={`text-3xl font-black italic uppercase tracking-widest mb-12 relative z-10 ${winProb > 0.5 ? 'text-green-400' : 'text-red-500'}`}>
                    {winProb > 0.5 
                      ? "VICTORY: Neural Network Outsmarted" 
                      : "DEFEAT: Strategic Flaws Detected"}
                  </div>

                  <button 
                    onClick={resetGame}
                    className={`relative z-10 inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full text-black font-black uppercase tracking-widest transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] ${winProb > 0.5 ? 'bg-green-400' : 'bg-white'}`}
                  >
                    <RefreshCw size={20} /> Reboot Simulation
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </main>
  );
}