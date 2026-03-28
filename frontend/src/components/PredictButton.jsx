"use client";
import { motion } from "framer-motion";

export default function PredictButton({ onClick, loading, label, accentColor = "#e60000" }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={loading}
      whileHover={{ scale: 1.02, boxShadow: `0 0 30px ${accentColor}40` }}
      whileTap={{ scale: 0.95 }}
      className="w-full py-5 px-8 font-black tracking-[0.2em] text-lg uppercase transition-all relative overflow-hidden group"
      style={{
        backgroundColor: `${accentColor}10`, // 10% opacity
        border: `1px solid ${accentColor}80`, // 80% opacity
        color: accentColor,
      }}
    >
      <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
        {loading ? "ANALYZING..." : (label || "INITIATE PREDICTION")}
      </span>
      
      {/* Animated Background Sweep */}
      <div 
        className="absolute inset-0 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" 
        style={{ backgroundColor: accentColor }}
      />
    </motion.button>
  );
}