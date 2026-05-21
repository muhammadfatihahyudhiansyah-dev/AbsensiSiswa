import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth'; // Inject Hook Auth
import {
  UserPlus,
  Search,
  Edit3,
  Trash2,
  ArrowLeft,
  User,
  School,
  Save,
  X,
  Hash,
  Mail,
  LayoutGrid,
  List,
  Sparkles,
  Layers, // Ditambahkan untuk ikon Role
} from 'lucide-react';
import Swal from 'sweetalert2';

const DataSiswa = ({ isDarkMode }) => {
  const { user } = useAuth(); // Ambil Session Pengguna Aktif
  const navigate = useNavigate();
  const [dataSiswa, setDataSiswa] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSiswa, setEditingSiswa] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [loading, setLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState('SISWA'); // State pemegang otoritas role
  const [formData, setFormData] = useState({
    nama: '',
    kelas: '',
    email: '',
    nisn: '',
    role: 'SISWA', // Default role di form state
  });

  // 1. FETCH DATA DARI SUPABASE & IDENTIFIKASI ROLE
  useEffect(() => {
    const initPage = async () => {
      try {
        setLoading(true);
        
        // Identifikasi Role Kredensial User Aktif
        if (user?.email) {
          const { data: roleData } = await supabase
            .from('dataSiswa')
            .select('role')
            .eq('email', user.email)
            .maybeSingle();
          if (roleData?.role) {
            setCurrentRole(roleData.role.toUpperCase());
          }
        }

        await fetchSiswa();
      } catch (err) {
        console.error('Initialization error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, [user]);

  const fetchSiswa = async () => {
    try {
      const { data, error } = await supabase
        .from('dataSiswa')
        .select('*')
        .order('nama', { ascending: true });

      if (error) throw error;
      setDataSiswa(data || []);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  const filteredSiswa = dataSiswa.filter(
    (s) =>
      s.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nisn?.toString().includes(searchTerm) ||
      s.kelas?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({ nama: '', kelas: '', email: '', nisn: '', role: 'SISWA' });
    setEditingSiswa(null);
    setIsModalOpen(false);
  };

  // 2. SUBMIT DATA (INSERT ATAU UPDATE)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.nisn || !formData.kelas) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Nama, NISN, dan Kelas wajib diisi!',
        background: isDarkMode ? '#1e293b' : '#fff',
        color: isDarkMode ? '#fff' : '#000',
      });
    }

    try {
      if (editingSiswa) {
        // Logika Update dengan Role Dinamis
        const { error } = await supabase
          .from('dataSiswa')
          .update({
            nama: formData.nama,
            nisn: String(formData.nisn),
            kelas: formData.kelas,
            email: formData.email,
            role: formData.role // Sync perubahan role ke database
          })
          .eq('id', editingSiswa.id);

        if (error) throw error;
        
        Swal.fire({
          icon: 'success',
          title: 'Data Diperbarui',
          timer: 1000,
          showConfirmButton: false,
          background: isDarkMode ? '#1e293b' : '#fff',
          color: isDarkMode ? '#fff' : '#000',
        });
      } else {
        // Logika Insert Akun/Siswa Baru dengan Role Terpilih
        const { error } = await supabase
          .from('dataSiswa')
          .insert([{
            nama: formData.nama,
            nisn: String(formData.nisn),
            kelas: formData.kelas,
            email: formData.email,
            role: formData.role // Memasukkan role pilihan admin
          }]);

        if (error) throw error;

        Swal.fire({
          icon: 'success',
          title: 'User Baru Berhasil Ditambahkan',
          timer: 1000,
          showConfirmButton: false,
          background: isDarkMode ? '#1e293b' : '#fff',
          color: isDarkMode ? '#fff' : '#000',
        });
      }
      fetchSiswa(); // Refresh data
      resetForm();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
        background: isDarkMode ? '#1e293b' : '#fff',
        color: isDarkMode ? '#fff' : '#000',
      });
    }
  };

  // 3. DELETE DATA
  const handleDelete = (id) => {
    if (currentRole !== 'ADMIN') {
      return Swal.fire({
        icon: 'error',
        title: 'Akses Ditolak',
        text: 'Hanya tingkatan ADMIN yang diizinkan meluncurkan fungsi hapus cloud!',
        background: isDarkMode ? '#1e293b' : '#fff',
        color: isDarkMode ? '#fff' : '#000',
      });
    }

    Swal.fire({
      title: 'Hapus Data?',
      text: 'Siswa ini akan dihapus permanen dari cloud!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Hapus!',
      background: isDarkMode ? '#1e293b' : '#fff',
      color: isDarkMode ? '#fff' : '#000',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { error } = await supabase
          .from('dataSiswa')
          .delete()
          .eq('id', id);

        if (!error) {
          fetchSiswa();
          Swal.fire({
            title: 'Terhapus!',
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
            background: isDarkMode ? '#1e293b' : '#fff',
            color: isDarkMode ? '#fff' : '#000',
          });
        }
      }
    });
  };

  const bgCard = isDarkMode
    ? 'bg-slate-900/60 border-slate-800/50'
    : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50';
  const bgInput = isDarkMode
    ? 'bg-slate-800/40 border-slate-700 focus:border-indigo-500 text-white'
    : 'bg-slate-100/50 border-transparent focus:bg-white focus:border-indigo-400 text-slate-800';

  return (
    <div
      className={`min-h-screen p-6 pb-40 transition-all duration-500 ${isDarkMode ? 'bg-[#020617]' : 'bg-slate-50'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate(-1)}
            className={`p-4 rounded-2xl transition-all active:scale-90 ${isDarkMode ? 'bg-slate-900 border border-slate-800 text-indigo-400' : 'bg-white shadow-md text-indigo-600'}`}
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2
                className={`text-3xl font-black italic tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-slate-800'}`}
              >
                DATABASE
              </h2>
              <Sparkles className="text-indigo-500 animate-pulse" size={20} />
            </div>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.3em] mt-1">
              Privilege: {currentRole}
            </p>
          </div>
        </div>
        
        {/* HANYA ADMIN yang bisa membuka modal input/register */}
        {currentRole === 'ADMIN' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-5 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-[2rem] shadow-lg shadow-indigo-500/30 active:scale-90 transition-all"
          >
            <UserPlus size={24} />
          </button>
        )}
      </div>

      {/* Bar Pencarian & Toggle View */}
      <div className="flex gap-3 mb-8">
        <div className="relative flex-1 group">
          <Search
            className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-300'} group-focus-within:text-indigo-500`}
            size={20}
          />
          <input
            type="text"
            placeholder="Cari Nama, Kelas, atau NISN..."
            className={`w-full pl-14 pr-6 py-5 rounded-[2rem] outline-none border-2 font-bold transition-all ${bgInput}`}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
          className={`p-5 rounded-[1.5rem] border-2 transition-all ${isDarkMode ? 'border-slate-800 bg-slate-900 text-slate-400' : 'border-white bg-white shadow-sm text-slate-400'}`}
        >
          {viewMode === 'list' ? <LayoutGrid size={22} /> : <List size={22} />}
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
           <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
           <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em]">Checking Authority...</p>
        </div>
      ) : (
        <div className={viewMode === 'list' ? 'space-y-4' : 'grid grid-cols-2 gap-4'}>
          {filteredSiswa.length > 0 ? (
            filteredSiswa.map((s, i) => (
              <div
                key={s.id}
                className={`${bgCard} backdrop-blur-md p-5 rounded-[2.5rem] border transition-all hover:border-indigo-500/50 hover:shadow-indigo-500/10 active:scale-95 animate-slideUp group overflow-hidden relative`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className={`absolute -right-2 -top-2 opacity-10 group-hover:rotate-12 transition-transform duration-700 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-200'}`}>
                  <User size={80} />
                </div>

                <div className={`flex relative z-10 ${viewMode === 'list' ? 'flex-row items-center justify-between' : 'flex-col items-center text-center'}`}>
                  <div className={`flex items-center gap-5 ${viewMode === 'grid' ? 'flex-col' : ''}`}>
                    <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-indigo-500/30">
                      {s.nama ? s.nama[0].toUpperCase() : '?'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-black text-sm tracking-tight leading-none ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                          {s.nama}
                        </h4>
                        {/* Badge indikator role kecil di sebelah nama user */}
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md tracking-tighter ${s.role === 'ADMIN' ? 'bg-indigo-500/20 text-indigo-400' : s.role === 'GURU' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'}`}>
                          {s.role || 'SISWA'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 opacity-60">
                        <span className={`text-[10px] font-bold uppercase ${isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>{s.kelas}</span>
                        <span className="w-1 h-1 bg-indigo-500 rounded-full"></span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>{s.nisn}</span>
                      </div>
                    </div>
                  </div>

                  <div className={`flex gap-2 ${viewMode === 'grid' ? 'mt-6 w-full' : ''}`}>
                    {/* ADMIN & GURU BISA EDIT */}
                    <button
                      onClick={() => {
                        setEditingSiswa(s);
                        setFormData({
                          nama: s.nama || '',
                          kelas: s.kelas || '',
                          email: s.email || '',
                          nisn: s.nisn || '',
                          role: s.role || 'SISWA', // inject role yang ada ke form data pas diedit
                        });
                        setIsModalOpen(true);
                      }}
                      className={`flex-1 p-3 rounded-xl transition-all ${isDarkMode ? 'bg-slate-800 text-amber-400 hover:bg-amber-500 hover:text-white shadow-lg shadow-black/20' : 'bg-slate-100 text-amber-600 hover:bg-amber-600 hover:text-white shadow-sm'}`}
                    >
                      <Edit3 size={16} className="mx-auto" />
                    </button>
                    
                    {/* HANYA ADMIN YANG BISA LIHAT DAN KLIK TOMBOL TRASH */}
                    {currentRole === 'ADMIN' && (
                      <button
                        onClick={() => handleDelete(s.id)}
                        className={`flex-1 p-3 rounded-xl transition-all ${isDarkMode ? 'bg-slate-800 text-rose-400 hover:bg-rose-500 hover:text-white shadow-lg shadow-black/20' : 'bg-slate-100 text-rose-600 hover:bg-rose-600 hover:text-white shadow-sm'}`}
                      >
                        <Trash2 size={16} className="mx-auto" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center opacity-30 italic font-black uppercase tracking-[0.5em]">
              Tidak Ada Data
            </div>
          )}
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-fadeIn">
          <div
            className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-white'} w-full max-w-lg p-8 rounded-[3rem] shadow-2xl border-2 animate-slideUp relative overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[60px] -z-10"></div>

            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className={`text-2xl font-black italic tracking-tighter uppercase ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  {editingSiswa ? 'Update' : 'Register'}
                </h3>
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Siswa Database</p>
              </div>
              <button
                onClick={resetForm}
                className={`p-3 rounded-full transition-all ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-800'}`}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                <div className="relative group">
                  <User className="absolute left-5 top-5 text-indigo-500" size={18} />
                  <input
                    type="text"
                    placeholder="Nama Lengkap"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className={`w-full pl-14 pr-6 py-5 rounded-[1.5rem] outline-none border-2 font-bold transition-all ${bgInput}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <Hash className="absolute left-5 top-5 text-indigo-500" size={18} />
                    <input
                      type="text"
                      placeholder="NISN"
                      value={formData.nisn}
                      onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                      className={`w-full pl-14 pr-6 py-5 rounded-[1.5rem] outline-none border-2 font-bold transition-all ${bgInput}`}
                    />
                  </div>
                  <div className="relative group">
                    <School className="absolute left-5 top-5 text-indigo-500" size={18} />
                    <input
                      type="text"
                      placeholder="Kelas"
                      value={formData.kelas}
                      onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                      className={`w-full pl-14 pr-6 py-5 rounded-[1.5rem] outline-none border-2 font-bold transition-all ${bgInput}`}
                    />
                  </div>
                </div>

                <div className="relative group">
                  <Mail className="absolute left-5 top-5 text-indigo-500" size={18} />
                  <input
                    type="email"
                    placeholder="Email (Opsional)"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full pl-14 pr-6 py-5 rounded-[1.5rem] outline-none border-2 font-bold transition-all ${bgInput}`}
                  />
                </div>

                {/* DROPDOWN PRIVILEGE ROLE SELECTION */}
                <div className="relative group">
                  <Layers className="absolute left-5 top-5 text-indigo-500" size={18} />
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className={`w-full pl-14 pr-10 py-5 rounded-[1.5rem] outline-none border-2 font-bold transition-all appearance-none cursor-pointer ${bgInput}`}
                  >
                    <option value="SISWA" className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}>SISWA</option>
                    <option value="GURU" className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}>GURU</option>
                    <option value="ADMIN" className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}>ADMIN (Full Access)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center text-slate-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-[2rem] font-black shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-3 active:scale-95 transition-all mt-4 tracking-[0.2em] uppercase text-xs"
              >
                <Save size={20} /> {editingSiswa ? 'Simpan Perubahan' : 'Daftarkan User'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataSiswa;