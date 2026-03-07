"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Activity, Sword, BarChart2, BookDashedIcon, GraduationCap, Menu, X, Notebook } from "lucide-react";

const links = [
  { name: "Predict", href: "/predict", icon: Sword },
  { name: "Drafter", href: "/recommend", icon: Activity },
  { name: "History", href: "/history", icon: BarChart2 },
  { name: "Dashboard", href: "/dashboard", icon: BookDashedIcon },
  { name: "Draft-Dojo", href: "/draft-dojo", icon: Sword },
  { name: "Tier List", href: "/tier-list", icon: GraduationCap },
  { name: "Research", href: "/research", icon:Notebook  }
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // Mobile Menu Animation Variants
  const menuVariants = {
    closed: { opacity: 0, y: "-100%" },
    open: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20, staggerChildren: 0.1, delayChildren: 0.1 } 
    },
    exit: { 
      opacity: 0, 
      y: "-100%", 
      transition: { duration: 0.3 } 
    }
  };

  const linkVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <>
      <nav 
        className="sticky top-0 z-50 w-full backdrop-blur-lg border-b shadow-[0_4px_30px_rgba(0,242,255,0.05)]"
        style={{
          backgroundColor: "rgba(1, 10, 19, 0.85)",
          borderColor: "#00f2ff33" // Neon Blue with opacity
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center relative z-50">
          
          {/* LOGO */}
          <Link href="/">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-black tracking-widest italic group"
              style={{ color: "#fff" }}
            >
              <span className="group-hover:text-white transition-colors drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                RIFT
              </span>
              <span 
                className="transition-colors drop-shadow-[0_0_15px_rgba(0,242,255,0.8)]"
                style={{ color: "#00f2ff" }}
              >
                ORACLE
              </span>
            </motion.div>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden lg:flex items-center gap-8">
            {links.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              
              return (
                <Link key={link.href} href={link.href} className="relative group flex items-center gap-2">
                  <Icon size={16} color={isActive ? "#00f2ff" : "#5c6b7f"} className="group-hover:text-[#00f2ff] transition-colors" />
                  <span 
                    className="text-sm font-bold uppercase tracking-wider transition-colors group-hover:text-[#00f2ff]"
                    style={{ color: isActive ? "#00f2ff" : "#5c6b7f" }}
                  >
                    {link.name}
                  </span>
                  
                  {/* Glowing Underline Animation */}
                  {isActive && (
                    <motion.div 
                      layoutId="nav-glow-desktop"
                      className="absolute -bottom-2 left-0 w-full h-[2px]"
                      style={{ 
                        backgroundColor: "#00f2ff",
                        boxShadow: "0 0 10px #00f2ff, 0 0 20px #00f2ff" 
                      }} 
                    />
                  )}
                </Link>
              );
            })}

            {/* Desktop Logout Button */}
            <div className="w-[1px] h-6 bg-white/10 ml-2" /> {/* Divider */}
            <button 
              onClick={handleLogout}
              className="ml-2 p-2 rounded-full hover:bg-red-500/10 transition-colors group relative overflow-hidden"
              title="Logout"
            >
              <LogOut size={20} className="text-slate-500 group-hover:text-red-500 transition-colors relative z-10" />
            </button>
          </div>

          {/* MOBILE TOGGLE BUTTON */}
          <button 
            className="lg:hidden text-[#00f2ff] p-2 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* FULL-SCREEN MOBILE DROPDOWN MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="exit"
            className="fixed inset-0 z-40 bg-[#010a13]/95 backdrop-blur-xl flex flex-col justify-center items-center px-6 pt-20"
          >
            {/* Animated Background Decor */}
            <div className="absolute top-1/4 -left-20 w-64 h-64 bg-[#00f2ff]/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex flex-col gap-8 w-full max-w-sm relative z-10">
              {links.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;

                return (
                  <motion.div key={link.href} variants={linkVariants}>
                    <Link 
                      href={link.href} 
                      onClick={() => setIsOpen(false)} // ✅ FIX: Closes menu cleanly on click
                      className={`flex items-center gap-4 text-2xl font-black uppercase tracking-widest p-4 rounded-xl border border-transparent transition-all ${
                        isActive 
                        ? "bg-[#00f2ff]/10 border-[#00f2ff]/30 text-[#00f2ff] shadow-[0_0_20px_rgba(0,242,255,0.1)]" 
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon size={24} className={isActive ? "text-[#00f2ff]" : "text-slate-500"} />
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div variants={linkVariants} className="w-full h-[1px] bg-white/10 my-4" />

              <motion.button 
                variants={linkVariants}
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="flex items-center justify-center gap-3 text-red-500 text-xl font-bold uppercase tracking-widest p-4 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all w-full"
              >
                <LogOut size={24} />
                Disconnect
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}