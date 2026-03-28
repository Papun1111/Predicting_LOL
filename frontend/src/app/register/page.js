"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { User, Lock, Mail } from "lucide-react";
import api from "../../lib/api";
import Navbar from "../../components/Navbar";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/register", formData);
      localStorage.setItem("user", JSON.stringify(res.data));
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen text-white flex flex-col relative overflow-hidden">
      <Navbar />

      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-[#e60000]/10 rounded-full blur-[120px]" />

      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 relative"
          style={{
            background: "rgba(10, 10, 10, 0.6)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
             {/* Aesthetic Corner Accents */}
             <div className="absolute top-0 left-0 w-2 h-2 bg-[#e60000]" />
             <div className="absolute top-0 right-0 w-2 h-2 bg-[#e60000]" />
             <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#e60000]" />
             <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#e60000]" />

            <h1 className="text-3xl font-black text-center mb-8 tracking-widest text-[#e60000]">
              NEW AGENT
            </h1>

          {error && <div className="text-red-500 text-center mb-4 font-mono text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <User className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-[#e60000]" size={20} />
              <input
                type="text"
                placeholder="CODENAME (USERNAME)"
                required
                className="w-full bg-[#0a0a0a]/50 border border-white/10 pl-12 pr-4 py-3 text-white focus:border-[#e60000]/50 outline-none font-mono text-sm transition-colors"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-[#e60000]" size={20} />
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                required
                className="w-full bg-[#0a0a0a]/50 border border-white/10 pl-12 pr-4 py-3 text-white focus:border-[#e60000]/50 outline-none font-mono text-sm transition-colors"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-[#e60000]" size={20} />
              <input
                type="password"
                placeholder="PASSWORD"
                required
                className="w-full bg-[#0a0a0a]/50 border border-white/10 pl-12 pr-4 py-3 text-white focus:border-[#e60000]/50 outline-none font-mono text-sm transition-colors"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-[#e60000] text-white font-bold py-3 uppercase tracking-widest hover:bg-[#cc0000] transition-colors"
            >
              {loading ? "REGISTERING..." : "INITIALIZE"}
            </motion.button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            ALREADY AN AGENT?{" "}
            <Link href="/login" className="text-[#e60000] hover:underline font-bold">
              LOGIN HERE
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}