"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Lock, Mail } from "lucide-react";
import api from "../../lib/api";
import Navbar from "../../components/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", formData);
      localStorage.setItem("user", JSON.stringify(res.data));
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#010a13] text-white flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Background Decor */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#00f2ff]/5 rounded-full blur-[100px]" />

      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 relative"
          style={{
            background: "rgba(6, 20, 35, 0.6)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(0, 242, 255, 0.1)",
            boxShadow: "0 0 40px -10px rgba(0,0,0,0.5)"
          }}
        >
          {/* Aesthetic Corner Accents */}
          <div className="absolute top-0 left-0 w-2 h-2 bg-[#00f2ff]" />
          <div className="absolute top-0 right-0 w-2 h-2 bg-[#00f2ff]" />
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#00f2ff]" />
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#00f2ff]" />

          <h1 className="text-3xl font-black text-center mb-8 tracking-widest text-[#00f2ff]">
            ACCESS PORTAL
          </h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 mb-6 text-sm font-bold text-center uppercase tracking-wider">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-[#00f2ff] transition-colors" size={20} />
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                required
                className="w-full bg-[#010a13]/50 border border-white/10 text-white pl-12 pr-4 py-3 focus:outline-none focus:border-[#00f2ff] transition-colors font-mono text-sm"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-[#00f2ff] transition-colors" size={20} />
              <input
                type="password"
                placeholder="PASSWORD"
                required
                className="w-full bg-[#010a13]/50 border border-white/10 text-white pl-12 pr-4 py-3 focus:outline-none focus:border-[#00f2ff] transition-colors font-mono text-sm"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-[#00f2ff] text-[#010a13] font-bold py-3 uppercase tracking-widest hover:bg-[#00c8d6] transition-colors"
            >
              {loading ? "AUTHENTICATING..." : "LOGIN"}
            </motion.button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            NEW AGENT?{" "}
            <Link href="/register" className="text-[#00f2ff] hover:underline font-bold">
              REGISTER HERE
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}