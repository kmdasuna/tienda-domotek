import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { Search, ShoppingBag, ChevronRight, LayoutGrid, X, Tag, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

// DEFINIMOS EL ORDEN OFICIAL DE DOMOTEK
const ORDEN_CATEGORIAS = [
  'Cámaras de Seguridad', 
  'Telecomunicaciones', 
  'Cómputo', 
  'Accesorios', 
  'Herramientas', 
  'Otros'
];

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [indiceBanner, setIndiceBanner] = useState(0);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    const { data } = await supabase.from('productos').select('*').order('id', { ascending: false });
    setProductos(data || []);
  };

  // 1. LÓGICA DEL BANNER: PROMOS + 2 DE CADA CATEGORÍA
  const productosBanner = useMemo(() => {
    if (productos.length === 0) return [];

    const promos = productos.filter(p => p.en_promocion).sort(() => 0.5 - Math.random()).slice(0, 2);
    
    const grupos = productos.reduce((acc, p) => {
      if (!acc[p.categoria]) acc[p.categoria] = [];
      acc[p.categoria].push(p);
      return acc;
    }, {});

    let resto = [];
    Object.values(grupos).forEach(items => {
      const shuffled = [...items].filter(p => !p.en_promocion).sort(() => 0.5 - Math.random());
      resto.push(...shuffled.slice(0, 2));
    });

    return [...promos, ...resto].sort(() => 0.5 - Math.random()); // Mezclamos promos y normales
  }, [productos]);

  // Temporizador de 3 segundos
  useEffect(() => {
    if (productosBanner.length > 0) {
      const intervalo = setInterval(() => {
        setIndiceBanner((prev) => (prev + 1) % productosBanner.length);
      }, 3000);
      return () => clearInterval(intervalo);
    }
  }, [productosBanner]);

  // 2. ORDENAR CATEGORÍAS SEGÚN EL DUEÑO
  const categoriasDinamicas = useMemo(() => {
    const existentes = [...new Set(productos.map(p => p.categoria))].filter(Boolean);
    // Ordenamos basándonos en nuestro array oficial
    return existentes.sort((a, b) => {
      let indexA = ORDEN_CATEGORIAS.indexOf(a);
      let indexB = ORDEN_CATEGORIAS.indexOf(b);
      if (indexA === -1) indexA = 99; // Lo que no esté en la lista va al final
      if (indexB === -1) indexB = 99;
      return indexA - indexB;
    });
  }, [productos]);

  // 3. FILTRADO Y ORDEN DE LA GRILLA (Promociones primero)
  const productosFiltrados = useMemo(() => {
    return productos
      .filter(p => {
        const nombre = p.nombre ? p.nombre.toLowerCase() : "";
        const coincideNombre = nombre.includes(busqueda.toLowerCase());
        const coincideCat = categoriaSeleccionada === 'Todas' || p.categoria === categoriaSeleccionada;
        return coincideNombre && coincideCat;
      })
      .sort((a, b) => (b.en_promocion ? 1 : 0) - (a.en_promocion ? 1 : 0)); 
  }, [productos, busqueda, categoriaSeleccionada]);

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
          {/* BUSCADOR */}
          <div className="relative mb-10 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar en Domotek Ancash..." 
              className="w-full bg-[#1e293b] border border-slate-700 py-5 pl-16 pr-8 rounded-[2rem] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm md:text-base shadow-xl shadow-black/20"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {/* BANNER DINÁMICO */}
          {productosBanner.length > 0 && categoriaSeleccionada === 'Todas' && busqueda === '' && (
            <section className={`mb-12 relative overflow-hidden rounded-[2.5rem] border transition-all duration-500 min-h-[450px] flex items-center
              ${productosBanner[indiceBanner].en_promocion 
                ? 'bg-gradient-to-br from-amber-600/20 via-[#1e293b] to-blue-900 border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.2)]' 
                : 'bg-gradient-to-br from-blue-900 via-[#1e293b] to-slate-900 border-blue-500/20'}`}>
              
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {productosBanner.map((_, i) => (
                  <button key={i} onClick={() => setIndiceBanner(i)}
                    className={`h-2 rounded-full transition-all duration-500 ${indiceBanner === i ? 'w-10 bg-blue-500' : 'w-2 bg-slate-600'}`} />
                ))}
              </div>

              <div className="flex flex-col md:flex-row items-center p-10 md:p-16 gap-10 w-full">
                <div className="flex-1 text-center md:text-left z-10">
                  {productosBanner[indiceBanner].en_promocion && (
                    <span className="bg-amber-500 text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2 w-fit mx-auto md:mx-0 mb-4 animate-bounce">
                      <Tag size={12} /> ¡Oferta Especial!
                    </span>
                  )}
                  <h2 className="text-4xl md:text-7xl font-black text-white leading-[0.95] tracking-tighter uppercase italic">
                    {productosBanner[indiceBanner].nombre}
                  </h2>
                  <div className="flex items-center justify-center md:justify-start gap-6 mt-8">
                    <div className="text-4xl font-black text-blue-400 tracking-tighter">S/. {productosBanner[indiceBanner].precio}</div>
                    <button onClick={() => setProductoSeleccionado(productosBanner[indiceBanner])}
                      className="bg-white text-blue-900 px-8 py-4 rounded-2xl font-black text-xs hover:bg-blue-500 hover:text-white transition-all transform hover:-translate-y-1 uppercase italic shadow-lg shadow-white/5">
                      Ver Oferta
                    </button>
                  </div>
                </div>
                <div className="flex-1 flex justify-center relative">
                  <div className={`absolute inset-0 blur-[120px] rounded-full animate-pulse ${productosBanner[indiceBanner].en_promocion ? 'bg-amber-500/30' : 'bg-blue-600/20'}`}></div>
                  <img key={productosBanner[indiceBanner].id} src={productosBanner[indiceBanner].imagen_url} alt="" 
                    className="relative h-72 md:h-[400px] object-contain drop-shadow-2xl transition-all duration-700" />
                </div>
              </div>
            </section>
          )}

          {/* GRILLA DE PRODUCTOS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productosFiltrados.map((producto) => (
              <div key={producto.id} onClick={() => setProductoSeleccionado(producto)}
                className={`group bg-[#1e293b] rounded-[2rem] overflow-hidden border transition-all cursor-pointer hover:shadow-2xl
                  ${producto.en_promocion 
                    ? 'border-amber-500/50 shadow-lg shadow-amber-500/10' 
                    : 'border-slate-800 hover:border-blue-500/50'}`}>
                
                <div className="h-56 bg-white p-6 relative overflow-hidden flex items-center justify-center">
                  <img src={producto.imagen_url} alt={producto.nombre} className="h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                  
                  {/* BADGE DE PROMOCIÓN (Abajo a la izquierda) */}
                  {producto.en_promocion && (
                    <div className="absolute bottom-4 left-4 z-10 bg-amber-500 text-black text-[9px] font-black px-3 py-1 rounded-full uppercase italic flex items-center gap-1 shadow-lg">
                      <Sparkles size={10} /> Oferta
                    </div>
                  )}

                  {/* BADGE DE CATEGORÍA (Arriba a la derecha) */}
                  <div className="absolute top-4 right-4 z-10 bg-slate-900/90 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase italic border border-slate-700">
                    {producto.categoria}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="relative min-h-[2.5rem] group/nombre">
                    <h4 className={`font-black text-sm uppercase italic tracking-tighter leading-tight line-clamp-2 group-hover/nombre:line-clamp-none group-hover/nombre:absolute group-hover/nombre:z-20 group-hover/nombre:bg-[#1e293b] group-hover/nombre:shadow-2xl group-hover/nombre:p-1 group-hover/nombre:rounded-md transition-all duration-300 w-full
                      ${producto.en_promocion ? 'text-amber-400' : 'text-white group-hover/nombre:text-blue-400'}`}>
                      {producto.nombre}
                    </h4>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`text-xl font-black tracking-tighter ${producto.en_promocion ? 'text-amber-500' : 'text-white'}`}>
                      S/. {producto.precio}
                    </span>
                    <div className={`p-3 rounded-xl transition-all ${producto.en_promocion ? 'bg-amber-500 text-black' : 'bg-blue-600/10 text-blue-500 group-hover:bg-blue-600 group-hover:text-white'}`}>
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* MODAL DE DETALLES */}
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
            
            {/* Contenedor del texto con 'relative' */}
            <div className="flex-1 p-10 md:p-14 relative">
              
              {/* STICKER DE OFERTA EN EL MODAL */}
              {productoSeleccionado.en_promocion && (
                <span className="bg-amber-500 text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2 w-fit mb-4 animate-bounce">
                  <Sparkles size={12} /> ¡Oferta Especial!
                </span>
              )}

              <span className="text-blue-500 font-black text-[10px] uppercase tracking-[0.3em]">{productoSeleccionado.categoria}</span>
              <h2 className="text-3xl md:text-4xl font-black text-white mt-4 italic uppercase leading-none tracking-tighter">{productoSeleccionado.nombre}</h2>
              <div className={`text-3xl font-black mt-6 tracking-tighter ${productoSeleccionado.en_promocion ? 'text-amber-500' : 'text-blue-400'}`}>
                S/. {productoSeleccionado.precio}
              </div>
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