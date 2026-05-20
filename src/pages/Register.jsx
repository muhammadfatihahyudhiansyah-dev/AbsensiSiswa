import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  IdCard,
  Orbit,
  Zap,
  Globe
} from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { register } = useAuth();
  const navigate = useNavigate();

  // Efek interaktif mengikuti mouse untuk background
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(email, password);
      Swal.fire({
        title: 'ENROLLED SUCCESS',
        text: 'Identitas baru berhasil diarsipkan.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        background: '#ffffff',
        color: '#4f46e5',
        customClass: {
          popup: 'rounded-[2.5rem] border-4 border-indigo-50 shadow-2xl',
        }
      });
      navigate('/login');
    } catch (error) {
      Swal.fire({
        title: 'ENROLLMENT FAILED',
        text: error.message,
        icon: 'error',
        timer: 2000,
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
      
      {/* Dynamic Aura Background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none transition-transform duration-500 ease-out opacity-60"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.1), transparent 80%)`
        }}
      ></div>

      {/* Floating Decorative Blobs */}
      <div className="absolute -top-20 -left-20 w-[35rem] h-[35rem] bg-indigo-100/50 rounded-full blur-[120px] animate-blob"></div>
      <div className="absolute -bottom-20 -right-20 w-[35rem] h-[35rem] bg-violet-100/50 rounded-full blur-[120px] animate-blob" style={{ animationDelay: '3s' }}></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Main Aesthetic Card */}
        <div className="bg-white/70 backdrop-blur-3xl p-8 sm:p-12 rounded-[4rem] border border-white shadow-[0_32px_64px_-16px_rgba(79,70,229,0.15)] animate-cardEntrance relative overflow-hidden">
          
          {/* Subtle Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>

          {/* Registration Logo Section */}
          <div className="text-center mb-12 relative z-10">
            <div className="relative inline-block group">
              {/* Pulsing Orbit Rings */}
              <div className="absolute -inset-4 border-2 border-indigo-100 rounded-[2.5rem] animate-ping opacity-20"></div>
              <div className="absolute -inset-8 border border-dashed border-indigo-200 rounded-full animate-spin-slow opacity-40"></div>
              
              <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-indigo-200 transform group-hover:scale-105 transition-transform duration-500">
                <IdCard size={44} className="text-white animate-pulse-gentle" />
                
                {/* Floating Badge */}
                <div className="absolute -top-3 -right-3 bg-white p-2.5 rounded-2xl shadow-xl border border-indigo-50 animate-bounce">
                  <UserPlus size={18} className="text-indigo-600" />
                </div>
              </div>
            </div>
            
            <div className="mt-10 space-y-2">
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic">
                ENROLL<span className="text-indigo-600">_</span>ME
              </h2>
              <div className="flex items-center justify-center gap-3">
                <div className="h-[1px] w-5 bg-indigo-200"></div>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] flex items-center gap-2">
                   <Globe size={10} className="animate-spin-slow" /> System Enrollment
                </p>
                <div className="h-[1px] w-5 bg-indigo-200"></div>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-5 relative z-10">
            {/* Email Field */}
            <div className="group">
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-5">Institutional Mail</label>
              <div className="relative">
                <div className="absolute -inset-0.5 bg-indigo-500/10 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity blur"></div>
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="relative w-full bg-slate-50 border-2 border-transparent rounded-2xl pl-14 pr-6 py-5 text-slate-900 font-bold outline-none focus:border-indigo-100 focus:bg-white transition-all shadow-inner placeholder:text-slate-300"
                  placeholder="name@school.id"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-5">Secure Pass-Key</label>
              <div className="relative">
                <div className="absolute -inset-0.5 bg-indigo-500/10 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity blur"></div>
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="relative w-full bg-slate-50 border-2 border-transparent rounded-2xl pl-14 pr-6 py-5 text-slate-900 font-bold outline-none focus:border-indigo-100 focus:bg-white transition-all shadow-inner placeholder:text-slate-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full mt-4 bg-slate-900 rounded-[2rem] py-6 overflow-hidden transition-all active:scale-95 disabled:opacity-50 shadow-2xl shadow-slate-200"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative flex items-center justify-center gap-3 text-white font-black text-[11px] uppercase tracking-[0.3em]">
                {loading ? (
                  <Orbit size={20} className="animate-spin" />
                ) : (
                  <>
                    Confirm Identity <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Login Redirection */}
          <div className="mt-12 text-center relative z-10">
            <Link to="/login" className="inline-flex flex-col items-center group">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 opacity-60">Already have access?</span>
              <span className="text-indigo-600 font-black text-xs uppercase tracking-[0.1em] border-b-2 border-indigo-50 group-hover:border-indigo-600 transition-all pb-1">
                Authenticate Now
              </span>
            </Link>
          </div>
        </div>

        {/* System Mark */}
        <div className="mt-10 flex flex-col items-center gap-3 opacity-30 animate-pulse">
           <Zap size={20} className="text-indigo-500" />
           <p className="text-[8px] font-black text-slate-500 uppercase tracking-[1em] ml-[1em]">
              Data Persistence On
           </p>
        </div>
      </div>

      <style>{`
        @keyframes cardEntrance {
          from { opacity: 0; transform: translateY(50px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.95); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-gentle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(0.95); }
        }
        .animate-cardEntrance {
          animation: cardEntrance 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-blob {
          animation: blob 8s infinite alternate ease-in-out;
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
        .animate-pulse-gentle {
          animation: pulse-gentle 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Register;