import React, { useState, useEffect } from 'react';
import { 
  Clock, Calendar, Search, Trash2, ArrowLeft, 
  UserCheck, Clock8, AlertCircle, FileSpreadsheet, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { supabase } from '../lib/supabase'; // Pastikan path ini benar

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
        .order('id', { ascending: false }); // Ambil yang terbaru di atas

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

  // STATISTIK
  const stats = {
    hadir: absensi.filter(a => a.status === 'Hadir').length,
    izin: absensi.filter(a => a.status === 'Izin').length,
    alpa: absensi.filter(a => a.status === 'Alfa' || a.status === 'Alpa').length,
  };

  // LOGIKA FILTER
  const filteredLogs = absensi.filter(log => {
    const matchesSearch = 
      (log.nama?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
      (log.kelas?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'Semua' || log.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
    }).then(async (res) => {
      if (res.isConfirmed) {
        const { error } = await supabase.from('absensi').delete().neq('id', 0);
        if (!error) {
          setAbsensi([]);
          Swal.fire('Terhapus!', 'Riwayat telah dibersihkan.', 'success');
        }
      }
    });
  };

  const cardClass = isDarkMode 
    ? 'bg-slate-900/50 border-slate-800' 
    : 'bg-white border-slate-100 shadow-sm';

  return (
    <div className={`min-h-screen p-6 pb-40 animate-fadeIn transition-colors duration-500 ${isDarkMode ? 'bg-[#020617]' : 'bg-slate-50'}`}>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className={`p-4 rounded-[1.5rem] transition-all active:scale-90 ${isDarkMode ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-white shadow-md text-slate-900'}`}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className={`text-3xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>LOGS</h2>
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Attendance Archive</p>
          </div>
        </div>
        <div className="flex gap-2">
           <button onClick={fetchHistory} className={`p-4 rounded-[1.5rem] ${isDarkMode ? 'bg-slate-900 text-emerald-500' : 'bg-white text-emerald-600 shadow-md'}`}>
              <FileSpreadsheet size={20} />
           </button>
           <button onClick={clearHistory} className="p-4 bg-rose-500/10 text-rose-500 rounded-[1.5rem] hover:bg-rose-500 hover:text-white transition-all">
              <Trash2 size={20} />
           </button>
        </div>
      </div>

      {/* Mini Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Present', val: stats.hadir, color: 'text-emerald-500', icon: <UserCheck size={14}/> },
          { label: 'Permit', val: stats.izin, color: 'text-orange-500', icon: <Clock8 size={14}/> },
          { label: 'Absent', val: stats.alpa, color: 'text-rose-500', icon: <AlertCircle size={14}/> },
        ].map((s, i) => (
          <div key={i} className={`${cardClass} p-4 rounded-3xl border flex flex-col items-center justify-center text-center`}>
            <div className={`${s.color} mb-1 opacity-70`}>{s.icon}</div>
            <span className="text-xl font-black leading-none">{s.val}</span>
            <span className="text-[8px] font-black uppercase opacity-40 mt-1">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4 mb-8">
        <div className={`flex items-center gap-4 px-6 py-4 rounded-3xl border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800 focus-within:border-indigo-500' : 'bg-white border-slate-100 shadow-sm'}`}>
          <Search size={18} className="text-slate-400" />
          <input 
            type="text"
            placeholder="Search student or class..."
            className="bg-transparent w-full outline-none font-bold text-sm text-inherit"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['Semua', 'Hadir', 'Izin', 'Alfa'].map((stat) => (
            <button
              key={stat}
              onClick={() => setFilterStatus(stat)}
              className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                filterStatus === stat 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                : isDarkMode ? 'bg-slate-900 text-slate-500' : 'bg-white text-slate-400 border border-slate-100'
              }`}
            >
              {stat}
            </button>
          ))}
        </div>
      </div>

      {/* List Logs */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-24 text-center animate-pulse">
            <p className="font-black italic uppercase text-xs tracking-[0.3em] opacity-50">Loading Data...</p>
          </div>
        ) : filteredLogs.length > 0 ? filteredLogs.map((log, i) => (
          <div 
            key={log.id} 
            className={`${cardClass} p-5 rounded-[2rem] border relative overflow-hidden group transition-all hover:scale-[1.02] hover:shadow-xl`}
          >
            <div className={`absolute top-0 left-0 w-1.5 h-full ${
              log.status === 'Hadir' ? 'bg-emerald-500' : 
              log.status === 'Izin' ? 'bg-orange-500' : 'bg-rose-500'
            }`} />
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg ${
                  isDarkMode ? 'bg-slate-800 text-indigo-400' : 'bg-slate-50 text-indigo-600'
                }`}>
                  {log.nama ? log.nama[0] : '?'}
                </div>
                <div>
                  <h4 className="font-black text-sm tracking-tight mb-1">{log.nama}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-md uppercase">
                      {log.kelas}
                    </span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="text-[9px] font-bold text-slate-400">{log.waktu}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-tighter ${
                  log.status === 'Hadir' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                  log.status === 'Izin' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 
                  'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                }`}>
                  {log.status}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-4 text-slate-400">
                <div className="flex items-center gap-1.5 text-[10px] font-bold">
                  <Calendar size={12} className="text-indigo-500" /> {log.tanggal}
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
            </div>

            {log.status === 'Izin' && log.keterangan && (
              <div className="mt-3 p-4 bg-orange-500/[0.03] rounded-2xl border border-dashed border-orange-500/20">
                <div className="flex gap-2">
                   <AlertCircle size={10} className="text-orange-500 mt-0.5 shrink-0" />
                   <p className="text-[10px] font-bold text-orange-600/80 italic leading-relaxed">
                     "{log.keterangan}"
                   </p>
                </div>
              </div>
            )}
          </div>
        )) : (
          <div className="py-24 text-center">
             <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock size={32} className="text-slate-300 animate-pulse" />
             </div>
             <p className="font-black italic uppercase text-xs tracking-[0.3em] opacity-20">No Database Record</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Riwayat;