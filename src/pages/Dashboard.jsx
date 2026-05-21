import React, { useMemo, useState, useEffect } from 'react';
import { 
  LayoutGrid, Users, Trophy, Activity, Info, 
  ChevronRight, Zap, Bell, Calendar as CalendarIcon, ArrowUpRight 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = ({ dataSiswa = [], absensi = [], isDarkMode }) => {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  // Perbarui state waktu setiap detik untuk jam analog dan kalender
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Memastikan data aman berupa array untuk menghindari error .length
  const safeDataSiswa = Array.isArray(dataSiswa) ? dataSiswa : [];
  const safeAbsensi = Array.isArray(absensi) ? absensi : [];

  // Menghitung jumlah notifikasi secara efisien
  const notificationCount = useMemo(() => {
    return safeAbsensi.length > 5 ? 5 : safeAbsensi.length;
  }, [safeAbsensi]);

  // Kalkulasi derajat rotasi jarum jam analog
  const clockDegrees = useMemo(() => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    return {
      hour: ((hours % 12) * 30) + (minutes * 0.5),
      minute: (minutes * 6) + (seconds * 0.1),
      second: seconds * 6
    };
  }, [time]);

  // Styling logic
  const cardClass = isDarkMode 
    ? 'bg-slate-900/40 border-slate-800 backdrop-blur-md text-white shadow-xl shadow-black/10' 
    : 'bg-white/80 border-white shadow-2xl shadow-slate-200/50 backdrop-blur-md text-slate-800';

  return (
    <div className={`p-6 pb-40 space-y-8 overflow-x-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#020617]' : 'bg-slate-50'}`}>
      
      {/* Top Bar - Decorative */}
      <div className="flex justify-between items-center px-2 animate-dashboardFadeIn">
        <div>
          <h4 className="text-[10px] font-black text-indigo-500 tracking-[0.3em] uppercase">Control Panel</h4>
          <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {time.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div 
          onClick={() => navigate('/notifikasi')}
          className="relative cursor-pointer active:scale-90 transition-transform group"
        >
          <div className={`p-3 rounded-2xl transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border border-slate-800 hover:bg-slate-800' : 'bg-white shadow-md hover:bg-slate-50'}`}>
            <Bell className={isDarkMode ? 'text-slate-400 group-hover:text-indigo-400' : 'text-slate-600 group-hover:text-indigo-600'} size={20} />
          </div>
          
          {/* Animasi Banner/Dot Merah */}
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 border-2 border-white dark:border-slate-900 items-center justify-center text-[8px] font-black text-white">
                {notificationCount}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Hero Section - Animasi Floating Premium */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-8 rounded-[3rem] text-white shadow-2xl shadow-indigo-500/30 group active:scale-95 transition-transform duration-500 animate-dashboardSlideUp">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
        <Zap className="absolute -right-4 -bottom-4 text-white/10 rotate-12 group-hover:rotate-0 group-hover:scale-125 transition-all duration-700" size={180} />
        
        <div className="relative z-10">
          <div className="bg-white/20 w-fit px-4 py-1 rounded-full backdrop-blur-md mb-4">
            <span className="text-[10px] font-black tracking-widest uppercase">Premium Access</span>
          </div>
          <h2 className="text-4xl font-black italic tracking-tighter mb-1">HELLO, CHIEF!</h2>
          <p className="text-xs font-medium opacity-80 leading-relaxed max-w-[200px]">
            Sistem absensi digital sedang berjalan optimal hari ini.
          </p>
        </div>
      </div>

      {/* FITUR BARU: Interactive Time & Calendar Bento Grid */}
      <div className="grid grid-cols-12 gap-4 animate-dashboardSlideUp" style={{ animationDelay: '100ms' }}>
        {/* Widget Jam Analog */}
        <div className={`${cardClass} col-span-5 p-4 rounded-[2.5rem] border flex flex-col items-center justify-center relative overflow-hidden group hover:scale-[1.03] transition-all duration-300`}>
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-indigo-500/30 flex items-center justify-center relative bg-gradient-to-b from-indigo-500/[0.02] to-transparent shadow-inner">
            {/* Center Dot */}
            <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full z-30 shadow-md shadow-indigo-500/50"></div>
            
            {/* Hour Hand */}
            <div 
              className="absolute bottom-10 left-1/2 w-1 h-6 bg-slate-700 dark:bg-slate-300 rounded-full origin-bottom z-10"
              style={{ transform: `translateX(-50%) rotate(${clockDegrees.hour}deg)`, transition: 'transform 0.5s cubic-bezier(0.4, 2.08, 0.55, 1)' }}
            />
            {/* Minute Hand */}
            <div 
              className="absolute bottom-10 left-1/2 w-0.75 h-8 bg-indigo-500 rounded-full origin-bottom z-20"
              style={{ transform: `translateX(-50%) rotate(${clockDegrees.minute}deg)`, transition: 'transform 0.5s cubic-bezier(0.4, 2.08, 0.55, 1)' }}
            />
            {/* Second Hand */}
            <div 
              className="absolute bottom-10 left-1/2 w-0.5 h-9 bg-rose-500 rounded-full origin-bottom z-20"
              style={{ transform: `translateX(-50%) rotate(${clockDegrees.second}deg)`, transition: 'transform 0.1s cubic-bezier(0.4, 2.08, 0.55, 1)' }}
            />

            {/* Jam Penunjuk Angka Minimalis */}
            <span className="absolute top-1 text-[8px] font-black text-slate-400 opacity-60">12</span>
            <span className="absolute bottom-1 text-[8px] font-black text-slate-400 opacity-60">6</span>
          </div>
          <p className="text-[11px] font-black tracking-tight mt-3 text-center uppercase">
            {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
        </div>

        {/* Widget Kalender Dinamis */}
        <div className={`${cardClass} col-span-7 p-5 rounded-[2.5rem] border flex items-center gap-4 group hover:scale-[1.03] transition-all duration-300 relative overflow-hidden`}>
          <div className="p-3.5 bg-indigo-500/10 text-indigo-500 rounded-2xl group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-500">
            <CalendarIcon size={22} className="animate-pulse" />
          </div>
          <div className="min-w-0">
            <p className="text-[8px] font-black text-indigo-500 uppercase tracking-widest leading-none mb-1.5">Live Calendar</p>
            <p className="text-2xl font-black italic tracking-tighter leading-none mb-1">
              {time.getDate()} <span className="text-xs font-bold not-italic text-slate-400 uppercase tracking-wider">{time.toLocaleDateString('id-ID', { month: 'short' })}</span>
            </p>
            <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-tight">Tahun {time.getFullYear()}</p>
          </div>
        </div>
      </div>

      {/* Stats Section - Bento Style */}
      <div className="grid grid-cols-2 gap-4 animate-dashboardSlideUp" style={{ animationDelay: '200ms' }}>
        {/* Stat 1 */}
        <div 
          onClick={() => navigate('/datasiswa')}
          className={`${cardClass} p-6 rounded-[2.5rem] border group cursor-pointer hover:scale-[1.02] active:scale-95 transition-all duration-300 overflow-hidden relative`}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all">
            <ArrowUpRight size={20} />
          </div>
          <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 mb-4 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-500">
            <Users size={24} />
          </div>
          <p className="text-3xl font-black italic tracking-tighter leading-none">{safeDataSiswa.length}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">Students</p>
        </div>

        {/* Stat 2 */}
        <div 
          onClick={() => navigate('/riwayat')}
          className={`${cardClass} p-6 rounded-[2.5rem] border group cursor-pointer hover:scale-[1.02] active:scale-95 transition-all duration-300 overflow-hidden relative`}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all">
            <ArrowUpRight size={20} />
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-500">
            <Activity size={24} />
          </div>
          <p className="text-3xl font-black italic tracking-tighter leading-none">{safeAbsensi.length}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">Activities</p>
        </div>
      </div>

      {/* Floating Menu - Interactive Grid */}
      <div className="grid grid-cols-4 gap-4 px-2">
        {[
          { icon: <Trophy />, label: 'Rank', path: '/leaderboard', color: 'from-amber-400 to-orange-600' },
          { icon: <LayoutGrid />, label: 'Data', path: '/datasiswa', color: 'from-blue-400 to-indigo-600' },
          { icon: <Info />, label: 'Info', path: '/info', color: 'from-rose-400 to-pink-600' },
          { icon: <CalendarIcon />, label: 'Logs', path: '/riwayat', color: 'from-violet-400 to-fuchsia-600' },
        ].map((item, i) => (
          <button 
            key={i} 
            onClick={() => navigate(item.path)} 
            className="flex flex-col items-center gap-3 active:scale-75 transition-all animate-dashboardGridUp group" 
            style={{ animationDelay: `${i * 80 + 300}ms` }}
          >
            <div className={`bg-gradient-to-tr ${item.color} p-5 rounded-[2rem] text-white shadow-lg group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300`}>
              {item.icon}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-tighter ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Feed Section - Glass List */}
      <div className={`${cardClass} p-8 rounded-[3.5rem] border relative overflow-hidden animate-dashboardSlideUp`} style={{ animationDelay: '450ms' }}>
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            <h4 className="text-sm font-black italic tracking-tighter uppercase">Recent Feed</h4>
          </div>
          <Link to="/riwayat" className="group text-[10px] font-black text-indigo-500 flex items-center gap-1 bg-indigo-500/10 px-3 py-1.5 rounded-full hover:bg-indigo-500 hover:text-white transition-all">
            VIEW ALL <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="space-y-5">
          {safeAbsensi.length > 0 ? safeAbsensi.slice(0, 3).map((item, i) => {
            const initialLetter = item.nama && typeof item.nama === 'string' && item.nama.length > 0
              ? item.nama[0].toUpperCase()
              : '?';

            return (
              <div 
                key={item.id || i} 
                className={`flex items-center gap-4 p-3 rounded-3xl transition-all hover:bg-slate-500/5 border border-transparent hover:border-slate-500/10 group`} 
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center font-black text-indigo-500 shadow-sm transition-transform duration-300 group-hover:rotate-6">
                  {initialLetter}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black truncate uppercase tracking-tight transition-colors duration-300 group-hover:text-indigo-500">{item.nama || 'Tanpa Nama'}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.waktu || '--:--'} • {item.status || 'Tidak Diketahui'}</p>
                </div>
                <div className={`h-10 w-1 rounded-full ${item.status === 'Hadir' ? 'bg-emerald-500' : item.status === 'Izin' ? 'bg-orange-500' : 'bg-rose-500'} shadow-[0_0_8px_rgba(0,0,0,0.1)]`} />
              </div>
            );
          }) : (
            <div className="py-10 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] opacity-30 italic">No activity yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Gaya Kustom Animasi CSS Terintegrasi */}
      <style>{`
        @keyframes dFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes dSlide { from { transform: translateY(25px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes dGrid { from { transform: scale(0.8) translateY(15px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }

        .animate-dashboardFadeIn { animation: dFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-dashboardSlideUp { animation: dSlide 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .animate-dashboardGridUp { animation: dGrid 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.2) forwards; opacity: 0; }
      `}</style>
    </div>
  );
};

export default Dashboard;