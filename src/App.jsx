import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Activity, AlertTriangle, X, Zap, Users, BarChart3, Heart, 
  Smartphone, CheckCircle, ArrowLeft, ArrowRight, Download, Box, Star
} from 'lucide-react';
import axios from 'axios';

// --- CONFIG ---
const INITIAL_VISITORS = 14212;
const INITIAL_LINKS = 45902;
const THEME_COLOR = '#3DDC84'; // Android Green

const loadingLogs = [
  "Connecting to repository...",
  "Searching package index...",
  "Verifying signatures...",
  "Fetching metadata...",
  "Finalizing results..."
];

export default function App() {
  const [url, setUrl] = useState(""); // Stores Search Query
  const [isLoading, setIsLoading] = useState(false);
  
  // --- NEW STATES FOR PAGINATION ---
  const [results, setResults] = useState([]); // Stores Array of Apps
  const [currentIndex, setCurrentIndex] = useState(0); // Which app to show
  
  const [logIndex, setLogIndex] = useState(0);
  const [notification, setNotification] = useState(null);
  const [stats, setStats] = useState({ visitors: INITIAL_VISITORS, links: INITIAL_LINKS });

  useEffect(() => {
    let interval;
    if (isLoading) {
      setLogIndex(0);
      interval = setInterval(() => {
        setLogIndex((prev) => (prev < loadingLogs.length - 1 ? prev + 1 : prev));
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        visitors: prev.visitors + Math.floor(Math.random() * 3)
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const showNotify = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch (err) {
      showNotify("Clipboard access denied", "error");
    }
  };

  // --- SEARCH FUNCTION ---
  const handleExtract = async () => {
    if (!url) return showNotify("Please enter App Name!", "error");

    setIsLoading(true);
    setResults([]);
    setCurrentIndex(0);

    try {
      const response = await axios.post('/api/apps', { url: url });
      const data = response.data;
      
      if (Array.isArray(data) && data.length > 0) {
        setResults(data);
        setStats(prev => ({ ...prev, links: prev.links + 1 }));
      } else {
        showNotify("No apps found.", "error");
      }

    } catch (error) {
      console.error("Extraction Error:", error);
      let msg = error.response?.data?.error || error.message || "Server Error";
      showNotify(`ERROR: ${msg.substring(0, 80)}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // --- PAGINATION HANDLERS ---
  const handleNext = () => {
    if (currentIndex < results.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Current Active Item
  const result = results[currentIndex];

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center font-sans overflow-x-hidden relative bg-[#050505]">
      
      {/* NOTIFICATION */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ y: -100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -100, opacity: 0, scale: 0.9 }}
            className="fixed top-6 left-0 right-0 mx-auto w-[90%] max-w-md z-50 pointer-events-none"
          >
            <div className="bg-black/90 backdrop-blur-xl border border-l-4 rounded-r-lg shadow-[0_0_20px_rgba(0,0,0,0.5)] p-4 flex items-start gap-4 pointer-events-auto"
                 style={{ borderColor: notification.type === 'error' ? '#ef4444' : THEME_COLOR }}>
              <div className={`p-2 rounded-full bg-opacity-20 ${notification.type === 'error' ? 'bg-red-500 text-red-500' : 'bg-green-500 text-green-500'}`}>
                <AlertTriangle size={20} />
              </div>
              <div className="flex-1">
                <h4 className={`text-xs font-bold tracking-widest uppercase mb-1 ${notification.type === 'error' ? 'text-red-500' : 'text-green-400'}`}>
                  {notification.type === 'error' ? 'SYSTEM ALERT' : 'NOTIFICATION'}
                </h4>
                <p className="text-gray-300 text-xs font-mono leading-relaxed break-words">{notification.message}</p>
              </div>
              <button onClick={() => setNotification(null)} className="text-gray-500 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER - SAME AS ORIGINAL */}
      <header className="mb-10 text-center flex flex-col items-center w-full max-w-2xl mx-auto">
        <div className="flex justify-center items-center gap-2 mb-6 px-3 py-1 rounded-full bg-white/5 border border-white/5">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            System Operational
          </span>
        </div>
        
        <motion.h1 
          className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight mb-2 leading-tight bg-clip-text text-transparent bg-[length:200%_auto]"
          animate={{
            backgroundImage: [
              "linear-gradient(to right, #ffffff, #a5f3fc, #ffffff)",
              "linear-gradient(to right, #a5f3fc, #ffffff, #a5f3fc)",
              "linear-gradient(to right, #ffffff, #a5f3fc, #ffffff)"
            ]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          style={{ backgroundImage: "linear-gradient(to right, #ffffff, #a5f3fc, #ffffff)" }}
        >
          ZERONAUT.DOWNLOADER
        </motion.h1>
        
        <div className="flex items-center gap-3 mb-8">
           <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-green-500/50"></div>
           <h2 className="text-[10px] sm:text-xs font-medium tracking-[0.5em] text-green-400/80 uppercase whitespace-nowrap">
              NO WATERMARK ENGINE
           </h2>
           <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-green-500/50"></div>
        </div>
      </header>

      {/* INPUT AREA */}
      <motion.div layout className="w-full max-w-3xl mb-8 relative z-20">
        <div className="bg-[#0a0a0c] border border-white/10 p-1 rounded-2xl shadow-2xl transition-colors duration-500" style={{ borderColor: THEME_COLOR }}>
          <div className="bg-[#121214] rounded-xl p-4 sm:p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: THEME_COLOR }} />
                TARGET: <span style={{ color: THEME_COLOR }} className="font-bold uppercase">APK REPOSITORY</span>
              </span>
              {isLoading ? <span className="text-green-400 animate-pulse">{">"} {loadingLogs[logIndex]}</span> : <span>READY</span>}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 group">
                <input 
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Type App Name (e.g. PUBG, Instagram)..."
                  className="w-full h-12 bg-black/40 border border-white/5 rounded-lg px-4 pr-10 text-white outline-none focus:border-white/20 transition-all placeholder:text-gray-600 font-mono text-xs"
                />
              </div>
              <button 
                onClick={handleExtract}
                disabled={isLoading}
                className="h-12 px-8 rounded-lg font-bold text-black text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 hover:brightness-110 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,0,0,0.3)]"
                style={{ backgroundColor: THEME_COLOR }}
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} className="fill-black" />}
                <span>SEARCH</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* RESULT CARD */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={currentIndex} // Key change triggers animation on Next/Prev
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-3xl mb-8"
          >
            <div className="bg-[#0a0a0c] border border-white/10 rounded-2xl overflow-hidden">
              <div className="bg-white/5 px-6 py-3 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2 text-green-400 text-xs font-bold tracking-wider">
                  <CheckCircle size={14} />
                  RESULT {currentIndex + 1} / {results.length}
                </div>
                <div className="text-[10px] text-gray-500 font-mono">
                    Ver: {result.version}
                </div>
              </div>
              <div className="p-6 flex flex-col md:flex-row gap-6">
                
                {/* THUMBNAIL */}
                <div className="w-full md:w-1/3 aspect-square bg-black rounded-xl border border-white/5 relative overflow-hidden group shadow-lg flex items-center justify-center p-4">
                  <img src={result.icon} alt="Icon" className="w-full h-full object-contain" />
                  <div className="absolute bottom-2 left-2 text-[10px] text-white bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 flex items-center gap-1">
                     <Box size={10}/> {result.size_mb} MB
                  </div>
                </div>

                {/* INFO & ACTIONS */}
                <div className="flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="text-white font-bold text-xl mb-1 line-clamp-2 leading-snug">{result.name}</h3>
                    <p className="text-gray-400 text-xs flex items-center gap-1 mb-2">
                        <Smartphone size={12}/> {result.package}
                    </p>
                    <div className="flex items-center gap-4 text-[10px] text-gray-500 font-mono">
                        <span className="flex items-center gap-1 text-yellow-500"><Star size={10} className="fill-yellow-500"/> {result.rating}</span>
                        <span>DEV: {result.developer}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3 mt-auto">
                    {/* DOWNLOAD BUTTON */}
                    <a 
                        href={result.download_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all bg-green-500 hover:bg-green-400 text-black shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)]"
                    >
                         <Download size={16} /> DOWNLOAD APK
                    </a>

                    {/* PAGINATION BUTTONS */}
                    <div className="flex gap-2">
                        <button 
                            onClick={handlePrev}
                            disabled={currentIndex === 0}
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all border border-white/10 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed text-white"
                        >
                            <ArrowLeft size={14} /> PREV
                        </button>
                        <button 
                            onClick={handleNext}
                            disabled={currentIndex === results.length - 1}
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all border border-white/10 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed text-white"
                        >
                            NEXT <ArrowRight size={14} />
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REALTIME STATS */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl mt-12 grid grid-cols-2 gap-4"
      >
        <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-5 flex items-center justify-between group hover:border-cyan-500/20 transition-colors">
           <div>
              <div className="flex items-center gap-2 mb-1">
                 <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                 <p className="text-[10px] font-bold tracking-widest text-cyan-500/70 uppercase">Live Users</p>
              </div>
              <h3 className="text-2xl font-mono text-white font-bold">{stats.visitors.toLocaleString()}</h3>
           </div>
           <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400 group-hover:scale-110 transition-transform">
              <Users size={20} />
           </div>
        </div>

        <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-5 flex items-center justify-between group hover:border-green-500/20 transition-colors">
           <div>
              <div className="flex items-center gap-2 mb-1">
                 <div className="w-2 h-2 rounded-full bg-green-500"></div>
                 <p className="text-[10px] font-bold tracking-widest text-green-500/70 uppercase">Processed</p>
              </div>
              <h3 className="text-2xl font-mono text-white font-bold">{stats.links.toLocaleString()}</h3>
           </div>
           <div className="p-3 bg-green-500/10 rounded-xl text-green-400 group-hover:scale-110 transition-transform">
              <BarChart3 size={20} />
           </div>
        </div>
      </motion.div>

      {/* DONATE BUTTON */}
      <motion.a
        href="https://sociabuzz.com/zeronaut/tribe" 
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-xs px-5 py-3 rounded-full shadow-[0_0_20px_rgba(255,165,0,0.4)] hover:shadow-[0_0_30px_rgba(255,165,0,0.6)] transition-shadow cursor-pointer w-max mx-auto mt-10 md:fixed md:bottom-6 md:right-6 md:z-50 md:m-0"
      >
        <Heart size={16} className="fill-black animate-pulse" />
        DONATE
      </motion.a>

      <footer className="mt-16 text-center opacity-30 hover:opacity-100 transition-opacity pb-8">
        <p className="text-[10px] text-white font-mono tracking-[0.2em] mb-2">
          © 2026 ZeroNaut Downloader. All rights reserved.
        </p>
        <div className="flex items-center justify-center gap-2 text-[9px] text-white">
          <span>Powered by ZeroNaut</span>
        </div>
      </footer>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Activity, AlertTriangle, X, Zap, Users, BarChart3, Heart, 
  Smartphone, CheckCircle, ArrowLeft, ArrowRight, Download, Box, Star
} from 'lucide-react';
import axios from 'axios';

// --- CONFIG ---
const INITIAL_VISITORS = 14212;
const INITIAL_LINKS = 45902;
const THEME_COLOR = '#3DDC84'; // Android Green

const loadingLogs = [
  "Connecting to repository...",
  "Searching package index...",
  "Verifying signatures...",
  "Fetching metadata...",
  "Finalizing results..."
];

export default function App() {
  const [url, setUrl] = useState(""); // Stores Search Query
  const [isLoading, setIsLoading] = useState(false);
  
  // --- NEW STATES FOR PAGINATION ---
  const [results, setResults] = useState([]); // Stores Array of Apps
  const [currentIndex, setCurrentIndex] = useState(0); // Which app to show
  
  const [logIndex, setLogIndex] = useState(0);
  const [notification, setNotification] = useState(null);
  const [stats, setStats] = useState({ visitors: INITIAL_VISITORS, links: INITIAL_LINKS });

  useEffect(() => {
    let interval;
    if (isLoading) {
      setLogIndex(0);
      interval = setInterval(() => {
        setLogIndex((prev) => (prev < loadingLogs.length - 1 ? prev + 1 : prev));
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        visitors: prev.visitors + Math.floor(Math.random() * 3)
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const showNotify = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch (err) {
      showNotify("Clipboard access denied", "error");
    }
  };

  // --- SEARCH FUNCTION ---
  const handleExtract = async () => {
    if (!url) return showNotify("Please enter App Name!", "error");

    setIsLoading(true);
    setResults([]);
    setCurrentIndex(0);

    try {
      const response = await axios.post('/api/apps', { url: url });
      const data = response.data;
      
      if (Array.isArray(data) && data.length > 0) {
        setResults(data);
        setStats(prev => ({ ...prev, links: prev.links + 1 }));
      } else {
        showNotify("No apps found.", "error");
      }

    } catch (error) {
      console.error("Extraction Error:", error);
      let msg = error.response?.data?.error || error.message || "Server Error";
      showNotify(`ERROR: ${msg.substring(0, 80)}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // --- PAGINATION HANDLERS ---
  const handleNext = () => {
    if (currentIndex < results.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Current Active Item
  const result = results[currentIndex];

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center font-sans overflow-x-hidden relative bg-[#050505]">
      
      {/* NOTIFICATION */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ y: -100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -100, opacity: 0, scale: 0.9 }}
            className="fixed top-6 left-0 right-0 mx-auto w-[90%] max-w-md z-50 pointer-events-none"
          >
            <div className="bg-black/90 backdrop-blur-xl border border-l-4 rounded-r-lg shadow-[0_0_20px_rgba(0,0,0,0.5)] p-4 flex items-start gap-4 pointer-events-auto"
                 style={{ borderColor: notification.type === 'error' ? '#ef4444' : THEME_COLOR }}>
              <div className={`p-2 rounded-full bg-opacity-20 ${notification.type === 'error' ? 'bg-red-500 text-red-500' : 'bg-green-500 text-green-500'}`}>
                <AlertTriangle size={20} />
              </div>
              <div className="flex-1">
                <h4 className={`text-xs font-bold tracking-widest uppercase mb-1 ${notification.type === 'error' ? 'text-red-500' : 'text-green-400'}`}>
                  {notification.type === 'error' ? 'SYSTEM ALERT' : 'NOTIFICATION'}
                </h4>
                <p className="text-gray-300 text-xs font-mono leading-relaxed break-words">{notification.message}</p>
              </div>
              <button onClick={() => setNotification(null)} className="text-gray-500 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER - SAME AS ORIGINAL */}
      <header className="mb-10 text-center flex flex-col items-center w-full max-w-2xl mx-auto">
        <div className="flex justify-center items-center gap-2 mb-6 px-3 py-1 rounded-full bg-white/5 border border-white/5">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            System Operational
          </span>
        </div>
        
        <motion.h1 
          className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight mb-2 leading-tight bg-clip-text text-transparent bg-[length:200%_auto]"
          animate={{
            backgroundImage: [
              "linear-gradient(to right, #ffffff, #a5f3fc, #ffffff)",
              "linear-gradient(to right, #a5f3fc, #ffffff, #a5f3fc)",
              "linear-gradient(to right, #ffffff, #a5f3fc, #ffffff)"
            ]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          style={{ backgroundImage: "linear-gradient(to right, #ffffff, #a5f3fc, #ffffff)" }}
        >
          ZERONAUT.DOWNLOADER
        </motion.h1>
        
        <div className="flex items-center gap-3 mb-8">
           <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-green-500/50"></div>
           <h2 className="text-[10px] sm:text-xs font-medium tracking-[0.5em] text-green-400/80 uppercase whitespace-nowrap">
              NO WATERMARK ENGINE
           </h2>
           <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-green-500/50"></div>
        </div>
      </header>

      {/* INPUT AREA */}
      <motion.div layout className="w-full max-w-3xl mb-8 relative z-20">
        <div className="bg-[#0a0a0c] border border-white/10 p-1 rounded-2xl shadow-2xl transition-colors duration-500" style={{ borderColor: THEME_COLOR }}>
          <div className="bg-[#121214] rounded-xl p-4 sm:p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: THEME_COLOR }} />
                TARGET: <span style={{ color: THEME_COLOR }} className="font-bold uppercase">APK REPOSITORY</span>
              </span>
              {isLoading ? <span className="text-green-400 animate-pulse">{">"} {loadingLogs[logIndex]}</span> : <span>READY</span>}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 group">
                <input 
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Type App Name (e.g. PUBG, Instagram)..."
                  className="w-full h-12 bg-black/40 border border-white/5 rounded-lg px-4 pr-10 text-white outline-none focus:border-white/20 transition-all placeholder:text-gray-600 font-mono text-xs"
                />
              </div>
              <button 
                onClick={handleExtract}
                disabled={isLoading}
                className="h-12 px-8 rounded-lg font-bold text-black text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 hover:brightness-110 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,0,0,0.3)]"
                style={{ backgroundColor: THEME_COLOR }}
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} className="fill-black" />}
                <span>SEARCH</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* RESULT CARD */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={currentIndex} // Key change triggers animation on Next/Prev
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-3xl mb-8"
          >
            <div className="bg-[#0a0a0c] border border-white/10 rounded-2xl overflow-hidden">
              <div className="bg-white/5 px-6 py-3 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2 text-green-400 text-xs font-bold tracking-wider">
                  <CheckCircle size={14} />
                  RESULT {currentIndex + 1} / {results.length}
                </div>
                <div className="text-[10px] text-gray-500 font-mono">
                    Ver: {result.version}
                </div>
              </div>
              <div className="p-6 flex flex-col md:flex-row gap-6">
                
                {/* THUMBNAIL */}
                <div className="w-full md:w-1/3 aspect-square bg-black rounded-xl border border-white/5 relative overflow-hidden group shadow-lg flex items-center justify-center p-4">
                  <img src={result.icon} alt="Icon" className="w-full h-full object-contain" />
                  <div className="absolute bottom-2 left-2 text-[10px] text-white bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 flex items-center gap-1">
                     <Box size={10}/> {result.size_mb} MB
                  </div>
                </div>

                {/* INFO & ACTIONS */}
                <div className="flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="text-white font-bold text-xl mb-1 line-clamp-2 leading-snug">{result.name}</h3>
                    <p className="text-gray-400 text-xs flex items-center gap-1 mb-2">
                        <Smartphone size={12}/> {result.package}
                    </p>
                    <div className="flex items-center gap-4 text-[10px] text-gray-500 font-mono">
                        <span className="flex items-center gap-1 text-yellow-500"><Star size={10} className="fill-yellow-500"/> {result.rating}</span>
                        <span>DEV: {result.developer}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3 mt-auto">
                    {/* DOWNLOAD BUTTON */}
                    <a 
                        href={result.download_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all bg-green-500 hover:bg-green-400 text-black shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)]"
                    >
                         <Download size={16} /> DOWNLOAD APK
                    </a>

                    {/* PAGINATION BUTTONS */}
                    <div className="flex gap-2">
                        <button 
                            onClick={handlePrev}
                            disabled={currentIndex === 0}
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all border border-white/10 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed text-white"
                        >
                            <ArrowLeft size={14} /> PREV
                        </button>
                        <button 
                            onClick={handleNext}
                            disabled={currentIndex === results.length - 1}
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all border border-white/10 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed text-white"
                        >
                            NEXT <ArrowRight size={14} />
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REALTIME STATS */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl mt-12 grid grid-cols-2 gap-4"
      >
        <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-5 flex items-center justify-between group hover:border-cyan-500/20 transition-colors">
           <div>
              <div className="flex items-center gap-2 mb-1">
                 <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                 <p className="text-[10px] font-bold tracking-widest text-cyan-500/70 uppercase">Live Users</p>
              </div>
              <h3 className="text-2xl font-mono text-white font-bold">{stats.visitors.toLocaleString()}</h3>
           </div>
           <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400 group-hover:scale-110 transition-transform">
              <Users size={20} />
           </div>
        </div>

        <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-5 flex items-center justify-between group hover:border-green-500/20 transition-colors">
           <div>
              <div className="flex items-center gap-2 mb-1">
                 <div className="w-2 h-2 rounded-full bg-green-500"></div>
                 <p className="text-[10px] font-bold tracking-widest text-green-500/70 uppercase">Processed</p>
              </div>
              <h3 className="text-2xl font-mono text-white font-bold">{stats.links.toLocaleString()}</h3>
           </div>
           <div className="p-3 bg-green-500/10 rounded-xl text-green-400 group-hover:scale-110 transition-transform">
              <BarChart3 size={20} />
           </div>
        </div>
      </motion.div>

      {/* DONATE BUTTON */}
      <motion.a
        href="https://sociabuzz.com/zeronaut/tribe" 
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-xs px-5 py-3 rounded-full shadow-[0_0_20px_rgba(255,165,0,0.4)] hover:shadow-[0_0_30px_rgba(255,165,0,0.6)] transition-shadow cursor-pointer w-max mx-auto mt-10 md:fixed md:bottom-6 md:right-6 md:z-50 md:m-0"
      >
        <Heart size={16} className="fill-black animate-pulse" />
        DONATE
      </motion.a>

      <footer className="mt-16 text-center opacity-30 hover:opacity-100 transition-opacity pb-8">
        <p className="text-[10px] text-white font-mono tracking-[0.2em] mb-2">
          © 2026 ZeroNaut Downloader. All rights reserved.
        </p>
        <div className="flex items-center justify-center gap-2 text-[9px] text-white">
          <span>Powered by ZeroNaut</span>
        </div>
      </footer>
    </div>
  );
}
