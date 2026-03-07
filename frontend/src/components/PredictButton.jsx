"use client";
import { motion } from "framer-motion";

export default function PredictButton({ onClick, loading }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={loading}
      whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(0, 242, 255, 0.4)" }}
      whileTap={{ scale: 0.95 }}
      className="w-full py-5 px-8 font-black tracking-[0.2em] text-lg uppercase transition-all relative overflow-hidden group"
      style={{
        backgroundColor: "rgba(0, 242, 255, 0.05)",
        border: "1px solid #00f2ff",
        color: "#00f2ff",
        textShadow: "0 0 10px rgba(0, 242, 255, 0.5)"
      }}
    >
      <span className="relative z-10">
        {loading ? "ANALYZING..." : "INITIATE PREDICTION"}
      </span>
      
      {/* Animated Background Sweep */}
      <div className="absolute inset-0 bg-[#00f2ff] opacity-0 group-hover:opacity-10 transition-opacity" />
    </motion.button>
  );
}