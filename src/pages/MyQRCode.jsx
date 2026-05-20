import React, { useState, useEffect, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  User, Download, ArrowLeft, ShieldCheck, RotateCw, 
  Fingerprint, Sparkles, Share2, Scan, ShieldAlert,
  Cat, Dog, Bird, Ghost, Smile, Eye, EyeOff
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyQRCode = ({ userData = {}, isDarkMode }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false); // State baru untuk Privacy Mode
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const availableIcons = [
    { id: 'User', icon: <User size={48} /> },
    { id: 'Cat', icon: <Cat size={48} /> },
    { id: 'Dog', icon: <Dog size={48} /> },
    { id: 'Bird', icon: <Bird size={48} /> },
    { id: 'Ghost', icon: <Ghost size={48} /> },
    { id: 'Smile', icon: <Smile size={48} /> },
  ];

  // Handle Tilt Effect
  const handleMouseMove = (e) => {
    if (isFlipped) return;
    const card = containerRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    setRotate({ x: rotateX, y: rotateY });
  };

  const resetRotate = () => setRotate({ x: 0, y: 0 });

  const downloadQR = () => {
    const canvas = document.getElementById("qr-siswa");
    if (!canvas) return;
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `QR_ID_${userData.email?.split('@')[0]}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const username = userData.email?.split('@')[0] || 'GUEST';

  return (
    <div className={`p-6 pb-40 min-h-screen transition-all duration-700 overflow-hidden relative ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Animated Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[30%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[30%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse"></div>

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between mb-10">
        <button onClick={() => navigate(-1)} className={`p-4 rounded-[2rem] active:scale-75 transition-all duration-300 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white shadow-xl text-indigo-600'}`}>
          <ArrowLeft size={20} />
        </button>
        <div className="text-center">
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-1">Pass Identity</p>
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
             <h2 className="text-xl font-black tracking-tighter italic">SCHOOL CARD</h2>
          </div>
        </div>
        <button onClick={downloadQR} className="p-4 bg-indigo-600 text-white rounded-[2rem] shadow-xl shadow-indigo-500/30 active:scale-75 transition-all">
          <Download size={20} />
        </button>
      </div>

      {/* 3D CARD CONTAINER */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetRotate}
        className="perspective-2000 w-full h-[580px] max-w-sm mx-auto relative z-10 cursor-pointer" 
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Floating Privacy Toggle Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Mencegah kartu berputar saat tombol ditekan
            setIsPrivate(!isPrivate);
          }}
          className={`absolute top-6 right-6 z-[100] p-4 rounded-3xl transition-all duration-500 backdrop-blur-xl border ${
            isPrivate 
            ? 'bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/40' 
            : isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-900/5 border-slate-900/10 text-slate-800'
          }`}
        >
          {isPrivate ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>

        <div 
          className={`relative w-full h-full transition-all duration-[1000ms] preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
          style={{ transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) ${isFlipped ? 'rotateY(180deg)' : ''}` }}
        >
          
          {/* FRONT SIDE - FUTURISTIC ID */}
          <div className={`absolute w-full h-full backface-hidden rounded-[4.5rem] shadow-2xl border-[10px] p-8 flex flex-col items-center justify-between overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800 shadow-black/50' : 'bg-white border-white shadow-indigo-200/50'}`}>
            
            {/* Holographic Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-gradient-to-tr from-transparent via-white to-transparent -translate-x-full animate-[shimmer_3s_infinite]"></div>
            
            <div className="w-full flex justify-between items-center px-2">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-indigo-500" />
                <span className="text-[9px] font-black uppercase tracking-widest opacity-50">Secure ID</span>
              </div>
              <Sparkles size={18} className="text-amber-500 animate-pulse" />
            </div>

            {/* Profile Frame */}
            <div className="relative">
                <div className="absolute -inset-4 bg-indigo-500/20 rounded-[4rem] blur-xl animate-pulse"></div>
                <div className="w-36 h-36 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[3.5rem] flex items-center justify-center text-white shadow-2xl relative overflow-hidden ring-[12px] ring-indigo-500/10">
                {userData.customPic ? (
                    <img src={userData.customPic} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                    availableIcons.find(i => i.id === userData.profilePic)?.icon || <User size={54} />
                )}
                </div>
            </div>

            <div className="text-center z-10">
              <h3 className="text-3xl font-black mb-2 tracking-tighter italic uppercase bg-gradient-to-b from-indigo-500 to-indigo-800 bg-clip-text text-transparent">
                {username}
              </h3>
              <div className="flex items-center gap-2 justify-center">
                <span className="h-[1px] w-4 bg-indigo-500/30"></span>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{userData.role || 'PREMIUM STUDENT'}</p>
                <span className="h-[1px] w-4 bg-indigo-500/30"></span>
              </div>
            </div>
            
            {/* QR Scanner Style Container with Blur Effect */}
            <div className="relative p-5 bg-white rounded-[3rem] shadow-2xl border border-slate-100 group transition-all duration-500 hover:scale-110">
              <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-indigo-600 rounded-tl-lg"></div>
              <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-indigo-600 rounded-tr-lg"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-indigo-600 rounded-bl-lg"></div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-indigo-600 rounded-br-lg"></div>
              
              <div className={`transition-all duration-700 ${isPrivate ? 'blur-[18px] opacity-40 scale-90' : 'blur-0'}`}>
                <QRCodeCanvas 
                  id="qr-siswa" 
                  value={userData.email || 'guest@school.id'} 
                  size={150} 
                  level="H" 
                  includeMargin={false}
                  imageSettings={{
                      src: "https://cdn-icons-png.flaticon.com/512/3064/3064155.png",
                      height: 30,
                      width: 30,
                      excavate: true,
                  }}
                />
              </div>

              {/* Masking Text when Private */}
              {isPrivate && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldCheck size={40} className="text-indigo-600 animate-pulse" />
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-3 bg-indigo-50 dark:bg-slate-800 px-6 py-3 rounded-full border border-indigo-100 dark:border-slate-700">
                    <Scan size={14} className="text-indigo-600 animate-spin-slow" />
                    <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">
                      {isPrivate ? 'UNLOCK TO SCAN' : 'TAP TO REVEAL DETAILS'}
                    </p>
                </div>
            </div>
          </div>

          {/* BACK SIDE - SPECIFICATIONS */}
          <div className={`absolute w-full h-full backface-hidden rotate-y-180 bg-[#020617] rounded-[4.5rem] shadow-2xl p-10 flex flex-col border-[12px] border-indigo-600/5 overflow-hidden`}>
            <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, #4f46e5 1px, transparent 0)', backgroundSize: '24px 24px'}}></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[80px] rounded-full"></div>
            
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-600/20 rounded-2xl">
                        <Fingerprint className="text-indigo-400" size={28} />
                    </div>
                    <h4 className="text-white text-xl font-black italic tracking-tighter uppercase leading-none">Meta<br/>Credentials</h4>
                </div>
                <Share2 className="text-slate-500 hover:text-white transition-colors" size={20} />
              </div>
              
              <div className="space-y-8 flex-1">
                {[
                  { label: 'System Identifier', value: username, icon: <User size={14}/> },
                  { label: 'Access Token', value: userData.nisn || '0054321890', icon: <ShieldAlert size={14}/> },
                  { label: 'Assigned Registry', value: `${userData.kelas || 'XII RPL 1'} Class`, icon: <RotateCw size={14}/> }
                ].map((item, i) => (
                  <div key={i} className="animate-slideUp" style={{animationDelay: `${i * 150}ms`}}>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-indigo-500">{item.icon}</span>
                        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em]">{item.label}</p>
                    </div>
                    {/* Nilai Sensitif di-blur jika isPrivate aktif */}
                    <p className={`text-white font-bold text-lg border-l-2 border-indigo-600/30 pl-4 ml-1.5 transition-all duration-500 ${isPrivate ? 'blur-md select-none opacity-40' : 'blur-0'}`}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="mt-auto group">
                <div className="bg-gradient-to-r from-indigo-600/20 to-transparent p-6 rounded-[2.5rem] border border-indigo-400/10 backdrop-blur-sm transition-all group-hover:border-indigo-500/40">
                   <p className="text-[10px] text-indigo-200/60 leading-relaxed font-bold italic">
                     {isPrivate 
                       ? "SECURITY MODE ACTIVE: Credentials hidden for privacy." 
                       : "This identity is strictly for internal school use. Digital signature is verified and encrypted under SchoolPass Protocol v2."
                     }
                   </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(150%) skewX(-20deg); }
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .perspective-2000 {
          perspective: 2000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default MyQRCode;