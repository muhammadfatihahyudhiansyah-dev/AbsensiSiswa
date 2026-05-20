import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  User, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  Fingerprint,
  Zap,
  Sparkles,
  KeyRound,
  Orbit
} from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { login } = useAuth();
  const navigate = useNavigate();

  // Efek interaktif mengikuti mouse untuk background
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      Swal.fire({
        title: 'VERIFIED',
        text: 'Identitas dikonfirmasi. Selamat datang.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        background: '#ffffff',
        color: '#4f46e5',
        customClass: {
          popup: 'rounded-[2.5rem] border-4 border-indigo-50 shadow-2xl',
        }
      });
      navigate('/');
    } catch (error) {
      Swal.fire({
        title: 'DENIED',
        text: 'Email atau password salah.',
        icon: 'error',
        timer: 1500,
        showConfirmButton: false,
        background: '#ffffff',
        color: '#f43f5e',
        customClass: {
          popup: 'rounded-[2.5rem] border-4 border-rose-50',
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-slate-50">
      
      {/* Interactive Background Elements */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none transition-transform duration-300 ease-out"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(79, 70, 229, 0.08), transparent 80%)`
        }}
      ></div>

      {/* Floating Animated Shapes */}
      <div className="absolute top-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-indigo-200/40 rounded-full blur-[100px] animate-blob"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[30rem] h-[30rem] bg-purple-200/40 rounded-full blur-[100px] animate-blob" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 w-full max-w-md">
        {/* White Aesthetic Card */}
        <div className="bg-white/80 backdrop-blur-2xl p-8 sm:p-12 rounded-[3.5rem] border border-white shadow-[0_20px_50px_rgba(79,70,229,0.1)] animate-cardEntrance relative overflow-hidden">
          
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

          {/* Logo Section */}
          <div className="text-center mb-12 relative z-10">
            <div className="relative inline-block group">
              {/* Spinning Orbit Ring */}
              <div className="absolute -inset-6 border-[3px] border-dashed border-indigo-200 rounded-full animate-spin-slow opacity-50 group-hover:opacity-100 group-hover:border-indigo-400 transition-all duration-700"></div>
              
              <div className="relative w-24 h-24 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-[2.2rem] flex items-center justify-center shadow-xl shadow-indigo-200 transform group-hover:rotate-[10deg] transition-transform duration-500">
                <Fingerprint size={48} className="text-white animate-pulse-gentle" />
                
                {/* Floating Badge */}
                <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg border border-slate-100 animate-bounce">
                  <ShieldCheck size={18} className="text-indigo-600" />
                </div>
              </div>
            </div>
            
            <div className="mt-10">
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic">
                SENABSEN<span className="text-indigo-600">_</span>
              </h2>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.6em] mt-2 flex items-center justify-center gap-2">
                <Sparkles size={10} className="animate-spin-slow" /> Security Protocol
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5 relative z-10">
            <div className="group">
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Identifier</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl pl-14 pr-6 py-5 text-slate-900 font-bold outline-none focus:border-indigo-100 focus:bg-white transition-all shadow-inner placeholder:text-slate-300"
                  placeholder="name@school.com"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Pass-Key</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl pl-14 pr-6 py-5 text-slate-900 font-bold outline-none focus:border-indigo-100 focus:bg-white transition-all shadow-inner placeholder:text-slate-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full mt-4 bg-slate-900 rounded-[1.8rem] py-6 overflow-hidden transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-slate-200"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative flex items-center justify-center gap-3 text-white font-black text-[11px] uppercase tracking-[0.2em]">
                {loading ? (
                  <Orbit size={20} className="animate-spin" />
                ) : (
                  <>
                    Initialize Entry <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-12 text-center relative z-10">
            <Link to="/register" className="inline-flex flex-col items-center group">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Authorization needed?</span>
              <span className="text-indigo-600 font-black text-xs uppercase tracking-[0.15em] border-b-2 border-indigo-100 group-hover:border-indigo-500 transition-all">
                Request Account
              </span>
            </Link>
          </div>
        </div>

        {/* Decorative Badge */}
        <div className="mt-12 flex justify-center items-center gap-4 opacity-40">
           <div className="h-[1px] w-12 bg-slate-300"></div>
           <KeyRound size={20} className="text-slate-400" />
           <div className="h-[1px] w-12 bg-slate-300"></div>
        </div>
      </div>

      <style>{`
        @keyframes cardEntrance {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-gentle {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.92); opacity: 0.8; }
        }
        .animate-cardEntrance {
          animation: cardEntrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-blob {
          animation: blob 7s infinite alternate ease-in-out;
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        .animate-pulse-gentle {
          animation: pulse-gentle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;