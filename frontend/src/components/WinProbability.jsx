"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function WinProbability({ probability }) {
  // probability is 0.0 to 1.0 (e.g., 0.65)
  const percentage = Math.round(probability * 100);
  const isBlueWin = probability >= 0.5;
  
  // Hard-coded Neon Colors
  const color = isBlueWin ? "#00f2ff" : "#ef4444"; // Cyan vs Red
  const glowColor = isBlueWin ? "rgba(0, 242, 255, 0.4)" : "rgba(239, 68, 68, 0.4)";

  // Animation State for the Number Counter
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1500; // 1.5 seconds animation
    const steps = 60;
    const increment = percentage / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= percentage) {
        setDisplayValue(percentage);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [percentage]);

  // SVG Circle Math
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (probability * circumference);

  return (
    <div className="flex flex-col items-center justify-center py-8 relative">
      {/* Background Glow Blob */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute w-48 h-48 rounded-full blur-[60px]"
        style={{ backgroundColor: glowColor, zIndex: 0 }}
      />

      {/* The Gauge Container */}
      <div className="relative w-64 h-64 z-10 flex items-center justify-center">
        
        {/* SVG Ring */}
        <svg className="w-full h-full rotate-[-90deg]">
          {/* Background Track */}
          <circle
            cx="128" cy="128" r={radius}
            fill="transparent"
            stroke="#091428" // Dark Navy
            strokeWidth="12"
          />
          
          {/* Animated Progress Bar */}
          <motion.circle
            cx="128" cy="128" r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 10px ${color})` }}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            className="text-6xl font-black tracking-tighter"
            style={{ color: "#ffffff", textShadow: `0 0 20px ${color}` }}
          >
            {displayValue}%
          </motion.span>
          
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-xs font-bold uppercase tracking-[0.2em] mt-2"
            style={{ color: color }}
          >
            {isBlueWin ? "Blue Advantage" : "Red Advantage"}
          </motion.span>
        </div>
      </div>

      {/* Aesthetic decorative lines below */}
      <div className="flex items-center gap-2 mt-4 opacity-50">
        <div className="w-12 h-[1px]" style={{ backgroundColor: color }} />
        <div className="w-2 h-2 rotate-45 border" style={{ borderColor: color }} />
        <div className="w-12 h-[1px]" style={{ backgroundColor: color }} />
      </div>
    </div>
  );
}