"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { getChampions } from "../lib/championData";

export default function ChampionPicker({ teamName, selectedIds, onSelect, color = "#00f2ff" }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [allChamps] = useState(() => getChampions());
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter champions based on search
  const filteredChamps = allChamps.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleChamp = (id) => {
    if (selectedIds.includes(id)) {
      onSelect(selectedIds.filter(cid => cid !== id));
    } else {
      if (selectedIds.length < 5) {
        onSelect([...selectedIds, id]);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/10 pb-2">
        <h2 className="text-lg font-bold uppercase tracking-widest flex items-center gap-2" style={{ color }}>
          {/* Subtle glowing dot */}
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}></span>
          {teamName}
        </h2>
        <span className="text-xs text-slate-500 font-mono bg-black/50 px-2 py-1 rounded border border-white/5">
          {selectedIds.length} / 5
        </span>
      </div>

      {/* Selected Slots (The 5 Main Circles) */}
      <div className="flex gap-2 justify-between">
        {Array.from({ length: 5 }).map((_, i) => {
          const champId = selectedIds[i];
          const champ = champId ? allChamps.find(c => c.id === champId) : null;

          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExpanded(true)}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border flex items-center justify-center relative cursor-pointer overflow-hidden bg-black/60 backdrop-blur-md transition-all duration-300 shadow-lg"
              style={{ 
                borderColor: champ ? color : "rgba(255,255,255,0.05)",
                boxShadow: champ ? `0 0 15px ${color}40, inset 0 0 20px ${color}20` : "none"
              }}
            >
              {champ ? (
                <>
                  <motion.img 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={champ.icon} 
                    alt={champ.name} 
                    className="w-full h-full object-cover" 
                  />
                  {/* Hover Overlay for clear deletion */}
                  <div 
                    onClick={(e) => { e.stopPropagation(); handleToggleChamp(champ.id); }}
                    className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 hover:opacity-100 transition-opacity backdrop-blur-sm"
                  >
                    <X size={24} className="text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                  </div>
                </>
              ) : (
                <span className="text-2xl text-white/10 font-thin">+</span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Grid Toggle Button */}
      <motion.button
        whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full py-3 text-xs font-bold uppercase tracking-[0.2em] border-y border-white/5 text-slate-400 flex items-center justify-center gap-2"
      >
        {isExpanded ? "Close Database" : "Access Champion Database"}
      </motion.button>

      {/* Hero Grid (Expandable) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="overflow-hidden"
          >
            {/* Holographic Search Input */}
            <div className="relative mb-4 mt-2 group">
              <Search className="absolute left-3 top-3 text-slate-500 group-focus-within:text-white transition-colors" size={16} />
              <input
                type="text"
                placeholder="Initialize search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/80 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-white/40 transition-all shadow-inner font-mono"
              />
            </div>

            {/* 3D Glass Grid */}
            <div className="grid grid-cols-5 gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar p-1">
              {filteredChamps.map((champ) => {
                const isSelected = selectedIds.includes(champ.id);
                const isDisabled = !isSelected && selectedIds.length >= 5;

                return (
                  <motion.button
                    key={champ.id}
                    disabled={isDisabled}
                    onClick={() => handleToggleChamp(champ.id)}
                    // The 3D Hover Effect
                    whileHover={!isDisabled ? { scale: 1.1, zIndex: 10, y: -5 } : {}}
                    whileTap={!isDisabled ? { scale: 0.9 } : {}}
                    className={`relative w-full aspect-square rounded-md overflow-hidden transition-all duration-300 ${
                      isSelected 
                        ? `border-2 opacity-100 z-10` 
                        : isDisabled 
                          ? "opacity-20 grayscale brightness-50 cursor-not-allowed" 
                          : "opacity-70 border border-white/5 hover:opacity-100 hover:border-white/40 shadow-lg"
                    }`}
                    style={{ 
                      borderColor: isSelected ? color : undefined,
                      boxShadow: isSelected ? `0 10px 20px -10px ${color}` : "none"
                    }}
                  >
                    <img 
                      src={champ.icon} 
                      alt={champ.name} 
                      className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110" 
                    />
                    
                    {/* Champion Name Tooltip Overlay (Visible on Hover in CSS/Tailwind) */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-1 translate-y-full hover:translate-y-0 opacity-0 hover:opacity-100 transition-all duration-300">
                      <p className="text-[9px] font-bold text-center uppercase tracking-wider truncate">{champ.name}</p>
                    </div>

                    {/* Selection Checkmark Overlay */}
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-black/50 border flex items-center justify-center backdrop-blur-sm" style={{ borderColor: color }}>
                        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: color }} />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}