import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Activity, AlertTriangle, X, Zap, Users, Heart, 
  CheckCircle, Copy, Database, ArrowRightLeft, 
  Globe, Coins, ShieldCheck, TrendingUp
} from 'lucide-react';
import axios from 'axios';

// --- CONFIG ---
const THEME_COLOR = '#3DDC84'; 
const API_BASE = 'https://real-time-global-exchange-rates.coder-manzoor.workers.dev/';

export default function App() {
  const [amount, setAmount] = useState('10');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('PKR');
  const [result, setResult] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [liveVisitors, setLiveVisitors] = useState(48);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVisitors(prev => Math.max(15, prev + (Math.floor(Math.random() * 3) - 1)));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const showNotify = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleConvert = async () => {
    if (!amount || isNaN(amount)) return showNotify("Please enter valid amount");
    setIsConverting(true);
    try {
      const res = await axios.get(`${API_BASE}?From=${from.toUpperCase()}&Amount=${amount}&To=${to.toUpperCase()}`);
      if (res.data.ok) {
        setResult(res.data);
        showNotify("Rates Updated!", "success");
      }
    } catch (error) {
      showNotify("Connection Error!");
    } finally {
      setIsConverting(false);
    }
  };

  const swapCurrencies = () => {
    setFrom(to);
    setTo(from);
  };

  const statsConfig = [
    { label: 'Supported', value: '150+', icon: <Globe />, color: '#3b82f6' },
    { label: 'Precision', value: 'High', icon: <ShieldCheck />, color: '#f59e0b' },
    { label: 'Uptime', value: '99.9%', icon: <Zap />, color: '#10b981' },
    { label: 'Latency', value: '24ms', icon: <Activity />, color: '#d946ef' },
  ];

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center font-sans overflow-x-hidden relative bg-[#050505] text-white">
      
      {/* BG DECOR */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-green-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* NOTIFICATION */}
      <AnimatePresence>
        {notification && (
          <motion.div initial={{ y: -100 }} animate={{ y: 0 }} exit={{ y: -100 }} className="fixed top-6 z-50 w-[90%] max-w-md pointer-events-none">
            <div className="bg-black/90 border-l-4 p-4 rounded-r-lg flex items-center gap-3 pointer-events-auto shadow-2xl" style={{ borderColor: notification.type === 'error' ? '#ef4444' : THEME_COLOR }}>
              {notification.type === 'error' ? <AlertTriangle className="text-red-500" size={18}/> : <CheckCircle className="text-green-500" size={18}/>}
              <p className="text-[10px] font-mono uppercase tracking-widest">{notification.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <header className="mb-6 text-center z-10 w-full">
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-white/5 border border-white/10">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em]">Engine Active</span>
        </div>
        <motion.h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
          BJ.CURRENCY
        </motion.h1>
      </header>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full max-w-[500px] mb-6 z-10">
        {statsConfig.map((item, index) => (
          <div key={index} className="bg-[#0a0a0c] border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center" style={{ borderColor: `${item.color}20` }}>
             <div className="mb-1" style={{ color: item.color }}>{React.cloneElement(item.icon, { size: 16 })}</div>
             <div className="text-sm font-bold font-mono">{item.value}</div>
             <div className="text-[8px] uppercase tracking-widest opacity-50" style={{ color: item.color }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* MAIN TOOL */}
      <motion.div layout className="w-full max-w-[500px] z-20">
        <div className="bg-[#0a0a0c] border p-1 rounded-[32px] shadow-2xl" style={{ borderColor: `${THEME_COLOR}40` }}>
          <div className="bg-[#121214] rounded-[28px] p-5 sm:p-8 flex flex-col gap-6">
            
            {/* FROM 🔁 TO - FIXED SINGLE ROW FOR MOBILE */}
            <div className="flex items-center justify-between gap-2 sm:gap-4">
                <div className="flex-1">
                    <label className="text-[9px] text-gray-500 font-bold mb-2 block tracking-widest text-center">FROM</label>
                    <input 
                        type="text" value={from} onChange={(e) => setFrom(e.target.value.toUpperCase())}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-center text-white focus:border-green-500 outline-none transition-all font-mono text-lg font-bold uppercase"
                    />
                </div>

                <div className="pt-6">
                    <button onClick={swapCurrencies} className="p-3 bg-white/5 rounded-full text-green-400 border border-white/5 active:scale-90 transition-all">
                        <ArrowRightLeft size={20} />
                    </button>
                </div>

                <div className="flex-1">
                    <label className="text-[9px] text-gray-500 font-bold mb-2 block tracking-widest text-center">TO</label>
                    <input 
                        type="text" value={to} onChange={(e) => setTo(e.target.value.toUpperCase())}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-center text-white focus:border-green-500 outline-none transition-all font-mono text-lg font-bold uppercase"
                    />
                </div>
            </div>

            {/* AMOUNT BOX */}
            <div className="w-full">
                <label className="text-[9px] text-gray-500 font-bold mb-2 block tracking-widest ml-1">AMOUNT</label>
                <div className="relative">
                    <input 
                        type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:border-green-500 outline-none transition-all font-mono text-2xl font-bold"
                        placeholder="0.00"
                    />
                    <Coins size={22} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600" />
                </div>
            </div>

            {/* BUTTON */}
            <button 
                onClick={handleConvert} disabled={isConverting}
                className="w-full py-5 bg-green-500 rounded-2xl text-black font-black tracking-widest hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg"
            >
                {isConverting ? <Loader2 className="animate-spin" /> : <Zap size={20} fill="black" />}
                {isConverting ? "SYNCING..." : "CONVERT NOW"}
            </button>

            {/* RESULT */}
            <AnimatePresence>
                {result && !isConverting && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-green-500/5 border border-green-500/10 rounded-2xl relative overflow-hidden text-center">
                        <TrendingUp size={40} className="absolute top-0 right-0 opacity-10 p-2" />
                        <p className="text-gray-500 text-[9px] font-mono tracking-[0.2em] mb-1 uppercase">Exchange Result</p>
                        <div className="flex items-baseline justify-center gap-2">
                            <h3 className="text-4xl font-black text-white font-mono">{result.converted_amount}</h3>
                            <span className="text-green-400 font-bold">{to}</span>
                        </div>
                        <p className="text-[9px] text-gray-600 mt-2 font-mono italic">1 {from} = {result.rate} {to}</p>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* FOOTER STATS */}
      <div className="w-full max-w-[500px] grid grid-cols-2 gap-3 mt-8 z-10">
        <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
           <div>
              <p className="text-[9px] font-bold text-cyan-500/70 uppercase">Online</p>
              <h3 className="text-xl font-mono text-white font-bold">{liveVisitors}</h3>
           </div>
           <Users size={18} className="text-cyan-400" />
        </div>
        <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
           <div>
              <p className="text-[9px] font-bold text-green-500/70 uppercase">Requests</p>
              <h3 className="text-xl font-mono text-white font-bold">12.4k</h3>
           </div>
           <Database size={18} className="text-green-400" />
        </div>
      </div>

      <motion.a href="https://t.me/BJ_Devs" target="_blank" className="mt-8 flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-[10px] px-6 py-3 rounded-full shadow-xl z-50">
        <Heart size={14} fill="black" className="animate-pulse" /> SUPPORT
      </motion.a>

      <footer className="mt-12 opacity-30 text-[9px] font-mono tracking-widest text-center">
        © 2026 BJ.TRICKS • ENCRYPTED GATEWAY
      </footer>
    </div>
  );
}
