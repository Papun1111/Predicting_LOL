"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Activity, Sword, BarChart2, BookDashedIcon, GraduationCap, Menu, X, Notebook } from "lucide-react";

export const getRouteColor = (path) => {
  if (!path) return "#e60000";
  if (path.startsWith("/predict")) return "#00f2ff";
  if (path.startsWith("/recommend") || path.startsWith("/draft-dojo")) return "#a855f7";
  if (path.startsWith("/history")) return "#10b981";
  if (path.startsWith("/dashboard")) return "#fbbf24";
  if (path.startsWith("/tier-list")) return "#f97316";
  if (path.startsWith("/research")) return "#6366f1";
  return "#e60000";
};

const links = [
  { name: "Predict", href: "/predict", icon: Sword },
  { name: "Drafter", href: "/recommend", icon: Activity },
  { name: "History", href: "/history", icon: BarChart2 },
  { name: "Dashboard", href: "/dashboard", icon: BookDashedIcon },
  { name: "Draft-Dojo", href: "/draft-dojo", icon: Sword },
  { name: "Tier List", href: "/tier-list", icon: GraduationCap },
  { name: "Research", href: "/research", icon: Notebook }
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  const activeColor = getRouteColor(pathname);

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
        className="sticky top-0 z-50 w-full backdrop-blur-lg border-b transition-colors duration-500"
        style={{
          backgroundColor: "rgba(5, 5, 5, 0.85)",
          borderColor: "rgba(255,255,255,0.08)"
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center relative z-50">
          
          <Link href="/">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-black tracking-tighter uppercase group flex items-center gap-0.5"
            >
              <span className="text-white group-hover:text-white transition-colors">
                Rift
              </span>
              <span className="transition-colors duration-500" style={{ color: activeColor }}>+</span>
              <span className="text-white group-hover:text-white transition-colors">
                Oracle
              </span>
            </motion.div>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden lg:flex items-center gap-8">
            {links.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              const linkColor = getRouteColor(link.href);
              
              return (
                <Link key={link.href} href={link.href} className="relative group flex items-center gap-2">
                  <Icon 
                    size={16} 
                    className="transition-colors duration-300"
                    style={{ color: isActive ? linkColor : undefined }}
                    // Apply gray text class via clsx-like logic, but inline styles override it when active
                    stroke={isActive ? linkColor : "currentColor"}
                    color={isActive ? linkColor : undefined}
                    {...(isActive ? {} : { className: "text-slate-500 group-hover:opacity-80 transition-opacity" })}
                  />
                  
                  {/* For inactive, we want text-slate-500 hover:text-white, but active is always white */}
                  <span 
                    className={`text-[11px] font-bold uppercase tracking-[0.15em] transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}
                  >
                    {link.name}
                  </span>
                  
                  {isActive && (
                    <motion.div 
                      layoutId="nav-glow-desktop"
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45"
                      style={{ 
                        backgroundColor: linkColor,
                        boxShadow: `0 0 10px ${linkColor}`
                      }}
                    />
                  )}
                </Link>
              );
            })}

            <div className="w-[1px] h-6 bg-white/10 ml-2" />
            <button 
              onClick={handleLogout}
              className="ml-2 p-2 rounded-full hover:bg-red-500/10 transition-colors group relative overflow-hidden"
              title="Logout"
            >
              <LogOut size={20} className="text-slate-500 group-hover:text-red-500 transition-colors relative z-10" />
            </button>
          </div>

          <button 
            className="lg:hidden text-white p-2 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="exit"
            className="fixed inset-0 z-40 bg-[#050505]/95 backdrop-blur-xl flex flex-col justify-center items-center px-6 pt-20"
          >
            <div className="absolute top-1/4 -left-20 w-64 h-64 bg-white/5 rounded-full blur-[100px] pointer-events-none" />
            <div 
              className="absolute bottom-1/4 -right-20 w-64 h-64 rounded-full blur-[100px] pointer-events-none transition-colors duration-1000"
              style={{ backgroundColor: activeColor, opacity: 0.15 }}
            />

            <div className="flex flex-col gap-8 w-full max-w-sm relative z-10">
              {links.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                const linkColor = getRouteColor(link.href);

                return (
                  <motion.div key={link.href} variants={linkVariants}>
                    <Link 
                      href={link.href} 
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-4 text-2xl font-black uppercase tracking-widest p-4 rounded-xl transition-all ${
                        isActive ? "text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                      style={isActive ? { 
                        backgroundColor: `${linkColor}15`, 
                        borderColor: `${linkColor}40`,
                        borderWidth: '1px'
                      } : { borderWidth: '1px', borderStyle: 'solid', borderColor: 'transparent' }}
                    >
                      <Icon size={24} style={{ color: isActive ? linkColor : undefined }} className={!isActive ? "text-slate-500" : ""} />
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