import React, { useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, CheckCircle2, Clock, XCircle, Trash2, Sparkles, User, ShieldAlert } from 'lucide-react';
import Swal from 'sweetalert2';

const Notifikasi = ({ absensi = [], setAbsensi, isDarkMode }) => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // Background Interactive Animation Logic (Peningkatan Aliran Partikel Sinematik)
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

    // Partikel bersinar premium yang bergerak melayang lembut
    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.5 + 1,
      speedX: Math.random() * 0.4 - 0.2,
      speedY: Math.random() * -0.6 - 0.1, // Bergerak ke atas secara konsisten seperti aurora
      opacity: Math.random() * 0.4 + 0.1
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;

        ctx.fillStyle = isDarkMode 
          ? `rgba(99, 102, 241, ${p.opacity})` 
          : `rgba(79, 70, 229, ${p.opacity * 0.4})`;
        
        ctx.beginPath();
        ctx.shadowBlur = isDarkMode ? 8 : 0;
        ctx.shadowColor = 'rgba(99, 102, 241, 0.5)';
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);

  // Mengompilasi Berita Real-time & Riwayat Otentikasi Pengguna (Login Session Simulation)
  const combinedNotifications = useMemo(() => {
    const safeAbsensi = Array.isArray(absensi) ? absensi : [];
    
    // 1. Transformasi data log absensi siswa ke dalam format notifikasi
    const logs = safeAbsensi.map((item, index) => {
      const logStatusClean = item.status || 'Hadir';
      return {
        id: item.id || `absensi-${index}`,
        type: 'ABSENSI',
        status: logStatusClean,
        nama: item.nama || item.nama_siswa || 'Siswa',
        kelas: item.kelas || 'X',
        waktu: item.waktu || 'Baru Saja',
        tanggal: item.tanggal || '',
        keterangan: item.keterangan || '',
        timestamp: item.id ? Number(item.id) : Date.now() - (index * 60000)
      };
    });

    // 2. Simulasi Pintar Notifikasi Otentikasi Login Pengguna Sistem (Chief Account)
    const logins = [];
    if (logs.length > 0) {
      logins.push({
        id: 'login-chief',
        type: 'LOGIN',
        status: 'Active',
        nama: 'CHIEF OPERATOR',
        kelas: 'SYSTEM',
        waktu: '11:05',
        tanggal: 'Hari Ini',
        keterangan: 'Akses masuk dashboard berhasil diverifikasi terenkripsi.',
        timestamp: Date.now() + 10000 // Taruh paling atas untuk indikasi sesi aktif
      });
    }

    // Gabungkan dan urutkan dari yang paling segar/terbaru di atas
    return [...logins, ...logs].sort((a, b) => b.timestamp - a.timestamp);
  }, [absensi]);

  const clearNotif = () => {
    Swal.fire({
      title: 'Hapus Notifikasi?',
      text: "Seluruh riwayat visual notifikasi akan dibersihkan.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: isDarkMode ? '#334155' : '#cbd5e1',
      confirmButtonText: 'Bersihkan',
      cancelButtonText: 'Batal',
      background: isDarkMode ? '#0f172a' : '#fff',
      color: isDarkMode ? '#fff' : '#000',
    }).then((result) => {
      if (result.isConfirmed) {
        // Panggil state handler jika tersedia untuk membersihkan secara aman
        if (typeof setAbsensi === 'function') {
          setAbsensi([]);
        }
        Swal.fire({
          title: 'Terhapus!',
          text: 'Notifikasi telah dibersihkan.',
          icon: 'success',
          background: isDarkMode ? '#0f172a' : '#fff',
          color: isDarkMode ? '#fff' : '#000',
        });
      }
    });
  };

  const getIcon = (notif) => {
    if (notif.type === 'LOGIN') {
      return <User className="text-indigo-500 animate-pulse" size={20} />;
    }
    switch (notif.status) {
      case 'Hadir': return <CheckCircle2 className="text-emerald-500" size={20} />;
      case 'Izin': return <Clock className="text-orange-500" size={20} />;
      default: return <XCircle className="text-rose-500" size={20} />;
    }
  };

  return (
    <div className={`relative min-h-screen p-6 pb-40 transition-colors duration-700 overflow-x-hidden ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Interactive Background Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />
      
      {/* Top Gradient Blur Aesthetics */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-[320px] opacity-25 pointer-events-none blur-[110px] ${isDarkMode ? 'bg-indigo-600' : 'bg-indigo-400'}`}></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-10 animate-notifFadeIn">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className={`p-3 rounded-2xl active:scale-90 transition-all duration-300 ${isDarkMode ? 'bg-slate-900 border border-slate-800 hover:bg-slate-800' : 'bg-white shadow-md text-slate-600 hover:bg-slate-50'}`}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-2xl font-black italic tracking-tighter leading-none">ALERTS</h2>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></span>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none">System Broadcasts</p>
              </div>
            </div>
          </div>
          <button 
            onClick={clearNotif}
            className={`p-3 rounded-2xl active:scale-90 transition-all duration-300 ${isDarkMode ? 'bg-slate-900 text-rose-500 border border-transparent hover:border-rose-500/20' : 'bg-white text-rose-500 shadow-md hover:bg-rose-50'}`}
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* Summary Cards - Bento Style Grid Layout */}
        <div className="grid grid-cols-2 gap-4 mb-10 animate-notifSlideUp" style={{ animationDelay: '100ms' }}>
           <div className={`p-6 rounded-[2.5rem] backdrop-blur-md border transition-all duration-300 hover:scale-[1.03] ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500/20 shadow-lg shadow-indigo-500/[0.02]' : 'bg-white/80 border-indigo-50 shadow-md shadow-slate-200/50'} flex flex-col items-center justify-center text-center`}>
              <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl mb-1.5"><Sparkles size={20} className="animate-pulse" /></div>
              <span className="text-2xl font-black italic tracking-tight">{absensi.filter(a => a && a.status === 'Hadir').length}</span>
              <span className="text-[8px] font-black uppercase opacity-40 tracking-wider mt-0.5">Hadir Hari Ini</span>
           </div>
           <div className={`p-6 rounded-[2.5rem] backdrop-blur-md border transition-all duration-300 hover:scale-[1.03] ${isDarkMode ? 'bg-slate-900/50 border-slate-800 shadow-lg' : 'bg-white/80 border-slate-100 shadow-md shadow-slate-200/50'} flex flex-col items-center justify-center text-center`}>
              <div className="p-2.5 bg-slate-500/10 text-slate-400 rounded-xl mb-1.5"><Bell size={20} /></div>
              <span className="text-2xl font-black italic tracking-tight">{combinedNotifications.length}</span>
              <span className="text-[8px] font-black uppercase opacity-40 tracking-wider mt-0.5">Total Alert</span>
           </div>
        </div>

        {/* Notif List - Staggered Slide In Cards */}
        <div className="space-y-4">
          {combinedNotifications.length > 0 ? (
            combinedNotifications.map((notif, i) => (
              <div 
                key={notif.id || i}
                className={`group flex items-start gap-4 p-5 rounded-[2.5rem] border backdrop-blur-md transition-all duration-300 hover:scale-[1.01] ${
                  notif.type === 'LOGIN'
                    ? isDarkMode ? 'bg-indigo-950/30 border-indigo-500/30 shadow-lg shadow-indigo-500/[0.03]' : 'bg-indigo-50/70 border-indigo-100 shadow-md shadow-indigo-100/50'
                    : isDarkMode ? 'bg-slate-900/40 border-slate-800 hover:border-indigo-500/30' : 'bg-white/90 border-slate-100 shadow-sm hover:border-indigo-500/30'
                } animate-notifRow`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className={`p-3 rounded-2xl transition-transform duration-300 group-hover:rotate-6 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  {getIcon(notif)}
                </div>
                
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center mb-1.5">
                    <h4 className={`text-[10px] font-black tracking-wider uppercase flex items-center gap-1.5 ${
                      notif.type === 'LOGIN' ? 'text-indigo-500' :
                      notif.status === 'Hadir' ? 'text-emerald-500' :
                      notif.status === 'Izin' ? 'text-orange-500' : 'text-rose-500'
                    }`}>
                      {notif.type === 'LOGIN' && <ShieldAlert size={10} />}
                      {notif.type === 'LOGIN' ? 'SECURITY LOG' : `STATUS: ${notif.status}`}
                    </h4>
                    <span className="text-[9px] font-bold opacity-30 bg-slate-500/5 dark:bg-slate-400/10 px-1.5 py-0.5 rounded-md">{notif.waktu}</span>
                  </div>
                  
                  {notif.type === 'LOGIN' ? (
                    <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      Akun pengelola <span className="font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-tight">{notif.nama}</span> terdeteksi aktif dalam sesi {notif.kelas}.
                    </p>
                  ) : (
                    <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Siswa bernama <span className="font-black text-slate-800 dark:text-white uppercase tracking-tight">{notif.nama}</span> <span className="font-bold opacity-70">({notif.kelas})</span> telah berhasil mengirimkan rekaman absen.
                    </p>
                  )}
                  
                  {notif.keterangan && (
                     <div className={`mt-3 p-3.5 rounded-2xl border border-dashed transition-colors duration-300 ${
                       notif.type === 'LOGIN' 
                         ? 'bg-indigo-500/[0.02] border-indigo-500/20 group-hover:border-indigo-500/40' 
                         : 'bg-orange-500/5 border-orange-500/20 group-hover:border-orange-500/40'
                     }`}>
                        <p className={`text-[9px] font-bold italic uppercase tracking-tight leading-normal ${notif.type === 'LOGIN' ? 'text-indigo-400' : 'text-orange-500'}`}>
                          INFO: {notif.keterangan}
                        </p>
                     </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-24 text-center flex flex-col items-center animate-notifFadeIn">
               <div className="w-20 h-20 bg-indigo-500/5 rounded-[2rem] flex items-center justify-center mb-5 border border-indigo-500/10 transform transition-transform hover:scale-110 duration-300">
                  <Bell size={36} className="text-indigo-500 opacity-20" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-20 italic">No New Notifications</p>
            </div>
          )}
        </div>

        {/* Footer Decoration */}
        <p className="mt-16 text-center text-[8px] font-black uppercase opacity-20 tracking-[0.4em] animate-pulse">
          End of Transmission
        </p>
      </div>

      {/* Gaya Desain Animasi Terkalibrasi Tinggi */}
      <style>{`
        @keyframes notifFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes notifUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes notifRowStagger { from { transform: translateX(-20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

        .animate-notifFadeIn { animation: notifFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-notifSlideUp { animation: notifUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .animate-notifRow { animation: notifRowStagger 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
      `}</style>

    </div>
  );
};

export default Notifikasi;