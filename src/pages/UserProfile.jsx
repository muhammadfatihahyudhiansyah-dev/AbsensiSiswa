import React, { useState, useRef, useEffect } from 'react';
import { 
  User, Camera, Save, Check, Moon, Sun, 
  Hash, GraduationCap, Sparkles, CreditCard, 
  ChevronRight, Quote, Edit3, X, LogOut,
  Calendar, ShieldCheck, QrCode, Globe,
  Bell, EyeOff, Palette, ArrowLeft, Settings
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useAuth } from '../hooks/useAuth'; // Import hook auth

const UserProfile = ({ userData, setUserData, isDarkMode, toggleDarkMode }) => {
  const [tempData, setTempData] = useState({ ...userData });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [language, setLanguage] = useState('ID'); // ID or EN
  const fileInputRef = useRef(null);
  
  const { logout } = useAuth(); // Ambil fungsi logout dari context

  useEffect(() => { setTempData({ ...userData }); }, [userData]);

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
      logoutConfirm: "Apakah Anda yakin ingin keluar?"
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
      logoutConfirm: "Are you sure you want to logout?"
    }
  };

  const currentT = t[language];

  const themes = [
    { id: 'indigo', color: 'bg-indigo-600', shadow: 'shadow-indigo-500/40', accent: 'text-indigo-500' },
    { id: 'rose', color: 'bg-rose-500', shadow: 'shadow-rose-500/40', accent: 'text-rose-500' },
    { id: 'emerald', color: 'bg-emerald-500', shadow: 'shadow-emerald-500/40', accent: 'text-emerald-500' },
    { id: 'amber', color: 'bg-amber-500', shadow: 'shadow-amber-500/40', accent: 'text-amber-500' },
  ];

  const currentTheme = themes.find(t => t.id === (userData.accent || 'indigo')) || themes[0];

  const handleSave = (e) => {
    e.preventDefault();
    setUserData(tempData);
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

  // Fungsi Logout Baru yang terhubung ke Supabase
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

  const infoRowClass = `flex items-center justify-between p-5 rounded-3xl border transition-all hover:scale-[1.02] ${
    isDarkMode ? 'bg-slate-900/50 border-slate-800 text-slate-300' : 'bg-white border-slate-100 text-slate-600 shadow-sm'
  }`;

  const inputClass = `w-full pl-12 pr-5 py-4 rounded-2xl border-2 outline-none font-bold transition-all ${
    isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' : 'bg-slate-50 border-transparent focus:bg-white focus:border-indigo-400'
  }`;

  return (
    <div className={`min-h-screen p-6 pb-40 animate-fadeIn transition-colors duration-500 ${isDarkMode ? 'bg-[#020617]' : 'bg-slate-50'}`}>
      
      {/* Header Profile */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-3xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{currentT.header}</h1>
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">{currentT.subHeader}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsSettingsOpen(true)} className={`p-4 rounded-2xl transition-all ${isDarkMode ? 'bg-slate-900 text-slate-400 border border-slate-800' : 'bg-white text-slate-600 shadow-md'}`}>
            <Settings size={20} />
          </button>
          <button onClick={toggleDarkMode} className={`p-4 rounded-2xl transition-all ${isDarkMode ? 'bg-slate-900 text-amber-400 border border-slate-800' : 'bg-white text-indigo-600 shadow-md'}`}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      {/* Advanced Virtual ID Card */}
      <div className="relative w-full h-60 mb-12 perspective-1000 group">
        <div 
          onClick={() => setIsFlipped(!isFlipped)}
          className={`relative w-full h-full transition-all duration-700 preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
        >
          {/* Front: ID Card Style */}
          <div className={`absolute w-full h-full backface-hidden ${currentTheme.color} rounded-[2.8rem] p-8 text-white shadow-2xl overflow-hidden`}>
            <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><CreditCard size={180} /></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
               <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-white/80" />
                  <span className="text-[10px] font-black tracking-[0.2em] uppercase opacity-80 text-white">Student Pass</span>
               </div>
               <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[9px] font-black uppercase">{currentT.active}</div>
            </div>

            <div className="flex items-center gap-6 relative z-10">
              <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md p-1.5 border border-white/30 shadow-lg">
                <div className="w-full h-full bg-slate-900/50 rounded-2xl overflow-hidden flex items-center justify-center">
                  {userData.profilePic ? <img src={userData.profilePic} className="w-full h-full object-cover" /> : <User size={32} className="text-white/50" />}
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <h2 className="font-black italic text-2xl leading-none mb-2 truncate uppercase">{userData.nama || 'Your Name'}</h2>
                <p className="text-[11px] font-bold opacity-70 mb-4 uppercase tracking-widest">{userData.kelas || currentT.notSet}</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-950/40 rounded-xl text-[11px] font-black">
                   <Hash size={14} className="text-white/60"/> {userData.nisn || '000000'}
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-8 right-8 opacity-40">
                <QrCode size={45} />
            </div>
          </div>

          {/* Back: QR Security */}
          <div className={`absolute w-full h-full backface-hidden rotate-y-180 bg-slate-900 rounded-[2.8rem] p-8 text-white border-4 border-slate-800 flex flex-col items-center justify-center shadow-2xl`}>
             <div className="w-full h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 absolute top-12 left-0"></div>
             <div className="bg-white p-4 rounded-[2rem] mb-6 shadow-2xl shadow-indigo-500/40">
                <div className="w-20 h-20 bg-slate-900 flex items-center justify-center rounded-2xl">
                   <Sparkles size={40} className="text-indigo-500 animate-pulse" />
                </div>
             </div>
             <p className="text-xs font-black uppercase tracking-[0.4em] mb-2">Terminal Access</p>
             <div className="px-4 py-2 bg-slate-800 rounded-full">
                <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest italic leading-none">
                  Auth Key: {userData.nisn ? btoa(userData.nisn).slice(0, 16) : 'user-key'}
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* Identity Summary List */}
      <div className="space-y-4 mb-10">
        {[
          { icon: <User />, label: currentT.name, value: userData.nama },
          { icon: <GraduationCap />, label: currentT.class, value: userData.kelas },
          { icon: <Quote />, label: currentT.motto, value: userData.bio, italic: true }
        ].map((item, idx) => (
          <div key={idx} className={infoRowClass}>
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} ${currentTheme.accent}`}>
                {React.cloneElement(item.icon, { size: 18 })}
              </div>
              <div>
                <p className="text-[9px] font-black opacity-40 uppercase tracking-widest mb-1">{item.label}</p>
                <h4 className={`font-black text-sm uppercase ${item.italic ? 'italic text-indigo-500' : ''}`}>
                  {item.value || currentT.notSet}
                </h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setIsModalOpen(true)}
          className={`p-6 rounded-[2.2rem] font-black text-[10px] tracking-widest uppercase flex flex-col items-center justify-center gap-3 transition-all active:scale-95 ${currentTheme.color} ${currentTheme.shadow} text-white`}
        >
          <Edit3 size={20} /> {currentT.edit}
        </button>
        
        <button 
          onClick={handleLogout}
          className={`p-6 rounded-[2.2rem] font-black text-[10px] tracking-widest uppercase flex flex-col items-center justify-center gap-3 transition-all active:scale-95 border-2 ${isDarkMode ? 'border-rose-500/20 bg-rose-500/5 text-rose-500' : 'border-rose-100 bg-rose-50 text-rose-600'}`}
        >
          <LogOut size={20} /> {currentT.logout}
        </button>
      </div>

      {/* --- MODAL EDIT --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className={`w-full max-w-lg p-8 rounded-[3.5rem] border-2 animate-slideUp shadow-2xl relative overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-white'}`}>
            <div className="flex justify-between items-center mb-8">
              <h3 className={`text-2xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>EDIT DATA</h3>
              <button onClick={() => setIsModalOpen(false)} className={`p-3 rounded-full ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}><X size={20}/></button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="flex items-center gap-5 p-5 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10">
                <div className="w-20 h-20 rounded-[1.8rem] bg-indigo-500 flex items-center justify-center text-white overflow-hidden shadow-lg shadow-indigo-500/20">
                    {tempData.profilePic ? <img src={tempData.profilePic} className="w-full h-full object-cover" /> : <Camera size={28}/>}
                </div>
                <div className="flex-1">
                   <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-3 leading-none">Photo Identity</p>
                   <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {
                      const reader = new FileReader();
                      reader.onload = () => setTempData({ ...tempData, profilePic: reader.result });
                      reader.readAsDataURL(e.target.files[0]);
                   }} />
                   <button type="button" onClick={() => fileInputRef.current.click()} className="text-[10px] font-black px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/30">UPLOAD</button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="relative"><User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500"/><input value={tempData.nama} onChange={e=>setTempData({...tempData, nama:e.target.value})} className={inputClass} placeholder={currentT.name} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative"><Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500"/><input value={tempData.nisn} onChange={e=>setTempData({...tempData, nisn:e.target.value})} className={inputClass} placeholder="NISN" /></div>
                  <div className="relative"><GraduationCap size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500"/><input value={tempData.kelas} onChange={e=>setTempData({...tempData, kelas:e.target.value})} className={inputClass} placeholder={currentT.class} /></div>
                </div>
                <div className="relative"><Quote size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500"/><input value={tempData.bio} onChange={e=>setTempData({...tempData, bio:e.target.value})} className={inputClass} placeholder={currentT.motto} /></div>
              </div>

              <button type="submit" className="w-full py-6 bg-indigo-600 text-white rounded-[2.2rem] font-black shadow-xl shadow-indigo-600/40 flex items-center justify-center gap-3 active:scale-95 transition-all mt-4 tracking-widest text-[11px] uppercase">
                <Save size={20} /> {currentT.save}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- SETTINGS DRAWER --- */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-lg p-10 rounded-t-[4rem] animate-slideUp shadow-2xl ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="w-16 h-1.5 bg-slate-500/20 rounded-full mx-auto mb-8"></div>
            
            <div className="flex justify-between items-center mb-10">
               <h3 className={`text-2xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{currentT.settings}</h3>
               <button onClick={() => setIsSettingsOpen(false)} className={`p-4 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}><X size={20}/></button>
            </div>

            <div className="space-y-4">
              <div className={infoRowClass}>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><Globe size={18}/></div>
                  <span className="font-black text-[11px] uppercase tracking-widest">{currentT.lang}</span>
                </div>
                <div className="flex bg-slate-500/10 p-1 rounded-xl">
                  {['ID', 'EN'].map(l => (
                    <button key={l} onClick={() => setLanguage(l)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${language === l ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}>{l}</button>
                  ))}
                </div>
              </div>

              <div className={infoRowClass}>
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl"><Palette size={18}/></div>
                    <span className="font-black text-[11px] uppercase tracking-widest">{currentT.theme}</span>
                 </div>
                 <div className="flex gap-2">
                   {themes.map(t => (
                     <button key={t.id} onClick={() => setUserData({...userData, accent: t.id})} className={`w-6 h-6 rounded-full ${t.color} ${userData.accent === t.id ? 'ring-4 ring-indigo-500/30' : 'opacity-40'}`}></button>
                   ))}
                 </div>
              </div>
            </div>

            <p className="text-center text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mt-12 mb-4">SchoolPass Version 2.4.1</p>
          </div>
        </div>
      )}

      {/* Global Style */}
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        .animate-slideUp { animation: slideUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); }
      `}</style>
    </div>
  );
};

export default UserProfile;