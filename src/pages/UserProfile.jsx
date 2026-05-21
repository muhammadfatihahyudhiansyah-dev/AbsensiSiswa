import React, { useState, useRef, useEffect } from 'react';
import { 
  User, Camera, Save, Check, Moon, Sun, 
  Hash, GraduationCap, Sparkles, CreditCard, 
  ChevronRight, Quote, Edit3, X, LogOut,
  Calendar, ShieldCheck, QrCode, Globe,
  Bell, EyeOff, Palette, ArrowLeft, Settings,
  Activity, KeyRound, Cpu
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useAuth } from '../hooks/useAuth'; // Import hook auth

const UserProfile = ({ userData = {}, setUserData, isDarkMode, toggleDarkMode }) => {
  const [tempData, setTempData] = useState({ ...userData });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [language, setLanguage] = useState('ID'); // ID or EN
  const fileInputRef = useRef(null);
  
  const { logout } = useAuth(); // Ambil fungsi logout dari context

  useEffect(() => { 
    setTempData({ ...userData }); 
  }, [userData]);

  // Dictionary Bahasa
  const t = {
    ID: {
      header: "IDENTITAS",
      subHeader: "Sistem Kartu Pelajar",
      edit: "Edit Profil",
      settings: "Pengaturan",
      logout: "Keluar Sistem",
      name: "Nama Lengkap",
      class: "Kelas",
      motto: "Motivasi/Bio",
      theme: "Tema Aksen",
      lang: "Bahasa",
      save: "Perbarui Data",
      active: "Aktif",
      notSet: "Belum Diatur",
      logoutConfirm: "Apakah Anda yakin ingin keluar?",
      statsHeader: "INTEGRITAS KARTU",
      encryption: "Enkripsi Key",
      sysStatus: "Status Sistem",
      accountTier: "Tingkat Akun"
    },
    EN: {
      header: "IDENTITY",
      subHeader: "Student Card System",
      edit: "Edit Profile",
      settings: "Settings",
      logout: "Logout System",
      name: "Full Name",
      class: "Class Grade",
      motto: "Motivation/Bio",
      theme: "Accent Theme",
      lang: "Language",
      save: "Update Data",
      active: "Active",
      notSet: "Not Set",
      logoutConfirm: "Are you sure you want to logout?",
      statsHeader: "CARD INTEGRITY",
      encryption: "Encryption Key",
      sysStatus: "System Status",
      accountTier: "Account Tier"
    }
  };

  const currentT = t[language] || t['ID'];

  const themes = [
    { id: 'indigo', color: 'from-indigo-600 to-indigo-800', shadow: 'shadow-indigo-500/30', accent: 'text-indigo-500', bgLight: 'bg-indigo-500/10' },
    { id: 'rose', color: 'from-rose-500 to-pink-700', shadow: 'shadow-rose-500/30', accent: 'text-rose-500', bgLight: 'bg-rose-500/10' },
    { id: 'emerald', color: 'from-emerald-500 to-teal-700', shadow: 'shadow-emerald-500/30', accent: 'text-emerald-500', bgLight: 'bg-emerald-500/10' },
    { id: 'amber', color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/30', accent: 'text-amber-500', bgLight: 'bg-amber-500/10' },
  ];

  // PERBAIKAN: Menggunakan tempData.accent agar perubahan di Settings Drawer langsung terlihat real-time di UI sebelum di-save
  const currentTheme = themes.find(t => t.id === (tempData.accent || 'indigo')) || themes[0];

  const handleSave = (e) => {
    e.preventDefault();
    setUserData(tempData); // Perubahan tema aksen dan data teks resmi di-commit ke state utama App.jsx di sini
    setIsModalOpen(false);
    Swal.fire({
      icon: 'success', 
      title: language === 'ID' ? 'Profil Diperbarui' : 'Profile Updated', 
      timer: 1500, 
      showConfirmButton: false,
      background: isDarkMode ? '#0f172a' : '#fff', 
      color: isDarkMode ? '#fff' : '#000'
    });
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: currentT.logout,
      text: currentT.logoutConfirm,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f43f5e',
      cancelButtonColor: '#64748b',
      confirmButtonText: language === 'ID' ? 'Ya, Keluar' : 'Yes, Logout',
      background: isDarkMode ? '#0f172a' : '#fff',
      color: isDarkMode ? '#fff' : '#000'
    });

    if (result.isConfirmed) {
      try {
        await logout();
      } catch (error) {
        Swal.fire('Error', error.message, 'error');
      }
    }
  };

  const infoRowClass = `flex items-center justify-between p-5 rounded-3xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
    isDarkMode ? 'bg-slate-900/40 border-slate-800/80 text-slate-300 hover:border-slate-700/50' : 'bg-white border-slate-100 text-slate-600 shadow-sm hover:border-slate-200'
  }`;

  const inputClass = `w-full pl-12 pr-5 py-4 rounded-2xl border-2 outline-none font-bold transition-all duration-300 ${
    isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' : 'bg-slate-50 border-transparent focus:bg-white focus:border-indigo-400'
  }`;

  const hasProfilePic = userData.profilePic && typeof userData.profilePic === 'string' && userData.profilePic.trim() !== '';
  const hasTempPic = tempData.profilePic && typeof tempData.profilePic === 'string' && tempData.profilePic.trim() !== '';

  return (
    <div className={`min-h-screen p-6 pb-40 overflow-x-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#020617]' : 'bg-slate-50'}`}>
      
      {/* Header Profile - Smooth Fade Down */}
      <div className="flex justify-between items-center mb-8 animate-profileFadeDown">
        <div>
          <h1 className={`text-3xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{currentT.header}</h1>
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">{currentT.subHeader}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsSettingsOpen(true)} className={`p-4 rounded-2xl transition-all duration-300 active:scale-90 ${isDarkMode ? 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800' : 'bg-white text-slate-600 shadow-md hover:bg-slate-50'}`}>
            <Settings size={20} className="hover:rotate-45 transition-transform duration-300" />
          </button>
          <button onClick={toggleDarkMode} className={`p-4 rounded-2xl transition-all duration-300 active:scale-90 ${isDarkMode ? 'bg-slate-900 text-amber-400 border border-slate-800 hover:bg-slate-800' : 'bg-white text-indigo-600 shadow-md hover:bg-slate-50'}`}>
            {isDarkMode ? <Sun size={20} className="animate-spinSlow" /> : <Moon size={20} className="animate-pulse" />}
          </button>
        </div>
      </div>

      {/* Advanced Virtual ID Card - Beautiful Hologram Effects */}
      <div className="relative w-full h-60 mb-12 perspective-1000 group animate-profileScaleUp">
        <div 
          onClick={() => setIsFlipped(!isFlipped)}
          className={`relative w-full h-full transition-all duration-700 preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
        >
          {/* Front: ID Card Style */}
          <div className={`absolute w-full h-full backface-hidden bg-gradient-to-br ${currentTheme.color} rounded-[2.8rem] p-8 text-white shadow-2xl overflow-hidden`}>
            {/* Holographic Shimmer Effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full animate-profileShimmer pointer-events-none" />
            
            <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"><CreditCard size={180} /></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
               <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-white/80 animate-bounceSlow" />
                  <span className="text-[10px] font-black tracking-[0.2em] uppercase opacity-80 text-white">Student Pass</span>
               </div>
               <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[9px] font-black uppercase tracking-wider">{currentT.active}</div>
            </div>

            <div className="flex items-center gap-6 relative z-10">
              <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md p-1.5 border border-white/30 shadow-lg transition-transform duration-500 group-hover:scale-105">
                <div className="w-full h-full bg-slate-900/50 rounded-2xl overflow-hidden flex items-center justify-center">
                  {hasProfilePic ? <img src={userData.profilePic} alt="Profile" className="w-full h-full object-cover" /> : <User size={32} className="text-white/50" />}
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <h2 className="font-black italic text-2xl leading-none mb-2 truncate uppercase tracking-tight transition-all duration-300 group-hover:translate-x-1">{userData.nama || 'Your Name'}</h2>
                <p className="text-[11px] font-bold opacity-70 mb-4 uppercase tracking-widest">{userData.kelas || currentT.notSet}</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-950/40 rounded-xl text-[11px] font-black border border-white/5 shadow-inner">
                   <Hash size={14} className="text-white/60"/> {userData.nisn || '000000'}
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-8 right-8 opacity-40 transition-all duration-500 group-hover:opacity-80 group-hover:scale-110">
                <QrCode size={45} />
            </div>
          </div>

          {/* Back: QR Security */}
          <div className={`absolute w-full h-full backface-hidden rotate-y-180 bg-slate-900 rounded-[2.8rem] p-8 text-white border-4 border-slate-800 flex flex-col items-center justify-center shadow-2xl overflow-hidden`}>
             <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-indigo-500/[0.03] to-transparent pointer-events-none" />
             <div className="w-full h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 absolute top-12 left-0"></div>
             <div className="bg-white p-4 rounded-[2rem] mb-6 shadow-2xl shadow-indigo-500/40 transform transition-transform duration-500 hover:scale-105">
                <div className="w-20 h-20 bg-slate-900 flex items-center justify-center rounded-2xl">
                   <Sparkles size={40} className="text-indigo-500 animate-pulse" />
                </div>
             </div>
             <p className="text-xs font-black uppercase tracking-[0.4em] mb-2">Terminal Access</p>
             <div className="px-4 py-2 bg-slate-800 rounded-full border border-slate-700/50">
                <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest italic leading-none">
                  Auth Key: {userData.nisn ? btoa(userData.nisn).slice(0, 16) : 'user-key'}
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* Identity Summary List - Elegant Staggered Slide Up */}
      <div className="space-y-4 mb-6">
        {[
          { icon: <User />, label: currentT.name, value: userData.nama },
          { icon: <GraduationCap />, label: currentT.class, value: userData.kelas },
          { icon: <Quote />, label: currentT.motto, value: userData.bio, italic: true }
        ].map((item, idx) => (
          <div 
            key={idx} 
            className={`${infoRowClass} animate-profileItemUp`}
            style={{ animationDelay: `${idx * 100 + 200}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl transition-all duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} ${currentTheme.accent}`}>
                {React.cloneElement(item.icon, { size: 18 })}
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black opacity-40 uppercase tracking-widest mb-1">{item.label}</p>
                <h4 className={`font-black text-sm uppercase truncate ${item.italic ? 'italic text-indigo-500 dark:text-indigo-400' : ''}`}>
                  {item.value || currentT.notSet}
                </h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FITUR BARU: Panel Integrasi & Metadata Status Kartu Pelajar */}
      <div className="mb-10 animate-profileItemUp" style={{ animationDelay: '450ms' }}>
        <p className={`text-[10px] font-black uppercase tracking-[0.25em] mb-3 px-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{currentT.statsHeader}</p>
        <div className={`grid grid-cols-3 gap-3 p-4 rounded-3xl border ${isDarkMode ? 'bg-slate-900/20 border-slate-800/60' : 'bg-slate-100/50 border-slate-200/60'}`}>
          <div className="text-center p-2">
            <KeyRound size={16} className={`mx-auto mb-1.5 ${currentTheme.accent}`} />
            <p className="text-[8px] font-bold uppercase opacity-50 mb-0.5">{currentT.encryption}</p>
            <p className="text-[10px] font-black tracking-wider uppercase font-mono">AES-256</p>
          </div>
          <div className="text-center p-2 border-x border-slate-800/10 dark:border-slate-800/50">
            <Cpu size={16} className={`mx-auto mb-1.5 ${currentTheme.accent}`} />
            <p className="text-[8px] font-bold uppercase opacity-50 mb-0.5">{currentT.sysStatus}</p>
            <p className="text-[10px] font-black text-emerald-500 uppercase">SYNCED</p>
          </div>
          <div className="text-center p-2">
            <Activity size={16} className={`mx-auto mb-1.5 ${currentTheme.accent}`} />
            <p className="text-[8px] font-bold uppercase opacity-50 mb-0.5">{currentT.accountTier}</p>
            <p className="text-[10px] font-black text-amber-500 uppercase">{userData.role || 'Siswa'}</p>
          </div>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="grid grid-cols-2 gap-4 animate-profileItemUp" style={{ animationDelay: '550ms' }}>
        <button 
          onClick={() => setIsModalOpen(true)}
          className={`p-6 rounded-[2.2rem] font-black text-[10px] tracking-widest uppercase flex flex-col items-center justify-center gap-3 transition-all duration-300 active:scale-95 bg-gradient-to-tr ${currentTheme.color} ${currentTheme.shadow} text-white hover:opacity-95`}
        >
          <Edit3 size={20} className="animate-pulse" /> {currentT.edit}
        </button>
        
        <button 
          onClick={handleLogout}
          className={`p-6 rounded-[2.2rem] font-black text-[10px] tracking-widest uppercase flex flex-col items-center justify-center gap-3 transition-all duration-300 active:scale-95 border-2 ${isDarkMode ? 'border-rose-500/20 bg-rose-500/5 text-rose-500 hover:bg-rose-500/10' : 'border-rose-100 bg-rose-5 text-rose-600 hover:bg-rose-100/50'}`}
        >
          <LogOut size={20} /> {currentT.logout}
        </button>
      </div>

      {/* --- MODAL EDIT --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-modalFade">
          <div className={`w-full max-w-lg p-8 rounded-[3.5rem] border-2 animate-modalSlide shadow-2xl relative overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-white'}`}>
            <div className="flex justify-between items-center mb-8">
              <h3 className={`text-2xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>EDIT DATA</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className={`p-3 rounded-full transition-colors ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}><X size={20}/></button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="flex items-center gap-5 p-5 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10">
                <div className="w-20 h-20 rounded-[1.8rem] bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white overflow-hidden shadow-lg shadow-indigo-500/20">
                    {hasTempPic ? <img src={tempData.profilePic} alt="Preview" className="w-full h-full object-cover" /> : <Camera size={28}/>}
                </div>
                <div className="flex-1">
                   <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-3 leading-none">Photo Identity</p>
                   <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onload = () => setTempData({ ...tempData, profilePic: reader.result });
                        reader.readAsDataURL(e.target.files[0]);
                      }
                   }} />
                   <button type="button" onClick={() => fileInputRef.current.click()} className="text-[10px] font-black px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/30 active:scale-95 transition-transform">UPLOAD</button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="relative"><User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500"/><input value={tempData.nama || ''} onChange={e=>setTempData({...tempData, nama:e.target.value})} className={inputClass} placeholder={currentT.name} required /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative"><Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500"/><input value={tempData.nisn || ''} onChange={e=>setTempData({...tempData, nisn:e.target.value})} className={inputClass} placeholder="NISN" /></div>
                  <div className="relative"><GraduationCap size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500"/><input value={tempData.kelas || ''} onChange={e=>setTempData({...tempData, kelas:e.target.value})} className={inputClass} placeholder={currentT.class} /></div>
                </div>
                <div className="relative"><Quote size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500"/><input value={tempData.bio || ''} onChange={e=>setTempData({...tempData, bio:e.target.value})} className={inputClass} placeholder={currentT.motto} /></div>
              </div>

              {/* Tombol Perbarui Data otomatis men-commit perubahan tema baru ke berkas App.jsx */}
              <button type="submit" className="w-full py-6 bg-indigo-600 text-white rounded-[2.2rem] font-black shadow-xl shadow-indigo-600/40 flex items-center justify-center gap-3 active:scale-95 transition-all mt-4 tracking-widest text-[11px] uppercase">
                <Save size={20} /> {currentT.save}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- SETTINGS DRAWER --- */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center bg-slate-950/80 backdrop-blur-sm animate-modalFade">
          <div className={`w-full max-w-lg p-10 rounded-t-[4rem] border-t border-slate-800/20 dark:border-slate-800 animate-drawerSlide shadow-2xl ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="w-16 h-1.5 bg-slate-500/20 rounded-full mx-auto mb-8"></div>
            
            <div className="flex justify-between items-center mb-10">
               <h3 className={`text-2xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{currentT.settings}</h3>
               <button type="button" onClick={() => setIsSettingsOpen(false)} className={`p-4 rounded-2xl transition-colors ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-50'}`}><X size={20}/></button>
            </div>

            <div className="space-y-4">
              <div className={infoRowClass}>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><Globe size={18}/></div>
                  <span className="font-black text-[11px] uppercase tracking-widest">{currentT.lang}</span>
                </div>
                <div className="flex bg-slate-500/10 p-1 rounded-xl">
                  {['ID', 'EN'].map(l => (
                    <button key={l} type="button" onClick={() => setLanguage(l)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all duration-300 ${language === l ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}>{l}</button>
                  ))}
                </div>
              </div>

              <div className={infoRowClass}>
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl"><Palette size={18}/></div>
                    <span className="font-black text-[11px] uppercase tracking-widest">{currentT.theme}</span>
                 </div>
                 <div className="flex gap-3">
                   {themes.map(t => (
                     <button 
                       key={t.id} 
                       type="button" 
                       onClick={() => {
                         // PERBAIKAN UTAMA: Mengubah accent di dalam tempData secara langsung agar UI merespon seketika secara interaktif sebelum di-save resmi
                         setTempData(prev => ({ ...prev, accent: t.id }));
                       }} 
                       className={`w-7 h-7 rounded-full bg-gradient-to-tr ${t.color} transition-all duration-300 active:scale-75 ${tempData.accent === t.id ? 'ring-4 ring-offset-2 ring-indigo-500 dark:ring-offset-slate-900 scale-110 opacity-100' : 'opacity-40 hover:opacity-70'}`}
                     ></button>
                   ))}
                 </div>
              </div>
            </div>

            <p className="text-center text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mt-12 mb-4 animate-pulse">SchoolPass Version 2.4.1</p>
          </div>
        </div>
      )}

      {/* Global Style - Diperbaiki untuk kompatibilitas rotasi 3D & Efek Shimmer Premium */}
      <style>{`
        .perspective-1000 { perspective: 1000px; -webkit-perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; -webkit-transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); -webkit-transform: rotateY(180deg); }
        
        /* Custom Core Animations */
        @keyframes profileFD { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes profileSU { from { transform: scale(0.95) translateY(15px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
        @keyframes profileIU { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes profileShm { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
        @keyframes modalF { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalS { from { transform: scale(0.9) translateY(30px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
        @keyframes drawerS { from { transform: translateY(100%); } to { transform: translateY(0); } }

        .animate-profileFadeDown { animation: profileFD 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-profileScaleUp { animation: profileSU 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-profileItemUp { animation: profileIU 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .animate-profileShimmer { animation: profileShm 3s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-modalFade { animation: modalF 0.3s ease-out forwards; }
        .animate-modalSlide { animation: modalS 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-drawerSlide { animation: drawerS 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-spinSlow { animation: spin 8s linear infinite; }
        .animate-bounceSlow { animation: bounce 3s infinite; }
      `}</style>
    </div>
  );
};

export default UserProfile;