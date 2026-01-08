import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CloudUpload, File, CheckCircle, Trash2, Copy, X, 
  Activity, HardDrive, Zap, Server, Shield, Globe, 
  ArrowLeft, Terminal, Code, Database, Loader2
} from 'lucide-react';
import axios from 'axios';

// --- CONFIG ---
const THEME_COLOR = '#f97316'; // BJ Orange (Change to #3DDC84 for Green)
const API_URL = 'https://bj-media-hosting.pages.dev/api/upload';

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function App() {
  const [view, setView] = useState('home'); // 'home' or 'api'
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // { type: 'success'|'error', msg: '' }
  const fileInputRef = useRef(null);

  // Stats State
  const [stats, setStats] = useState({ count: 0, size: 0, today: 0 });

  // --- INITIAL LOAD ---
  useEffect(() => {
    const savedFiles = JSON.parse(localStorage.getItem('bjFilesPlain') || '[]');
    setFiles(savedFiles);
    calculateStats(savedFiles);
  }, []);

  const calculateStats = (fileList) => {
    const totalSize = fileList.reduce((acc, f) => acc + (f.size || 0), 0);
    const todayStr = new Date().toDateString();
    const todayCount = fileList.filter(f => new Date(f.date).toDateString() === todayStr).length;

    setStats({
      count: fileList.length,
      size: (totalSize / (1024 * 1024)).toFixed(2), // MB
      today: todayCount
    });
  };

  // --- ACTIONS ---
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const uploadFile = async (file) => {
    setIsUploading(true);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Direct Upload to External API (Matches HTML logic)
      const res = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const data = res.data;

      if (data.ok) {
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
        
        setUploadStatus({ type: 'success', msg: 'File Uploaded Successfully!' });
        navigator.clipboard.writeText(data.data); // Auto Copy
      } else {
        throw new Error(data.error || 'Upload Failed');
      }

    } catch (error) {
      console.error(error);
      setUploadStatus({ type: 'error', msg: 'Upload Failed. Try again.' });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const deleteFile = (id) => {
    const updated = files.filter(f => f.id !== id);
    setFiles(updated);
    localStorage.setItem('bjFilesPlain', JSON.stringify(updated));
    calculateStats(updated);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setUploadStatus({ type: 'success', msg: 'Link Copied to Clipboard!' });
    setTimeout(() => setUploadStatus(null), 3000);
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center font-sans bg-[#050505] text-white overflow-x-hidden relative">
      
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px]" style={{ backgroundColor: `${THEME_COLOR}15` }}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      </div>

      {/* NOTIFICATION TOAST */}
      <AnimatePresence>
        {uploadStatus && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-6 z-50 flex items-center gap-3 px-6 py-3 rounded-lg backdrop-blur-md shadow-2xl border"
            style={{ 
              backgroundColor: uploadStatus.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              borderColor: uploadStatus.type === 'success' ? '#22c55e' : '#ef4444',
              color: uploadStatus.type === 'success' ? '#22c55e' : '#ef4444'
            }}
          >
            {uploadStatus.type === 'success' ? <CheckCircle size={18} /> : <X size={18} />}
            <span className="text-sm font-bold tracking-wide">{uploadStatus.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <header className="z-10 w-full max-w-4xl flex justify-between items-center mb-12 mt-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 bg-white/5 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
             <span className="font-bold text-lg" style={{ color: THEME_COLOR }}>BJ</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">BJ HOSTING</h1>
            <div className="flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: THEME_COLOR }}></span>
               <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">System Operational</span>
            </div>
          </div>
        </div>

        <nav className="flex gap-4">
          <button 
            onClick={() => setView('home')} 
            className={`text-xs font-bold px-4 py-2 rounded-lg transition-all border ${view === 'home' ? `bg-[${THEME_COLOR}20] border-[${THEME_COLOR}50]` : 'bg-transparent border-transparent text-gray-500 hover:text-white'}`}
            style={view === 'home' ? { backgroundColor: `${THEME_COLOR}20`, borderColor: `${THEME_COLOR}50`, color: THEME_COLOR } : {}}
          >
            DASHBOARD
          </button>
          <button 
            onClick={() => setView('api')} 
            className={`text-xs font-bold px-4 py-2 rounded-lg transition-all border ${view === 'api' ? `bg-[${THEME_COLOR}20] border-[${THEME_COLOR}50]` : 'bg-transparent border-transparent text-gray-500 hover:text-white'}`}
            style={view === 'api' ? { backgroundColor: `${THEME_COLOR}20`, borderColor: `${THEME_COLOR}50`, color: THEME_COLOR } : {}}
          >
            API DOCS
          </button>
        </nav>
      </header>

      {/* --- HOME VIEW --- */}
      {view === 'home' && (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="w-full max-w-3xl z-10 flex flex-col gap-8"
        >
          {/* STATS GRID (Replaces Icons) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
             <StatsCard icon={<HardDrive size={18}/>} label="Total Files" value={stats.count} color={THEME_COLOR} />
             <StatsCard icon={<Database size={18}/>} label="Used Space" value={`${stats.size} MB`} color="#3b82f6" />
             <StatsCard icon={<Zap size={18}/>} label="Uploaded Today" value={stats.today} color="#eab308" />
             <StatsCard icon={<Activity size={18}/>} label="Bandwidth" value="Unlimited" color="#a855f7" />
          </div>

          {/* UPLOAD BOX (Replaces Search Bar) */}
          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute -inset-1 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" style={{ background: `linear-gradient(to right, ${THEME_COLOR}, #a855f7)` }}></div>
            <div 
              className="relative bg-[#0a0a0c] border border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:border-white/20"
              onClick={() => fileInputRef.current.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileSelect}
              />
              
              <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-6 shadow-xl border border-white/5 group-hover:scale-110 transition-transform duration-300">
                 {isUploading ? (
                    <Loader2 size={40} className="animate-spin" style={{ color: THEME_COLOR }} />
                 ) : (
                    <CloudUpload size={40} style={{ color: THEME_COLOR }} />
                 )}
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">
                {isUploading ? 'Uploading to Server...' : 'Click or Drag to Upload'}
              </h3>
              <p className="text-gray-500 text-xs font-mono">Max 50MB • Secure Encryption • Auto Rename</p>
            </div>
          </motion.div>

          {/* FILE LIST (Replaces Result Card) */}
          {files.length > 0 && (
            <motion.div variants={itemVariants} className="bg-[#0a0a0c] border border-white/10 rounded-2xl overflow-hidden">
               <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                     <Server size={14} style={{ color: THEME_COLOR }} /> RECENT UPLOADS
                  </h3>
                  <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-gray-400">{files.length} Files</span>
               </div>
               
               <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto">
                 <AnimatePresence>
                   {files.map((file) => (
                     <motion.div 
                        key={file.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition group"
                     >
                        <div className="flex items-center gap-4 overflow-hidden">
                           <div className="w-10 h-10 rounded-lg bg-[#111] border border-white/10 flex items-center justify-center text-gray-500 group-hover:text-white transition">
                              <File size={18} />
                           </div>
                           <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-200 truncate pr-4">{file.name}</p>
                              <div className="flex gap-2 text-[10px] text-gray-600 font-mono mt-0.5">
                                 <span>{(file.size / 1024).toFixed(1)} KB</span>
                                 <span>•</span>
                                 <span>{new Date(file.date).toLocaleDateString()}</span>
                              </div>
                           </div>
                        </div>
                        
                        <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition">
                           <button onClick={() => copyToClipboard(file.url)} className="p-2 hover:bg-white/10 rounded-lg text-blue-400" title="Copy Link"><Copy size={14}/></button>
                           <button onClick={() => deleteFile(file.id)} className="p-2 hover:bg-white/10 rounded-lg text-red-400" title="Delete"><Trash2 size={14}/></button>
                        </div>
                     </motion.div>
                   ))}
                 </AnimatePresence>
               </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* --- API VIEW --- */}
      {view === 'api' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl z-10"
        >
          <div className="text-center mb-8">
             <h2 className="text-3xl font-bold text-white mb-2">Developer API</h2>
             <p className="text-gray-500 text-sm">Integrate BJ Hosting into your own applications.</p>
          </div>

          <div className="space-y-6">
            <ApiSection 
               method="POST" 
               url="https://bj-media-hosting.pages.dev/api/upload" 
               title="Upload File"
               description="Upload a file using multipart/form-data. Returns JSON."
               color={THEME_COLOR}
            />
            
            <ApiSection 
               method="GET" 
               url="/api/upload?url=..." 
               title="Remote Upload"
               description="Upload file via URL query parameter."
               color="#3b82f6"
            />

            <div className="bg-[#0a0a0c] border border-white/10 rounded-xl p-6">
               <h3 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2"><Code size={16}/> Response JSON</h3>
               <pre className="bg-black/50 p-4 rounded-lg text-xs font-mono text-gray-400 overflow-x-auto border border-white/5">
{`{
  "ok": true,
  "filename": "file_83920.jpg",
  "size": 83638,
  "data": "https://bj-media-hosting.pages.dev/file/x9k2m.jpg"
}`}
               </pre>
            </div>
          </div>
        </motion.div>
      )}

      {/* FOOTER */}
      <footer className="mt-16 text-center opacity-30 hover:opacity-100 transition-opacity z-10">
        <p className="text-[10px] text-white font-mono tracking-[0.2em] mb-2">
          © 2026 BJ HOSTING. SECURE STORAGE.
        </p>
        <div className="flex items-center justify-center gap-2 text-[9px] text-white">
          <span>Powered by ZeroNaut Engine</span>
        </div>
      </footer>
    </div>
  );
}

// --- HELPER COMPONENTS ---
function StatsCard({ icon, label, value, color }) {
  return (
    <div className="bg-[#0a0a0c] border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-white/20 transition group">
       <div className="mb-2 transition-transform group-hover:scale-110" style={{ color: color }}>{icon}</div>
       <div className="text-lg font-bold text-white font-mono">{value}</div>
       <div className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</div>
    </div>
  );
}

function ApiSection({ method, url, title, description, color }) {
  return (
    <div className="bg-[#0a0a0c] border border-white/10 rounded-xl overflow-hidden">
       <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-3">
             <span className="px-2 py-1 rounded text-[10px] font-bold text-black" style={{ backgroundColor: color }}>{method}</span>
             <span className="text-xs font-mono text-gray-300">{url}</span>
          </div>
       </div>
       <div className="p-4">
          <h4 className="text-white font-bold text-sm mb-1">{title}</h4>
          <p className="text-gray-500 text-xs">{description}</p>
       </div>
    </div>
  );
}
