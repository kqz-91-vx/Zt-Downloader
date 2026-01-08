import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, Clipboard, CheckCircle, Loader2, 
  Trash2, Activity, AlertTriangle, X, Zap, 
  Users, BarChart3, Heart, Download, ChevronLeft, ChevronRight, Star, Box
} from 'lucide-react';
import axios from 'axios';

// --- CONFIG ---
const API_ENDPOINT = "/api/apps"; // Local Server Route

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.03 } }
};

const loadingLogs = [
  "Connecting to APK Store...",
  "Searching database...",
  "Fetching latest versions...",
  "Verifying signatures...",
  "Preparing download links..."
];

const INITIAL_VISITORS = 14205;
const INITIAL_LINKS = 45902;

export default function App() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // --- STATE FOR RESULTS & NAVIGATION ---
  const [results, setResults] = useState([]); // Array of apps
  const [currentIndex, setCurrentIndex] = useState(0); // Kaunsa app dikhana hai
  
  const [logIndex, setLogIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [notification, setNotification] = useState(null);
  const [stats, setStats] = useState({ visitors: INITIAL_VISITORS, links: INITIAL_LINKS });

  // Current active app data
  const currentApp = results.length > 0 ? results[currentIndex] : null;

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
      setQuery(text);
    } catch (err) {
      showNotify("Clipboard access denied", "error");
    }
  };

  const addToHistory = (data) => {
    // History mein sirf wahi add karo jo user ne finally dekha/download kiya
    setHistory(prev => [data, ...prev].slice(0, 3));
  };

  const clearHistory = () => setHistory([]);

  // --- SEARCH LOGIC ---
  const handleSearch = async () => {
    if (!query) return showNotify("Please enter App Name!", "error");

    setIsLoading(true);
    setResults([]); // Reset previous results
    setCurrentIndex(0);

    try {
      // Backend call
      const response = await axios.post(API_ENDPOINT, { url: query });
      
      const dataArray = response.data;
      
      if (Array.isArray(dataArray) && dataArray.length > 0) {
          setResults(dataArray);
          addToHistory(dataArray[0]); // Add first result to history
          setStats(prev => ({ ...prev, links: prev.links + 1 }));
      } else {
          throw new Error("No apps found.");
      }

    } catch (error) {
      console.error("Search Error:", error);
      let msg = "Server Error.";
      if (error.response && error.response.data) {
          msg = error.response.data.details || error.response.data.error || "Unknown Error";
      } else if (error.message) {
          msg = error.message;
      }
      showNotify(`ERROR: ${msg.substring(0, 80)}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // --- NAVIGATION LOGIC ---
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

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center font-sans overflow-x-hidden relative bg-[#050505]">
      
      {/* NOTIFIKASI */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ y: -100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -100, opacity: 0, scale: 0.9 }}
            className="fixed top-6 left-0 right-0 mx-auto w-[90%] max-w-md z-50 pointer-events-none"
          >
            <div className="bg-black/90 backdrop-blur-xl border border-l-4 rounded-r-lg shadow-[0_0_20px_rgba(0,0,0,0.5)] p-4 flex items-start gap-4 pointer-events-auto"
                 style={{ borderColor: notification.type === 'error' ? '#ef4444' : '#3DDC84' }}>
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

      {/* HEADER */}
      <header className="mb-10 text-center flex flex-col items-center w-full max-w-2xl mx-auto">
        <div className="flex justify-center items-center gap-2 mb-6 px-3 py-1 rounded-full bg-white/5 border border-white/5">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            APK Engine Online
          </span>
        </div>
        
        <motion.h1 
          className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight mb-2 leading-tight bg-clip-text text-transparent bg-[length:200%_auto]"
          animate={{
            backgroundImage: [
              "linear-gradient(to right, #ffffff, #3DDC84, #ffffff)",
              "linear-gradient(to right, #3DDC84, #ffffff, #3DDC84)",
              "linear-gradient(to right, #ffffff, #3DDC84, #ffffff)"
            ]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          style={{ backgroundImage: "linear-gradient(to right, #ffffff, #3DDC84, #ffffff)" }}
        >
          APK.DOWNLOADER
        </motion.h1>
        
        <div className="flex items-center gap-3 mb-8">
           <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-green-500/50"></div>
           <h2 className="text-[10px] sm:text-xs font-medium tracking-[0.5em] text-green-400/80 uppercase whitespace-nowrap">
              DIRECT STORE ACCESS
           </h2>
           <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-green-500/50"></div>
        </div>
      </header>

      {/* SINGLE PLATFORM INDICATOR */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="mb-8 flex items-center justify-center"
      >
          <div className="px-6 py-2 rounded-full border border-green-500/30 bg-green-500/10 flex items-center gap-3">
              <Smartphone className="text-green-400" size={18} />
              <span className="text-green-400 font-bold text-xs tracking-widest">ANDROID APK REPO</span>
          </div>
      </motion.div>

      {/* INPUT AREA */}
      <motion.div layout className="w-full max-w-2xl mb-8 relative z-20">
        <div className="bg-[#0a0a0c] border border-white/10 p-1 rounded-2xl shadow-2xl transition-colors duration-500" style={{ borderColor: '#3DDC84' }}>
          <div className="bg-[#121214] rounded-xl p-4 sm:p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full animate-ping bg-green-500" />
                STATUS: <span className="text-green-400 font-bold uppercase">READY TO SEARCH</span>
              </span>
              {isLoading ? <span className="text-green-400 animate-pulse">{">"} {loadingLogs[logIndex]}</span> : <span>V.4.2.0</span>}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 group">
                <input 
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type App Name (e.g. PUBG, Instagram, Termux)..."
                  className="w-full h-12 bg-black/40 border border-white/5 rounded-lg px-4 pr-10 text-white outline-none focus:border-green-500/50 transition-all placeholder:text-gray-600 font-mono text-xs"
                />
                <button onClick={handlePaste} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                  <Clipboard size={16} />
                </button>
              </div>
              <button 
                onClick={handleSearch}
                disabled={isLoading}
                className="h-12 px-8 rounded-lg font-bold text-black text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 hover:brightness-110 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(61,220,132,0.3)] bg-[#3DDC84]"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} className="fill-black" />}
                <span>{isLoading ? 'SEARCHING...' : 'SEARCH APK'}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* RESULT CARD WITH NAVIGATION */}
      <AnimatePresence mode="wait">
        {currentApp && (
          <motion.div
            key={currentApp.package + currentIndex} // Key change triggers animation
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-2xl mb-8"
          >
            <div className="bg-[#0a0a0c] border border-white/10 rounded-2xl overflow-hidden relative">
              
              {/* Card Header */}
              <div className="bg-white/5 px-6 py-3 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2 text-green-400 text-xs font-bold tracking-wider">
                  <CheckCircle size={14} />
                  RESULT FOUND
                </div>
                <div className="text-[10px] text-gray-500 font-mono">
                    Item {currentIndex + 1} of {results.length}
                </div>
              </div>

              {/* Main Content */}
              <div className="p-6 flex flex-col md:flex-row gap-6 items-start">
                {/* Icon */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-black rounded-2xl border border-white/5 p-2 shrink-0 shadow-lg mx-auto md:mx-0">
                  <img src={currentApp.thumbnail} alt="Icon" className="w-full h-full object-contain rounded-xl" />
                </div>
                
                {/* Details */}
                <div className="flex-1 flex flex-col w-full">
                  <div className="mb-4 text-center md:text-left">
                    <h3 className="text-white font-bold text-xl sm:text-2xl mb-1 leading-tight">{currentApp.title}</h3>
                    <p className="text-gray-400 text-xs font-mono flex items-center justify-center md:justify-start gap-2">
                        <Box size={12} /> {currentApp.package}
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-6">
                      <div className="bg-white/5 p-2 rounded-lg text-center border border-white/5">
                          <p className="text-[9px] text-gray-500 uppercase tracking-widest">Version</p>
                          <p className="text-white text-xs font-bold">{currentApp.version}</p>
                      </div>
                      <div className="bg-white/5 p-2 rounded-lg text-center border border-white/5">
                          <p className="text-[9px] text-gray-500 uppercase tracking-widest">Size</p>
                          <p className="text-white text-xs font-bold">{currentApp.size}</p>
                      </div>
                      <div className="bg-white/5 p-2 rounded-lg text-center border border-white/5">
                          <p className="text-[9px] text-gray-500 uppercase tracking-widest">Rating</p>
                          <p className="text-yellow-400 text-xs font-bold flex items-center justify-center gap-1">
                              <Star size={10} className="fill-yellow-400"/> {currentApp.rating}
                          </p>
                      </div>
                      <div className="bg-white/5 p-2 rounded-lg text-center border border-white/5">
                          <p className="text-[9px] text-gray-500 uppercase tracking-widest">Downloads</p>
                          <p className="text-white text-xs font-bold">{currentApp.downloads?.toLocaleString()}</p>
                      </div>
                  </div>

                  {/* Download Button */}
                  <a 
                    href={currentApp.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-black py-3 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(61,220,132,0.3)] active:scale-95"
                  >
                     <Download size={18} /> DOWNLOAD APK
                  </a>
                </div>
              </div>

              {/* NAVIGATION FOOTER */}
              <div className="bg-white/5 p-2 flex items-center justify-between border-t border-white/5">
                  <button 
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg bg-black/50 hover:bg-white/10 text-xs text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                      <ChevronLeft size={16} /> PREV
                  </button>

                  <div className="flex gap-1">
                      {results.map((_, idx) => (
                          <div 
                            key={idx} 
                            className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentIndex ? 'bg-green-500 w-3' : 'bg-white/20'}`}
                          />
                      ))}
                  </div>

                  <button 
                    onClick={handleNext}
                    disabled={currentIndex === results.length - 1}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg bg-black/50 hover:bg-white/10 text-xs text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                      NEXT <ChevronRight size={16} />
                  </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HISTORY */}
      {history.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="w-full max-w-2xl mt-4"
        >
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold tracking-widest uppercase">
              <Clock size={12} /> Recent Searches
            </div>
            <button onClick={clearHistory} className="text-[10px] text-red-500/70 hover:text-red-500 flex items-center gap-1 transition-colors">
              <Trash2 size={10} /> CLEAR ALL
            </button>
          </div>
          <div className="space-y-2">
            {history.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-[#0a0a0c] border border-white/5 rounded-lg p-3 flex items-center justify-between hover:border-white/10 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-white/5 p-1">
                      <img src={item.thumbnail} alt="icon" className="w-full h-full object-contain opacity-70 group-hover:opacity-100" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-gray-300 group-hover:text-white text-xs font-bold truncate max-w-[200px] transition-colors">{item.title}</h4>
                    <p className="text-[10px] text-gray-600">{item.version}</p>
                  </div>
                </div>
                <a href={item.url} target="_blank" rel="noreferrer" className="text-green-500 hover:text-green-400 text-[10px] border border-green-500/20 hover:border-green-500 px-3 py-1.5 rounded transition-all bg-green-500/5">
                  GET
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* REALTIME STATS */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mt-12 grid grid-cols-2 gap-4"
      >
        <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-5 flex items-center justify-between group hover:border-green-500/20 transition-colors">
           <div>
              <div className="flex items-center gap-2 mb-1">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                 <p className="text-[10px] font-bold tracking-widest text-green-500/70 uppercase">Online Users</p>
              </div>
              <h3 className="text-2xl font-mono text-white font-bold">{stats.visitors.toLocaleString()}</h3>
           </div>
           <div className="p-3 bg-green-500/10 rounded-xl text-green-400 group-hover:scale-110 transition-transform">
              <Users size={20} />
           </div>
        </div>

        <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-5 flex items-center justify-between group hover:border-blue-500/20 transition-colors">
           <div>
              <div className="flex items-center gap-2 mb-1">
                 <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                 <p className="text-[10px] font-bold tracking-widest text-blue-500/70 uppercase">APKs Delivered</p>
              </div>
              <h3 className="text-2xl font-mono text-white font-bold">{stats.links.toLocaleString()}</h3>
           </div>
           <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 group-hover:scale-110 transition-transform">
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
          © 2026 ZeroNaut APK Store. All rights reserved.
        </p>
        <div className="flex items-center justify-center gap-2 text-[9px] text-white">
          <span>Powered by ZeroNaut</span>
        </div>
      </footer>
    </div>
  );
}
