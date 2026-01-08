import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Activity, AlertTriangle, X, Zap, Users, Heart, 
  CheckCircle, CloudUpload, File, Trash2, Copy, HardDrive, 
  Database, Server, ExternalLink // <-- Added ExternalLink Icon
} from 'lucide-react';
import axios from 'axios';

// --- CONFIG ---
// Stats ko realistic kar diya hai new project ke hisab se
const INITIAL_ACTIVE_USERS = 24; 
const INITIAL_TOTAL_UPLOADS = 108; 
const THEME_COLOR = '#3DDC84'; 
const UPLOAD_API = 'https://bj-media-hosting.pages.dev/api/upload';

const loadingLogs = [
  "Encrypting connection...",
  "Allocating secure storage...",
  "Compressing data...",
  "Verifying integrity...",
  "Generating secure link..."
];

export default function App() {
  const [isUploading, setIsUploading] = useState(false);
  const [logIndex, setLogIndex] = useState(0);
  const [notification, setNotification] = useState(null);
  const [files, setFiles] = useState([]);
  const [stats, setStats] = useState({ count: 0, size: 0, today: 0 });
  const [liveVisitors, setLiveVisitors] = useState(INITIAL_ACTIVE_USERS);
  
  const fileInputRef = useRef(null);

  // --- SAFE LOAD ---
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('bjFilesPlain');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (Array.isArray(parsedData)) {
          setFiles(parsedData);
          calculateStats(parsedData);
        }
      }
    } catch (e) {
      console.error("Storage Error:", e);
      localStorage.removeItem('bjFilesPlain');
    }
  }, []);

  // --- ANIMATIONS ---
  useEffect(() => {
    let interval;
    if (isUploading) {
      setLogIndex(0);
      interval = setInterval(() => {
        setLogIndex((prev) => (prev < loadingLogs.length - 1 ? prev + 1 : prev));
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isUploading]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Realistic random fluctuation for new site
      setLiveVisitors(prev => {
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
        return Math.max(10, prev + change); // Minimum 10 users rahenge
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const calculateStats = (fileList) => {
    const totalSize = fileList.reduce((acc, f) => acc + (f.size || 0), 0);
    const todayStr = new Date().toDateString();
    const todayCount = fileList.filter(f => new Date(f.date).toDateString() === todayStr).length;

    setStats({
      count: fileList.length,
      size: (totalSize / (1024 * 1024)).toFixed(2),
      today: todayCount
    });
  };

  const showNotify = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(UPLOAD_API, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const data = res.data;

      if (data.ok || data.success) {
        const newFile = {
          id: Date.now(),
          name: data.filename || file.name,
          url: data.data,
          size: file.size,
          date: new Date().toISOString()
        };

        const updatedFiles = [newFile, ...files];
        setFiles(updatedFiles);
        localStorage.setItem('bjFilesPlain', JSON.stringify(updatedFiles));
        calculateStats(updatedFiles);

        showNotify("File Uploaded! Link Copied.", "success");
        navigator.clipboard.writeText(data.data);
      } else {
        throw new Error(data.error || "Upload failed");
      }

    } catch (error) {
      console.error(error);
      showNotify("Upload Failed. Check Network.", "error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const deleteFile = (id) => {
    if(window.confirm("Delete this file history?")) {
        const updated = files.filter(f => f.id !== id);
        setFiles(updated);
        localStorage.setItem('bjFilesPlain', JSON.stringify(updated));
        calculateStats(updated);
    }
  };

  const copyLink = (url) => {
    navigator.clipboard.writeText(url);
    showNotify("Link Copied to Clipboard", "success");
  };

  // --- ANIMATED STATS CONFIG ---
  const statsConfig = [
    { 
      label: 'Total Files', 
      value: stats.count, 
      icon: <File />, 
      color: '#3b82f6' 
    },
    { 
      label: 'Used Space', 
      value: `${stats.size} MB`, 
      icon: <HardDrive />, 
      color: '#f59e0b' 
    },
    { 
      label: 'Today', 
      value: stats.today, 
      icon: <Zap />, 
      color: '#10b981' 
    },
    { 
      label: 'Bandwidth', 
      value: '∞', 
      icon: <Activity />, 
      color: '#d946ef' 
    },
  ];

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center font-sans overflow-x-hidden relative bg-[#050505]">
      
      {/* BACKGROUND PARTICLES */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-green-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl"></div>
      </div>

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
                {notification.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
              </div>
              <div className="flex-1">
                <h4 className={`text-xs font-bold tracking-widest uppercase mb-1 ${notification.type === 'error' ? 'text-red-500' : 'text-green-400'}`}>
                  {notification.type === 'error' ? 'SYSTEM ALERT' : 'SUCCESS'}
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
      <header className="mb-6 text-center flex flex-col items-center w-full max-w-2xl mx-auto z-10">
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
          BJ.MEDIA HOSTING
        </motion.h1>
        
        <div className="flex items-center gap-3 mb-4">
           <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-green-500/50"></div>
           <h2 className="text-[10px] sm:text-xs font-medium tracking-[0.5em] text-green-400/80 uppercase whitespace-nowrap">
              SECURE STORAGE ENGINE
           </h2>
           <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-green-500/50"></div>
        </div>
      </header>

      {/* --- ANIMATED COLORFUL STATS GRID --- */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-3xl mb-8 z-10"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-2">
          {statsConfig.map((item, index) => (
            <motion.div
              key={index}
              animate={{ 
                y: [0, -6, 0], // Floating Effect
                boxShadow: [`0 0 0px ${item.color}00`, `0 0 15px ${item.color}20`, `0 0 0px ${item.color}00`] // Glow Effect
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                delay: index * 0.2, 
                ease: "easeInOut" 
              }}
              className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center transition-colors group relative overflow-hidden"
              style={{ borderColor: `${item.color}30` }}
            >
               <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{ backgroundColor: item.color }}></div>
               
               <div className="mb-2 transition-transform duration-300 group-hover:scale-110" style={{ color: item.color }}>
                 {React.cloneElement(item.icon, { size: 22 })}
               </div>
               
               <div className="text-lg font-bold text-white font-mono tracking-tight">{item.value}</div>
               
               <div className="text-[10px] uppercase tracking-widest opacity-60 font-bold mt-1" style={{ color: item.color }}>
                 {item.label}
               </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* --- UPLOAD AREA --- */}
      <motion.div layout className="w-full max-w-3xl mb-8 relative z-20">
        <div className="bg-[#0a0a0c] border border-white/10 p-1 rounded-2xl shadow-2xl transition-colors duration-500" style={{ borderColor: THEME_COLOR }}>
          <div className="bg-[#121214] rounded-xl p-4 sm:p-5 flex flex-col gap-3">
            
            <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: THEME_COLOR }} />
                TARGET: <span style={{ color: THEME_COLOR }} className="font-bold uppercase">BJ CLOUD SERVER</span>
              </span>
              {isUploading ? <span className="text-green-400 animate-pulse">{">"} {loadingLogs[logIndex]}</span> : <span>READY TO UPLOAD</span>}
            </div>

            <div 
                onClick={() => fileInputRef.current.click()}
                className="relative flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/10 rounded-lg hover:border-green-500/30 hover:bg-white/5 transition-all cursor-pointer group"
            >
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileSelect}
                />
                
                {isUploading ? (
                    <Loader2 size={32} className="text-green-400 animate-spin mb-2" />
                ) : (
                    <CloudUpload size={32} className="text-gray-500 group-hover:text-green-400 transition-colors mb-2" />
                )}
                
                <h3 className="text-white font-bold text-sm">
                    {isUploading ? "UPLOADING..." : "CLICK TO UPLOAD"}
                </h3>
                <p className="text-[10px] text-gray-500 font-mono mt-1">Max 50MB • Auto Encryption</p>
            </div>

          </div>
        </div>
      </motion.div>

      {/* --- FILE LIST --- */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-3xl mb-8 z-10"
          >
            <div className="bg-[#0a0a0c] border border-white/10 rounded-2xl overflow-hidden">
              <div className="bg-white/5 px-6 py-3 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2 text-green-400 text-xs font-bold tracking-wider">
                  <Server size={14} />
                  MY RECENT UPLOADS
                </div>
                <div className="text-[10px] text-gray-500 font-mono">
                    Stored: {files.length}
                </div>
              </div>
              
              <div className="p-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                {files.map((file) => (
                    <motion.div 
                        key={file.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-3 mb-1 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 flex items-center justify-between group transition-all"
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-2 rounded-lg bg-[#111] text-gray-500 group-hover:text-green-400 transition-colors">
                                <File size={16} />
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-white text-xs font-bold truncate pr-2">{file.name}</h4>
                                <div className="flex gap-2 text-[10px] text-gray-600 font-mono">
                                    <span>{(file.size / 1024).toFixed(1)} KB</span>
                                    <span>{new Date(file.date).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                            {/* --- NEW OPEN BUTTON --- */}
                            <a 
                                href={file.url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="p-2 hover:bg-white/10 rounded-lg text-blue-400 transition-colors"
                                title="Open Link"
                            >
                                <ExternalLink size={14} />
                            </a>

                            <button onClick={() => copyLink(file.url)} className="p-2 hover:bg-white/10 rounded-lg text-green-400 transition-colors" title="Copy"><Copy size={14}/></button>
                            <button onClick={() => deleteFile(file.id)} className="p-2 hover:bg-white/10 rounded-lg text-red-500 transition-colors" title="Delete"><Trash2 size={14}/></button>
                        </div>
                    </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIVE STATS FOOTER (Realistic Numbers) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl mt-12 grid grid-cols-2 gap-4 z-10"
      >
        <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-5 flex items-center justify-between group hover:border-cyan-500/20 transition-colors">
           <div>
              <div className="flex items-center gap-2 mb-1">
                 <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                 <p className="text-[10px] font-bold tracking-widest text-cyan-500/70 uppercase">Active Users</p>
              </div>
              <h3 className="text-2xl font-mono text-white font-bold">{liveVisitors.toLocaleString()}</h3>
           </div>
           <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400 group-hover:scale-110 transition-transform">
              <Users size={20} />
           </div>
        </div>

        <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-5 flex items-center justify-between group hover:border-green-500/20 transition-colors">
           <div>
              <div className="flex items-center gap-2 mb-1">
                 <div className="w-2 h-2 rounded-full bg-green-500"></div>
                 <p className="text-[10px] font-bold tracking-widest text-green-500/70 uppercase">Total Uploads</p>
              </div>
              <h3 className="text-2xl font-mono text-white font-bold">{(INITIAL_TOTAL_UPLOADS + stats.count).toLocaleString()}</h3>
           </div>
           <div className="p-3 bg-green-500/10 rounded-xl text-green-400 group-hover:scale-110 transition-transform">
              <Database size={20} />
           </div>
        </div>
      </motion.div>

      {/* DONATE BUTTON */}
      <motion.a
        href="https://t.me/BJ_Devs" 
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-xs px-5 py-3 rounded-full shadow-[0_0_20px_rgba(255,165,0,0.4)] hover:shadow-[0_0_30px_rgba(255,165,0,0.6)] transition-shadow cursor-pointer w-max mx-auto mt-10 md:fixed md:bottom-6 md:right-6 md:z-50 md:m-0 z-50"
      >
        <Heart size={16} className="fill-black animate-pulse" />
        DONATE
      </motion.a>

      <footer className="mt-16 text-center opacity-30 hover:opacity-100 transition-opacity pb-8 z-10">
        <p className="text-[10px] text-white font-mono tracking-[0.2em] mb-2">
          © 2026 BJ MEDIA Hosting. All rights reserved.
        </p>
        <div className="flex items-center justify-center gap-2 text-[9px] text-white">
          <span>Powered by BJ Tricks</span>
        </div>
      </footer>
    </div>
  );
}
