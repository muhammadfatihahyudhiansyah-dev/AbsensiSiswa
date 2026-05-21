import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';

// Import Pages
import Navbar from './pages/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DataSiswa from './pages/DataSiswa';
import FormAbsensi from './pages/FormAbsensi';
import Leaderboard from './pages/Leaderboard';
import MyQRCode from './pages/MyQRCode';
import Riwayat from './pages/Riwayat';
import UserProfile from './pages/UserProfile';
import Info from './pages/Info';
import Notifikasi from './pages/Nontifikasi'; // Tetap dipertahankan sesuai nama file Anda
import Register from './pages/Register';

// Import Provider & Hook
import { AuthProvider, useAuth } from './hooks/useAuth';

// PROTECTED ROUTE DENGAN VALIDASI ROLE SECURITY
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();
  const [currentRole, setCurrentRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user?.email) {
        setLoadingRole(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('dataSiswa')
          .select('role')
          .eq('email', user.email)
          .maybeSingle();
        
        if (!error && data) {
          // Normalisasi string role menjadi UPPERCASE agar konsisten
          setCurrentRole(data.role?.toUpperCase() || 'SISWA');
        } else {
          setCurrentRole('SISWA'); // Fallback default aman
        }
      } catch (err) {
        console.error('Error fetching role:', err.message);
        setCurrentRole('SISWA');
      } finally {
        setLoadingRole(false);
      }
    };

    fetchUserRole();
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;
  if (loadingRole) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] animate-pulse">
          Validating Security Token...
        </p>
      </div>
    );
  }

  // Jika halaman butuh role tertentu dan role user sekarang tidak diizinkan, tendang ke dashboard
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppContent = () => {
  const { user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [userRole, setUserRole] = useState('SISWA'); // Global system role state
  
  // State Data
  const [dataSiswa, setDataSiswa] = useState([]);
  const [absensi, setAbsensi] = useState(() => JSON.parse(localStorage.getItem('data_absensi')) || []);
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('user_profile_data');
    return saved ? JSON.parse(saved) : {
      nama: 'Zidan Al-Ghifari',
      email: 'zidan@school.id',
      role: 'Siswa Pro',
      kelas: 'XII RPL 1',
      nisn: '0054321890',
      profilePic: null,
      accent: 'indigo',
    };
  });

  // Sync Role Pengguna Secara Global dari Supabase
  useEffect(() => {
    if (!user?.email) return;
    const syncRole = async () => {
      const { data } = await supabase
        .from('dataSiswa')
        .select('role')
        .eq('email', user.email)
        .maybeSingle();
      if (data?.role) {
        setUserRole(data.role.toUpperCase());
      }
    };
    syncRole();
  }, [user, dataSiswa]);

  // Ambil Data Siswa dari Supabase saat App Load
  useEffect(() => {
    const fetchSiswa = async () => {
      try {
        const { data, error } = await supabase
          .from("dataSiswa") 
          .select('*');
        if (error) throw error;
        if (data) setDataSiswa(data);
      } catch (err) {
        console.error('Gagal mengambil data siswa:', err.message);
      }
    };
    fetchSiswa();
  }, []);

  // Sync ke LocalStorage untuk fitur lainnya
  useEffect(() => {
    localStorage.setItem('user_profile_data', JSON.stringify(userData));
    localStorage.setItem('data_absensi', JSON.stringify(absensi));
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [userData, absensi, isDarkMode]);

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'}`}>
      {user && <Navbar isDarkMode={isDarkMode} />}

      <main className={`${user ? 'pt-20 pb-24' : ''} max-w-md mx-auto relative min-h-screen`}>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

          {/* DASHBOARD: Bisa diakses semua role */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GURU', 'SISWA']}>
              <Dashboard dataSiswa={dataSiswa} absensi={absensi} isDarkMode={isDarkMode} />
            </ProtectedRoute>
          } />

          {/* DATASISWA: Hanya ADMIN dan GURU */}
          <Route path="/datasiswa" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GURU']}>
              <DataSiswa dataSiswa={dataSiswa} setDataSiswa={setDataSiswa} />
            </ProtectedRoute>
          } />
          
          {/* ABSENSI: Hanya ADMIN dan GURU */}
          <Route path="/absensi" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GURU']}>
              <FormAbsensi 
                dataSiswa={dataSiswa} 
                absensi={absensi} 
                setAbsensi={setAbsensi} 
                isDarkMode={isDarkMode} 
              />
            </ProtectedRoute>
          } />

          {/* LEADERBOARD, QRCODE, INFO, NOTIFIKASI, PROFILE: Semua Role Bisa Akses */}
          <Route path="/leaderboard" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GURU', 'SISWA']}>
              <Leaderboard absensi={absensi} dataSiswa={dataSiswa} isDarkMode={isDarkMode} />
            </ProtectedRoute>
          } />
          
          <Route path="/qrcode" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GURU', 'SISWA']}>
              <MyQRCode userData={userData} isDarkMode={isDarkMode} />
            </ProtectedRoute>
          } />
          
          {/* RIWAYAT: Hanya ADMIN yang bisa masuk */}
          <Route path="/riwayat" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Riwayat absensi={absensi} isDarkMode={isDarkMode} />
            </ProtectedRoute>
          } />
          
          <Route path="/info" element={<ProtectedRoute allowedRoles={['ADMIN', 'GURU', 'SISWA']}><Info /></ProtectedRoute>} />
          <Route path="/notifikasi" element={<ProtectedRoute allowedRoles={['ADMIN', 'GURU', 'SISWA']}><Notifikasi absensi={absensi} setAbsensi={setAbsensi} isDarkMode={isDarkMode} /></ProtectedRoute>} />
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GURU', 'SISWA']}>
              <UserProfile 
                userData={userData} 
                setUserData={setUserData} 
                isDarkMode={isDarkMode} 
                toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
              />
            </ProtectedRoute>
          } />

          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;