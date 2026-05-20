import React, { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import { supabase } from '../lib/supabase';
import {
  Search,
  QrCode,
  X,
  User,
  CheckCircle2,
  Layers,
  ChevronDown,
  Sparkles,
  ScanLine,
  MapPin,
  Clock,
} from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const FormAbsensi = ({ dataSiswa = [], isDarkMode }) => {
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('Semua');
  const [selectedSiswa, setSelectedSiswa] = useState(null);
  const [status, setStatus] = useState('Hadir');
  const [catatan, setCatatan] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  // Ambil daftar kelas unik dari dataSiswa
  const listKelas = useMemo(() => {
    const kelas = dataSiswa.map((s) => s.kelas);
    return ['Semua', ...new Set(kelas)];
  }, [dataSiswa]);

  // Filter pencarian berdasarkan kelas dan keyword (Sesuai tabel dataSiswa)
  const filteredSearch = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term || selectedSiswa) return [];

    return dataSiswa
      .filter((s) => {
        const matchKelas =
          selectedClass === 'Semua' || s.kelas === selectedClass;
        const matchTerm =
          (s.nama && s.nama.toLowerCase().includes(term)) ||
          (s.nisn && String(s.nisn).includes(term));
        return matchKelas && matchTerm;
      })
      .slice(0, 5);
  }, [search, dataSiswa, selectedSiswa, selectedClass]);

  useEffect(() => {
    let scanner = null;
    if (showScanner) {
      scanner = new Html5QrcodeScanner('reader', {
        fps: 20,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      });

      scanner.render(
        (text) => {
          const found = dataSiswa.find((s) => String(s.nisn) === text);
          if (found) {
            setSelectedSiswa(found);
            setSearch(found.nama);
            setShowScanner(false);
            scanner.clear();

            if (navigator.vibrate) navigator.vibrate(100);
            Swal.fire({
              icon: 'success',
              title: 'QR Terverifikasi!',
              text: `Identitas: ${found.nama}`,
              timer: 1500,
              showConfirmButton: false,
              background: isDarkMode ? '#1e293b' : '#fff',
              color: isDarkMode ? '#fff' : '#000',
            });
          }
        },
        () => {}
      );
    }
    return () => {
      if (scanner) scanner.clear().catch(() => {});
    };
  }, [showScanner, dataSiswa, isDarkMode]);

  // FUNGSI HANDLE ABSEN - CONNECT TO SUPABASE
  const handleAbsen = async (e) => {
    e.preventDefault();
    if (!selectedSiswa) return;

    const ket =
      status === 'Izin'
        ? catatan
        : status === 'Alfa'
          ? 'Tanpa Keterangan'
          : 'Hadir Tepat Waktu';

    // Perbaikan Format Tanggal agar diterima Supabase (YYYY-MM-DD)
    const now = new Date();
    const formatTanggal = now.toISOString().split('T')[0];
    const formatWaktu = now
      .toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      .replace('.', ':');

    const entryData = {
      nama: selectedSiswa.nama,
      kelas: selectedSiswa.kelas,
      status: status,
      keterangan: ket,
      tanggal: formatTanggal, // Hasilnya: 2026-05-13
      waktu: formatWaktu,
    };

    try {
      const { error } = await supabase.from('absensi').insert([entryData]);

      if (error) throw error;

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: `${selectedSiswa.nama} berhasil absen (${status})`,
        background: isDarkMode ? '#1e293b' : '#fff',
        color: isDarkMode ? '#fff' : '#000',
      });
      // Reset form
      setSelectedSiswa(null);
      setSearch('');
      setCatatan('');
      setStatus('Hadir');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Mengirim',
        text: error.message,
        background: isDarkMode ? '#1e293b' : '#fff',
        color: isDarkMode ? '#fff' : '#000',
      });
    }
  };

  const inputBaseClass = `w-full pl-12 pr-6 py-5 rounded-3xl outline-none font-bold border-2 transition-all duration-300 ${
    isDarkMode
      ? 'bg-slate-900 border-slate-800 text-white focus:border-indigo-500'
      : 'bg-slate-50 border-slate-50 focus:border-indigo-400 focus:bg-white shadow-inner'
  }`;

  return (
    <div
      className={`min-h-screen p-6 pb-40 animate-fadeIn ${isDarkMode ? 'bg-[#020617]' : 'bg-slate-50'}`}
    >
      <div className="max-w-lg mx-auto flex justify-between items-end mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={16} className="text-indigo-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">
              Terminal Cloud V1
            </span>
          </div>
          <h2
            className={`text-4xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
          >
            PRESENSI
          </h2>
        </div>

        <button
          onClick={() => setShowScanner(!showScanner)}
          className={`relative p-5 rounded-[2rem] transition-all active:scale-90 shadow-2xl overflow-hidden group ${
            showScanner
              ? 'bg-rose-500 shadow-rose-500/20'
              : 'bg-indigo-600 shadow-indigo-500/20'
          } text-white`}
        >
          {showScanner ? (
            <X size={24} className="relative z-10" />
          ) : (
            <QrCode size={24} className="relative z-10" />
          )}
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </button>
      </div>

      <div className="max-w-lg mx-auto space-y-6">
        {showScanner && (
          <div className="relative animate-slideUp">
            <div
              id="reader"
              className="rounded-[2.5rem] overflow-hidden border-4 border-indigo-500 shadow-2xl bg-black"
            ></div>
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
              <div className="w-64 h-64 border-2 border-indigo-400/30 rounded-3xl relative overflow-hidden">
                <div className="w-full h-1 bg-indigo-500 shadow-[0_0_15px_#6366f1] absolute top-0 left-0 animate-scanLoop"></div>
              </div>
              <p className="mt-4 text-[10px] font-black text-white uppercase tracking-[0.4em] bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">
                Scanning Identity...
              </p>
            </div>
          </div>
        )}

        <form
          onSubmit={handleAbsen}
          className={`${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-white shadow-2xl shadow-slate-200'} p-8 rounded-[3.5rem] border backdrop-blur-md space-y-6 animate-slideUp`}
        >
          <div className="relative group">
            <Layers
              className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-500"
              size={18}
            />
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedSiswa(null);
                setSearch('');
              }}
              className={`${inputBaseClass} appearance-none cursor-pointer`}
            >
              {listKelas.map((k) => (
                <option key={k} value={k} className="bg-slate-900 text-white">
                  {k === 'Semua' ? 'Semua Kelas' : k}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:rotate-180 transition-transform"
              size={18}
            />
          </div>

          <div className="relative">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari Nama / NISN..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedSiswa(null);
              }}
              className={inputBaseClass}
            />

            {filteredSearch.length > 0 && (
              <div
                className={`absolute left-0 right-0 top-[110%] rounded-[2rem] p-3 shadow-2xl z-[9999] border animate-fadeIn ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 text-slate-800'}`}
              >
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-4 py-2">
                  Hasil Pencarian ({selectedClass})
                </p>
                {filteredSearch.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setSelectedSiswa(s);
                      setSearch(s.nama);
                    }}
                    className="p-4 hover:bg-indigo-600 hover:text-white rounded-2xl cursor-pointer font-bold flex justify-between items-center transition-all group"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm">{s.nama}</span>
                      <span className="text-[9px] opacity-50 uppercase">
                        {s.nisn}
                      </span>
                    </div>
                    <span className="text-[10px] bg-slate-500/10 group-hover:bg-white/20 px-2 py-1 rounded-lg uppercase tracking-tighter">
                      {s.kelas}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedSiswa && (
            <div className="flex items-center gap-4 p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] animate-slideUp">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                <User size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p
                    className={`text-xs font-black uppercase ${isDarkMode ? 'text-white' : 'text-slate-800'}`}
                  >
                    {selectedSiswa.nama}
                  </p>
                  <CheckCircle2 className="text-emerald-500" size={14} />
                </div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  {selectedSiswa.kelas} • Ready to Clock-In
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedSiswa(null);
                  setSearch('');
                }}
                className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            {[
              {
                id: 'Hadir',
                col: 'bg-emerald-500',
                shadow: 'shadow-emerald-500/40',
              },
              {
                id: 'Izin',
                col: 'bg-orange-500',
                shadow: 'shadow-orange-500/40',
              },
              { id: 'Alfa', col: 'bg-rose-500', shadow: 'shadow-rose-500/40' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setStatus(st.id)}
                className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 border-2 ${
                  status === st.id
                    ? `${st.col} ${st.shadow} text-white border-transparent scale-105 shadow-xl`
                    : isDarkMode
                      ? 'bg-slate-800/50 border-slate-800 text-slate-500'
                      : 'bg-slate-50 border-slate-100 text-slate-400'
                }`}
              >
                {st.id}
              </button>
            ))}
          </div>

          {status === 'Izin' && (
            <textarea
              placeholder="Berikan alasan izin yang jelas..."
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              className={`w-full p-5 rounded-2xl outline-none text-sm font-bold border-2 transition-all animate-slideUp ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-white focus:border-orange-500'
                  : 'bg-orange-50/50 border-orange-100 focus:border-orange-400 focus:bg-white'
              }`}
              rows={3}
            />
          )}

          <button
            type="submit"
            disabled={!selectedSiswa}
            className={`w-full py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] transition-all overflow-hidden relative group active:scale-95 shadow-2xl ${
              selectedSiswa
                ? 'bg-indigo-600 text-white shadow-indigo-600/30'
                : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed border-none shadow-none'
            }`}
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12"></div>
            <span className="relative z-10 flex items-center justify-center gap-3">
              Kirim Absensi {selectedSiswa && <Sparkles size={14} />}
            </span>
          </button>
        </form>
      </div>

      <style>{`
        @keyframes scanLoop {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scanLoop { animation: scanLoop 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default FormAbsensi;
