import { X, MapPin } from 'lucide-react'; 
import logoDomotek from '../assets/logo domotekv2.png';

const Sidebar = ({ menuAbierto, setMenuAbierto, categoriaSeleccionada, setCategoriaSeleccionada, categorias }) => {
  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1e293b] border-r border-slate-700 transform ${menuAbierto ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static transition-transform duration-300 ease-in-out flex flex-col`}>
      
      {/* LOGO DOMOTEK */}
      <div className="p-2 pt-8 flex flex-col items-center border-b border-slate-800">
        <img 
          src={logoDomotek} 
          alt="Domotek Logo" 
          className="w-full h-auto max-h-44 object-contain px-4" 
        />
        <p className="text-[10px] text-blue-400 my-4 uppercase tracking-[0.2em] font-black text-center px-4">
          Tecnología de Vanguardia
        </p>
      </div>
      
      {/* NAVEGACIÓN */}
      <nav className="mt-4 px-4 space-y-2 flex-grow overflow-y-auto scrollbar-hide">
        <p className="text-slate-500 text-[10px] font-bold uppercase px-2 mb-4 tracking-widest italic">Explorar</p>
        
        <button 
          onClick={() => { setCategoriaSeleccionada('Todas'); setMenuAbierto(false); }}
          className={`w-full text-left px-4 py-3 rounded-xl text-[11px] font-black transition-all border ${categoriaSeleccionada === 'Todas' ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-800'}`}
        >
          TODOS LOS PRODUCTOS
        </button>
        
        {categorias.map((cat) => (
          <button 
            key={cat} 
            onClick={() => { setCategoriaSeleccionada(cat); setMenuAbierto(false); }}
            className={`w-full text-left px-4 py-3 rounded-xl text-[11px] font-black transition-all border ${categoriaSeleccionada === cat ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-800'}`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </nav>

      {/* FOOTER DEL SIDEBAR */}
      <div className="p-5 border-t border-slate-800 bg-[#161e2d]">
        
        <div className="flex items-start gap-2 mb-6 text-[11px] text-slate-400 leading-tight">
          <MapPin size={16} className="text-red-500 shrink-0" />
          <span>Casma, Ancash<br/>Mercado Modelo, Campo Ferial</span>
        </div>

        {/* BOTÓN FACEBOOK MANUAL (SIN ICONO DE LIBRERÍA) */}
        <a 
          href="https://www.facebook.com/domotek.casma" // <-- ¡Pon aquí tu link real!
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full py-2.5 bg-[#1877F2] rounded-xl text-white hover:bg-[#145dbf] transition-all text-xs font-black shadow-lg shadow-blue-900/40"
        >
          <div className="bg-white text-[#1877F2] w-5 h-5 rounded flex items-center justify-center text-sm font-black">
            f
          </div>
          SEGUIR EN FACEBOOK
        </a>
        
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col items-center opacity-60">
          <span className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">Developed by</span>
          <span className="text-[10px] font-black text-blue-400">kmdasuna</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;