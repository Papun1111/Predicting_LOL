"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, CartesianGrid,
  LineChart, Line
} from 'recharts';
import { Network, Target, Activity, Cpu, Database, TrendingUp, Sparkles, Terminal } from 'lucide-react';
import Navbar from '../../components/Navbar';
import GlassCard from '../../components/GlassCard'; 
import api from '../../lib/api';

// Reusing global Custom Styles for consistency
const customStyles = `
  .animate-scanline {
    animation: scanl 8s linear infinite;
  }
  @keyframes scanl {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }
  /* Custom glowing scrollbar for this page */
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #010a13; }
  ::-webkit-scrollbar-thumb { background: #00f2ff; border-radius: 10px; box-shadow: 0 0 10px #00f2ff; }
`;

export default function ResearchPage() {
  const [metricsData, setMetricsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await api.get('/predict/metrics'); 
        setMetricsData(res.data);
      } catch (err) {
        console.error("Failed to load metrics", err);
        setError("Failed to fetch model metrics. Ensure the training script has been run and the backend is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center text-[#00f2ff] relative">
      <div className="w-16 h-16 border-4 border-[#00f2ff]/20 border-t-[#00f2ff] rounded-full animate-spin mb-6 drop-shadow-[0_0_15px_rgba(0,242,255,0.8)]" />
      <p className="font-mono tracking-[0.3em] animate-pulse text-[#00f2ff]/70 text-sm">ACCESSING ARCHIVES...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-transparent text-white flex flex-col items-center justify-center relative">
      <Navbar />
      <div className="bg-red-950/20 border border-red-500/50 text-red-500 p-10 rounded-xl max-w-lg text-center mt-20 backdrop-blur-md shadow-[0_0_40px_rgba(239,68,68,0.2)]">
        <Terminal size={48} className="mx-auto mb-6 opacity-80 animate-pulse" />
        <h2 className="text-2xl font-black mb-3 uppercase tracking-widest">Database Offline</h2>
        <p className="text-sm font-mono opacity-80">{error}</p>
      </div>
    </div>
  );

  // Extract the data securely
  const { models, roc_data } = metricsData || {};

  // Helper to shorten long model names for the X-Axis so they don't overlap
  const getShortName = (name) => {
    if (name === 'Stacking Ensemble') return 'Ensemble';
    if (name === 'Deep Learning (ANN)') return 'ANN';
    if (name === 'K-Nearest Neighbors') return 'KNN';
    if (name === 'Logistic Regression') return 'LogReg';
    if (name === 'Gradient Boosting') return 'GradBoost';
    return name;
  };

  // Formats data perfectly for the Bar Chart. 
  const chartData = models ? Object.keys(models).map(key => ({
    name: getShortName(key),
    originalName: key, // Keep original for tooltips
    Accuracy: (models[key]['Accuracy'] || 0) * 100,
    Precision: (models[key]['Precision'] || 0) * 100,
    Recall: (models[key]['Recall'] || 0) * 100,
    F1_Score: (models[key]['F1-Score'] || 0) * 100,
  })) : [];

  // Sort by accuracy so the chart looks like a nice staircase
  chartData.sort((a, b) => b.Accuracy - a.Accuracy);

  const rocKeys = roc_data && roc_data.length > 0 
    ? Object.keys(roc_data[0]).filter(k => k !== 'fpr') 
    : [];

  // Bright Cyberpunk Data Palette (Matches UI Colors)
  const colorPalette = {
    'STACKING ENSEMBLE': '#00f2ff', // Hero Cyan
    'XGBOOST': '#ec4899',           // Hero Pink
    'RANDOM FOREST': '#8b5cf6',     // Purple
    'GRADIENT BOOSTING': '#f59e0b', // Amber
    'LOGISTIC REGRESSION': '#3b82f6',// Blue
    'NAIVE BAYES': '#10b981',       // Emerald
    'K-NEAREST NEIGHBORS': '#64748b',// Slate
    'DEEP LEARNING (ANN)': '#ef4444' // Red
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#010a13]/95 border border-[#00f2ff]/30 p-4 rounded backdrop-blur-xl shadow-[0_0_30px_rgba(0,242,255,0.1)] font-mono">
          <p className="text-[#00f2ff] font-bold mb-3 border-b border-[#00f2ff]/20 pb-2 uppercase tracking-wider">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-xs font-bold flex justify-between gap-8 mb-1">
              <span>{entry.name.replace('_', '-')}:</span> 
              <span>{Number(entry.value).toFixed(2)}%</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <main className="min-h-screen bg-transparent text-white pb-32 overflow-hidden relative selection:bg-[#00f2ff] selection:text-black">
      
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      <div className="relative z-10 w-full">
        <Navbar />
        
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          
          {/* HEADER SECTION */}
          <div className="text-center mb-24 relative">
             <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 mb-8 backdrop-blur-xl shadow-[0_0_15px_rgba(236,72,153,0.2)]"
            >
              <Sparkles size={14} className="text-fuchsia-400 animate-pulse" />
              <span className="text-fuchsia-400/90 text-[10px] font-bold tracking-[0.4em] uppercase">Architecture Evaluation</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ff] via-fuchsia-400 to-orange-400 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              Neural <span className="italic text-white">Metrics</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-slate-300 max-w-2xl mx-auto flex items-center justify-center gap-2 font-mono text-sm tracking-widest uppercase"
            >
              <Database size={16} />
              Evaluating 8 Classifiers vs. Stacking Meta-Model
            </motion.p>
          </div>

          {/* 1. Bar Chart Comparison */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="relative bg-[#031118]/60 backdrop-blur-2xl border border-[#00f2ff]/20 p-6 md:p-10 rounded-2xl overflow-hidden group hover:border-[#00f2ff]/50 transition-all duration-500 shadow-2xl">
              
              {/* Inner Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00f2ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <h2 className="text-3xl font-black mb-10 flex items-center gap-4 text-[#00f2ff] uppercase tracking-widest">
                <Target size={30} className="text-[#00f2ff]/50" /> Performance Autopsy
              </h2>
              
              <div className="h-[500px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="2 2" stroke="rgba(0,242,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" angle={-25} textAnchor="end" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace', fontWeight: 'bold' }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                    <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,242,255,0.03)' }} />
                    <Legend wrapperStyle={{ paddingTop: '30px', fontFamily: 'monospace', fontSize: '11px', color: '#fff' }} formatter={(value) => <span className="text-white hover:text-white/70 transition-colors uppercase tracking-wider">{value.replace('_', '-')}</span>} />
                    
                    <Bar dataKey="Accuracy" fill="#00f2ff" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="Precision" fill="#ec4899" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="Recall" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="F1_Score" name="F1-Score" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* 1.5. ROC Curve Visualization */}
          {roc_data && roc_data.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-24"
            >
              <div className="relative bg-[#031118]/60 backdrop-blur-2xl border border-fuchsia-500/20 p-6 md:p-10 rounded-2xl overflow-hidden group hover:border-fuchsia-500/50 transition-all duration-500 shadow-2xl">
                
                <div className="absolute inset-0 bg-gradient-to-tl from-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                  <h2 className="text-3xl font-black flex items-center gap-4 text-fuchsia-400 uppercase tracking-widest">
                    <TrendingUp size={30} className="text-fuchsia-400/50" /> ROC Trajectories
                  </h2>
                </div>
                
                <div className="h-[550px] w-full relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={roc_data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="2 2" stroke="rgba(236,72,153,0.05)" />
                      <XAxis dataKey="fpr" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }} type="number" domain={[0, 1]} />
                      <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }} type="number" domain={[0, 1]} />
                      <RechartsTooltip contentStyle={{ backgroundColor: '#010a13', border: '1px solid rgba(236,72,153,0.2)', borderRadius: '12px', color: '#fff', backdropFilter: 'blur(10px)', boxShadow: '0 0 30px rgba(0,0,0,0.5)' }} itemStyle={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 'bold' }} labelStyle={{ display: 'none' }} />
                      <Legend wrapperStyle={{ paddingTop: '30px', fontFamily: 'monospace', fontSize: '11px' }} formatter={(value) => <span className="text-white hover:text-white/70 transition-colors uppercase tracking-wider">{value}</span>} />
                      
                      <Line type="monotone" dataKey="fpr" name="Random Guess" stroke="#475569" strokeDasharray="3 3" dot={false} strokeWidth={2} />
                      
                      {/* Dynamically render all 8 models */}
                      {rocKeys.map((key) => {
                        const isHero = key === 'STACKING ENSEMBLE' || key === 'XGBOOST';
                        return (
                          <Line 
                            key={key}
                            type="monotone" 
                            dataKey={key} 
                            name={key} 
                            stroke={colorPalette[key] || '#ffffff'} 
                            dot={false} 
                            strokeWidth={isHero ? 4 : 2} 
                            activeDot={isHero ? { r: 6, stroke: '#fff', strokeWidth: 2 } : false} 
                            strokeOpacity={isHero ? 1 : 0.6}
                            style={{ filter: isHero ? `drop-shadow(0 0 8px ${colorPalette[key]}80)` : 'none' }}
                          />
                        )
                      })}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. Confusion Matrices Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-12 px-2">
              <Network size={32} className="text-[#00f2ff]/50" />
              <div>
                <h2 className="text-3xl font-black text-[#00f2ff] uppercase tracking-widest font-mono">
                  Confusion Nodes
                </h2>
                <p className="text-slate-400 font-mono text-sm tracking-widest uppercase mt-1">Raw Classification Matrix</p>
              </div>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {models && Object.keys(models).map((key, index) => {
                const modelData = models[key];
                const isEnsemble = key === 'Stacking Ensemble';
                
                const tp = modelData['TP (Correct Blue)'];
                const fn = modelData['FN (Wrong Red)'];
                const fp = modelData['FP (Wrong Blue)'];
                const tn = modelData['TN (Correct Red)'];
                
                const acc = (modelData['Accuracy'] || 0) * 100;
                const aucScore = modelData['auc'] ? Number(modelData['auc']).toFixed(3) : "N/A";
                
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div 
                      className={`relative overflow-hidden p-6 md:p-8 transition-all duration-500 rounded-2xl border ${isEnsemble ? 'border-[#00f2ff]/40 shadow-[0_0_40px_rgba(0,242,255,0.15)] bg-[#00f2ff]/5' : 'border-white/10 hover:border-white/20 bg-[#010a13]/80 backdrop-blur-xl'} group`}
                    >
                      {/* Animated Corner Accents */}
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00f2ff]/30 group-hover:border-[#00f2ff] transition-colors duration-300" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00f2ff]/30 group-hover:border-[#00f2ff] transition-colors duration-300" />

                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-white/10">
                        <h3 className={`text-xl font-bold font-mono tracking-widest uppercase ${isEnsemble ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ff] transition-fuchsia-400 drop-shadow-[0_0_10px_rgba(0,242,255,0.8)]' : 'text-[#00f2ff]'} mb-4 md:mb-0`}>
                          {key}
                        </h3>
                        <div className="flex gap-3">
                          <span className="text-xs md:text-sm font-mono text-fuchsia-400 bg-fuchsia-400/10 px-4 py-1.5 rounded-sm border border-fuchsia-400/20 uppercase tracking-wider backdrop-blur-md">
                            AUC: {aucScore}
                          </span>
                          <span className={`text-xs md:text-sm font-mono px-4 py-1.5 rounded-sm border uppercase tracking-wider backdrop-blur-md ${isEnsemble ? 'bg-[#00f2ff] text-black border-[#00f2ff] shadow-[0_0_15px_rgba(0,242,255,0.4)]' : 'text-slate-300 bg-white/5 border-white/10'}`}>
                            ACC: {Number(acc).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 text-center text-[10px] md:text-xs font-mono uppercase tracking-[0.2em]">
                        
                        <div className="invisible"></div>
                        <div className="text-slate-500 py-3 border border-white/5 rounded-sm bg-white/5 flex items-center justify-center">Pred Blue</div>
                        <div className="text-slate-500 py-3 border border-white/5 rounded-sm bg-white/5 flex items-center justify-center">Pred Red</div>
                        
                        <div className="text-slate-500 flex items-center justify-center bg-[#00f2ff]/5 rounded-sm border border-[#00f2ff]/20 py-3">
                          <span className="writing-vertical md:writing-horizontal">Actual<br className="hidden md:block"/>Blue</span>
                        </div>
                        
                        {/* True Positive */}
                        <div className="bg-white/5 p-4 rounded-sm border border-white/10 flex flex-col justify-center transition-all group-hover:bg-[#00f2ff]/10 group-hover:border-[#00f2ff]/30">
                          <span className="block text-[#00f2ff]/70 mb-2">VALID (TP)</span>
                          <span className="text-2xl md:text-3xl font-black text-white">{tp}</span>
                        </div>
                        {/* False Negative */}
                        <div className="bg-white/5 p-4 rounded-sm border border-white/10 flex flex-col justify-center transition-all group-hover:bg-fuchsia-500/10 group-hover:border-fuchsia-500/30">
                          <span className="block text-fuchsia-400/70 mb-2">ERROR (FN)</span>
                          <span className="text-2xl md:text-3xl font-black text-white">{fn}</span>
                        </div>
                        
                        <div className="text-slate-500 flex items-center justify-center bg-fuchsia-500/5 rounded-sm border border-fuchsia-500/20 py-3">
                          <span className="writing-vertical md:writing-horizontal">Actual<br className="hidden md:block"/>Red</span>
                        </div>
                        
                        {/* False Positive */}
                        <div className="bg-white/5 p-4 rounded-sm border border-white/10 flex flex-col justify-center transition-all group-hover:bg-fuchsia-500/10 group-hover:border-fuchsia-500/30">
                          <span className="block text-fuchsia-400/70 mb-2">ERROR (FP)</span>
                          <span className="text-2xl md:text-3xl font-black text-white">{fp}</span>
                        </div>
                        {/* True Negative */}
                        <div className="bg-white/5 p-4 rounded-sm border border-white/10 flex flex-col justify-center transition-all group-hover:bg-[#00f2ff]/10 group-hover:border-[#00f2ff]/30">
                          <span className="block text-[#00f2ff]/70 mb-2">VALID (TN)</span>
                          <span className="text-2xl md:text-3xl font-black text-white">{tn}</span>
                        </div>

                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}