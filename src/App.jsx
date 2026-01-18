import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Activity, AlertTriangle, X, Zap, Users, Heart, 
  CheckCircle, Copy, Database, ArrowRightLeft, 
  Globe, Coins, ShieldCheck, TrendingUp
} from 'lucide-react';
import axios from 'axios';

const THEME_COLOR = '#3DDC84'; 
const API_BASE = 'https://real-time-global-exchange-rates.coder-manzoor.workers.dev/';

export default function App() {
  const [amount, setAmount] = useState('10');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('PKR');
  const [result, setResult] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [liveVisitors, setLiveVisitors] = useState(34);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVisitors(prev => Math.max(10, prev + (Math.floor(Math.random() * 3) - 1)));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const showNotify = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleConvert = async () => {
    if (!amount || isNaN(amount)) return showNotify("Enter valid amount");
    setIsConverting(true);
    try {
      const res = await axios.get(`${API_BASE}?From=${from.toUpperCase()}&Amount=${amount}&To=${to.toUpperCase()}`);
      if (res.data.ok) {
        setResult(res.data);
      }
    } catch (error) {
      showNotify("API Error. Try later.");
    } finally {
      setIsConverting(false);
    }
  };

  const swapCurrencies = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center font-sans bg-[#050505] text-white overflow-x-hidden relative">
      
      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
          <div className="absolute top-0 left-0 w-64 h-64 bg-green-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[120px]"></div>
      </div>

      {/* HEADER */}
      <header className="mb-8 text-center z-10 w-full">
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-white/5 border border-white/10">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em]">Secure Node Connected</span>
        </div>
        <motion.h1 className="text-4xl font-black tracking-tighter bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
          BJ.CONVERT
        </motion.h1>
      </header>

      {/* MAIN TOOL CARD */}
      <div className="w-full max-w-[400px] z-20">
        <div className="bg-[#0a0a0c] border border-white/10 p-1 rounded-[32px] shadow-2xl" style={{ borderColor: `${THEME_COLOR}40` }}>
          <div className="bg-[#111113] rounded-[28px] p-5 flex flex-col gap-5">
            
            {/* FROM 🔁 TO (FIXED ROW FOR MOBILE) */}
            <div className="flex items-center justify-between gap-2">
                {/* FROM BOX */}
                <div className="flex-1">
                    <label className="text-[9px] text-gray-500 font-bold mb-1.5 block tracking-widest text-center">FROM</label>
                    <input 
                        type="text" value={from} onChange={(e) => setFrom(e.target.value.toUpperCase())}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-2 text-center text-white focus:border-green-500/50 outline-none transition-all font-mono text-lg font-bold uppercase"
                        maxLength={4}
                    />
                </div>

                {/* SWAP BUTTON */}
                <div className="pt-5">
                    <button onClick={swapCurrencies} className="p-2.5 bg-green-500/10 rounded-full border border-green-500/20 text-green-400 active:rotate-180 transition-transform duration-500">
                        <ArrowRightLeft size={18} />
                    </button>
                </div>

                {/* TO BOX */}
                <div className="flex-1">
                    <label className="text-[9px] text-gray-500 font-bold mb-1.5 block tracking-widest text-center">TO</label>
                    <input 
                        type="text" value={to} onChange={(e) => setTo(e.target.value.toUpperCase())}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-2 text-center text-white focus:border-green-500/50 outline-none transition-all font-mono text-lg font-bold uppercase"
                        maxLength={4}
                    />
                </div>
            </div>

            {/* AMOUNT BOX (FULL WIDTH BELOW) */}
            <div className="w-full">
                <label className="text-[9px] text-gray-500 font-bold mb-1.5 block tracking-widest ml-1">AMOUNT</label>
                <div className="relative">
                    <input 
                        type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white focus:border-green-500/50 outline-none transition-all font-mono text-xl font-bold"
                        placeholder="0.00"
                    />
                    <Coins size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600" />
                </div>
            </div>

            {/* CONVERT BUTTON */}
            <button 
                onClick={handleConvert}
                disabled={isConverting}
                className="w-full py-4 bg-green-500 rounded-2xl text-black font-black tracking-widest hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(61,220,132,0.2)]"
            >
                {isConverting ? <Loader2 className="animate-spin" size={20} /> : <Zap size={18} fill="black" />}
                {isConverting ? "PROCESSING..." : "CONVERT NOW"}
            </button>

            {/* RESULT PANEL */}
            <AnimatePresence>
                {result && !isConverting && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="p-4 bg-green-500/5 border border-green-500/10 rounded-2xl text-center"
                    >
                        <div className="text-[10px] text-gray-500 font-mono mb-1">{amount} {from} =</div>
                        <div className="text-3xl font-black text-green-400 font-mono tracking-tighter">
                            {result.converted_amount} <span className="text-sm opacity-60">{to}</span>
                        </div>
                        <div className="text-[9px] text-gray-600 mt-2 font-mono italic">Rate: 1 {from} = {result.rate} {to}</div>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* QUICK STATS (MOBILE OPTIMIZED) */}
      <div className="w-full max-w-[400px] mt-6 grid grid-cols-2 gap-3 z-10 px-1">
          <div className="bg-white/5 border border-white/5 p-3 rounded-2xl flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Users size={16} /></div>
              <div>
                  <p className="text-[8px] text-gray-500 font-bold uppercase">Online</p>
                  <p className="text-xs font-mono font-bold">{liveVisitors}</p>
              </div>
          </div>
          <div className="bg-white/5 border border-white/5 p-3 rounded-2xl flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400"><Activity size={16} /></div>
              <div>
                  <p className="text-[8px] text-gray-500 font-bold uppercase">Uptime</p>
                  <p className="text-xs font-mono font-bold">99.9%</p>
              </div>
          </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-auto pt-10 pb-6 text-center z-10">
        <p className="text-[9px] text-gray-600 font-mono tracking-[0.3em] uppercase">
          © 2026 BJ.Tricks • Global Exchange
        </p>
        <div className="mt-4 flex justify-center gap-4">
            <motion.a href="https://t.me/BJ_Devs" whileTap={{scale: 0.9}} className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[10px] font-bold tracking-widest">
                <Heart size={12} className="text-red-500 fill-red-500" /> SUPPORT
            </motion.a>
        </div>
      </footer>

      {/* NOTIFICATION LAYER */}
      <AnimatePresence>
        {notification && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-24 z-50 px-4 w-full max-w-[400px]">
            <div className="bg-black/90 border border-white/10 p-3 rounded-xl flex items-center gap-3 shadow-2xl">
              <AlertTriangle size={16} className="text-red-500" />
              <p className="text-[10px] font-mono">{notification.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
