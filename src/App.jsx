import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Activity, AlertTriangle, X, Zap, Users, Heart, 
  CheckCircle, Copy, Database, RefreshCcw, ArrowRightLeft, TrendingUp
} from 'lucide-react';
import axios from 'axios';

const THEME_COLOR = '#3DDC84'; 
const API_BASE = 'https://real-time-global-exchange-rates.coder-manzoor.workers.dev/';

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('1');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('PKR');
  const [result, setResult] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [history, setHistory] = useState([]);
  const [liveVisitors, setLiveVisitors] = useState(42);

  // Load History
  useEffect(() => {
    const saved = localStorage.getItem('bj_conv_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // Live Visitor Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVisitors(prev => Math.max(10, prev + (Math.floor(Math.random() * 3) - 1)));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const showNotify = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleConvert = async () => {
    if (!amount || isNaN(amount)) return showNotify("Enter valid amount", "error");
    
    setIsConverting(true);
    try {
      const res = await axios.get(`${API_BASE}?From=${from.toUpperCase()}&Amount=${amount}&To=${to.toUpperCase()}`);
      if (res.data.ok) {
        setResult(res.data);
        const newEntry = {
            id: Date.now(),
            ...res.data,
            date: new Date().toLocaleTimeString()
        };
        const updatedHistory = [newEntry, ...history].slice(0, 5);
        setHistory(updatedHistory);
        localStorage.setItem('bj_conv_history', JSON.stringify(updatedHistory));
      }
    } catch (err) {
      showNotify("Connection Error", "error");
    } finally {
      setIsConverting(false);
    }
  };

  const swapCurrencies = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center font-sans bg-[#050505] text-white overflow-x-hidden relative">
      
      {/* BACKGROUND PARTICLES */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-green-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* NOTIFICATION */}
      <AnimatePresence>
        {notification && (
          <motion.div initial={{ y: -100 }} animate={{ y: 0 }} exit={{ y: -100 }} className="fixed top-6 z-50 w-[90%] max-w-md">
            <div className="bg-black/90 border-l-4 p-4 rounded-r-lg flex items-center gap-3" style={{ borderColor: notification.type === 'error' ? '#ef4444' : THEME_COLOR }}>
              {notification.type === 'error' ? <AlertTriangle className="text-red-500" /> : <CheckCircle className="text-green-500" />}
              <p className="text-xs font-mono">{notification.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <header className="mb-8 text-center z-10">
        <div className="flex justify-center items-center gap-2 mb-4 px-3 py-1 rounded-full bg-white/5 border border-white/5 w-fit mx-auto">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Global Rates Live</span>
        </div>
        <motion.h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-2 bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
          BJ.CURRENCY
        </motion.h1>
        <h2 className="text-[10px] font-medium tracking-[0.5em] text-green-400/80 uppercase">SECURE EXCHANGE ENGINE</h2>
      </header>

      {/* CONVERTER CARD */}
      <motion.div layout className="w-full max-w-2xl z-20">
        <div className="bg-[#0a0a0c] border border-white/10 p-1 rounded-3xl shadow-2xl" style={{ borderColor: `${THEME_COLOR}50` }}>
          <div className="bg-[#121214] rounded-2xl p-6 flex flex-col gap-6">
            
            {/* INPUTS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
              <div className="md:col-span-2">
                <label className="text-[10px] text-gray-500 font-bold mb-2 block tracking-widest">AMOUNT</label>
                <input 
                  type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-green-500 outline-none transition-all font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] text-gray-500 font-bold mb-2 block tracking-widest">FROM</label>
                <input 
                  type="text" value={from} onChange={(e) => setFrom(e.target.value.toUpperCase())}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-green-500 outline-none uppercase font-mono"
                />
              </div>

              <div className="flex justify-center pb-2">
                <button onClick={swapCurrencies} className="p-3 bg-white/5 rounded-full hover:bg-green-500/20 text-green-400 transition-all">
                  <ArrowRightLeft size={20} />
                </button>
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] text-gray-500 font-bold mb-2 block tracking-widest">TO</label>
                <input 
                  type="text" value={to} onChange={(e) => setTo(e.target.value.toUpperCase())}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-green-500 outline-none uppercase font-mono"
                />
              </div>
            </div>

            <button 
              onClick={handleConvert}
              disabled={isConverting}
              className="w-full py-4 bg-green-500 rounded-xl text-black font-black tracking-widest hover:bg-green-400 transition-all flex items-center justify-center gap-2"
            >
              {isConverting ? <Loader2 className="animate-spin" /> : <Zap size={18} fill="black" />}
              {isConverting ? "FETCHING RATES..." : "CONVERT NOW"}
            </button>

            {/* RESULT AREA */}
            <AnimatePresence>
              {result && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-4 p-6 bg-green-500/10 border border-green-500/30 rounded-2xl text-center">
                  <div className="text-gray-400 text-xs font-mono mb-1">{amount} {from} =</div>
                  <div className="text-4xl font-black text-green-400 font-mono tracking-tighter">
                    {result.converted_amount} <span className="text-lg">{to}</span>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-2 font-mono">Rate: 1 {from} = {result.rate} {to}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* STATS FOOTER */}
      <div className="w-full max-w-2xl mt-8 grid grid-cols-2 gap-4 z-10">
        <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
           <div>
              <p className="text-[10px] font-bold text-cyan-500/70 uppercase mb-1">Live Users</p>
              <h3 className="text-xl font-mono font-bold">{liveVisitors}</h3>
           </div>
           <Users className="text-cyan-400" size={20} />
        </div>
        <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
           <div>
              <p className="text-[10px] font-bold text-green-500/70 uppercase mb-1">Conversions</p>
              <h3 className="text-xl font-mono font-bold">14.2K+</h3>
           </div>
           <TrendingUp className="text-green-400" size={20} />
        </div>
      </div>

      {/* DONATE */}
      <motion.a href="https://t.me/BJ_Devs" target="_blank" whileHover={{ scale: 1.05 }} className="mt-10 flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-xs px-6 py-3 rounded-full shadow-lg z-50">
        <Heart size={16} fill="black" /> DONATE TO SUPPORT
      </motion.a>

      <footer className="mt-10 opacity-30 text-[10px] font-mono tracking-widest">
        © 2026 BJ TRICKS • POWERED BY REAL-TIME ENGINE
      </footer>
    </div>
  );
}
