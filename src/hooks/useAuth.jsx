import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Swal from "sweetalert2";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Pantau jika ada yang login atau logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  // Fungsi untuk login
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  // Fungsi untuk Register
  const register = async (email, password) => {
    // Supabase secara otomatis mengarahkan ke /auth/v1/signup
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  };
  
  // Fungsi untuk Logout
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error; 
    Swal.fire({
      title: 'Berhasil Logout', 
      icon: 'success', 
      timer: 1500, 
      showConfirmButton: false
    });
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext);
};