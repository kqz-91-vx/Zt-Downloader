import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CloudUpload, Files, HardDrive, Zap, Activity, Clock, 
  Trash2, Copy, ExternalLink, Menu, X, CheckCircle, 
  AlertCircle, Send, Globe, ShieldCheck, Infinity as InfinityIcon,
  Code, Terminal, FileCode, Command, ArrowLeft, Loader2
} from 'lucide-react';
import axios from 'axios';

// --- CONFIGURATION ---
const API_URL = 'https://bj-media-hosting.pages.dev/api/upload';
const TELEGRAM_CHANNEL = 'https://t.me/BJ_Devs';
const DEVELOPER_CONTACT = 'https://t.me/BJ_Coder';

export default function App() {
  const [view, setView] = useState('home'); // 'home' | 'api'
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  
  const fileInputRef = useRef(null);

  // --- INITIAL LOAD & STATS ---
  useEffect(() => {
    const saved = localStorage.getItem('bjFilesReact');
    if (saved) {
      setFiles(JSON.parse(saved));
    }
  }, []);

  const saveFilesToStorage = (newFiles) => {
    setFiles(newFiles);
    localStorage.setItem('bjFilesReact', JSON.stringify(newFiles));
  };

  // Stats Calculation
  const totalFiles = files.length;
  const totalSize = (files.reduce((acc, f) => acc + (f.size || 0), 0) / (1024 * 1024)).toFixed(2);
  const uploadsToday = files.filter(f => new Date(f.date).toDateString() === new Date().toDateString()).length;

  // --- ACTIONS ---
  const showNotify = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const data = response.data;

      if (data.ok) {
        const newFile = {
            id: Date.now(),
            name: data.filename || file.name,
            url: data.data,
            size: file.size,
            date: new Date().toISOString()
        };
        
        const updatedList = [newFile, ...files];
        saveFilesToStorage(updatedList);
        
        await navigator.clipboard.writeText(data.data);
        showNotify("File Uploaded & Link Copied!", "success");
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error) {
      console.error(error);
      showNotify("Upload Failed: " + (error.response?.data?.error || error.message), "error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this file from your history?")) {
      const updated = files.filter(f => f.id !== id);
      saveFilesToStorage(updated);
      showNotify("Removed from history.", "success");
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotify("Link copied to clipboard!", "success");
    } catch (err) {
      showNotify("Failed to copy", "error");
    }
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-orange-500/30 selection:text-orange-100 flex flex-col relative overflow-x-hidden">
      
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-800/10 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      </div>

      {/* NOTIFICATION TOAST */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className={`fixed top-6 left-0 right-0 mx-auto w-max max-w-[90%] z-[100] px-6 py-3 rounded-full shadow-2xl border backdrop-blur-md flex items-center gap-3 ${
              notification.type === 'error' 
                ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                : 'bg-green-500/10 border-green-500/20 text-green-400'
            }`}
          >
            {notification.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
            <span className="text-sm font-bold">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVBAR */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between gap-3">
                {/* Logo */}
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setView('home'); window.scrollTo(0,0); }}>
                    <div className="grid h-10 w-10 place-items-center rounded-xl border border-orange-500/25 bg-orange-500/10 text-orange-200 shadow-lg shadow-orange-900/10">
                        <span className="text-sm font-bold tracking-tight">BJ</span>
                    </div>
                    <div className="leading-tight">
                        <div className="text-sm font-bold tracking-tight text-zinc-100">BJ Hosting</div>
                        <div className="text-[10px] text-zinc-400 font-mono">SECURE • FAST • FREE</div>
                    </div>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    <button onClick={() => setView('home')} className={`text-sm transition ${view === 'home' ? 'text-orange-400 font-bold' : 'text-zinc-400 hover:text-white'}`}>Dashboard</button>
                    <button onClick={() => setView('api')} className={`text-sm transition ${view === 'api' ? 'text-orange-400 font-bold' : 'text-zinc-400 hover:text-white'}`}>API Docs</button>
                    <div className="h-4 w-px bg-white/10"></div>
                    <a href={TELEGRAM_CHANNEL} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-black text-xs font-bold hover:bg-orange-400 transition">
                        <Send size={14} /> Join Channel
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 text-zinc-400 hover:text-white">
                    <Menu />
                </button>
            </div>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm md:hidden"
                onClick={() => setMobileMenuOpen(false)}
            >
                <motion.div 
                    initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                    className="absolute right-0 top-0 h-full w-[280px] bg-[#0a0a0a] border-l border-white/10 p-6 flex flex-col gap-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-lg text-white">Menu</span>
                        <button onClick={() => setMobileMenuOpen(false)} className="text-zinc-500 hover:text-white"><X /></button>
                    </div>
                    <button onClick={() => { setView('home'); setMobileMenuOpen(false); }} className="text-left p-3 rounded-lg hover:bg-white/5 text-zinc-300">Dashboard</button>
                    <button onClick={() => { setView('api'); setMobileMenuOpen(false); }} className="text-left p-3 rounded-lg hover:bg-white/5 text-zinc-300">API Documentation</button>
                    <div className="h-px bg-white/10 my-2"></div>
                    <a href={TELEGRAM_CHANNEL} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold">
                        <Send size={16} /> Join Channel
                    </a>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow pt-28 pb-20 px-4 max-w-5xl mx-auto w-full">
        <AnimatePresence mode="wait">
            
            {/* --- HOME VIEW --- */}
            {view === 'home' ? (
                <motion.div 
                    key="home"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* HERO HEADER */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold tracking-widest uppercase mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                            System Operational
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black mb-4 text-white tracking-tight leading-tight">
                            Professional Simple Secure <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-200">File Hosting</span>
                        </h1>
                        <p className="text-zinc-400 max-w-lg mx-auto leading-relaxed text-sm md:text-base">
                            Upload your files in moments. Unlimited storage, enterprise-grade security, and blazing-fast global access.
                        </p>
                    </div>

                    {/* STATS GRID */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                        {[
                            { label: 'Total Files', value: totalFiles, icon: <Files size={20}/> },
                            { label: 'Total Size', value: `${totalSize} MB`, icon: <HardDrive size={20}/> },
                            { label: 'Today', value: uploadsToday, icon: <Zap size={20}/> },
                            { label: 'Bandwidth', value: '∞', icon: <Activity size={20}/> },
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-white/[0.03] border border-white/10 rounded-xl p-5 text-center hover:border-orange-500/20 hover:bg-orange-500/5 transition duration-300 group">
                                <div className="text-zinc-500 group-hover:text-orange-400 mb-2 flex justify-center transition-colors">{stat.icon}</div>
                                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-[10px] text-zinc-500 uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* UPLOAD AREA */}
                    <motion.div 
                        whileHover={{ scale: 1.01 }}
                        className="mb-12 relative group cursor-pointer"
                        onClick={() => !isUploading && fileInputRef.current.click()}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                        <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:border-orange-500/40 transition duration-300 min-h-[250px]">
                            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                            
                            {isUploading ? (
                                <div className="flex flex-col items-center">
                                    <Loader2 size={48} className="text-orange-500 animate-spin mb-4" />
                                    <h3 className="text-xl font-bold text-white animate-pulse">Uploading File...</h3>
                                    <p className="text-zinc-500 text-xs mt-2">Please wait while we secure your data</p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-900/10 flex items-center justify-center text-orange-500 mb-6 shadow-xl shadow-orange-900/10 border border-orange-500/10 group-hover:scale-110 transition-transform duration-300">
                                        <CloudUpload size={40} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Click to Upload</h3>
                                    <p className="text-zinc-500 text-sm">Max 20MB • Auto Rename • Instant Link</p>
                                </>
                            )}
                        </div>
                    </motion.div>

                    {/* FILE HISTORY LIST */}
                    {files.length > 0 && (
                        <div className="mb-12 bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
                            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <Clock size={16} className="text-orange-500" /> Recent Uploads
                                </h3>
                                <span className="text-[10px] bg-orange-500/10 border border-orange-500/20 text-orange-400 px-2 py-1 rounded font-mono">
                                    {files.length} FILES
                                </span>
                            </div>
                            <div className="divide-y divide-white/5">
                                {files.map((file) => (
                                    <motion.div 
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        key={file.id} 
                                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition group"
                                    >
                                        <div className="flex items-center gap-4 overflow-hidden">
                                            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500 group-hover:text-orange-500 group-hover:border-orange-500/30 transition shrink-0">
                                                <Files size={20} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-zinc-200 truncate font-mono">{file.name}</p>
                                                <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">
                                                    <span>{(file.size / 1024).toFixed(1)} KB</span>
                                                    <span>•</span>
                                                    <span>{new Date(file.date).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition duration-200">
                                            <a href={file.url} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-orange-500/10 hover:text-orange-400 text-zinc-400 transition" title="Open">
                                                <ExternalLink size={16} />
                                            </a>
                                            <button onClick={() => copyToClipboard(file.url)} className="p-2 rounded-lg bg-white/5 hover:bg-blue-500/10 hover:text-blue-400 text-zinc-400 transition" title="Copy Link">
                                                <Copy size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(file.id)} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-zinc-400 transition" title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* FEATURES GRID */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <FeatureCard icon={<InfinityIcon size={20}/>} title="Unlimited Storage" desc="Store as many files as you want without restrictions." />
                        <FeatureCard icon={<ShieldCheck size={20}/>} title="Secure & Private" desc="Files are renamed randomly and stored securely." />
                        <FeatureCard icon={<Globe size={20}/>} title="Global CDN" desc="Lightning fast download speeds from anywhere." />
                    </div>

                </motion.div>
            ) : (
                /* --- API DOCUMENTATION VIEW --- */
                <motion.div 
                    key="api"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <button onClick={() => setView('home')} className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-orange-400 transition group text-sm">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
                    </button>

                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">BJ Hosting API</h1>
                        <p className="text-zinc-400">Simple, powerful file hosting API for developers.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                        {['RESTful API', 'URL Upload', 'JSON Response', '50MB Limit'].map((tag, i) => (
                            <div key={i} className="bg-[#0f0f0f] border border-white/10 rounded-lg p-3 text-center text-xs text-zinc-300 font-mono">
                                {tag}
                            </div>
                        ))}
                    </div>

                    {/* API ENDPOINTS */}
                    <div className="space-y-8">
                        {/* POST Upload */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <CloudUpload className="text-orange-500" /> File Upload (POST)
                            </h2>
                            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6">
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
                                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded text-xs font-bold border border-green-500/30">POST</span>
                                    <code className="text-zinc-200 text-sm font-mono bg-black/50 px-2 py-1 rounded break-all">{API_URL}</code>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm text-zinc-300">
                                        <thead className="border-b border-white/10 text-zinc-500 text-xs uppercase">
                                            <tr><th className="py-2">Key</th><th className="py-2">Type</th><th className="py-2">Description</th></tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="py-3 font-mono text-orange-400">file</td>
                                                <td className="py-3 text-zinc-500">multipart</td>
                                                <td className="py-3">The file to upload (Max 50MB)</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>

                        {/* RESPONSE SAMPLE */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <CheckCircle className="text-orange-500" /> JSON Response
                            </h2>
                            <div className="bg-[#0f0f0f] border border-zinc-800 rounded-lg p-4 font-mono text-xs md:text-sm text-zinc-300 overflow-x-auto">
                                <pre>{`{
  "creator": "@BJ_Devs on Telegram",
  "ok": true,
  "filename": "file_83920.jpg",
  "size": 83638,
  "uploaded_on": "2026-01-07T14:11:52.833Z",
  "media_type": "image/jpeg",
  "data": "https://bj-media-hosting.pages.dev/file/x9k2m/image.jpg"
}`}</pre>
                            </div>
                        </section>

                        {/* CODE SNIPPETS */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <Code className="text-orange-500" /> Code Examples
                            </h2>
                            <div className="space-y-6">
                                <CodeSnippet 
                                    icon={<Terminal size={16}/>} title="Python" 
                                    code={`import requests\n\nurl = "${API_URL}"\nfiles = {'file': open('image.jpg', 'rb')}\nresponse = requests.post(url, files=files)\nprint(response.json())`} 
                                />
                                <CodeSnippet 
                                    icon={<FileCode size={16}/>} title="JavaScript (Fetch)" 
                                    code={`const formData = new FormData();\nformData.append('file', fileInput.files[0]);\n\nconst response = await fetch('${API_URL}', {\n  method: 'POST',\n  body: formData\n});\nconst result = await response.json();`} 
                                />
                                <CodeSnippet 
                                    icon={<Command size={16}/>} title="cURL" 
                                    code={`curl -X POST ${API_URL} \\\n  -F "file=@/path/to/your/image.jpg"`} 
                                />
                            </div>
                        </section>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black mt-auto z-10">
        <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col items-center gap-4">
            <p className="text-sm text-zinc-500">
                © 2026 BJ HOSTING. Developed by <a href={TELEGRAM_CHANNEL} target="_blank" rel="noreferrer" className="text-orange-400 hover:text-orange-300 transition">BJ Tricks</a>
            </p>
            <div className="flex gap-4">
                <FooterIcon href={TELEGRAM_CHANNEL} icon={<Send size={18} />} />
                <FooterIcon href={DEVELOPER_CONTACT} icon={<Code size={18} />} />
            </div>
        </div>
      </footer>

    </div>
  );
}

// --- HELPER COMPONENTS ---

const FeatureCard = ({ icon, title, desc }) => (
    <div className="bg-white/[0.03] border border-white/10 p-6 rounded-xl hover:border-orange-500/30 transition group">
        <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-zinc-400">{desc}</p>
    </div>
);

const CodeSnippet = ({ icon, title, code }) => (
    <div className="mb-4">
        <h3 className="text-sm font-semibold text-zinc-200 mb-2 flex items-center gap-2">{icon} {title}</h3>
        <div className="bg-[#0f0f0f] border border-zinc-800 rounded-lg p-4 font-mono text-xs md:text-sm text-zinc-400 overflow-x-auto">
            <pre>{code}</pre>
        </div>
    </div>
);

const FooterIcon = ({ href, icon }) => (
    <a href={href} target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-orange-500/10 hover:text-orange-400 text-zinc-400 transition border border-white/5 hover:border-orange-500/20">
        {icon}
    </a>
);
