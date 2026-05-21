import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, Medal, Star, ArrowLeft, Crown, 
  TrendingUp, Award, Flame, Target, Zap 
} from 'lucide-react';
import { supabase } from '../lib/supabase'; // Pastikan path ke konfigurasi supabase lu udah bener

const Leaderboard = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const [dataSiswa, setDataSiswa] = useState([]);
  const [absensi, setAbsensi] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH DATA REAL-TIME LANGSUNG DARI SUPABASE
  useEffect(() => {
    const fetchDataKlasemen = async () => {
      setLoading(true);
      try {
        // Fix string escape untuk nama tabel CamelCase di PostgreSQL/Supabase
        const { data: siswaData, error: errorSiswa } = await supabase
          .from('dataSiswa') 
          .select('*');
        
        if (errorSiswa) throw errorSiswa;

        const { data: absensiData, error: errorAbsensi } = await supabase
          .from('absensi')
          .select('*');

        if (errorAbsensi) throw errorAbsensi;

        setDataSiswa(siswaData || []);
        setAbsensi(absensiData || []);
      } catch (err) {
        console.error('Error fetching leaderboard data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDataKlasemen();
  }, []);

  // Logika Kalkulasi Data Klasemen (Fitur Lama Tetap Dijaga & Dioptimalkan)
  const leaderboardData = useMemo(() => {
    const safeDataSiswa = Array.isArray(dataSiswa) ? dataSiswa : [];
    const safeAbsensi = Array.isArray(absensi) ? absensi : [];

    const calculated = safeDataSiswa.map((siswa, index) => {
      const namaSiswa = siswa.nama || siswa.nama_siswa || siswa.name || `Siswa ${index + 1}`;
      const kelasSiswa = siswa.kelas || siswa.class || 'X';

      // Hitung jumlah kehadiran berdasarkan nama siswa di tabel absensi
      const totalHadir = safeAbsensi.filter(a => {
        if (!a) return false;
        const namaAbsen = a.nama || a.nama_siswa || a.name;
        const statusAbsen = a.status || '';
        
        return String(namaAbsen).trim().toLowerCase() === String(namaSiswa).trim().toLowerCase() && 
               String(statusAbsen).toLowerCase().includes('hadir');
      }).length;

      // Logic persentase bawaan code lama
      const totalHariEfektif = safeAbsensi.length > 0 ? Math.max(20, totalHadir) : 20;
      const percentage = ((totalHadir / totalHariEfektif) * 100).toFixed(0);

      return {
        ...siswa,
        nama: namaSiswa,
        kelas: kelasSiswa,
        score: totalHadir,
        percent: Number(percentage)
      };
    });

    // PENGURUTAN: Skor tertinggi (paling rajin) berada paling atas
    return calculated.sort((a, b) => {
      if (b.score === a.score) {
        return a.nama.localeCompare(b.nama); // Jika skor sama baru urutkan abjad
      }
      return b.score - a.score;
    });
  }, [dataSiswa, absensi]);

  const top3 = leaderboardData.slice(0, 3);
  const rest = leaderboardData.slice(3);

  // Kalkulasi statistik global bawaan code lama
  const { rataRataKehadiran, onStreakCount } = useMemo(() => {
    if (leaderboardData.length === 0) return { rataRataKehadiran: 0, onStreakCount: 0 };
    
    const totalPersen = leaderboardData.reduce((acc, curr) => acc + curr.percent, 0);
    const avg = (totalPersen / leaderboardData.length).toFixed(0);
    
    const realAvg = avg === "0" ? "100" : avg;
    const streak = leaderboardData.filter(siswa => siswa.percent >= 80 || siswa.score === 0).length;
    
    return { rataRataKehadiran: realAvg, onStreakCount: streak };
  }, [leaderboardData]);

  const cardClass = isDarkMode 
    ? 'bg-slate-900 border-slate-800 text-white shadow-xl shadow-black/20' 
    : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50 text-slate-800';

  return (
    <div className={`p-6 pb-40 min-h-screen transition-all duration-500 overflow-x-hidden ${isDarkMode ? 'bg-[#020617]' : 'bg-slate-50'}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fadeIn">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className={`p-3 rounded-2xl transition-all duration-300 active:scale-90 ${isDarkMode ? 'bg-slate-900 text-white border border-slate-800 hover:bg-slate-800' : 'bg-white shadow-md text-slate-600 hover:bg-slate-50'}`}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className={`text-2xl font-black italic tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Hall of Fame</h2>
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-1">Mei 2026 Edition</p>
          </div>
        </div>
        <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl animate-pulse">
          <Award size={24} />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 opacity-40 italic font-black uppercase tracking-[0.2em] text-xs animate-pulse">
          Mengsinkronkan Data Klasemen...
        </div>
      ) : leaderboardData.length === 0 ? (
        <div className="text-center py-20 opacity-40 italic font-black uppercase tracking-[0.2em] text-xs animate-pulse">
          Belum Ada Data Siswa...
        </div>
      ) : (
        <>
          {/* Podium Top 3 - Desain Visual Ultra Premium */}
          <div className="flex justify-center items-end gap-3 mb-16 mt-16 px-2 scale-[1.02]">
            
            {/* Rank 2 - Silver */}
            {top3[1] ? (
              <div className="flex flex-col items-center animate-podiumSilver">
                <div className="relative mb-3 group">
                  <div className="w-16 h-16 bg-gradient-to-tr from-slate-200 via-white to-slate-300 rounded-[1.8rem] flex items-center justify-center border-4 border-slate-400 shadow-lg overflow-hidden transition-transform duration-300 group-hover:rotate-12">
                     <span className="text-2xl filter drop-shadow">🥈</span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-slate-500 text-white px-2 py-0.5 rounded-md text-[9px] font-black tracking-tighter border border-white">#2</div>
                </div>
                <div className="h-28 w-24 bg-gradient-to-b from-slate-400 via-slate-500 to-slate-600 rounded-t-[2.2rem] flex flex-col items-center justify-center p-3 text-white shadow-xl relative border-t border-x border-white/20">
                  <div className="absolute inset-0 bg-white/5 rounded-t-[2.2rem] pointer-events-none"></div>
                  <span className="text-[9px] font-black uppercase truncate w-full text-center tracking-tight opacity-90 mb-1">{top3[1].nama}</span>
                  <span className="text-2xl font-black tracking-tight leading-none">{top3[1].score}</span>
                  <span className="text-[7px] font-black opacity-60 tracking-wider mt-0.5">HADIR</span>
                </div>
              </div>
            ) : (
              <div className="w-24 h-28 opacity-0 pointer-events-none" />
            )}

            {/* Rank 1 - Gold */}
            {top3[0] && (
              <div className="flex flex-col items-center -translate-y-5 z-10 animate-podiumGold">
                <Crown className="text-amber-400 mb-2 animate-crownBounce filter drop-shadow-[0_4px_10px_rgba(245,158,11,0.5)]" size={42} />
                <div className="relative mb-3 group">
                  <div className="w-20 h-20 bg-gradient-to-tr from-amber-200 via-yellow-100 to-amber-300 rounded-[2.2rem] flex items-center justify-center border-4 border-amber-400 shadow-2xl overflow-hidden ring-4 ring-amber-500/20 transition-transform duration-500 group-hover:scale-105">
                     <span className="text-4xl filter drop-shadow">👑</span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white px-2 py-0.5 rounded-md text-[9px] font-black shadow-lg border border-white tracking-widest">TOP</div>
                </div>
                <div className="h-36 w-28 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 rounded-t-[2.8rem] flex flex-col items-center justify-center p-3 text-white shadow-[0_25px_50px_rgba(245,158,11,0.35)] relative border-x border-t border-white/30">
                  <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-white/10 to-transparent rounded-t-[2.8rem]"></div>
                  <span className="text-[11px] font-black uppercase truncate w-full text-center tracking-tight mb-1">{top3[0].nama}</span>
                  <span className="text-3xl font-black tracking-tighter leading-none">{top3[0].score}</span>
                  <span className="text-[8px] font-black opacity-90 tracking-[0.15em] mt-1 text-amber-100 bg-amber-700/30 px-2 py-0.5 rounded-full">PERFECT</span>
                </div>
              </div>
            )}

            {/* Rank 3 - Bronze */}
            {top3[2] ? (
              <div className="flex flex-col items-center animate-podiumBronze">
                <div className="relative mb-3 group">
                  <div className="w-16 h-16 bg-gradient-to-tr from-orange-200 via-amber-50 to-orange-300 rounded-[1.8rem] flex items-center justify-center border-4 border-orange-400 shadow-lg overflow-hidden transition-transform duration-300 group-hover:-rotate-12">
                     <span className="text-2xl filter drop-shadow">🥉</span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-orange-600 text-white px-2 py-0.5 rounded-md text-[9px] font-black tracking-tighter border border-white">#3</div>
                </div>
                <div className="h-24 w-24 bg-gradient-to-b from-orange-500 via-orange-600 to-orange-700 rounded-t-[2.2rem] flex flex-col items-center justify-center p-3 text-white shadow-xl relative border-t border-x border-white/20">
                  <div className="absolute inset-0 bg-white/5 rounded-t-[2.2rem] pointer-events-none"></div>
                  <span className="text-[9px] font-black uppercase truncate w-full text-center tracking-tight opacity-90 mb-1">{top3[2].nama}</span>
                  <span className="text-2xl font-black tracking-tight leading-none">{top3[2].score}</span>
                  <span className="text-[7px] font-black opacity-60 tracking-wider mt-0.5">HADIR</span>
                </div>
              </div>
            ) : (
              <div className="w-24 h-24 opacity-0 pointer-events-none" />
            )}
          </div>

          {/* Global Stats - Bento Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className={`${cardClass} p-5 rounded-[2.5rem] border flex items-center gap-4 transform transition-all duration-300 hover:scale-[1.03]`}>
              <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl"><TrendingUp size={20} className="animate-pulse" /></div>
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Rata-rata</p>
                <p className="text-sm font-black tracking-tight">{rataRataKehadiran}% Rajin</p>
              </div>
            </div>
            <div className={`${cardClass} p-5 rounded-[2.5rem] border flex items-center gap-4 transform transition-all duration-300 hover:scale-[1.03]`}>
              <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl"><Flame size={20} className="animate-bounce" style={{ animationDuration: '2s' }} /></div>
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">On Streak</p>
                <p className="text-sm font-black tracking-tight">{onStreakCount} Siswa</p>
              </div>
            </div>
          </div>

          {/* List Section: Peringkat/Klasemen Lainnya */}
          <div className="space-y-3.5">
            <h4 className={`text-sm font-black uppercase tracking-[0.15em] ml-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Peringkat Lainnya</h4>
            {rest.length > 0 ? rest.map((item, index) => {
              const rankNumber = index + 4;
              return (
                <div 
                  key={item.id || `${item.nama}-${index}`} 
                  className={`${cardClass} p-4.5 rounded-[2.2rem] flex items-center justify-between border group transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] animate-staggerRow`}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs transition-colors duration-300 group-hover:bg-indigo-500 group-hover:text-white ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                      #{rankNumber}
                    </div>
                    <div>
                      <p className="font-black text-sm tracking-tight uppercase transition-colors duration-300 group-hover:text-indigo-500">{item.nama}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[8px] font-black text-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/20 px-2 py-0.5 rounded-md uppercase tracking-wider">{item.kelas}</span>
                        <div className="flex items-center text-[9px] font-bold text-slate-400 bg-slate-500/5 dark:bg-slate-400/10 px-1.5 py-0.5 rounded-md">
                          <Target size={10} className="mr-1 text-slate-400" /> {item.percent}%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{item.score}</p>
                      <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none">Hadir</p>
                    </div>
                    <div className={`p-2.5 rounded-xl transition-all duration-300 group-hover:rotate-12 ${isDarkMode ? 'bg-slate-800 text-amber-500' : 'bg-amber-50 text-amber-500'}`}>
                      <Star size={16} className={item.score > 15 ? "fill-amber-500" : "opacity-40"} />
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-8 opacity-40 italic font-black uppercase tracking-[0.2em] text-[9px] animate-fadeIn">
                Semua siswa masuk Top 3 Podium
              </div>
            )}
          </div>
        </>
      )}

      {/* Footer Info Badge */}
      <div className="mt-12 p-6 rounded-[2.8rem] border-2 border-dashed border-indigo-500/20 flex flex-col items-center gap-3 bg-gradient-to-b from-indigo-500/5 to-transparent transition-transform duration-500 hover:scale-[1.01]">
        <Zap className="text-indigo-500 animate-bounce" size={24} style={{ animationDuration: '3s' }} />
        <p className={`text-[9px] font-black text-center uppercase tracking-[0.15em] leading-relaxed ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
          Peringkat diperbarui setiap jam 15:00.<br/>
          Terus tingkatkan kehadiranmu untuk mendapatkan badge emas!
        </p>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes crownBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes pGold { from { transform: translateY(20px) scale(0.9); opacity: 0; } to { transform: translateY(-20px) scale(1); opacity: 1; } }
        @keyframes pSilver { from { transform: translateY(30px) scale(0.9); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        @keyframes pBronze { from { transform: translateY(35px) scale(0.9); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        @keyframes rowStagger { from { transform: translateX(25px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-podiumGold { animation: pGold 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-podiumSilver { animation: pSilver 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.1) 0.1s forwards; opacity: 0; }
        .animate-podiumBronze { animation: pBronze 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.1) 0.2s forwards; opacity: 0; }
        .animate-crownBounce { animation: crownBounce 2.5s ease-in-out infinite; }
        .animate-staggerRow { animation: rowStagger 0.4s cubic-bezier(0.215, 0.61, 0.355, 1) forwards; opacity: 0; }
      `}</style>
    </div>
  );
};

export default Leaderboard;