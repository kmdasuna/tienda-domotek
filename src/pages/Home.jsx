import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { Search, ChevronRight, ChevronLeft, LayoutGrid, X, Tag, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const ORDEN_CATEGORIAS = [
  'Cámaras de Seguridad', 
  'Telecomunicaciones', 
  'Cómputo', 
  'Accesorios para celular', 
  'Herramientas', 
  'Otros'
];

const PRODUCTOS_POR_PAGINA = 20;

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [indiceBanner, setIndiceBanner] = useState(0);
  const [paginaActual, setPaginaActual] = useState(1);
  
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    fetchProductos();
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, categoriaSeleccionada]);

  const fetchProductos = async () => {
    const { data } = await supabase.from('productos').select('*').order('id', { ascending: false });
    setProductos(data || []);
  };

  const productosBanner = useMemo(() => {
    if (productos.length === 0) return [];
    const promos = productos.filter(p => p.en_promocion).sort(() => 0.5 - Math.random());
    const grupos = {};
    productos.forEach(p => {
      const cats = p.categoria ? p.categoria.split(', ') : ['Otros'];
      cats.forEach(cat => {
        if (!grupos[cat]) grupos[cat] = [];
        grupos[cat].push(p);
      });
    });
    let resto = [];
    Object.values(grupos).forEach(items => {
      const disponibles = items.filter(p => !p.en_promocion && !resto.some(r => r.id === p.id));
      const shuffled = [...disponibles].sort(() => 0.5 - Math.random());
      resto.push(...shuffled.slice(0, 1)); 
    });
    return [...promos, ...resto];
  }, [productos]);

  useEffect(() => {
    if (productosBanner.length > 0) {
      const intervalo = setInterval(() => {
        nextSlide();
      }, 5000);
      return () => clearInterval(intervalo);
    }
  }, [productosBanner, indiceBanner]);

  const nextSlide = () => setIndiceBanner((prev) => (prev + 1) % productosBanner.length);
  const prevSlide = () => setIndiceBanner((prev) => (prev - 1 + productosBanner.length) % productosBanner.length);

  const minSwipeDistance = 50;
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) nextSlide();
    if (distance < -minSwipeDistance) prevSlide();
  };

  const categoriasDinamicas = useMemo(() => {
    const todasLasCat = productos.flatMap(p => p.categoria ? p.categoria.split(', ') : []);
    const existentes = [...new Set(todasLasCat)].filter(Boolean);
    return existentes.sort((a, b) => {
      let indexA = ORDEN_CATEGORIAS.indexOf(a);
      let indexB = ORDEN_CATEGORIAS.indexOf(b);
      if (indexA === -1) indexA = 99; 
      if (indexB === -1) indexB = 99;
      return indexA - indexB;
    });
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    return productos
      .filter(p => {
        const nombre = p.nombre ? p.nombre.toLowerCase() : "";
        const coincideNombre = nombre.includes(busqueda.toLowerCase());
        const coincideCat = categoriaSeleccionada === 'Todas' || (p.categoria && p.categoria.includes(categoriaSeleccionada));
        return coincideNombre && coincideCat;
      })
      .sort((a, b) => (b.en_promocion ? 1 : 0) - (a.en_promocion ? 1 : 0)); 
  }, [productos, busqueda, categoriaSeleccionada]);

  const indiceUltimoProducto = paginaActual * PRODUCTOS_POR_PAGINA;
  const indicePrimerProducto = indiceUltimoProducto - PRODUCTOS_POR_PAGINA;
  const productosPaginados = productosFiltrados.slice(indicePrimerProducto, indiceUltimoProducto);
  const totalPaginas = Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA);

  const cambiarPagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans overflow-x-hidden">
      <Navbar setMenuAbierto={setMenuAbierto} />
      
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-8 p-4 md:p-8">
        <Sidebar 
          menuAbierto={menuAbierto} 
          setMenuAbierto={setMenuAbierto}
          categorias={categoriasDinamicas}
          categoriaSeleccionada={categoriaSeleccionada}
          setCategoriaSeleccionada={setCategoriaSeleccionada}
        />

        <main className="flex-1 w-full min-w-0">
          <div className="relative mb-6 md:mb-10 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar en Domotek..." 
              className="w-full bg-[#1e293b] border border-slate-700 py-4 md:py-5 pl-14 md:pl-16 pr-8 rounded-full outline-none focus:border-blue-500 transition-all text-sm shadow-xl shadow-black/20"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {productosBanner.length > 0 && categoriaSeleccionada === 'Todas' && busqueda === '' && (
            <section 
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              className={`group/banner mb-8 md:mb-12 relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border transition-all duration-700 min-h-[340px] md:min-h-[450px] flex items-center touch-pan-y
              ${productosBanner[indiceBanner].en_promocion 
                ? 'bg-gradient-to-br from-amber-600/20 via-[#1e293b] to-blue-900 border-amber-500/50' 
                : 'bg-gradient-to-br from-blue-900 via-[#1e293b] to-slate-900 border-blue-500/20'}`}>
              
              <button onClick={prevSlide} className="hidden md:block absolute left-4 z-30 p-2.5 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover/banner:opacity-100 transition-all hover:bg-blue-600">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextSlide} className="hidden md:block absolute right-4 z-30 p-2.5 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover/banner:opacity-100 transition-all hover:bg-blue-600">
                <ChevronRight size={20} />
              </button>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {productosBanner.map((_, i) => (
                  <button key={i} onClick={() => setIndiceBanner(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${indiceBanner === i ? 'w-8 bg-blue-500' : 'w-1.5 bg-slate-600'}`} />
                ))}
              </div>

              <div className="flex flex-col md:flex-row items-center p-8 md:p-16 gap-6 md:gap-10 w-full animate-in fade-in duration-700 select-none">
                <div className="flex-1 text-center md:text-left z-10 pointer-events-none">
                  {productosBanner[indiceBanner].en_promocion && (
                    <span className="bg-amber-500 text-black text-[9px] md:text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-2 w-fit mx-auto md:mx-0 mb-3 animate-bounce">
                      <Tag size={10} /> Oferta
                    </span>
                  )}
                  <h2 className="text-2xl md:text-7xl font-black text-white leading-tight md:leading-[0.95] tracking-tighter uppercase italic">
                    {productosBanner[indiceBanner].nombre}
                  </h2>
                  <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 md:gap-6 mt-4 md:mt-8 pointer-events-auto">
                    <div className="text-2xl md:text-4xl font-black text-blue-400 tracking-tighter">S/. {productosBanner[indiceBanner].precio}</div>
                    <button onClick={() => setProductoSeleccionado(productosBanner[indiceBanner])}
                      className="bg-white text-blue-900 px-6 py-2.5 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs hover:bg-blue-500 hover:text-white transition-all uppercase italic shadow-lg">
                      {productosBanner[indiceBanner].en_promocion ? 'Ver Oferta' : 'Ver Producto'}
                    </button>
                  </div>
                </div>
                <div className="flex-1 flex justify-center relative pointer-events-none">
                  <div className={`absolute inset-0 blur-[80px] md:blur-[120px] rounded-full animate-pulse ${productosBanner[indiceBanner].en_promocion ? 'bg-amber-500/20' : 'bg-blue-600/10'}`}></div>
                  <img key={productosBanner[indiceBanner].id} src={productosBanner[indiceBanner].imagen_url} alt="" 
                    className="relative h-44 md:h-[400px] object-contain drop-shadow-2xl transition-all duration-700" />
                </div>
              </div>
            </section>
          )}

          <div id="inicio-grilla" className="mb-6">
            <h3 className="text-lg md:text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-2">
              <LayoutGrid className="text-blue-500" size={18} />
              {categoriaSeleccionada} <span className="text-slate-600 text-xs font-bold">/ {productosFiltrados.length}</span>
            </h3>
          </div>

          {/* GRILLA DE PRODUCTOS (2 COLUMNAS EN CELULAR) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {productosPaginados.map((producto) => (
              <div key={producto.id} onClick={() => setProductoSeleccionado(producto)}
                className={`group bg-[#1e293b] rounded-2xl md:rounded-[2rem] overflow-hidden border transition-all cursor-pointer hover:shadow-2xl flex flex-col
                  ${producto.en_promocion ? 'border-amber-500/30' : 'border-slate-800'}`}>
                
                <div className="h-36 md:h-56 bg-slate-900/40 p-4 md:p-6 relative flex items-center justify-center shrink-0">
                  <img src={producto.imagen_url} alt={producto.nombre} className="h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                  
                  {producto.en_promocion && (
                    <div className="absolute bottom-2 left-2 z-10 bg-amber-500 text-black text-[7px] md:text-[9px] font-black px-2 py-0.5 rounded-full uppercase italic shadow-lg">
                      Oferta
                    </div>
                  )}

                  <div className="absolute top-2 right-2 z-10 bg-slate-900/90 text-white text-[7px] md:text-[10px] font-black px-2 py-1 rounded-full uppercase border border-slate-700 max-w-[80px] md:max-w-[120px] truncate">
                    {producto.categoria ? producto.categoria.split(', ')[0] : 'Otros'}
                  </div>
                </div>
                
                <div className="p-3 md:p-6 flex flex-col flex-grow justify-between">
                  <h4 className={`font-black text-[10px] md:text-sm uppercase italic tracking-tighter leading-tight line-clamp-2
                    ${producto.en_promocion ? 'text-amber-400' : 'text-white'}`}>
                    {producto.nombre}
                  </h4>
                  <div className="mt-3 md:mt-4 flex items-center justify-between">
                    <span className={`text-sm md:text-xl font-black tracking-tighter ${producto.en_promocion ? 'text-amber-500' : 'text-white'}`}>
                      S/. {producto.precio}
                    </span>
                    <div className={`p-2 md:p-3 rounded-lg md:rounded-xl transition-all ${producto.en_promocion ? 'bg-amber-500 text-black' : 'bg-blue-600/10 text-blue-500'}`}>
                      <ChevronRight size={14} className="md:w-5 md:h-5" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPaginas > 1 && (
            <div className="flex justify-center items-center gap-2 md:gap-4 mt-10 md:mt-12 mb-8">
              <button
                onClick={() => cambiarPagina(Math.max(paginaActual - 1, 1))}
                disabled={paginaActual === 1}
                className="p-2 md:p-3 rounded-xl bg-[#1e293b] border border-slate-700 text-slate-400 disabled:opacity-30"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="bg-[#1e293b] border border-slate-700 px-4 md:px-6 py-2 md:py-3 rounded-xl text-[10px] font-bold text-slate-400 uppercase">
                {paginaActual} / {totalPaginas}
              </div>

              <button
                onClick={() => cambiarPagina(Math.min(paginaActual + 1, totalPaginas))}
                disabled={paginaActual === totalPaginas}
                className="p-2 md:p-3 rounded-xl bg-[#1e293b] border border-slate-700 text-slate-400 disabled:opacity-30"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </main>
      </div>

      {productoSeleccionado && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={() => setProductoSeleccionado(null)}></div>
          <div className="relative bg-[#1e293b] w-full max-w-4xl rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-slate-700 shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setProductoSeleccionado(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-10 p-2 bg-slate-900 rounded-full text-slate-400 hover:text-white border border-slate-700 transition-all"
            >
              <X size={18} />
            </button>
            
            <div className="flex-1 bg-[#0f172a]/50 p-8 md:p-12 flex items-center justify-center">
              <img src={productoSeleccionado.imagen_url} alt="" className="max-h-[250px] md:max-h-[350px] object-contain drop-shadow-2xl" />
            </div>
            
            <div className="flex-1 p-8 md:p-14 relative">
              {productoSeleccionado.en_promocion && (
                <span className="bg-amber-500 text-black text-[8px] md:text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-2 w-fit mb-4">
                  <Sparkles size={10} /> ¡Oferta Especial!
                </span>
              )}

              <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
                {productoSeleccionado.categoria && productoSeleccionado.categoria.split(', ').map((cat, idx) => (
                  <span key={idx} className="text-blue-500 font-black text-[8px] md:text-[10px] uppercase tracking-[0.2em]">{cat}</span>
                ))}
              </div>

              <h2 className="text-2xl md:text-4xl font-black text-white italic uppercase leading-tight tracking-tighter">{productoSeleccionado.nombre}</h2>
              <div className={`text-2xl md:text-3xl font-black mt-4 md:mt-6 tracking-tighter ${productoSeleccionado.en_promocion ? 'text-amber-500' : 'text-blue-400'}`}>
                S/. {productoSeleccionado.precio}
              </div>
              <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-slate-700">
                <p className="text-slate-400 text-xs md:text-base leading-relaxed italic">{productoSeleccionado.description || "Tecnología de última generación disponible en Domotek."}</p>
              </div>
              
              <a 
                href={`https://wa.me/51936374988?text=Hola Domotek! Me interesa este producto: ${productoSeleccionado.nombre}`}
                target="_blank" rel="noreferrer"
                className="mt-8 md:mt-10 w-full bg-green-600 hover:bg-green-500 text-white font-black py-4 md:py-5 rounded-xl md:rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 uppercase text-[10px] md:text-xs italic"
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