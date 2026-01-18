import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Activity, AlertTriangle, X, Zap, Users, Heart, 
  CheckCircle, Copy, Database, RefreshCcw, ArrowRightLeft, 
  TrendingUp, Globe, Coins, ShieldCheck
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

  // --- LIVE VISITORS ANIMATION ---
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVisitors(prev => {
        const change = Math.floor(Math.random() * 3) - 1;
        return Math.max(15, prev + change);
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const showNotify = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleConvert = async () => {
    if (!amount || isNaN(amount)) {
        showNotify("Please enter a valid numeric amount");
        return;
    }
    setIsConverting(true);
    try {
      const res = await axios.get(`${API_BASE}?From=${from.toUpperCase()}&Amount=${amount}&To=${to.toUpperCase()}`);
      if (res.data.ok) {
        setResult(res.data);
        showNotify("Rates Updated Successfully!", "success");
      } else {
        throw new Error("API Error");
      }
    } catch (error) {
      showNotify("Failed to fetch rates. Check connection.");
    } finally {
      setIsConverting(false);
    }
  };

  const swapCurrencies = () => {
    setFrom(to);
    setTo(from);
  };

  // --- STATS CONFIG (Aapki Web Jaisa Colorful) ---
  const statsConfig = [
    { label: 'Supported', value: '150+', icon: <Globe />, color: '#3b82f6' },
    { label: 'Precision', value: 'High', icon: <ShieldCheck />, color: '#f59e0b' },
    { label: 'Uptime', value: '99.9%', icon: <Zap />, color: '#10b981' },
    { label: 'Latency', value: '24ms', icon: <Activity />, color: '#d946ef' },
  ];

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center font-sans overflow-x-hidden relative bg-[#050505] text-white">
      
      {/* BACKGROUND PARTICLES */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-green-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* NOTIFICATION */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-6 left-0 right-0 mx-auto w-[90%] max-w-md z-50 pointer-events-none"
          >
            <div className="bg-black/90 backdrop-blur-xl border border-l-4 rounded-r-lg p-4 flex items-center gap-4 pointer-events-auto"
                 style={{ borderColor: notification.type === 'error' ? '#ef4444' : THEME_COLOR }}>
              <div className={notification.type === 'error' ? 'text-red-500' : 'text-green-500'}>
                {notification.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
              </div>
              <div className="flex-1">
                <p className="text-gray-300 text-xs font-mono uppercase tracking-tighter">{notification.message}</p>
              </div>
              <button onClick={() => setNotification(null)} className="text-gray-500"><X size={16} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <header className="mb-6 text-center flex flex-col items-center w-full max-w-2xl mx-auto z-10">
        <div className="flex justify-center items-center gap-2 mb-6 px-3 py-1 rounded-full bg-white/5 border border-white/5">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Exchange Engine Active</span>
        </div>
        
        <motion.h1 
          className="text-4xl md:text-6xl font-black tracking-tight mb-2 leading-tight bg-clip-text text-transparent bg-[length:200%_auto]"
          animate={{ backgroundImage: ["linear-gradient(to right, #ffffff, #a5f3fc, #ffffff)", "linear-gradient(to right, #a5f3fc, #ffffff, #a5f3fc)", "linear-gradient(to right, #ffffff, #a5f3fc, #ffffff)"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          style={{ backgroundImage: "linear-gradient(to right, #ffffff, #a5f3fc, #ffffff)" }}
        >
          BJ CURRENCY
        </motion.h1>
        
        <div className="flex items-center gap-3 mb-4">
           <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-green-500/50"></div>
           <h2 className="text-[10px] font-medium tracking-[0.5em] text-green-400/80 uppercase">REAL-TIME GLOBAL RATES</h2>
           <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-green-500/50"></div>
        </div>
      </header>

      {/* --- COLORFUL STATS GRID --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-3xl mb-8 z-10 px-2">
        {statsConfig.map((item, index) => (
          <motion.div
            key={index}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: index * 0.3 }}
            className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden group"
            style={{ borderColor: `${item.color}30` }}
          >
             <div className="mb-2 transition-transform group-hover:scale-110" style={{ color: item.color }}>
               {React.cloneElement(item.icon, { size: 20 })}
             </div>
             <div className="text-lg font-bold font-mono">{item.value}</div>
             <div className="text-[9px] uppercase tracking-widest opacity-60 font-bold" style={{ color: item.color }}>{item.label}</div>
          </motion.div>
        ))}
      </div>

      {/* --- MAIN CONVERTER AREA --- */}
      <motion.div layout className="w-full max-w-3xl mb-8 relative z-20">
        <div className="bg-[#0a0a0c] border p-1 rounded-3xl shadow-2xl transition-all duration-500" style={{ borderColor: THEME_COLOR }}>
          <div className="bg-[#121214] rounded-[22px] p-5 sm:p-8 flex flex-col gap-6">
            
            {/* ROW 1: FROM & TO WITH SWAP */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1 w-full">
                    <label className="text-[10px] text-gray-500 font-bold mb-2 block tracking-widest ml-1">FROM (SOURCE)</label>
                    <input 
                        type="text" value={from} onChange={(e) => setFrom(e.target.value.toUpperCase())}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-green-500 outline-none transition-all font-mono text-xl uppercase tracking-widest"
                        placeholder="USD"
                    />
                </div>

                <div className="pt-6">
                    <button onClick={swapCurrencies} className="p-4 bg-white/5 rounded-full hover:bg-green-500/20 text-green-400 border border-white/10 hover:border-green-500/50 transition-all active:scale-90">
                        <ArrowRightLeft size={24} />
                    </button>
                </div>

                <div className="flex-1 w-full">
                    <label className="text-[10px] text-gray-500 font-bold mb-2 block tracking-widest ml-1">TO (TARGET)</label>
                    <input 
                        type="text" value={to} onChange={(e) => setTo(e.target.value.toUpperCase())}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-green-500 outline-none transition-all font-mono text-xl uppercase tracking-widest"
                        placeholder="PKR"
                    />
                </div>
            </div>

            {/* ROW 2: AMOUNT */}
            <div className="w-full">
                <label className="text-[10px] text-gray-500 font-bold mb-2 block tracking-widest ml-1">AMOUNT TO CONVERT</label>
                <div className="relative">
                    <input 
                        type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-5 text-white focus:border-green-500 outline-none transition-all font-mono text-2xl"
                        placeholder="0.00"
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600">
                        <Coins size={24} />
                    </div>
                </div>
            </div>

            {/* ACTION BUTTON */}
            <button 
                onClick={handleConvert}
                disabled={isConverting}
                className="w-full py-5 bg-green-500 rounded-2xl text-black font-black tracking-[0.2em] hover:bg-green-400 hover:shadow-[0_0_30px_rgba(61,220,132,0.3)] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
                {isConverting ? <Loader2 className="animate-spin" /> : <Zap size={20} fill="black" />}
                {isConverting ? "SYNCHRONIZING..." : "EXECUTE CONVERSION"}
            </button>

            {/* RESULT DISPLAY */}
            <AnimatePresence>
                {result && !isConverting && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 p-6 bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <TrendingUp size={60} />
                        </div>
                        <p className="text-gray-400 text-[10px] font-mono tracking-widest mb-1">CONVERSION RESULT</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-4xl font-black text-white font-mono">{result.converted_amount}</h3>
                            <span className="text-green-400 font-bold text-lg">{to}</span>
                        </div>
                        <div className="mt-3 flex justify-between items-center border-t border-white/5 pt-3">
                            <span className="text-[10px] text-gray-500 font-mono">Rate: 1 {from} = {result.rate} {to}</span>
                            <button 
                                onClick={() => { navigator.clipboard.writeText(result.converted_amount); showNotify("Result Copied!", "success"); }}
                                className="text-[10px] flex items-center gap-1 text-green-400 hover:text-white transition-colors uppercase font-bold"
                            >
                                <Copy size={12} /> Copy
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

          </div>
        </div>
      </motion.div>

      {/* LIVE STATS FOOTER */}
      <div className="w-full max-w-3xl grid grid-cols-2 gap-4 z-10 mb-10">
        <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-5 flex items-center justify-between group">
           <div>
              <div className="flex items-center gap-2 mb-1">
                 <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                 <p className="text-[10px] font-bold tracking-widest text-cyan-500/70 uppercase">Online Users</p>
              </div>
              <h3 className="text-2xl font-mono text-white font-bold">{liveVisitors}</h3>
           </div>
           <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400 group-hover:rotate-12 transition-transform">
              <Users size={20} />
           </div>
        </div>

        <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-5 flex items-center justify-between group">
           <div>
              <div className="flex items-center gap-2 mb-1">
                 <div className="w-2 h-2 rounded-full bg-green-500"></div>
                 <p className="text-[10px] font-bold tracking-widest text-green-500/70 uppercase">Daily Requests</p>
              </div>
              <h3 className="text-2xl font-mono text-white font-bold">8.4k+</h3>
           </div>
           <div className="p-3 bg-green-500/10 rounded-xl text-green-400 group-hover:rotate-12 transition-transform">
              <Database size={20} />
           </div>
        </div>
      </div>

      {/* DONATE BUTTON */}
      <motion.a
        href="https://t.me/BJ_Devs" 
        target="_blank"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-xs px-5 py-3 rounded-full shadow-lg z-50 mb-10 md:fixed md:bottom-6 md:right-6 md:mb-0"
      >
        <Heart size={16} className="fill-black animate-pulse" />
        SUPPORT PROJECT
      </motion.a>

      <footer className="text-center opacity-30 pb-8 z-10">
        <p className="text-[10px] text-white font-mono tracking-[0.2em] mb-2 uppercase">
          © 2026 BJ Currency Converter • Secured by BJ_Devs
        </p>
      </footer>
    </div>
  );
}
