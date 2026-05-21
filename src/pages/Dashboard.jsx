import React, { useMemo, useState, useEffect } from 'react';
import {
  LayoutGrid,
  Users,
  Trophy,
  Activity,
  Info,
  ChevronRight,
  Zap,
  Bell,
  Calendar as CalendarIcon,
  ArrowUpRight,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

const Dashboard = ({ dataSiswa: propsDataSiswa = [], absensi: propsAbsensi = [], isDarkMode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  
  // State lokal untuk sinkronisasi data dari Supabase jika props kosong
  const [dbDataSiswa, setDbDataSiswa] = useState([]);
  const [dbAbsensi, setDbAbsensi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myRole, setMyRole] = useState('SISWA');

  // FETCH DATA SECARA REAL-TIME DARI SUPABASE
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Ambil data siswa
        const { data: siswaData, error: errorSiswa } = await supabase
          .from('dataSiswa')
          .select('*');
        if (!errorSiswa && siswaData) setDbDataSiswa(siswaData);

        // Ambil data absensi diurutkan dari yang paling baru
        const { data: absensiData, error: errorAbsensi } = await supabase
          .from('absensi')
          .select('*')
          .order('id', { ascending: false });
        if (!errorAbsensi && absensiData) setDbAbsensi(absensiData);

        // Identifikasi Role Aktif Pengguna dari Database Berdasarkan Email Session
        if (user?.email) {
          const { data: currentSiswa, error: errorRole } = await supabase
            .from('dataSiswa')
            .select('role')
            .eq('email', user.email)
            .maybeSingle();
          if (!errorRole && currentSiswa?.role) {
            setMyRole(currentSiswa.role.toUpperCase());
          }
        }

      } catch (err) {
        console.error('Error fetching dashboard data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Perbarui state waktu setiap detik untuk jam analog dan kalender
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Gunakan data dari Supabase, jika kosong/gagal baru fallback ke props bawaan
  const safeDataSiswa = useMemo(() => dbDataSiswa.length > 0 ? dbDataSiswa : (Array.isArray(propsDataSiswa) ? propsDataSiswa : []), [dbDataSiswa, propsDataSiswa]);
  const safeAbsensi = useMemo(() => dbAbsensi.length > 0 ? dbAbsensi : (Array.isArray(propsAbsensi) ? propsAbsensi : []), [dbAbsensi, propsAbsensi]);

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
      hour: (hours % 12) * 30 + minutes * 0.5,
      minute: minutes * 6 + seconds * 0.1,
      second: seconds * 6,
    };
  }, [time]);

  // Filter Menu Berdasarkan Otoritas Kredensial (Role-Based Filtering)
  const filteredMenuItems = useMemo(() => {
    const allItems = [
      {
        icon: <Trophy size={20} />,
        label: 'Rank',
        path: '/leaderboard',
        color: 'from-amber-400 to-orange-600',
        roles: ['ADMIN', 'GURU', 'SISWA'],
      },
      {
        icon: <LayoutGrid size={20} />,
        label: 'Data',
        path: '/datasiswa',
        color: 'from-blue-400 to-indigo-600',
        roles: ['ADMIN', 'GURU'],
      },
      {
        icon: <Info size={20} />,
        label: 'Info',
        path: '/info',
        color: 'from-rose-400 to-pink-600',
        roles: ['ADMIN', 'GURU', 'SISWA'],
      },
      {
        icon: <CalendarIcon size={20} />,
        label: 'Logs',
        path: '/riwayat',
        color: 'from-violet-400 to-fuchsia-600',
        roles: ['ADMIN'],
      },
    ];
    return allItems.filter(item => item.roles.includes(myRole));
  }, [myRole]);

  // Styling logic Liquid Dynamic Theme
  const bgMain = isDarkMode ? 'bg-[#030014]' : 'bg-slate-50';
  const cardClass = isDarkMode
    ? 'bg-white/[0.03] border-white/5 backdrop-blur-xl text-white hover:border-indigo-500/30 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]'
    : 'bg-white/80 border-slate-200/60 backdrop-blur-xl text-slate-800 hover:border-indigo-400/30 hover:shadow-[0_10px_30px_rgba(99,102,241,0.05)]';

  return (
    <div
      className={`p-6 pb-40 space-y-8 overflow-x-hidden min-h-screen transition-all duration-700 relative ${bgMain} animate-dashboardFadeIn`}
    >
      {/* AURORA GLOW EFFECT */}
      {isDarkMode && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-20%] w-[80vw] h-[80vw] rounded-full bg-indigo-600/10 blur-[130px] animate-pulse duration-[8000ms]" />
          <div className="absolute bottom-[-15%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-fuchsia-500/10 blur-[140px] animate-pulse duration-[6000ms]" />
        </div>
      )}

      <div className="relative z-10 space-y-8">
        {/* Top Bar - Decorative */}
        <div className="flex justify-between items-center px-2">
          <div>
            <h4 className="text-[10px] font-black text-indigo-400 tracking-[0.3em] uppercase">
              Control Panel • {myRole}
            </h4>
            <p
              className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}
            >
              {time.toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </p>
          </div>
          <div
            onClick={() => navigate('/notifikasi')}
            className="relative cursor-pointer active:scale-90 transition-transform group"
          >
            <div
              className={`p-3.5 rounded-2xl border transition-all duration-500 ease-fluid ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white shadow-md hover:bg-slate-50'}`}
            >
              <Bell
                className={
                  isDarkMode
                    ? 'text-slate-400 group-hover:text-indigo-400'
                    : 'text-slate-600 group-hover:text-indigo-600'
                }
                size={18}
              />
            </div>

            {/* Animasi Banner/Dot Merah */}
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 border-2 border-white dark:border-[#030014] items-center justify-center text-[8px] font-black text-white">
                  {notificationCount}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Hero Section - Animasi Floating Premium */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-8 rounded-[3rem] text-white shadow-2xl shadow-indigo-500/30 group active:scale-[0.98] transition-all duration-700 ease-fluid animate-dashboardSlideUp">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
          <Zap
            className="absolute -right-4 -bottom-4 text-white/10 rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-1000 ease-fluid"
            size={180}
          />

          <div className="relative z-10">
            <div className="bg-white/20 w-fit px-4 py-1 rounded-full backdrop-blur-md mb-4">
              <span className="text-[10px] font-black tracking-widest uppercase">
                {myRole === 'SISWA' ? 'STUDENT PORTAL' : 'CORE PANEL ACCESS'}
              </span>
            </div>
            <h2 className="text-4xl font-black italic tracking-tighter mb-1">
              HELLO, {myRole}!
            </h2>
            <p className="text-xs font-medium opacity-80 leading-relaxed max-w-[200px]">
              Sistem absensi digital sedang berjalan optimal hari ini.
            </p>
          </div>
        </div>

        {/* Interactive Time & Calendar Bento Grid */}
        <div
          className="grid grid-cols-12 gap-4 animate-dashboardSlideUp"
          style={{ animationDelay: '100ms' }}
        >
          {/* Widget Jam Analog */}
          <div
            className={`${cardClass} col-span-5 p-4 rounded-[2.5rem] border flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500 ease-fluid hover:scale-[1.03]`}
          >
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-indigo-500/30 flex items-center justify-center relative bg-gradient-to-b from-indigo-500/[0.02] to-transparent shadow-inner">
              {/* Center Dot */}
              <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full z-30 shadow-md shadow-indigo-500/50"></div>

              {/* Hour Hand */}
              <div
                className="absolute bottom-10 left-1/2 w-1 h-6 bg-slate-700 dark:bg-slate-300 rounded-full origin-bottom z-10"
                style={{
                  transform: `translateX(-50%) rotate(${clockDegrees.hour}deg)`,
                  transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
              {/* Minute Hand */}
              <div
                className="absolute bottom-10 left-1/2 w-0.75 h-8 bg-indigo-500 rounded-full origin-bottom z-20"
                style={{
                  transform: `translateX(-50%) rotate(${clockDegrees.minute}deg)`,
                  transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
              {/* Second Hand */}
              <div
                className="absolute bottom-10 left-1/2 w-0.5 h-9 bg-rose-500 rounded-full origin-bottom z-20"
                style={{
                  transform: `translateX(-50%) rotate(${clockDegrees.second}deg)`,
                  transition: 'transform 0.1s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />

              {/* Jam Penunjuk Angka Minimalis */}
              <span className="absolute top-1 text-[8px] font-black text-slate-400 opacity-60">
                12
              </span>
              <span className="absolute bottom-1 text-[8px] font-black text-slate-400 opacity-60">
                6
              </span>
            </div>
            <p className="text-[11px] font-black tracking-tight mt-3 text-center uppercase">
              {time.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </p>
          </div>

          {/* Widget Kalender Dinamis */}
          <div
            className={`${cardClass} col-span-7 p-5 rounded-[2.5rem] border flex items-center gap-4 transition-all duration-500 ease-fluid hover:scale-[1.03] relative overflow-hidden`}
          >
            <div className="p-3.5 bg-indigo-500/10 text-indigo-400 rounded-2xl transition-colors duration-500">
              <CalendarIcon size={22} className="animate-pulse" />
            </div>
            <div className="min-w-0">
              <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1.5">
                Live Calendar
              </p>
              <p className="text-2xl font-black italic tracking-tighter leading-none mb-1">
                {time.getDate()}{' '}
                <span className="text-xs font-bold not-italic text-slate-400 uppercase tracking-wider">
                  {time.toLocaleDateString('id-ID', { month: 'short' })}
                </span>
              </p>
              <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-tight">
                Tahun {time.getFullYear()}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section - Bento Style (Conditional Links Based on Roles) */}
        <div
          className="grid grid-cols-2 gap-4 animate-dashboardSlideUp"
          style={{ animationDelay: '200ms' }}
        >
          {/* Stat 1: Students */}
          <div
            onClick={() => ['ADMIN', 'GURU'].includes(myRole) ? navigate('/datasiswa') : null}
            className={`${cardClass} p-6 rounded-[2.5rem] border group ${['ADMIN', 'GURU'].includes(myRole) ? 'cursor-pointer' : 'cursor-default'} transition-all duration-500 ease-fluid hover:scale-[1.02] active:scale-95 overflow-hidden relative`}
          >
            {['ADMIN', 'GURU'].includes(myRole) && (
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500 ease-fluid">
                <ArrowUpRight size={20} />
              </div>
            )}
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-4 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-500">
              <Users size={24} />
            </div>
            <p className="text-3xl font-black italic tracking-tighter leading-none">
              {loading ? '...' : safeDataSiswa.length}
            </p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">
              Students
            </p>
          </div>

          {/* Stat 2: Activities */}
          <div
            onClick={() => myRole === 'ADMIN' ? navigate('/riwayat') : null}
            className={`${cardClass} p-6 rounded-[2.5rem] border group ${myRole === 'ADMIN' ? 'cursor-pointer' : 'cursor-default'} transition-all duration-500 ease-fluid hover:scale-[1.02] active:scale-95 overflow-hidden relative`}
          >
            {myRole === 'ADMIN' && (
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500 ease-fluid">
                <ArrowUpRight size={20} />
              </div>
            )}
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
              <Activity size={24} />
            </div>
            <p className="text-3xl font-black italic tracking-tighter leading-none">
              {loading ? '...' : safeAbsensi.length}
            </p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">
              Activities
            </p>
          </div>
        </div>

        {/* Floating Menu - Interactive Grid Dynamic Filtered */}
        <div className={`grid gap-4 px-2 ${
          filteredMenuItems.length === 4 ? 'grid-cols-4' : filteredMenuItems.length === 3 ? 'grid-cols-3' : 'grid-cols-2'
        }`}>
          {filteredMenuItems.map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-3 active:scale-75 transition-all animate-dashboardGridUp group"
              style={{ animationDelay: `${i * 80 + 300}ms` }}
            >
              <div
                className={`bg-gradient-to-tr ${item.color} p-5 rounded-[2rem] text-white shadow-lg group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-500 ease-fluid`}
              >
                {item.icon}
              </div>
              <span
                className={`text-[10px] font-black uppercase tracking-tighter ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* Feed Section - Glass List */}
        <div
          className={`${cardClass} p-8 rounded-[3.5rem] border relative overflow-hidden animate-dashboardSlideUp`}
          style={{ animationDelay: '450ms' }}
        >
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
              <h4 className="text-sm font-black italic tracking-tighter uppercase">
                Recent Feed
              </h4>
            </div>
            {myRole === 'ADMIN' && (
              <Link
                to="/riwayat"
                className="group text-[10px] font-black text-indigo-400 flex items-center gap-1 bg-indigo-500/10 px-3 py-1.5 rounded-full hover:bg-gradient-to-r hover:from-indigo-500 hover:to-fuchsia-500 hover:text-white transition-all duration-500 ease-fluid"
              >
                VIEW ALL{' '}
                <ChevronRight
                  size={12}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            )}
          </div>

          <div className="space-y-5">
            {loading ? (
              <div className="py-10 text-center animate-pulse">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.25em]">
                  Streaming Feed Arrays...
                </p>
              </div>
            ) : safeAbsensi.length > 0 ? (
              safeAbsensi.slice(0, 3).map((item, i) => {
                const initialLetter =
                  item.nama &&
                  typeof item.nama === 'string' &&
                  item.nama.length > 0
                    ? item.nama[0].toUpperCase()
                    : '?';

                return (
                  <div
                    key={item.id || i}
                    className="flex items-center gap-4 p-3 rounded-3xl transition-all duration-500 ease-fluid hover:bg-white/[0.04] dark:hover:bg-white/[0.02] border border-transparent hover:border-indigo-500/20 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 border dark:border-white/5 flex items-center justify-center font-black text-indigo-400 shadow-sm transition-transform duration-500 ease-fluid group-hover:rotate-6 group-hover:scale-105">
                      {initialLetter}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black truncate uppercase tracking-tight transition-colors duration-300 group-hover:text-indigo-400">
                        {item.nama || 'Tanpa Nama'}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                        {item.waktu || '--:--'} •{' '}
                        <span className={item.status === 'Hadir' ? 'text-indigo-400' : 'text-rose-400'}>
                          {item.status || 'Tidak Diketahui'}
                        </span>
                      </p>
                    </div>
                    <div
                      className={`h-10 w-1 rounded-full transition-all duration-500 ${item.status === 'Hadir' ? 'bg-gradient-to-b from-indigo-500 to-fuchsia-500 shadow-[0_0_12px_rgba(99,102,241,0.4)]' : item.status === 'Izin' ? 'bg-orange-500' : 'bg-rose-500'}`}
                    />
                  </div>
                );
              })
            ) : (
              <div className="py-10 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] opacity-30 italic">
                  No activity yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gaya Kustom Animasi CSS Terintegrasi */}
      <style>{`
        .ease-fluid { transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes dFade { from { opacity: 0; filter: blur(4px); } to { opacity: 1; filter: blur(0); } }
        @keyframes dSlide { from { transform: translateY(30px); opacity: 0; filter: blur(4px); } to { transform: translateY(0); opacity: 1; filter: blur(0); } }
        @keyframes dGrid { from { transform: scale(0.8) translateY(20px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }

        .animate-dashboardFadeIn { animation: dFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-dashboardSlideUp { animation: dSlide 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .animate-dashboardGridUp { animation: dGrid 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.15) forwards; opacity: 0; }
      `}</style>
    </div>
  );
};

export default Dashboard;