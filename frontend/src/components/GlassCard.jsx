"use client";
import { motion } from "framer-motion";

export default function GlassCard({ children, title, className = "", accentColor = "#e60000" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden p-6 ${className}`}
      style={{
        background: "linear-gradient(180deg, rgba(10, 10, 10, 0.8) 0%, rgba(10, 10, 10, 0.4) 100%)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 0 40px -10px rgba(0, 0, 0, 0.5)",
      }}
    >
      {/* Decorative Corner Accents (Dynamic Route Color) */}
      <div className="absolute top-0 left-0 w-2 h-2 transition-colors duration-500" style={{ backgroundColor: accentColor }} />
      <div className="absolute top-0 right-0 w-2 h-2 transition-colors duration-500" style={{ backgroundColor: accentColor }} />
      <div className="absolute bottom-0 left-0 w-2 h-2 transition-colors duration-500" style={{ backgroundColor: accentColor }} />
      <div className="absolute bottom-0 right-0 w-2 h-2 transition-colors duration-500" style={{ backgroundColor: accentColor }} />

      {title && (
        <h3 
          className="mb-6 text-xl font-bold uppercase tracking-widest border-b pb-2"
          style={{ borderColor: "rgba(255, 255, 255, 0.08)", color: "#c8aa6e" }}
        >
          {title}
        </h3>
      )}

      {children}
    </motion.div>
  );
}