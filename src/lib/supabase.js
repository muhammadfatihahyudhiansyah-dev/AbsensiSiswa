import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
 

export const supabase = createClient(supabaseUrl, supabaseKey);

// Fungsi ini akan digunakan untuk berinteraksi dengan Supabase, seperti mengambil data transaksi, menambahkan transaksi baru, atau mengupdate data yang sudah ada. Dengan menggunakan Supabase, kita bisa menyimpan data transaksi secara permanen di cloud, sehingga data tidak akan hilang meskipun aplikasi direfresh atau ditutup. Supabase juga menyediakan fitur autentikasi, sehingga kita bisa menambahkan fitur login untuk pengguna jika diinginkan. Dengan begitu, setiap pengguna bisa memiliki data transaksi yang terpisah dan aman.
