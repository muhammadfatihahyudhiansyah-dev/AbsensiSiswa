import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clock, Calendar, Search, Trash2, ArrowLeft, 
  UserCheck, Clock8, AlertCircle, FileSpreadsheet, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { supabase } from '../lib/supabase';

const Riwayat = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const [absensi, setAbsensi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');

  // AMBIL DATA DARI SUPABASE
  const fetchHistory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('absensi')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      setAbsensi(data || []);
    } catch (err) {
      console.error('Error fetching history:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // STATISTIK - Menggunakan useMemo agar kalkulasi data lebih efisien & reaktif
  const stats = useMemo(() => {
    const safeAbsensi = Array.isArray(absensi) ? absensi : [];
    return {
      hadir: safeAbsensi.filter(a => a && String(a.status).toLowerCase().includes('hadir')).length,
      izin: safeAbsensi.filter(a => a && String(a.status).toLowerCase() === 'izin').length,
      alpa: safeAbsensi.filter(a => a && (String(a.status).toLowerCase() === 'alpa' || String(a.status).toLowerCase() === 'alfa')).length,
    };
  }, [absensi]);

  // LOGIKA FILTER
  const filteredLogs = useMemo(() => {
    const safeAbsensi = Array.isArray(absensi) ? absensi : [];
    return safeAbsensi.filter(log => {
      if (!log) return false;
      const matchesSearch = 
        (log.nama?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
        (log.kelas?.toLowerCase() || "").includes(searchTerm.toLowerCase());
      
      const logStatusClean = String(log.status).toLowerCase();
      let matchesStatus = filterStatus === 'Semua';
      
      if (!matchesStatus) {
        if (filterStatus === 'Hadir') matchesStatus = logStatusClean.includes('hadir');
        else if (filterStatus === 'Izin') matchesStatus = logStatusClean === 'izin';
        else if (filterStatus === 'Alfa') matchesStatus = (logStatusClean === 'alfa' || logStatusClean === 'alpa');
      }
      
      return matchesSearch && matchesStatus;
    });
  }, [absensi, searchTerm, filterStatus]);

  // FITUR UTAMA: Ekspor Data ke Excel/Spreadsheet (Format CSV dengan BOM UTF-8)
  const exportToSpreadsheet = () => {
    if (absensi.length === 0) {
      Swal.fire({
        title: 'Gagal Ekspor!',
        text: 'Tidak ada data log absensi yang bisa diunduh.',
        icon: 'info',
        background: isDarkMode ? '#0f172a' : '#fff',
        color: isDarkMode ? '#fff' : '#000',
        confirmButtonColor: '#4f46e5',
      });
      return;
    }

    // Pembuatan Header & Baris Data
    const headers = ['ID', 'Nama Siswa', 'Kelas', 'Status Kehadiran', 'Tanggal', 'Jam', 'Keterangan'];
    const csvRows = [headers.join(',')];

    absensi.forEach(log => {
      const row = [
        log.id || '',
        `"${(log.nama || '').replace(/"/g, '""')}"`,
        `"${(log.kelas || '').replace(/"/g, '""')}"`,
        log.status || '',
        log.tanggal || '',
        log.waktu || '',
        `"${(log.keterangan || '-').replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(','));
    });

    // Menggunakan UTF-8 BOM agar Excel otomatis membaca karakter spesial dengan benar tanpa berantakan
    const csvContent = '\uFEFF' + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Proses pembuatan tautan unduhan otomatis
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `REKAP_ABSENSI_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
      title: 'Berhasil Ekspor!',
      text: 'File CSV berhasil dibuat, siap dibuka di Excel atau Google Sheets.',
      icon: 'success',
      background: isDarkMode ? '#0f172a' : '#fff',
      color: isDarkMode ? '#fff' : '#000',
      confirmButtonColor: '#10b981',
    });
  };

  const clearHistory = async () => {
    Swal.fire({
      title: 'Hapus Semua Data?',
      text: "Data di database akan dihapus permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Bersihkan!',
      cancelButtonText: 'Batal',
      background: isDarkMode ? '#0f172a' : '#fff',
      color: isDarkMode ? '#fff' : '#000',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: isDarkMode ? '#334155' : '#cbd5e1',
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const { error } = await supabase.from('absensi').delete().neq('id', 0);
          if (error) throw error;
          
          setAbsensi([]);
          Swal.fire({
            title: 'Terhapus!', 
            text: 'Riwayat telah dibersihkan.', 
            icon: 'success',
            background: isDarkMode ? '#0f172a' : '#fff',
            color: isDarkMode ? '#fff' : '#000',
          });
        } catch (err) {
          Swal.fire({
            title: 'Gagal Menghapus!',
            text: err.message,
            icon: 'error',
            background: isDarkMode ? '#0f172a' : '#fff',
            color: isDarkMode ? '#fff' : '#000',
          });
        }
      }
    });
  };

  const cardClass = isDarkMode 
    ? 'bg-slate-900/50 border-slate-800 text-white shadow-xl shadow-black/10' 
    : 'bg-white border-slate-100 shadow-xl shadow-slate-200/40 text-slate-800';

  return (
    <div className={`min-h-screen p-6 pb-40 transition-colors duration-500 overflow-x-hidden ${isDarkMode ? 'bg-[#020617]' : 'bg-slate-50'}`}>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-8 animate-riwayatFadeIn">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className={`p-4 rounded-[1.5rem] transition-all duration-300 active:scale-90 ${isDarkMode ? 'bg-slate-900 border border-slate-800 text-white hover:bg-slate-800' : 'bg-white shadow-md text-slate-900 hover:bg-slate-50'}`}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className={`text-3xl font-black italic tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>LOGS</h2>
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-1">Attendance Archive</p>
          </div>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={exportToSpreadsheet} 
             title="Export ke Spreadsheet"
             className={`p-4 rounded-[1.5rem] transition-all duration-300 active:scale-90 transform hover:scale-105 ${isDarkMode ? 'bg-slate-900 border border-slate-800 text-emerald-500 hover:bg-slate-800' : 'bg-white text-emerald-600 shadow-md hover:bg-slate-50'}`}
           >
              <FileSpreadsheet size={20} className="animate-riwayatPulse" style={{ animationDuration: '3s' }} />
           </button>
           <button 
             onClick={clearHistory} 
             className="p-4 bg-rose-500/10 text-rose-500 rounded-[1.5rem] hover:bg-rose-500 hover:text-white transition-all duration-300 active:scale-90 transform hover:scale-105"
           >
              <Trash2 size={20} />
           </button>
        </div>
      </div>

      {/* Mini Stats Grid - Animasi Elevasi Mikro */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Present', val: stats.hadir, color: 'text-emerald-500', bg: 'bg-emerald-500/5', icon: <UserCheck size={14}/>, delay: '0ms' },
          { label: 'Permit', val: stats.izin, color: 'text-orange-500', bg: 'bg-orange-500/5', icon: <Clock8 size={14}/>, delay: '100ms' },
          { label: 'Absent', val: stats.alpa, color: 'text-rose-500', bg: 'bg-rose-500/5', icon: <AlertCircle size={14}/>, delay: '200ms' },
        ].map((s, i) => (
          <div 
            key={i} 
            className={`${cardClass} p-4 rounded-3xl border flex flex-col items-center justify-center text-center transform transition-all duration-300 hover:scale-[1.03] animate-riwayatSlideUp`}
            style={{ animationDelay: s.delay }}
          >
            <div className={`p-2 rounded-xl ${s.bg} ${s.color} mb-1.5 opacity-90`}>{s.icon}</div>
            <span className="text-2xl font-black tracking-tight leading-none">{s.val}</span>
            <span className="text-[8px] font-black uppercase opacity-40 mt-1 tracking-wider">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4 mb-8 animate-riwayatFadeIn" style={{ animationDelay: '150ms' }}>
        <div className={`flex items-center gap-4 px-6 py-4 rounded-3xl border transition-all duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10' : 'bg-white border-slate-100 shadow-sm focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/5'}`}>
          <Search size={18} className="text-slate-400" />
          <input 
            type="text"
            placeholder="Search student or class..."
            className="bg-transparent w-full outline-none font-bold text-sm text-inherit placeholder:opacity-40"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['Semua', 'Hadir', 'Izin', 'Alfa'].map((stat) => (
            <button
              key={stat}
              onClick={() => setFilterStatus(stat)}
              className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap active:scale-95 ${
                filterStatus === stat 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105' 
                : isDarkMode ? 'bg-slate-900 text-slate-400 border border-transparent hover:bg-slate-800' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50 shadow-sm'
              }`}
            >
              {stat}
            </button>
          ))}
        </div>
      </div>

      {/* List Logs - Efek Staggered Entry List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-24 text-center animate-pulse">
            <p className="font-black italic uppercase text-xs tracking-[0.3em] opacity-50">Loading Archive...</p>
          </div>
        ) : filteredLogs.length > 0 ? filteredLogs.map((log, i) => (
          <div 
            key={log.id || i} 
            className={`${cardClass} p-5 rounded-[2.2rem] border relative overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/[0.02] active:scale-[0.99] animate-riwayatRowStagger`}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {/* Indikator Garis Samping Status */}
            <div className={`absolute top-0 left-0 w-1.5 h-full transition-transform duration-300 group-hover:scale-y-110 ${
              String(log.status).toLowerCase().includes('hadir') ? 'bg-emerald-500' : 
              String(log.status).toLowerCase() === 'izin' ? 'bg-orange-500' : 'bg-rose-500'
            }`} />
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className={`w-13 h-13 rounded-2xl flex items-center justify-center font-black text-base transition-transform duration-300 group-hover:rotate-6 ${
                  isDarkMode ? 'bg-slate-800 text-indigo-400' : 'bg-slate-100 text-indigo-600'
                }`}>
                  {log.nama ? String(log.nama)[0].toUpperCase() : '?'}
                </div>
                <div>
                  <h4 className="font-black text-sm tracking-tight mb-1 uppercase group-hover:text-indigo-500 transition-colors duration-300">{log.nama}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {log.kelas}
                    </span>
                    <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
                    <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                      <Clock size={10} /> {log.waktu || '--:--'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider border transition-all duration-300 ${
                  String(log.status).toLowerCase().includes('hadir') ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white' : 
                  String(log.status).toLowerCase() === 'izin' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20 group-hover:bg-orange-500 group-hover:text-white' : 
                  'bg-rose-500/10 text-rose-500 border-rose-500/20 group-hover:bg-rose-500 group-hover:text-white'
                }`}>
                  {log.status}
                </span>
              </div>
            </div>

            {/* Bagian Bawah Card */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-4 text-slate-400">
                <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-tight">
                  <Calendar size={12} className="text-indigo-500" /> {log.tanggal}
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1.5 transition-transform duration-300" />
            </div>

            {/* Box Keterangan Khusus Izin */}
            {String(log.status).toLowerCase() === 'izin' && log.keterangan && (
              <div className="mt-3 p-3.5 bg-orange-500/[0.02] dark:bg-orange-500/[0.04] rounded-2xl border border-dashed border-orange-500/20 transform transition-all duration-300 group-hover:border-orange-500/40">
                <div className="flex gap-2">
                   <AlertCircle size={12} className="text-orange-500 shrink-0 mt-0.5" />
                   <p className="text-[10px] font-bold text-orange-600/90 dark:text-orange-400/90 italic leading-relaxed">
                     "{log.keterangan}"
                   </p>
                </div>
              </div>
            )}
          </div>
        )) : (
          <div className="py-24 text-center animate-riwayatFadeIn">
             <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-6 transform transition-transform hover:rotate-45 duration-500">
                <Clock size={32} className="text-slate-300 dark:text-slate-700 animate-riwayatPulse" />
             </div>
             <p className="font-black italic uppercase text-xs tracking-[0.25em] opacity-30">No Database Record</p>
          </div>
        )}
      </div>

      {/* Gaya Animasi CSS Modular Tingkat Tinggi */}
      <style>{`
        @keyframes riwayatFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes riwayatUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes riwayatPulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.97); } }
        @keyframes riwayatStagger { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

        .animate-riwayatFadeIn { animation: riwayatFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-riwayatSlideUp { animation: riwayatUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .animate-riwayatPulse { animation: riwayatPulse 2s ease-in-out infinite; }
        .animate-riwayatRowStagger { animation: riwayatStagger 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Riwayat;