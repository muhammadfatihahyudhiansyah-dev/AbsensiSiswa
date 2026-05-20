import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ClipboardCheck, History, User, QrCode } from 'lucide-react';

const Navbar = ({ isDarkMode }) => {
  const location = useLocation();
  
  const items = [
    { path: '/dashboard', icon: <LayoutDashboard size={22} />, label: 'Home' },
    { path: '/absensi', icon: <ClipboardCheck size={22} />, label: 'Absen' },
    { path: '/qrcode', icon: <QrCode size={26} />, label: 'Scan', center: true },
    { path: '/riwayat', icon: <History size={22} />, label: 'History' },
    { path: '/profile', icon: <User size={22} />, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-[10000] px-2">
      <nav className={`relative rounded-[2.5rem] border transition-all duration-700 ${
        isDarkMode 
        ? 'bg-slate-900/70 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' 
        : 'bg-white/80 border-slate-200/50 shadow-[0_20px_50px_rgba(79,70,229,0.15)]'
      } backdrop-blur-2xl`}>
        
        <ul className="flex justify-between items-center px-4 py-2 relative h-20">
          {items.map((item, idx) => {
            const active = location.pathname === item.path;
            
            // TOMBOL TENGAH (QR SCAN)
            if (item.center) {
              return (
                <li key={item.path} className="relative z-20">
                  <Link 
                    to={item.path}
                    className={`group relative -top-10 w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-500 shadow-2xl active:scale-75 ${
                      active 
                      ? 'bg-indigo-600 text-white shadow-indigo-500/50 scale-110' 
                      : 'bg-indigo-500 text-white shadow-indigo-600/30 hover:scale-105'
                    }`}
                  >
                    {/* Ring Animasi Luar */}
                    <div className={`absolute inset-0 rounded-3xl border-4 border-indigo-400/30 animate-ping opacity-0 ${active ? 'opacity-100' : ''}`}></div>
                    
                    {/* Background Glow */}
                    <div className="absolute -inset-2 bg-indigo-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className={`relative z-10 transition-transform duration-700 ${active ? 'rotate-[360deg]' : 'group-hover:rotate-12'}`}>
                      {item.icon}
                    </div>
                  </Link>
                </li>
              );
            }

            // TOMBOL REGULER
            return (
              <li key={item.path} className="relative z-10">
                <Link 
                  to={item.path} 
                  className={`flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all duration-500 ${
                    active 
                    ? 'text-indigo-500' 
                    : isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-indigo-400'
                  }`}
                >
                  {/* Background Bulat saat Aktif */}
                  {active && (
                    <div className={`absolute inset-0 scale-110 blur-sm rounded-2xl opacity-20 bg-indigo-500 animate-pulse`}></div>
                  )}

                  <div className={`relative transition-all duration-500 ease-out ${
                    active ? 'scale-125 -translate-y-2' : 'scale-100 translate-y-0'
                  }`}>
                    {item.icon}
                  </div>

                  {/* Indikator Titik Animasi */}
                  <div className={`mt-1 transition-all duration-500 overflow-hidden flex flex-col items-center`}>
                    <span className={`text-[7px] font-black uppercase tracking-tighter transition-all duration-500 ${
                      active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}>
                      {item.label}
                    </span>
                    <div className={`w-1 h-1 bg-indigo-500 rounded-full transition-all duration-500 ${
                      active ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                    }`}></div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* CSS Animasi Tambahan */}
      <style>{`
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.1); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        .active-icon {
          animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>
    </div>
  );
};

export default Navbar;