"use client";
import { motion } from "framer-motion";

export default function PredictionResult({ result }) {
  if (!result) return null;

  const winRate = (result.winProbability * 100).toFixed(1);
  const isBlueWin = result.winProbability > 0.5;
  const winColor = isBlueWin ? "#00f2ff" : "#ef4444"; // Cyan or Neon Red
  
  // Format SHAP explanations
  const shapData = Object.entries(result.explanation || {})
    .map(([feature, value]) => ({ feature, value }))
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 5); // Limit to top 5 factors

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="mt-8 space-y-10 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden shadow-2xl"
    >
      {/* Background glow behind the container */}
      <div 
        className="absolute top-0 right-0 w-64 h-64 bg-opacity-20 rounded-full blur-[100px] pointer-events-none"
        style={{ backgroundColor: winColor }}
      />
      <div 
        className="absolute bottom-0 left-0 w-64 h-64 bg-opacity-10 rounded-full blur-[100px] pointer-events-none"
        style={{ backgroundColor: isBlueWin ? "#ef4444" : "#00f2ff" }}
      />

      {/* Title */}
      <div className="text-center relative z-10">
        <h2 className="text-xl font-black uppercase tracking-widest text-white/90">
          Neural Prediction
        </h2>
        <div className="w-24 h-1 mx-auto mt-4 rounded-full" style={{ backgroundColor: winColor, boxShadow: `0 0 10px ${winColor}` }} />
      </div>

      {/* Main Win Rate Circle (The Core) */}
      <div className="flex flex-col items-center relative z-10">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="relative w-56 h-56 flex items-center justify-center cursor-crosshair group"
        >
          {/* Pulsing inner glow */}
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full blur-2xl"
            style={{ backgroundColor: winColor }}
          />
          
          <div className="z-10 text-center">
            <h2 
              className="text-7xl font-black tracking-tighter mix-blend-screen"
              style={{ color: winColor, textShadow: `0 0 30px ${winColor}` }}
            >
              {winRate}%
            </h2>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/50 mt-2">
              {isBlueWin ? "Blue Advantage" : "Red Advantage"}
            </p>
          </div>
          
          {/* Animated 3D Ring */}
          <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
            <circle
              cx="112" cy="112" r="104"
              fill="transparent"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="8"
            />
            <motion.circle
              cx="112" cy="112" r="104"
              fill="transparent"
              stroke={winColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="653" // 2 * PI * 104
              strokeDashoffset="653"
              animate={{ strokeDashoffset: 653 - (653 * result.winProbability) }}
              transition={{ duration: 2, ease: "easeOut" }}
              style={{ filter: `drop-shadow(0 0 15px ${winColor})` }}
            />
          </svg>
        </motion.div>
      </div>

      {/* X-Ray SHAP Factors */}
      <div className="relative z-10 mt-12 bg-black/60 p-6 rounded-xl border border-white/5">
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            X-Ray Analysis (SHAP)
          </h3>
          <span className="text-[10px] uppercase tracking-widest text-white/30">Impact Weight</span>
        </div>
        
        <div className="space-y-5">
          {shapData.map((item, index) => {
            const isPositive = item.value > 0;
            const barColor = isPositive ? "#00f2ff" : "#ef4444";
            // Scale the bar width aggressively so we can see small decimal changes
            const widthPercentage = Math.min(Math.abs(item.value) * 1500, 50);

            return (
              <motion.div 
                key={item.feature}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + (index * 0.15), type: "spring" }}
                className="group relative"
              >
                {/* Text Row */}
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-white/70 group-hover:text-white transition-colors">
                    {item.feature.replace(/_/g, " ").toUpperCase()}
                  </span>
                  <span style={{ color: barColor, textShadow: `0 0 5px ${barColor}` }}>
                    {isPositive ? "+" : ""}{item.value.toFixed(3)}
                  </span>
                </div>
                
                {/* Visual Bar Track */}
                <div className="h-1.5 w-full bg-slate-800/50 rounded-full relative overflow-hidden border border-white/5">
                   {/* Center Pivot Line */}
                   <div className="absolute left-[50%] top-0 bottom-0 w-[1px] bg-white/20 z-10" />
                   
                   {/* Growing Fill */}
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${widthPercentage}%` }}
                     transition={{ delay: 1 + (index * 0.1), duration: 1, ease: "easeOut" }}
                     className="absolute top-0 bottom-0 shadow-lg"
                     style={{ 
                       backgroundColor: barColor,
                       // If positive, anchor right from center. If negative, anchor left from center.
                       left: isPositive ? "50%" : `calc(50% - ${widthPercentage}%)`,
                       boxShadow: `0 0 10px ${barColor}`
                     }}
                   />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}