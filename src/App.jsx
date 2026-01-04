import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Music, Instagram, Youtube, Ghost, Twitter, Download, Terminal, 
  Facebook, Linkedin, Share2, Cloud, Video, Mic2, Image, Radio, 
  Layers, Hash, Scissors, Clipboard, CheckCircle, Loader2, FileVideo, 
  FileAudio, ShieldAlert, Clock, Trash2, Activity, ExternalLink
} from 'lucide-react';
import axios from 'axios';

// --- DATABASE PLATFORM ---
const platforms = [
  { id: 'tiktok', name: 'TikTok', icon: <Music />, color: '#ff0050' },
  { id: 'instagram', name: 'Instagram', icon: <Instagram />, color: '#E1306C' },
  { id: 'youtube', name: 'YouTube', icon: <Youtube />, color: '#FF0000' },
  { id: 'snapchat', name: 'Snapchat', icon: <Ghost />, color: '#FFFC00' },
  { id: 'twitter', name: 'Twitter/X', icon: <Twitter />, color: '#1DA1F2' },
  { id: 'facebook', name: 'Facebook', icon: <Facebook />, color: '#1877F2' },
  { id: 'spotify', name: 'Spotify', icon: <Radio />, color: '#1DB954' },
  { id: 'soundcloud', name: 'SoundCloud', icon: <Mic2 />, color: '#FF5500' },
  { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin />, color: '#0077B5' },
  { id: 'pinterest', name: 'Pinterest', icon: <Image />, color: '#BD081C' },
  { id: 'tumblr', name: 'Tumblr', icon: <Layers />, color: '#36465D' },
  { id: 'douyin', name: 'Douyin', icon: <Music />, color: '#ffffff' }, 
  { id: 'kuaishou', name: 'Kuaishou', icon: <Video />, color: '#FF7F24' },
  { id: 'capcut', name: 'CapCut', icon: <Scissors />, color: '#ffffff' },
  { id: 'dailymotion', name: 'Dailymotion', icon: <Video />, color: '#0066DC' },
  { id: 'bluesky', name: 'Bluesky', icon: <Cloud />, color: '#0085FF' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.03 } }
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const loadingLogs = [
  "Handshake initialized...",
  "Requesting content data...",
  "Bypassing token security...",
  "Parsing media stream...",
  "Finalizing extraction..."
];

