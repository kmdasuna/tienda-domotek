import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import logoDomotek from '../assets/logo_store_20615343405-removebg-preview.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Error: Credenciales incorrectas para el acceso administrativo.");
    } else {
      navigate('/admin'); // Si es correcto, lo mandamos al panel
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1e293b] rounded-[2.5rem] p-8 border border-slate-700 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <img src={logoDomotek} alt="Domotek" className="h-24 object-contain mb-4" />
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter text-center">
            Panel de Control <br/> <span className="text-blue-500 not-italic font-medium text-sm tracking-widest">ACCESO RESTRINGIDO</span>
          </h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-slate-500 size-5" />
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full bg-[#0f172a] border border-slate-600 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-slate-500 size-5" />
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full bg-[#0f172a] border border-slate-600 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl mt-4 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "VERIFICANDO..." : "INGRESAR AL SISTEMA"}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <p className="text-center text-slate-500 text-[10px] mt-8 uppercase font-bold tracking-widest">
            Exclusivo para personal autorizado de Domotek
        </p>
      </div>
    </div>
  );
};

export default Login;