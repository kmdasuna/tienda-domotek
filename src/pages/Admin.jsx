import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { LogOut, PlusCircle, Package, Trash2, Edit3, Search, XCircle, Tag, Filter } from 'lucide-react';

const CATEGORIAS_DISPONIBLES = [
  'Cámaras de Seguridad',
  'Telecomunicaciones',
  'Cómputo',
  'Accesorios para celular',
  'Herramientas',
  'Otros'
];

const Admin = () => {
  const [productos, setProductos] = useState([]);
  const [busquedaAdmin, setBusquedaAdmin] = useState('');
  const [filtroCategoriaAdmin, setFiltroCategoriaAdmin] = useState('Todas'); // Nuevo estado para filtrar
  const [loading, setLoading] = useState(false);
  
  const estadoInicial = { nombre: '', precio: '', categoria: '', imagen_url: '', descripcion: '', stock: 0, en_promocion: false };
  const [nuevoProducto, setNuevoProducto] = useState(estadoInicial);
  
  const navigate = useNavigate();

  useEffect(() => { fetchProductos(); }, []);

  const fetchProductos = async () => {
    const { data } = await supabase.from('productos').select('*').order('id', { ascending: false });
    setProductos(data || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevoProducto.categoria) {
      alert("Por favor, selecciona al menos una categoría.");
      return;
    }

    setLoading(true);
    if (nuevoProducto.id) {
      const { error } = await supabase.from('productos').update(nuevoProducto).eq('id', nuevoProducto.id);
      if (error) alert("Error al actualizar: " + error.message);
      else alert("¡Producto actualizado correctamente!");
    } else {
      const { error } = await supabase.from('productos').insert([nuevoProducto]);
      if (error) alert("Error al subir: " + error.message);
      else alert("¡Producto agregado con éxito!");
    }

    setNuevoProducto(estadoInicial);
    fetchProductos();
    setLoading(false);
  };

  const eliminarProducto = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      const { error } = await supabase.from('productos').delete().eq('id', id);
      if (error) alert("Error al eliminar");
      else fetchProductos();
    }
  };

  const prepararEdicion = (p) => {
    setNuevoProducto(p);
    // Ya no necesitamos scrollear hasta arriba de la página completa, 
    // pero podemos asegurar que el contenedor del formulario suba al inicio.
    const formElement = document.getElementById('form-container');
    if (formElement) formElement.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => setNuevoProducto(estadoInicial);

  const handleCategoriaToggle = (cat) => {
    let catsActuales = nuevoProducto.categoria ? nuevoProducto.categoria.split(', ') : [];
    if (catsActuales.includes(cat)) {
      catsActuales = catsActuales.filter(c => c !== cat);
    } else {
      catsActuales.push(cat);
    }
    setNuevoProducto({...nuevoProducto, categoria: catsActuales.join(', ')});
  };

  // LÓGICA DE FILTRADO AVANZADO (Nombre + Categoría)
  const productosFiltradosAdmin = productos.filter(p => {
    const coincideNombre = p.nombre.toLowerCase().includes(busquedaAdmin.toLowerCase());
    const coincideCat = filtroCategoriaAdmin === 'Todas' || (p.categoria && p.categoria.includes(filtroCategoriaAdmin));
    return coincideNombre && coincideCat;
  });

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-8 font-sans">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8 bg-[#1e293b] p-6 rounded-[2rem] border border-slate-700 shadow-2xl">
        <div>
          <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter">Panel Domotek</h1>
          <p className="text-blue-500 text-[10px] font-bold tracking-[0.3em] uppercase">Gestión de Inventario</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500/10 text-red-500 px-5 py-2.5 rounded-2xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all text-sm font-black italic uppercase">
          <LogOut size={18} /> Salir
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* FORMULARIO CON SCROLL INDEPENDIENTE */}
        <div 
          id="form-container"
          className="lg:col-span-5 bg-[#1e293b] p-8 rounded-[2.5rem] border border-slate-700 shadow-xl lg:sticky lg:top-8 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-white flex items-center gap-2 italic uppercase">
              {nuevoProducto.id ? <Edit3 className="text-yellow-500" /> : <PlusCircle className="text-blue-500" />}
              {nuevoProducto.id ? 'Editar Producto' : 'Nuevo Ingreso'}
            </h2>
            {nuevoProducto.id && (
              <button onClick={cancelarEdicion} className="text-slate-400 hover:text-white text-xs font-bold uppercase flex items-center gap-1">
                <XCircle size={14} /> Cancelar
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pb-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Nombre del Producto</label>
              <input 
                type="text" required placeholder="Nombre..."
                className="w-full bg-[#0f172a] border border-slate-700 p-4 rounded-2xl outline-none focus:border-blue-500 text-sm"
                value={nuevoProducto.nombre} onChange={(e) => setNuevoProducto({...nuevoProducto, nombre: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Precio (S/.)</label>
                <input 
                  type="number" required placeholder="0.00"
                  className="w-full bg-[#0f172a] border border-slate-700 p-4 rounded-2xl outline-none focus:border-blue-500 text-sm"
                  value={nuevoProducto.precio} onChange={(e) => setNuevoProducto({...nuevoProducto, precio: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Stock</label>
                <input 
                  type="number" required placeholder="0"
                  className="w-full bg-[#0f172a] border border-slate-700 p-4 rounded-2xl outline-none focus:border-blue-500 text-sm"
                  value={nuevoProducto.stock} onChange={(e) => setNuevoProducto({...nuevoProducto, stock: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Categorías</label>
              <div className="flex flex-wrap gap-2 bg-[#0f172a] border border-slate-700 p-4 rounded-2xl">
                {CATEGORIAS_DISPONIBLES.map(cat => {
                  const seleccionado = nuevoProducto.categoria && nuevoProducto.categoria.split(', ').includes(cat);
                  return (
                    <button key={cat} type="button" onClick={() => handleCategoriaToggle(cat)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all border ${
                        seleccionado ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2">URL de Imagen</label>
              <input 
                type="text" required placeholder="https://..."
                className="w-full bg-[#0f172a] border border-slate-700 p-4 rounded-2xl outline-none focus:border-blue-500 text-sm"
                value={nuevoProducto.imagen_url} onChange={(e) => setNuevoProducto({...nuevoProducto, imagen_url: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Descripción</label>
              <textarea 
                placeholder="Detalles..." rows="3"
                className="w-full bg-[#0f172a] border border-slate-700 p-4 rounded-2xl outline-none focus:border-blue-500 text-sm"
                value={nuevoProducto.descripcion} onChange={(e) => setNuevoProducto({...nuevoProducto, descripcion: e.target.value})}
              ></textarea>
            </div>

            <div className="flex items-center justify-between bg-[#0f172a] border border-slate-700 p-4 rounded-2xl cursor-pointer"
                 onClick={() => setNuevoProducto({...nuevoProducto, en_promocion: !nuevoProducto.en_promocion})}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${nuevoProducto.en_promocion ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-500'}`}>
                  <Tag size={16} />
                </div>
                <p className="text-xs font-black text-white uppercase italic">¿En Oferta?</p>
              </div>
              <div className={`w-10 h-5 rounded-full p-1 transition-all ${nuevoProducto.en_promocion ? 'bg-amber-500' : 'bg-slate-700'}`}>
                <div className={`bg-white w-3 h-3 rounded-full transform transition-all ${nuevoProducto.en_promocion ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
            </div>
            
            <button disabled={loading} className={`w-full py-4 rounded-2xl font-black text-sm uppercase transition-all shadow-lg active:scale-95 ${
                nuevoProducto.id ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-blue-600 hover:bg-blue-500'
              }`}>
              {loading ? 'Procesando...' : nuevoProducto.id ? 'Actualizar Producto' : 'Guardar Producto'}
            </button>
          </form>
        </div>

        {/* LISTADO CON FILTROS AVANZADOS */}
        <div className="lg:col-span-7 bg-[#1e293b] p-8 rounded-[2.5rem] border border-slate-700 shadow-xl">
          <div className="flex flex-col gap-6 mb-8">
            <h2 className="text-xl font-black text-white flex items-center gap-2 italic uppercase">
              <Package className="text-blue-500" /> Inventario
              <span className="bg-blue-500/10 text-blue-500 text-[10px] px-2 py-1 rounded-md ml-2">{productos.length}</span>
            </h2>
            
            {/* BARRA DE FILTROS */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-slate-500 size-4" />
                <input 
                  type="text" placeholder="Buscar por nombre..."
                  className="w-full bg-[#0f172a] border border-slate-700 pl-10 pr-4 py-3 rounded-xl text-xs outline-none focus:border-blue-500"
                  value={busquedaAdmin} onChange={(e) => setBusquedaAdmin(e.target.value)}
                />
              </div>
              
              <div className="relative md:w-48">
                <Filter className="absolute left-3 top-3 text-slate-500 size-4" />
                <select 
                  className="w-full bg-[#0f172a] border border-slate-700 pl-10 pr-4 py-3 rounded-xl text-xs outline-none focus:border-blue-500 appearance-none font-bold text-slate-300"
                  value={filtroCategoriaAdmin} 
                  onChange={(e) => setFiltroCategoriaAdmin(e.target.value)}
                >
                  <option value="Todas">Todas las Categorías</option>
                  {CATEGORIAS_DISPONIBLES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            {productosFiltradosAdmin.map(p => (
              <div key={p.id} className="flex items-center justify-between p-4 bg-[#0f172a] rounded-3xl border border-slate-800 hover:border-slate-600 transition-all">
                <div className="flex items-center gap-4 w-full overflow-hidden">
                  <div className="w-14 h-14 bg-white rounded-2xl p-2 flex shrink-0 items-center justify-center">
                    <img src={p.imagen_url} alt="" className="max-h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-white uppercase italic tracking-tighter truncate">{p.nombre}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {p.categoria && p.categoria.split(', ').map((cat, idx) => (
                        <span key={idx} className="text-[7px] font-bold text-blue-500 uppercase bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/10">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0 ml-2">
                  <button onClick={() => prepararEdicion(p)} className="p-3 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500">
                    <Edit3 size={16} />
                  </button>
                  <button onClick={() => eliminarProducto(p.id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Admin;