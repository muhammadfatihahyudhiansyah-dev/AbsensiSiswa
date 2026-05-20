import React, { useMemo } from 'react';
import { 
  LayoutGrid, Users, Trophy, Activity, Info, 
  ChevronRight, Zap, Bell, Calendar, ArrowUpRight 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = ({ dataSiswa = [], absensi = [], isDarkMode }) => {
  const navigate = useNavigate();

  // Memastikan data aman berupa array untuk menghindari error .length
  const safeDataSiswa = Array.isArray(dataSiswa) ? dataSiswa : [];
  const safeAbsensi = Array.isArray(absensi) ? absensi : [];

  // Menghitung jumlah notifikasi secara efisien
  const notificationCount = useMemo(() => {
    return safeAbsensi.length > 5 ? 5 : safeAbsensi.length;
  }, [safeAbsensi]);

  // Styling logic
  const cardClass = isDarkMode 
    ? 'bg-slate-900/40 border-slate-800 backdrop-blur-md' 
    : 'bg-white/80 border-white shadow-2xl shadow-slate-200/50 backdrop-blur-md';

  return (
    <div className={`p-6 pb-40 space-y-8 animate-fadeIn transition-colors duration-500 ${isDarkMode ? 'bg-[#020617]' : 'bg-slate-50'}`}>
      
      {/* Top Bar - Decorative */}
      <div className="flex justify-between items-center px-2">
        <div>
          <h4 className="text-[10px] font-black text-indigo-500 tracking-[0.3em] uppercase">Control Panel</h4>
          <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div 
          onClick={() => navigate('/notifikasi')}
          className="relative cursor-pointer active:scale-90 transition-transform group"
        >
          <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-slate-900' : 'bg-white shadow-sm'}`}>
            <Bell className={isDarkMode ? 'text-slate-400 group-hover:text-indigo-400' : 'text-slate-600 group-hover:text-indigo-600'} size={20} />
          </div>
          
          {/* Animasi Banner/Dot Merah yang keren */}
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

      {/* Hero Section - Animasi Floating */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-8 rounded-[3rem] text-white shadow-2xl shadow-indigo-500/30 group active:scale-95 transition-transform duration-500">
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

      {/* Stats Section - Bento Style */}
      <div className="grid grid-cols-2 gap-4">
        {/* Stat 1 */}
        <div 
          onClick={() => navigate('/datasiswa')}
          className={`${cardClass} p-6 rounded-[2.5rem] border-2 group cursor-pointer hover:scale-[1.02] active:scale-95 transition-all duration-300 overflow-hidden relative`}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all">
            <ArrowUpRight size={20} />
          </div>
          <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 mb-4 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-500">
            <Users size={24} />
          </div>
          <p className={`text-3xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{safeDataSiswa.length}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Students</p>
        </div>

        {/* Stat 2 */}
        <div 
          onClick={() => navigate('/riwayat')}
          className={`${cardClass} p-6 rounded-[2.5rem] border-2 group cursor-pointer hover:scale-[1.02] active:scale-95 transition-all duration-300 overflow-hidden relative`}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all">
            <ArrowUpRight size={20} />
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-500">
            <Activity size={24} />
          </div>
          <p className={`text-3xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{safeAbsensi.length}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Activities</p>
        </div>
      </div>

      {/* Floating Menu - Interactive Grid */}
      <div className="grid grid-cols-4 gap-4 px-2">
        {[
          { icon: <Trophy />, label: 'Rank', path: '/leaderboard', color: 'from-amber-400 to-orange-600' },
          { icon: <LayoutGrid />, label: 'Data', path: '/datasiswa', color: 'from-blue-400 to-indigo-600' },
          { icon: <Info />, label: 'Info', path: '/info', color: 'from-rose-400 to-pink-600' },
          { icon: <Calendar />, label: 'Logs', path: '/riwayat', color: 'from-violet-400 to-fuchsia-600' },
        ].map((item, i) => (
          <button 
            key={i} 
            onClick={() => navigate(item.path)} 
            className="flex flex-col items-center gap-3 active:scale-75 transition-all animate-slideUp group" 
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className={`bg-gradient-to-tr ${item.color} p-5 rounded-[2rem] text-white shadow-lg shadow-inner group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300`}>
              {item.icon}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-tighter ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Feed Section - Glass List */}
      <div className={`${cardClass} p-8 rounded-[3.5rem] border-2 relative overflow-hidden`}>
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            <h4 className={`text-sm font-black italic tracking-tighter uppercase ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Recent Feed</h4>
          </div>
          <Link to="/riwayat" className="group text-[10px] font-black text-indigo-500 flex items-center gap-1 bg-indigo-500/10 px-3 py-1.5 rounded-full hover:bg-indigo-500 hover:text-white transition-all">
            VIEW ALL <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="space-y-5">
          {safeAbsensi.length > 0 ? safeAbsensi.slice(0, 3).map((item, i) => {
            // Pengaman inisial huruf pertama jika data string kosong / bermasalah
            const initialLetter = item.nama && typeof item.nama === 'string' && item.nama.length > 0
              ? item.nama[0].toUpperCase()
              : '?';

            return (
              <div 
                key={item.id || i} 
                className={`flex items-center gap-4 p-3 rounded-3xl transition-all hover:bg-slate-500/5 animate-slideUp border border-transparent hover:border-slate-500/10`} 
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center font-black text-indigo-500 shadow-sm">
                  {initialLetter}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-black truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{item.nama || 'Tanpa Nama'}</p>
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
    </div>
  );
};

export default Dashboard;