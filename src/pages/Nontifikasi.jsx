import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, CheckCircle2, Clock, XCircle, Trash2, Sparkles } from 'lucide-react';
import Swal from 'sweetalert2';

const Notifikasi = ({ absensi = [], setAbsensi, isDarkMode }) => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // Background Interactive Animation Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    // Blue/Indigo particles for notification stream
    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speedX: Math.random() * 0.5 - 0.25,
      speedY: Math.random() * 0.5 - 0.25,
      opacity: Math.random() * 0.3
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.fillStyle = isDarkMode ? `rgba(99, 102, 241, ${p.opacity})` : `rgba(79, 70, 229, ${p.opacity * 0.5})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);

  const clearNotif = () => {
    Swal.fire({
      title: 'Hapus Notifikasi?',
      text: "Seluruh riwayat visual notifikasi akan dibersihkan.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      confirmButtonText: 'Bersihkan',
      background: isDarkMode ? '#0f172a' : '#fff',
      color: isDarkMode ? '#fff' : '#000',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Terhapus!', 'Notifikasi telah dibersihkan.', 'success');
      }
    });
  };

  const getIcon = (status) => {
    switch (status) {
      case 'Hadir': return <CheckCircle2 className="text-emerald-500" size={20} />;
      case 'Izin': return <Clock className="text-orange-500" size={20} />;
      default: return <XCircle className="text-rose-500" size={20} />;
    }
  };

  return (
    <div className={`relative min-h-screen p-6 pb-40 transition-colors duration-700 overflow-hidden ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Interactive Background Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />
      
      {/* Top Gradient Blur */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] opacity-20 pointer-events-none blur-[100px] ${isDarkMode ? 'bg-indigo-600' : 'bg-indigo-400'}`}></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className={`p-3 rounded-2xl active:scale-90 transition-all ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white shadow-md text-slate-600'}`}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-2xl font-black italic tracking-tighter leading-none">ALERTS</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none">System Broadcasts</p>
              </div>
            </div>
          </div>
          <button 
            onClick={clearNotif}
            className={`p-3 rounded-2xl active:scale-90 transition-all ${isDarkMode ? 'bg-slate-900 text-rose-500' : 'bg-white text-rose-500 shadow-md'}`}
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-10">
           <div className={`p-6 rounded-[2.5rem] backdrop-blur-md border transition-all hover:scale-105 ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-white/80 border-indigo-50 shadow-sm'} flex flex-col items-center justify-center`}>
              <Sparkles className="text-indigo-500 mb-2" size={24} />
              <span className="text-2xl font-black italic">{absensi.filter(a => a.status === 'Hadir').length}</span>
              <span className="text-[8px] font-black uppercase opacity-40 tracking-tighter">Hadir Hari Ini</span>
           </div>
           <div className={`p-6 rounded-[2.5rem] backdrop-blur-md border transition-all hover:scale-105 ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white/80 border-slate-100 shadow-sm'} flex flex-col items-center justify-center`}>
              <Bell className="text-slate-400 mb-2" size={24} />
              <span className="text-2xl font-black italic">{absensi.length}</span>
              <span className="text-[8px] font-black uppercase opacity-40 tracking-tighter">Total Alert</span>
           </div>
        </div>

        {/* Notif List */}
        <div className="space-y-4">
          {absensi.length > 0 ? (
            [...absensi].reverse().map((notif, i) => (
              <div 
                key={i}
                className={`group flex items-start gap-4 p-5 rounded-[2.5rem] border backdrop-blur-md transition-all hover:border-indigo-500/40 ${
                  isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white/90 border-slate-100 shadow-sm'
                } animate-slideUp`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  {getIcon(notif.status)}
                </div>
                
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-[11px] font-black italic tracking-tight uppercase text-indigo-500">
                      STATUS: {notif.status}
                    </h4>
                    <span className="text-[9px] font-bold opacity-30">{notif.waktu}</span>
                  </div>
                  <p className={`text-[11px] leading-snug ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    <span className="font-black text-slate-800 dark:text-white uppercase tracking-tighter">{notif.nama}</span>
                    <span className="mx-1 font-medium opacity-60">({notif.kelas})</span> melakukan absensi.
                  </p>
                  
                  {notif.status === 'Izin' && (
                     <div className="mt-3 bg-orange-500/5 p-3 rounded-2xl border border-dashed border-orange-500/20">
                        <p className="text-[9px] font-bold text-orange-500 italic uppercase tracking-tighter leading-none">Note: {notif.keterangan || 'Tanpa alasan'}</p>
                     </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-24 text-center flex flex-col items-center">
               <div className="w-20 h-20 bg-indigo-500/5 rounded-full flex items-center justify-center mb-4 border border-indigo-500/10">
                  <Bell size={40} className="text-indigo-500 opacity-20" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-20 italic">No New Notifications</p>
            </div>
          )}
        </div>

        {/* Footer Decoration */}
        <p className="mt-16 text-center text-[8px] font-black uppercase opacity-20 tracking-[0.5em]">
          End of Transmission
        </p>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp {
          animation: slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>

    </div>
  );
};

export default Notifikasi;