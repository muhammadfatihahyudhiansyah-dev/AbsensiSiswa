import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, Zap, Clock, ArrowLeft, Heart, Globe, Cpu, 
  ChevronRight, Code2, Share2, Sparkles, MessageCircle, 
  Mail, Send, Copy, CheckCircle2, Camera, Battery, Wifi, Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InfoPage = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);
  
  // State untuk System Monitor
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Battery API
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        setBatteryLevel(Math.round(battery.level * 100));
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      });
    }

    // Online Status API
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Canvas Background Animation
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
      }
      draw() {
        ctx.fillStyle = isDarkMode ? `rgba(99, 102, 241, ${this.opacity})` : `rgba(79, 70, 229, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < 50; i++) particles.push(new Particle());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    init();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isDarkMode]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cardClass = isDarkMode 
    ? 'bg-slate-900/60 border-slate-800/50 backdrop-blur-xl' 
    : 'bg-white/70 border-white shadow-2xl shadow-slate-200/50 backdrop-blur-xl';

  return (
    <div className={`relative min-h-screen p-6 pb-40 overflow-hidden transition-colors duration-700 ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Interactive Background Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Header Section */}
      <div className="relative z-10 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className={`p-4 rounded-2xl active:scale-75 transition-all duration-300 ${isDarkMode ? 'bg-slate-900 border border-slate-800 text-indigo-400' : 'bg-white shadow-lg text-indigo-600'}`}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-black italic tracking-tighter leading-none uppercase">System Info</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></span>
              <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Status: Operational</p>
            </div>
          </div>
        </div>
        <Sparkles className="text-indigo-500 animate-bounce" size={24} />
      </div>

      <div className="relative z-10 space-y-6">
        
        {/* Main Hero Card */}
        <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-10 rounded-[3.5rem] text-white shadow-2xl shadow-indigo-500/40 overflow-hidden group active:scale-95 transition-all duration-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
          <Zap className="absolute -right-4 -top-4 opacity-20 group-hover:rotate-12 transition-transform duration-700" size={150} />
          
          <div className="relative z-10">
            <div className="bg-white/20 w-fit px-4 py-1 rounded-full backdrop-blur-md mb-4 text-[10px] font-black tracking-[0.2em]">VERSION 2.1.0</div>
            <h3 className="text-4xl font-black mb-2 italic tracking-tighter uppercase">SchoolPass</h3>
            <p className="text-xs font-medium opacity-80 leading-relaxed max-w-[250px]">Terminal presensi digital masa depan. Cepat, akurat, dan transparan.</p>
          </div>
        </div>

        {/* Jam Operasional Card */}
        <div className={`${cardClass} p-8 rounded-[3rem] border-2 border-transparent animate-slideUp`}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl"><Clock size={24} /></div>
              <h4 className="font-black text-sm uppercase tracking-widest">Waktu Presensi</h4>
            </div>
            <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[8px] font-black rounded-full border border-emerald-500/20">LIVE GMT+7</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-5 rounded-[2rem] transition-all hover:scale-105 ${isDarkMode ? 'bg-slate-800/40' : 'bg-slate-50'}`}>
              <p className="text-[10px] font-black opacity-40 uppercase mb-1">Gerbang Buka</p>
              <p className="text-xl font-black text-emerald-500 tracking-tighter">06:30</p>
            </div>
            <div className={`p-5 rounded-[2rem] transition-all hover:scale-105 ${isDarkMode ? 'bg-slate-800/40' : 'bg-slate-50'}`}>
              <p className="text-[10px] font-black opacity-40 uppercase mb-1">Batas Telat</p>
              <p className="text-xl font-black text-rose-500 tracking-tighter">07:15</p>
            </div>
          </div>
        </div>

        {/* SYSTEM MONITOR COMPONENT */}
        <div className={`${cardClass} p-8 rounded-[3.5rem] border-2 border-indigo-500/20 animate-slideUp`}>
          <div className="flex items-center gap-3 mb-6">
            <Activity className="text-indigo-500" size={20} />
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Device Health Monitor</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-5 rounded-[2.5rem] ${isDarkMode ? 'bg-slate-800/40' : 'bg-slate-50'}`}>
               <div className="flex justify-between items-start mb-2">
                 <Battery className={batteryLevel < 20 ? 'text-rose-500' : 'text-emerald-500'} size={18} />
                 <span className="text-[8px] font-black opacity-40">BATTERY</span>
               </div>
               <p className="text-2xl font-black tracking-tighter italic">{batteryLevel ? `${batteryLevel}%` : '---'}</p>
            </div>

            <div className={`p-5 rounded-[2.5rem] ${isDarkMode ? 'bg-slate-800/40' : 'bg-slate-50'}`}>
               <div className="flex justify-between items-start mb-2">
                 <Wifi className={isOnline ? 'text-indigo-500' : 'text-rose-500'} size={18} />
                 <span className="text-[8px] font-black opacity-40">NETWORK</span>
               </div>
               <p className={`text-[11px] font-black tracking-tighter italic uppercase ${isOnline ? 'text-indigo-500' : 'text-rose-500'}`}>
                 {isOnline ? 'Online' : 'Offline'}
               </p>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: <ShieldCheck className="text-blue-500" />, title: 'Keamanan', desc: 'AES-256 Encrypted' },
            { icon: <Globe className="text-purple-500" />, title: 'Network', desc: 'Real-time Sync' },
            { icon: <Cpu className="text-amber-500" />, title: 'Engine', desc: 'React 18 Optimized' },
            { icon: <Code2 className="text-rose-500" />, title: 'Dev Mode', desc: 'Bento UI Kit' }
          ].map((item, i) => (
            <div 
              key={i} 
              className={`${cardClass} p-6 rounded-[2.5rem] border-2 border-transparent animate-slideUp group hover:border-indigo-500/50 transition-all cursor-pointer`} 
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">{item.icon}</div>
              <p className="text-[10px] font-black uppercase tracking-wider mb-1">{item.title}</p>
              <p className="text-[9px] font-bold text-slate-400 leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* CONTACT HUB SECTION */}
        <div className={`${cardClass} p-8 rounded-[3.5rem] border-2 border-indigo-500/10 relative overflow-hidden animate-slideUp`}>
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-sm font-black italic tracking-tighter uppercase flex items-center gap-2">
              <Send size={18} className="text-indigo-500" /> Connect with Me
            </h4>
            {copied && (
              <div className="flex items-center gap-1 text-[8px] font-black text-emerald-500">
                <CheckCircle2 size={12} /> EMAIL COPIED
              </div>
            )}
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {[
              { icon: <MessageCircle />, color: 'bg-emerald-500', link: 'https://wa.me/6281374709760' },
              { icon: <Camera />, color: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600', link: 'https://www.instagram.com/fatihahyudhiansyah/' },
              { icon: <Mail />, color: 'bg-blue-600', link: 'mailto:muhammadfatihahyudhiansyah@gmail.com' }
            ].map((contact, i) => (
              <a 
                key={i}
                href={contact.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-16 h-16 shrink-0 ${contact.color} rounded-3xl flex items-center justify-center text-white shadow-lg active:scale-90 transition-all`}
              >
                {contact.icon}
              </a>
            ))}
            <button 
              onClick={() => copyToClipboard('muhammadfatihahyudhiansyah@gmail.com')}
              className={`w-16 h-16 shrink-0 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} rounded-3xl flex items-center justify-center text-indigo-500 border-2 border-dashed border-indigo-500/30 active:scale-90 transition-all`}
            >
              <Copy size={20} />
            </button>
          </div>
        </div>

        {/* Developer Section */}
        <div className={`${cardClass} p-8 rounded-[3rem] border-2 border-indigo-500/20 relative overflow-hidden group animate-slideUp`}>
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
            <Heart size={80} fill="currentColor" />
          </div>
          
          <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <Code2 size={16} className="text-indigo-500" /> Lead Developer
          </h4>
          
          <div className="flex items-center gap-5 mb-6">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-500/20">
              FY
            </div>
            <div>
              <p className="font-black text-lg tracking-tighter italic">M. Fatihah Yudhiansyah</p>
              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Full Stack Engineer</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-90 flex items-center justify-center gap-2">
              <Share2 size={14} /> Bagikan
            </button>
            <button className={`flex-1 py-4 ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-800'} rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-90`}>
              Portfolio
            </button>
          </div>
        </div>
      </div>

      {/* Aesthetic Footer */}
      <div className="relative z-10 mt-12 text-center pb-10">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.5em] opacity-40 italic">
          Built for Future Education
        </p>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp {
          animation: slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default InfoPage;