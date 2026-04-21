import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Search, ShoppingBag, ChevronRight, LayoutGrid, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  
  // ESTADOS PARA EL CARRUSEL
  const [indiceBanner, setIndiceBanner] = useState(0);

  useEffect(() => {
    fetchProductos();
  }, []);

  // Lógica del temporizador para el carrusel (5 segundos)
  useEffect(() => {
    if (productos.length > 0) {
      const intervalo = setInterval(() => {
        setIndiceBanner((prev) => (prev + 1) % Math.min(productos.length, 3));
      }, 4000);
      return () => clearInterval(intervalo);
    }
  }, [productos]);

  const fetchProductos = async () => {
    const { data } = await supabase.from('productos').select('*').order('id', { ascending: false });
    setProductos(data || []);
  };

  // Obtener categorías únicas de los productos existentes
  const todasLasCategorias = productos.map(p => p.categoria);
  const categoriasDinamicas = [...new Set(todasLasCategorias)].filter(Boolean).sort();

  const productosFiltrados = productos.filter(p => {
    const nombre = p.nombre ? p.nombre.toLowerCase() : "";
    const coincideNombre = nombre.includes(busqueda.toLowerCase());
    const coincideCat = categoriaSeleccionada === 'Todas' || p.categoria === categoriaSeleccionada;
    return coincideNombre && coincideCat;
  });

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans">
      <Navbar setMenuAbierto={setMenuAbierto} />
      
      <div className="max-w-[1400px] mx-auto flex gap-8 p-4 md:p-8">
        
        <Sidebar 
          menuAbierto={menuAbierto} 
          setMenuAbierto={setMenuAbierto}
          categorias={categoriasDinamicas}
          categoriaSeleccionada={categoriaSeleccionada}
          setCategoriaSeleccionada={setCategoriaSeleccionada}
        />

        <main className="flex-1 w-full">
          
          {/* BARRA DE BÚSQUEDA */}
          <div className="relative mb-10 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar cámaras, herramientas, accesorios..." 
              className="w-full bg-[#1e293b] border border-slate-700 py-5 pl-16 pr-8 rounded-[2rem] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm md:text-base shadow-xl shadow-black/20"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {/* BANNER CARRUSEL DINÁMICO (Solo se muestra en "Todas") */}
          {productos.length > 0 && categoriaSeleccionada === 'Todas' && busqueda === '' && (
            <section className="mb-12 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-900 via-[#1e293b] to-slate-900 border border-blue-500/20 shadow-2xl min-h-[450px] flex items-center">
              
              {/* Indicadores (Bolitas) */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {[...Array(Math.min(productos.length, 3))].map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setIndiceBanner(i)}
                    className={`h-2 rounded-full transition-all duration-500 ${indiceBanner === i ? 'w-10 bg-blue-500' : 'w-2 bg-slate-600'}`}
                  />
                ))}
              </div>

              <div className="flex flex-col md:flex-row items-center p-10 md:p-16 gap-10 w-full">
                <div className="flex-1 text-center md:text-left z-10 animate-in fade-in slide-in-from-left-8 duration-700">
                  <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] italic">
                    Novedad en Domotek
                  </span>
                  <h2 className="text-4xl md:text-7xl font-black text-white mt-6 leading-[0.95] tracking-tighter uppercase italic">
                    {productos[indiceBanner].nombre}
                  </h2>
                  <p className="text-slate-400 mt-6 text-sm md:text-lg leading-relaxed max-w-md line-clamp-2 font-medium">
                    {productos[indiceBanner].descripcion}
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-6 mt-8">
                    <div className="text-4xl font-black text-blue-400 tracking-tighter">S/. {productos[indiceBanner].precio}</div>
                    <button 
                      onClick={() => setProductoSeleccionado(productos[indiceBanner])}
                      className="bg-white text-blue-900 px-8 py-4 rounded-2xl font-black text-xs hover:bg-blue-500 hover:text-white transition-all transform hover:-translate-y-1 shadow-lg shadow-white/5 uppercase italic"
                    >
                      Ver producto
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex justify-center relative animate-in fade-in slide-in-from-right-12 duration-1000">
                  <div className="absolute inset-0 bg-blue-600/20 blur-[120px] rounded-full animate-pulse"></div>
                  <img 
                    key={indiceBanner}
                    src={productos[indiceBanner].imagen_url} 
                    alt="Destacado" 
                    className="relative h-72 md:h-[400px] object-contain drop-shadow-[0_35px_60px_rgba(0,0,0,0.6)] transition-all duration-700" 
                  />
                </div>
              </div>
            </section>
          )}

          {/* GRILLA DE PRODUCTOS */}
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
              <LayoutGrid className="text-blue-500" size={20} />
              {categoriaSeleccionada} <span className="text-slate-600 text-sm font-bold">/ {productosFiltrados.length} items</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productosFiltrados.map((producto) => (
              <div 
                key={producto.id} 
                onClick={() => setProductoSeleccionado(producto)}
                className="group bg-[#1e293b] rounded-[2rem] overflow-hidden border border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer hover:shadow-2xl hover:shadow-blue-500/10"
              >
                <div className="h-56 bg-white p-6 relative overflow-hidden flex items-center justify-center">
                  <img src={producto.imagen_url} alt={producto.nombre} className="h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                  {producto.stock <= 0 && (
                    <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center font-black text-white uppercase italic text-xs tracking-widest">Agotado</div>
                  )}
                  <div className="absolute top-4 right-4 bg-slate-900/90 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase italic border border-slate-700">
                    {producto.categoria}
                  </div>
                </div>
                
                <div className="p-6">
                  {/* EFECTO DE EXPANSIÓN DEL NOMBRE */}
                  <div className="relative min-h-[2.5rem] group/nombre">
                    <h4 className="text-white font-black text-sm uppercase italic tracking-tighter leading-tight 
                                   line-clamp-2 
                                   group-hover/nombre:line-clamp-none 
                                   group-hover/nombre:absolute 
                                   group-hover/nombre:z-20 
                                   group-hover/nombre:bg-[#1e293b] 
                                   group-hover/nombre:text-blue-400 
                                   group-hover/nombre:shadow-2xl
                                   transition-all duration-300 w-full">
                      {producto.nombre}
                    </h4>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-black text-white tracking-tighter">S/. {producto.precio}</span>
                    <div className="p-3 bg-blue-600/10 text-blue-500 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* MODAL DE DETALLES (Pop-up) */}
      {productoSeleccionado && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={() => setProductoSeleccionado(null)}></div>
          <div className="relative bg-[#1e293b] w-full max-w-4xl rounded-2xl md:rounded-[3rem] overflow-hidden border border-slate-700 shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setProductoSeleccionado(null)}
              className="absolute top-6 right-6 z-10 p-2 bg-slate-900 rounded-full text-slate-400 hover:text-white border border-slate-700 transition-all"
            >
              <X size={20} />
            </button>
            <div className="flex-1 bg-white p-12 flex items-center justify-center">
              <img src={productoSeleccionado.imagen_url} alt="" className="max-h-[350px] object-contain drop-shadow-2xl" />
            </div>
            <div className="flex-1 p-10 md:p-14">
              <span className="text-blue-500 font-black text-[10px] uppercase tracking-[0.3em]">{productoSeleccionado.categoria}</span>
              <h2 className="text-3xl md:text-4xl font-black text-white mt-4 italic uppercase leading-none tracking-tighter">{productoSeleccionado.nombre}</h2>
              <div className="text-3xl font-black text-blue-400 mt-6 tracking-tighter">S/. {productoSeleccionado.precio}</div>
              <div className="mt-8 pt-8 border-t border-slate-700">
                <p className="text-slate-400 text-sm md:text-base leading-relaxed italic">{productoSeleccionado.descripcion || "Sin descripción disponible."}</p>
              </div>
              <div className="mt-4">
                <span className={`text-[10px] font-bold uppercase ${productoSeleccionado.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    Disponibilidad: {productoSeleccionado.stock > 0 ? `${productoSeleccionado.stock} unidades` : 'Agotado'}
                </span>
              </div>
              <a 
                href={`https://wa.me/51936374988?text=Hola Domotek! Me interesa este producto: ${productoSeleccionado.nombre}`}
                target="_blank" rel="noreferrer"
                className="mt-10 w-full bg-green-600 hover:bg-green-500 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 shadow-lg shadow-green-900/20 uppercase text-xs italic"
              >
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Home;