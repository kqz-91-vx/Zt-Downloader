import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Download, Smartphone, ChevronLeft, ChevronRight, 
  Star, Box, Activity, Layers, ShieldCheck, Loader2, AlertTriangle, X 
} from 'lucide-react';
import axios from 'axios';

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]); // Array of apps
  const [currentIndex, setCurrentIndex] = useState(0); // Kaunsa app dikhana hai
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // --- API CALL ---
  const handleSearch = async () => {
    if (!query.trim()) return showNotify("Please enter an App Name!", "error");

    setIsLoading(true);
    setResults([]); // Clear old results
    setCurrentIndex(0); // Reset index

    try {
      // Backend Route Call
      const response = await axios.post('/api/apps', { url: query });
      
      const data = response.data;
      
      if (Array.isArray(data) && data.length > 0) {
        setResults(data);
      } else {
        showNotify("No apps found.", "error");
      }

    } catch (error) {
      console.error("Search Error:", error);
      const msg = error.response?.data?.details || error.message || "Server Error";
      showNotify(msg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // --- NAVIGATION LOGIC ---
  const nextApp = () => {
    if (currentIndex < results.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevApp = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const showNotify = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Current Active App Data
  const currentApp = results[currentIndex];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-sans bg-[#050505] text-white p-4 overflow-hidden relative">
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[100px]"></div>
      </div>

      {/* NOTIFICATION */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-6 z-50 bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-3 rounded-lg flex items-center gap-3 backdrop-blur-md"
          >
            <AlertTriangle size={18} />
            <span className="text-sm font-bold">{notification.message}</span>
            <button onClick={() => setNotification(null)}><X size={14}/></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="z-10 text-center mb-10">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl mb-4 ring-1 ring-white/10"
        >
          <Smartphone size={32} className="text-green-400" />
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-300 to-cyan-400 mb-2">
          ZERONAUT APK
        </h1>
        <p className="text-gray-500 text-xs md:text-sm font-mono tracking-[0.3em] uppercase">
          Secure Android App Repository
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="w-full max-w-xl z-10 mb-8">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-cyan-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative flex bg-[#0a0a0c] rounded-xl border border-white/10 p-1">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search application name (e.g. Instagram, Pubg)..."
              className="w-full bg-transparent text-white px-4 py-3 outline-none placeholder-gray-600 font-mono text-sm"
            />
            <button 
              onClick={handleSearch}
              disabled={isLoading}
              className="bg-white/10 hover:bg-white/20 text-white px-6 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center min-w-[60px]"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* RESULTS AREA */}
      <div className="w-full max-w-2xl z-10 h-[450px] relative">
        <AnimatePresence mode="wait">
          {results.length > 0 && currentApp ? (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              {/* APP CARD */}
              <div className="bg-[#0f0f11] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative h-full flex flex-col">
                
                {/* Result Counter */}
                <div className="absolute top-4 right-6 text-gray-600 font-mono text-xs">
                  RESULT {currentIndex + 1} / {results.length}
                </div>

                {/* App Header Info */}
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-black/50 border border-white/10 shrink-0 shadow-lg">
                    <img src={currentApp.icon} alt={currentApp.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-1 truncate">
                      {currentApp.name}
                    </h2>
                    <p className="text-gray-400 text-xs md:text-sm mb-3 font-mono">{currentApp.package}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-[10px] rounded border border-yellow-500/20 flex items-center gap-1 font-bold">
                        <Star size={10} className="fill-yellow-500" /> {currentApp.rating || 'N/A'}
                      </span>
                      <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] rounded border border-blue-500/20 flex items-center gap-1 font-bold">
                        <Box size={10} /> {currentApp.size_mb} MB
                      </span>
                      <span className="px-2 py-1 bg-green-500/10 text-green-400 text-[10px] rounded border border-green-500/20 flex items-center gap-1 font-bold">
                        <ShieldCheck size={10} /> VERIFIED
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-auto bg-white/5 rounded-xl p-4 border border-white/5">
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Version</p>
                    <p className="text-gray-200 text-sm font-mono truncate">{currentApp.version}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Developer</p>
                    <p className="text-gray-200 text-sm font-mono truncate">{currentApp.developer}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Downloads</p>
                    <p className="text-gray-200 text-sm font-mono">{currentApp.downloads?.toLocaleString() || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Update</p>
                    <p className="text-green-400 text-sm font-mono font-bold">Latest</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-col gap-3">
                  <a 
                    href={currentApp.download_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
                  >
                    <Download size={20} />
                    DOWNLOAD APK
                  </a>
                </div>

                {/* Navigation Buttons (Left/Right) */}
                <div className="absolute top-1/2 -left-4 md:-left-16 -translate-y-1/2">
                   <button 
                     onClick={prevApp} 
                     disabled={currentIndex === 0}
                     className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/20 hover:border-green-500/50 transition-all disabled:opacity-20 disabled:cursor-not-allowed text-white"
                   >
                     <ChevronLeft size={24} />
                   </button>
                </div>

                <div className="absolute top-1/2 -right-4 md:-right-16 -translate-y-1/2">
                   <button 
                     onClick={nextApp} 
                     disabled={currentIndex === results.length - 1}
                     className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/20 hover:border-green-500/50 transition-all disabled:opacity-20 disabled:cursor-not-allowed text-white"
                   >
                     <ChevronRight size={24} />
                   </button>
                </div>

              </div>
            </motion.div>
          ) : (
            !isLoading && (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 border border-white/5 rounded-3xl bg-[#0a0a0c]">
                <Layers size={48} className="mb-4 opacity-20" />
                <p className="text-sm font-mono">WAITING FOR INPUT...</p>
              </div>
            )
          )}
        </AnimatePresence>
      </div>
      
      {/* Footer */}
      <div className="fixed bottom-4 text-[10px] text-gray-600 font-mono">
        POWERED BY ZERONAUT ENGINE v2.0
      </div>

    </div>
  );
}
