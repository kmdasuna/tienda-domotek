import { Menu, ShoppingBag, MessageCircle } from 'lucide-react'; // Añadimos el icono de mensaje

const Navbar = ({ setMenuAbierto }) => {
  return (
    <nav className="bg-[#1e293b] border-b border-slate-800 p-4 sticky top-0 z-[60] shadow-xl">
      <div className="max-w-[1400px] mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setMenuAbierto(true)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
          >
            <Menu size={24} />
          </button>
          <div className="flex flex-col">
            <span className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">Domotek</span>
            <span className="text-[10px] text-blue-500 font-bold tracking-[0.3em] uppercase leading-none mt-1">Store</span>
          </div>
        </div>

        {/* SECCIÓN DE CONTACTO VOLVIENDO A SER FUNCIONAL */}
        <div className="flex items-center gap-4 md:gap-6">
          <a 
            href="https://wa.me/51936374988" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-3 group"
          >
            <div className="hidden md:flex flex-col text-right">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest group-hover:text-blue-400 transition-colors">Atención al Cliente</span>
              <span className="text-xs text-white font-black italic">+51 936 374 988</span>
            </div>
            <div className="bg-green-600/10 p-2.5 rounded-xl border border-green-500/20 text-green-500 group-hover:bg-green-600 group-hover:text-white transition-all shadow-lg shadow-green-900/10">
              <MessageCircle size={20} fill="currentColor" fillOpacity={0.2} />
            </div>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;