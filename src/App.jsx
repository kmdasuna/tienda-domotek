import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Login from './pages/Login';

// Componente Guardián de Rutas
const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Revisar si hay una sesión activa al cargar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Escuchar cambios en el estado de autenticación (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white font-black italic uppercase tracking-tighter">Verificando Credenciales...</div>;

  return session ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública para clientes */}
        <Route path="/" element={<Home />} />
        
        {/* Ruta pública para el login */}
        <Route path="/login" element={<Login />} />
        
        {/* Ruta PROTEGIDA para el administrador */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirección por defecto si la ruta no existe */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;