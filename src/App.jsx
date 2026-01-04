import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Music, Instagram, Youtube, Ghost, Twitter, Download, Terminal, 
  Facebook, Linkedin, Share2, Cloud, Video, Mic2, Image, Radio, 
  Layers, Hash, Scissors, Clipboard, CheckCircle, Loader2, FileVideo, FileAudio, ShieldAlert
} from 'lucide-react';

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
  { id: 'reddit', name: 'Reddit', icon: <Share2 />, color: '#FF4500' },
  { id: 'threads', name: 'Threads', icon: <Hash />, color: '#ffffff' }, 

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

export default function App() {
  const [selected, setSelected] = useState(null);
  const [url, setUrl] = useState("");
  
  // State baru untuk logika aplikasi
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null); // Menyimpan data hasil (dummy)

  const activeColor = selected ? platforms.find(p => p.id === selected).color : '#00f2ff';
  const activeName = selected ? platforms.find(p => p.id === selected).name : 'Universal';

  // --- FITUR 1: AUTO PASTE ---
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch (err) {
      alert("Failed to read clipboard!");
    }
  };

  // --- FITUR 2: SIMULASI DOWNLOAD ---
  const handleExtract = () => {
    if (!url) {
      alert("Please insert URL first!");
      return;
    }

    // Mulai Loading
    setIsLoading(true);
    setResult(null); // Reset hasil sebelumnya

    // Simulasi Delay API (2 detik)
    setTimeout(() => {
      setIsLoading(false);
      // Data Dummy Hasil Download (Nanti ini diganti data dari API beneran)
      setResult({
        title: "Video Content Example - ZERONAUT DEMO",
        author: "@zeronaut_user",
        duration: "00:59",
        size: "15.4 MB",
        thumbnail: "https://via.placeholder.com/600x400/000000/00f2ff?text=PREVIEW+THUMBNAIL"
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center font-sans">
      
      {/* HEADER */}
      <header className="mb-6 text-center">
        <div className="flex justify-center items-center gap-2 mb-2">
          <Terminal size={14} className="text-cyber" />
          <span className="text-[10px] text-cyber/80 font-bold uppercase tracking-[0.3em] animate-pulse">
            System Online // V.3.0
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
            onClick={() => { setSelected(p.id); setResult(null); }} // Reset result saat ganti platform
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
      <motion.div layout className="w-full max-w-3xl mb-8">
        <div 
          className="bg-[#0a0a0c]/80 border-2 p-1 rounded-xl backdrop-blur-xl transition-colors duration-500 shadow-2xl relative z-10"
          style={{ borderColor: activeColor, boxShadow: selected ? `0 0 30px -10px ${activeColor}20` : 'none' }}
        >
          <div className="bg-white/5 rounded-lg p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: activeColor }} />
                TARGET: <span style={{ color: activeColor }} className="font-bold uppercase">{activeName}</span>
              </span>
              <span>READY</span>
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
                
                {/* TOMBOL PASTE */}
                <button 
                  onClick={handlePaste}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  title="Paste from Clipboard"
                >
                  <Clipboard size={14} />
                </button>
              </div>

              {/* TOMBOL EXTRACT DENGAN LOADING STATE */}
              <button 
                onClick={handleExtract}
                disabled={isLoading}
                className="h-10 px-6 rounded-md font-bold text-black text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 hover:brightness-110 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: activeColor }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>PROCESSING...</span>
                  </>
                ) : (
                  <>
                    <Download size={16} className="animate-bounce" />
                    <span>EXTRACT DATA</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* --- FITUR 3: RESULT CARD (MUNCUL SETELAH LOADING) --- */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-3xl"
          >
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md">
              
              {/* Result Header */}
              <div className="bg-black/30 px-6 py-3 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2 text-cyber text-xs font-bold tracking-wider">
                  <CheckCircle size={14} />
                  EXTRACTION COMPLETE
                </div>
                <div className="text-[10px] text-gray-500 font-mono">ID: {Math.floor(Math.random() * 999999)}</div>
              </div>

              {/* Result Body */}
              <div className="p-6 flex flex-col md:flex-row gap-6">
                {/* Thumbnail Dummy */}
                <div className="w-full md:w-1/3 aspect-video bg-black rounded-lg border border-white/10 flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                  <img src={result.thumbnail} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2 left-2 z-20 text-[10px] text-white bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                    {result.duration}
                  </div>
                </div>

                {/* Info & Download Buttons */}
                <div className="flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="text-white font-bold text-lg leading-tight mb-1 line-clamp-2">{result.title}</h3>
                    <p className="text-gray-400 text-xs flex items-center gap-2">
                      <span>By {result.author}</span> • <span>Size: {result.size}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white py-2 rounded-lg text-xs font-bold transition-all group">
                      <FileVideo size={16} className="text-blue-400 group-hover:scale-110 transition-transform" />
                      DOWNLOAD MP4
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white py-2 rounded-lg text-xs font-bold transition-all group">
                      <FileAudio size={16} className="text-green-400 group-hover:scale-110 transition-transform" />
                      DOWNLOAD MP3
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- FITUR 4: FOOTER --- */}
      <footer className="mt-12 text-center opacity-40 hover:opacity-100 transition-opacity">
        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 mb-2">
          <ShieldAlert size={12} />
          <span>EDUCATIONAL PURPOSE ONLY</span>
        </div>
        <p className="text-[9px] text-gray-600 font-mono tracking-widest">
          BUILT WITH REACT.JS // ZERONAUT_SYSTEM_V3
        </p>
      </footer>

    </div>
  );
}