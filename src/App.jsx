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
import Notifikasi from './pages/Nontifikasi';
import Register from './pages/Register';

// Import Provider & Hook
import { AuthProvider, useAuth } from './hooks/useAuth';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const AppContent = () => {
  const { user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  
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

  // Ambil Data Siswa dari Supabase saat App Load
  useEffect(() => {
    const fetchSiswa = async () => {
      try {
        const { data, error } = await supabase
          .from("dataSiswa") // Case sensitive sesuai tabel kamu
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

          <Route path="/dashboard" element={<PrivateRoute><Dashboard dataSiswa={dataSiswa} absensi={absensi} isDarkMode={isDarkMode} /></PrivateRoute>} />
          <Route path="/datasiswa" element={<PrivateRoute><DataSiswa dataSiswa={dataSiswa} setDataSiswa={setDataSiswa} /></PrivateRoute>} />
          
          {/* PERBAIKAN DI SINI: Sekarang mengirim dataSiswa ke FormAbsensi */}
          <Route path="/absensi" element={
            <PrivateRoute>
              <FormAbsensi 
                dataSiswa={dataSiswa} 
                absensi={absensi} 
                setAbsensi={setAbsensi} 
                isDarkMode={isDarkMode} 
              />
            </PrivateRoute>
          } />

          <Route path="/leaderboard" element={<PrivateRoute><Leaderboard absensi={absensi} /></PrivateRoute>} />
          <Route path="/qrcode" element={<PrivateRoute><MyQRCode userData={userData} /></PrivateRoute>} />
          <Route path="/riwayat" element={<PrivateRoute><Riwayat absensi={absensi} /></PrivateRoute>} />
          <Route path="/info" element={<PrivateRoute><Info /></PrivateRoute>} />
          <Route path="/notifikasi" element={<PrivateRoute><Notifikasi absensi={absensi} setAbsensi={setAbsensi} isDarkMode={isDarkMode} /></PrivateRoute>} />
          <Route path="/profile" element={
            <PrivateRoute>
              <UserProfile 
                userData={userData} 
                setUserData={setUserData} 
                isDarkMode={isDarkMode} 
                toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
              />
            </PrivateRoute>
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