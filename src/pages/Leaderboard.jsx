import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, Medal, Star, ArrowLeft, Crown, 
  TrendingUp, Award, Flame, Target, Zap 
} from 'lucide-react';

const Leaderboard = ({ absensi = [], dataSiswa = [], isDarkMode }) => {
  const navigate = useNavigate();

  // 1. Logika Kalkulasi Data Siswa Ter-Rajin
  const leaderboardData = dataSiswa.map(siswa => {
    // Hitung total hadir (bisa dikembangkan berdasarkan ketepatan waktu jika ada data jam)
    const totalHadir = absensi.filter(a => a.nama === siswa.nama && a.status.includes('Hadir')).length;
    
    // Logika Persentase (Asumsi total hari efektif adalah 20 hari atau sesuai data)
    const percentage = Math.min((totalHadir / 20) * 100, 100).toFixed(0);

    return { ...siswa, score: totalHadir, percent: percentage };
  }).sort((a, b) => b.score - a.score);

  const top3 = leaderboardData.slice(0, 3);
  const rest = leaderboardData.slice(3);

  const cardClass = isDarkMode 
    ? 'bg-slate-900 border-slate-800 text-white' 
    : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50 text-slate-800';

  return (
    <div className={`p-6 pb-40 min-h-screen transition-all duration-500 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className={`p-3 rounded-2xl ${isDarkMode ? 'bg-slate-900 text-white shadow-black' : 'bg-white shadow-lg text-slate-600'}`}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className={`text-2xl font-black italic tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Hall of Fame</h2>
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">Mei 2026 Edition</p>
          </div>
        </div>
        <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
          <Award size={24} />
        </div>
      </div>

      {/* Podium Top 3 - Desain Visual Mewah */}
      <div className="flex justify-center items-end gap-2 mb-16 mt-12">
        {/* Rank 2 - Silver */}
        {top3[1] && (
          <div className="flex flex-col items-center animate-slideUp" style={{ animationDelay: '200ms' }}>
            <div className="relative mb-3">
              <div className="w-16 h-16 bg-slate-200 rounded-[1.8rem] flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                 <span className="text-2xl">🥈</span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-slate-400 text-white p-1 rounded-lg text-[8px] font-black">#2</div>
            </div>
            <div className="h-28 w-24 bg-gradient-to-b from-slate-400 to-slate-600 rounded-t-[2.5rem] flex flex-col items-center justify-center p-3 text-white shadow-2xl relative">
              <span className="text-[8px] font-black uppercase truncate w-full text-center opacity-80">{top3[1].nama}</span>
              <span className="text-2xl font-black">{top3[1].score}</span>
              <span className="text-[7px] font-bold opacity-60">KEHADIRAN</span>
            </div>
          </div>
        )}

        {/* Rank 1 - Gold */}
        {top3[0] && (
          <div className="flex flex-col items-center -translate-y-6 z-10 animate-slideUp">
            <Crown className="text-amber-400 mb-2 animate-bounce" size={40} />
            <div className="relative mb-3">
              <div className="w-20 h-20 bg-amber-100 rounded-[2.2rem] flex items-center justify-center border-4 border-white shadow-2xl overflow-hidden ring-4 ring-amber-500/20">
                 <span className="text-4xl">👑</span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white px-2 py-1 rounded-lg text-[10px] font-black shadow-lg">WINNER</div>
            </div>
            <div className="h-36 w-28 bg-gradient-to-b from-amber-400 to-amber-600 rounded-t-[3rem] flex flex-col items-center justify-center p-3 text-white shadow-[0_20px_40px_rgba(245,158,11,0.3)] relative border-x border-t border-white/20">
              <span className="text-[10px] font-black uppercase truncate w-full text-center">{top3[0].nama}</span>
              <span className="text-3xl font-black">{top3[0].score}</span>
              <span className="text-[8px] font-black opacity-80 tracking-widest">PERFECT!</span>
            </div>
          </div>
        )}

        {/* Rank 3 - Bronze */}
        {top3[2] && (
          <div className="flex flex-col items-center animate-slideUp" style={{ animationDelay: '400ms' }}>
            <div className="relative mb-3">
              <div className="w-16 h-16 bg-orange-100 rounded-[1.8rem] flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                 <span className="text-2xl">🥉</span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-orange-600 text-white p-1 rounded-lg text-[8px] font-black">#3</div>
            </div>
            <div className="h-24 w-24 bg-gradient-to-b from-orange-500 to-orange-700 rounded-t-[2.5rem] flex flex-col items-center justify-center p-3 text-white shadow-2xl relative">
              <span className="text-[8px] font-black uppercase truncate w-full text-center opacity-80">{top3[2].nama}</span>
              <span className="text-2xl font-black">{top3[2].score}</span>
              <span className="text-[7px] font-bold opacity-60">KEHADIRAN</span>
            </div>
          </div>
        )}
      </div>

      {/* Fitur Tambahan: Global Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className={`${cardClass} p-5 rounded-[2.5rem] border flex items-center gap-4`}>
          <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl"><TrendingUp size={20} /></div>
          <div>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Rata-rata</p>
            <p className="text-sm font-black">94% Rajin</p>
          </div>
        </div>
        <div className={`${cardClass} p-5 rounded-[2.5rem] border flex items-center gap-4`}>
          <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl"><Flame size={20} /></div>
          <div>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">On Streak</p>
            <p className="text-sm font-black">12 Siswa</p>
          </div>
        </div>
      </div>

      {/* List Section: Peringkat Lainnya */}
      <div className="space-y-4">
        <h4 className={`text-lg font-black italic ml-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Peringkat Lainnya</h4>
        {rest.length > 0 ? rest.map((item, index) => (
          <div 
            key={index} 
            className={`${cardClass} p-5 rounded-[2.8rem] flex items-center justify-between border group transition-all hover:scale-[1.02] active:scale-95`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-50 text-slate-400'}`}>
                #{index + 4}
              </div>
              <div>
                <p className="font-bold text-sm tracking-tight">{item.nama}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[8px] font-black text-indigo-500 bg-indigo-500/5 px-2 py-0.5 rounded-md uppercase tracking-widest">{item.kelas}</span>
                  <div className="flex items-center text-[8px] font-bold text-slate-400">
                    <Target size={10} className="mr-1" /> {item.percent}%
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className={`text-lg font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{item.score}</p>
                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none">Hadir</p>
              </div>
              <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-slate-800 text-amber-500' : 'bg-amber-50 text-amber-500'}`}>
                <Star size={18} className={item.score > 15 ? "fill-amber-500" : ""} />
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-10 opacity-30 italic font-bold uppercase tracking-[0.2em] text-xs">
            Menunggu Data Tambahan...
          </div>
        )}
      </div>

      {/* Footer Info Badge */}
      <div className="mt-10 p-6 rounded-[3rem] border-2 border-dashed border-indigo-500/20 flex flex-col items-center gap-3 bg-indigo-500/5">
        <Zap className="text-indigo-500" size={24} />
        <p className={`text-[9px] font-black text-center uppercase tracking-widest leading-relaxed ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
          Peringkat diperbarui setiap jam 15:00.<br/>
          Terus tingkatkan kehadiranmu untuk mendapatkan badge emas!
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;