export default function App() {
  const [selected, setSelected] = useState(null);
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [logIndex, setLogIndex] = useState(0);
  const [history, setHistory] = useState([]);

  const activeColor = selected ? platforms.find(p => p.id === selected).color : '#00f2ff';
  const activeName = selected ? platforms.find(p => p.id === selected).name : 'Universal';

  // Efek Log berjalan saat loading
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

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch (err) {
      alert("Clipboard access denied");
    }
  };

  const addToHistory = (data) => {
    setHistory(prev => [data, ...prev].slice(0, 3));
  };

  const clearHistory = () => setHistory([]);

  // --- LOGIKA UNTUK MENCARI LINK DOWNLOAD ---
  const getDownloadLink = (type) => {
    if (!result) return null;

    // 1. Cek jika API memberikan link langsung (Simple API)
    if (result.downloadUrl && type === 'video') return result.downloadUrl;

    // 2. Cek jika API memberikan daftar formats (Complex API like YouTube)
    if (result.formats && Array.isArray(result.formats)) {
      if (type === 'video') {
        // Cari format MP4 terbaik
        const video = result.formats.find(f => f.extension === 'mp4' || f.type === 'video');
        return video ? video.url : null;
      } else if (type === 'audio') {
        // Cari format Audio/MP3 terbaik
        const audio = result.formats.find(f => f.extension === 'mp3' || f.extension === 'm4a' || f.type === 'audio');
        return audio ? audio.url : null;
      }
    }
    
    return null;
  };

  const handleExtract = async () => {
    if (!url) return alert("Please insert URL first!");
    if (!selected) return alert("Please select a platform first!");

    setIsLoading(true);
    setResult(null);

    const endpoint = `http://localhost:3000/api/${selected}`;

    try {
      const response = await axios.post(endpoint, { url: url });
      setResult(response.data);
      addToHistory(response.data);
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.details || error.response?.data?.error || "Gagal menghubungi Server.";
      alert(`ERROR (${selected.toUpperCase()}): \n${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center font-sans overflow-x-hidden">
      
      {/* HEADER */}
      <header className="mb-6 text-center">
        <div className="flex justify-center items-center gap-2 mb-2">
          <Terminal size={14} className="text-cyber" />
          <span className="text-[10px] text-cyber/80 font-bold uppercase tracking-[0.3em] animate-pulse">
            System Online // V.3.5 (Download Active)
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic mb-4">
          ZERONAUT_<span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">DOWNLOADER</span>
        </h1>
        <div className="inline-block px-4 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
          <p className="text-[10px] md:text-xs text-gray-400 tracking-widest font-mono">
             [ PLEASE SELECT PLATFORM TARGET BELOW ]
          </p>
        </div>
      </header>

      {/* GRID PLATFORM */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-5xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-8"
      >
        {platforms.map((p) => (
          <motion.button
            key={p.id}
            variants={itemVariants}
            onClick={() => { setSelected(p.id); setResult(null); }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`relative flex flex-row items-center justify-start gap-3 px-4 py-3 rounded-lg border border-white/5 bg-white/5 backdrop-blur-sm transition-all duration-300 group overflow-hidden ${
              selected === p.id ? 'ring-1 ring-offset-1 ring-offset-black' : 'hover:bg-white/10'
            }`}
            style={{ borderColor: selected === p.id ? p.color : 'rgba(255,255,255,0.05)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="transition-transform duration-300 group-hover:scale-110 shrink-0" style={{ color: p.color }}>
              {React.cloneElement(p.icon, { size: 20 })}
            </div>
            <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase group-hover:text-white transition-colors truncate">
              {p.name}
            </span>
            {selected === p.id && (
              <motion.div 
                layoutId="active-dot"
                className="absolute right-2 w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: p.color, boxShadow: `0 0 8px ${p.color}` }}
              />
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* INPUT AREA */}
      <motion.div layout className="w-full max-w-3xl mb-8 relative z-20">
        <div 
          className="bg-[#0a0a0c]/80 border-2 p-1 rounded-xl backdrop-blur-xl transition-colors duration-500 shadow-2xl"
          style={{ borderColor: activeColor, boxShadow: selected ? `0 0 30px -10px ${activeColor}20` : 'none' }}
        >
          <div className="bg-white/5 rounded-lg p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: activeColor }} />
                TARGET: <span style={{ color: activeColor }} className="font-bold uppercase">{activeName}</span>
              </span>
              {isLoading ? <span className="text-cyber animate-pulse">{">"} {loadingLogs[logIndex]}</span> : <span>READY</span>}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 group">
                <input 
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={`Paste ${activeName} Link...`}
                  className="w-full h-10 bg-black/50 border border-white/10 rounded-md px-4 pr-10 text-white outline-none focus:border-white/30 transition-all placeholder:text-gray-600 font-mono text-xs"
                />
                <button onClick={handlePaste} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                  <Clipboard size={14} />
                </button>
              </div>

              <button 
                onClick={handleExtract}
                disabled={isLoading}
                className="h-10 px-6 rounded-md font-bold text-black text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 hover:brightness-110 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: activeColor }}
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} className="animate-bounce" />}
                <span>{isLoading ? 'PROCESSING...' : 'EXTRACT DATA'}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* RESULT CARD (VERSI BARU DENGAN LINK DOWNLOAD) */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-3xl mb-8"
          >
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md">
              <div className="bg-black/30 px-6 py-3 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2 text-cyber text-xs font-bold tracking-wider">
                  <CheckCircle size={14} />
                  SUCCESS
                </div>
                <div className="text-[10px] text-gray-500 font-mono">{result.date || 'Just now'}</div>
              </div>
              <div className="p-6 flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3 aspect-video bg-black rounded-lg border border-white/10 relative overflow-hidden group">
                  <img src={result.thumbnail} alt="Preview" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute bottom-2 left-2 text-[10px] text-white bg-black/50 px-2 rounded">{result.size || 'Varies'}</div>
                </div>
                <div className="flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="text-white font-bold text-base mb-1 line-clamp-2">{result.title}</h3>
                    <p className="text-gray-400 text-xs">By {result.author}</p>
                  </div>
                  
                  {/* TOMBOL DOWNLOAD AKTIF */}
                  <div className="grid grid-cols-2 gap-3">
                    {getDownloadLink('video') ? (
                      <a 
                        href={getDownloadLink('video')} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-200 py-2 rounded-lg text-xs font-bold transition-all"
                      >
                        <FileVideo size={14} /> DOWNLOAD MP4
                      </a>
                    ) : (
                      <button disabled className="flex items-center justify-center gap-2 bg-white/5 text-gray-500 py-2 rounded-lg text-xs font-bold cursor-not-allowed border border-white/5">
                        <FileVideo size={14} /> NO VIDEO
                      </button>
                    )}

                    {getDownloadLink('audio') ? (
                      <a 
                        href={getDownloadLink('audio')} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 bg-green-600/20 hover:bg-green-600/40 border border-green-500/30 text-green-200 py-2 rounded-lg text-xs font-bold transition-all"
                      >
                         <FileAudio size={14} /> DOWNLOAD MP3
                      </a>
                    ) : (
                      // Kalau tidak ada audio terpisah (biasanya video sudah ada suaranya), kita disable
                      <button disabled className="flex items-center justify-center gap-2 bg-white/5 text-gray-500 py-2 rounded-lg text-xs font-bold cursor-not-allowed border border-white/5">
                        <FileAudio size={14} /> NO AUDIO
                      </button>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HISTORY PANEL */}
      {history.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="w-full max-w-3xl mt-4"
        >
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="flex items-center gap-2 text-gray-500 text-xs font-bold">
              <Clock size={12} /> RECENT ACTIVITY
            </div>
            <button onClick={clearHistory} className="text-[10px] text-red-500 hover:text-red-400 flex items-center gap-1">
              <Trash2 size={10} /> CLEAR
            </button>
          </div>
          <div className="space-y-2">
            {history.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-white/5 border border-white/5 rounded-lg p-3 flex items-center justify-between hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-black rounded-md text-gray-400">
                    <Activity size={14} />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-white text-xs font-bold truncate max-w-[200px]">{item.title}</h4>
                    <p className="text-[10px] text-gray-500">{item.author}</p>
                  </div>
                </div>
                <button className="text-cyber text-[10px] border border-cyber/30 px-2 py-1 rounded hover:bg-cyber/10">
                  <ExternalLink size={10} /> OPEN
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <footer className="mt-12 text-center opacity-40 hover:opacity-100 transition-opacity pb-6">
        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 mb-2">
          <ShieldAlert size={12} />
          <span>EDUCATIONAL PURPOSE ONLY</span>
        </div>
        <p className="text-[9px] text-gray-600 font-mono tracking-widest">
          ZERONAUT_SYSTEM // V.3.5
        </p>
      </footer>
    </div>
  );
}