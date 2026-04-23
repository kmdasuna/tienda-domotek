import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { LogOut, PlusCircle, Package, Trash2, Edit3, Search, XCircle, Tag } from 'lucide-react';

const Admin = () => {
  const [productos, setProductos] = useState([]);
  const [busquedaAdmin, setBusquedaAdmin] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Estado inicial actualizado con en_promocion
  const estadoInicial = { nombre: '', precio: '', categoria: 'Cámaras de Seguridad', imagen_url: '', descripcion: '', stock: 0, en_promocion: false };
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
    setLoading(true);
    
    if (nuevoProducto.id) {
      // MODO EDICIÓN
      const { error } = await supabase.from('productos').update(nuevoProducto).eq('id', nuevoProducto.id);
      if (error) alert("Error al actualizar: " + error.message);
      else alert("¡Producto actualizado correctamente!");
    } else {
      // MODO CREACIÓN
      const { error } = await supabase.from('productos').insert([nuevoProducto]);
      if (error) alert("Error al subir: " + error.message);
      else alert("¡Producto agregado con éxito!");
    }

    setNuevoProducto(estadoInicial);
    fetchProductos();
    setLoading(false);
  };

  const eliminarProducto = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.")) {
      const { error } = await supabase.from('productos').delete().eq('id', id);
      if (error) alert("Error al eliminar");
      else fetchProductos();
    }
  };

  const prepararEdicion = (p) => {
    setNuevoProducto(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => setNuevoProducto(estadoInicial);

  // Filtrado para el buscador del inventario
  const productosFiltradosAdmin = productos.filter(p => 
    p.nombre.toLowerCase().includes(busquedaAdmin.toLowerCase())
  );

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

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* FORMULARIO (4 columnas) */}
        <div className="lg:col-span-5 bg-[#1e293b] p-8 rounded-[2.5rem] border border-slate-700 shadow-xl h-fit sticky top-8">
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Nombre del Producto</label>
              <input 
                type="text" required placeholder="Ej. Cámara IP Exterior 4K"
                className="w-full bg-[#0f172a] border border-slate-700 p-4 rounded-2xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
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
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Categoría</label>
              <select 
                className="w-full bg-[#0f172a] border border-slate-700 p-4 rounded-2xl outline-none focus:border-blue-500 text-sm appearance-none"
                value={nuevoProducto.categoria} onChange={(e) => setNuevoProducto({...nuevoProducto, categoria: e.target.value})}
              >
                <option value="Cámaras de Seguridad">Cámaras de Seguridad</option>
                <option value="Telecomunicaciones">Telecomunicaciones</option>
                <option value="Cómputo">Cómputo</option>
                <option value="Accesorios para celular">Accesorios para celular</option>
                <option value="Herramientas">Herramientas</option>
                <option value="Otros">Otros</option>
              </select>
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
                placeholder="Detalles técnicos..." rows="3"
                className="w-full bg-[#0f172a] border border-slate-700 p-4 rounded-2xl outline-none focus:border-blue-500 text-sm"
                value={nuevoProducto.descripcion} onChange={(e) => setNuevoProducto({...nuevoProducto, descripcion: e.target.value})}
              ></textarea>
            </div>

            {/* CHECKBOX DE PROMOCIÓN ESTILIZADO */}
            <div className="flex items-center justify-between bg-[#0f172a] border border-slate-700 p-4 rounded-2xl cursor-pointer hover:border-amber-500/50 transition-all"
                 onClick={() => setNuevoProducto({...nuevoProducto, en_promocion: !nuevoProducto.en_promocion})}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-all ${nuevoProducto.en_promocion ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-500'}`}>
                  <Tag size={16} />
                </div>
                <div>
                  <p className="text-sm font-black text-white uppercase italic tracking-tighter">¿Producto en Oferta?</p>
                  <p className="text-[10px] text-slate-400 font-bold">Destacarlo en el inicio</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${nuevoProducto.en_promocion ? 'bg-amber-500' : 'bg-slate-700'}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${nuevoProducto.en_promocion ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </div>
            </div>
            
            <button 
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95 mt-2 ${
                nuevoProducto.id ? 'bg-yellow-600 hover:bg-yellow-500 shadow-yellow-900/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20'
              }`}
            >
              {loading ? 'Procesando...' : nuevoProducto.id ? 'Actualizar Producto' : 'Guardar Producto'}
            </button>
          </form>
        </div>

        {/* LISTADO (7 columnas) */}
        <div className="lg:col-span-7 bg-[#1e293b] p-8 rounded-[2.5rem] border border-slate-700 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h2 className="text-xl font-black text-white flex items-center gap-2 italic uppercase">
              <Package className="text-blue-500" /> Inventario
              <span className="bg-blue-500/10 text-blue-500 text-[10px] px-2 py-1 rounded-md ml-2">{productos.length}</span>
            </h2>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 text-slate-500 size-4" />
              <input 
                type="text" placeholder="Buscar por nombre..."
                className="w-full bg-[#0f172a] border border-slate-700 pl-10 pr-4 py-2 rounded-xl text-xs outline-none focus:border-blue-500"
                value={busquedaAdmin} onChange={(e) => setBusquedaAdmin(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-3">
            {productosFiltradosAdmin.length > 0 ? (
              productosFiltradosAdmin.map(p => (
                <div key={p.id} className="group flex items-center justify-between p-4 bg-[#0f172a] rounded-3xl border border-slate-800 hover:border-slate-600 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white rounded-2xl p-2 flex items-center justify-center">
                      <img src={p.imagen_url} alt="" className="max-h-full object-contain" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-black text-white uppercase italic tracking-tighter line-clamp-1">{p.nombre}</p>
                        {p.en_promocion && (
                          <span className="bg-amber-500 text-black text-[8px] px-1.5 py-0.5 rounded-sm font-black uppercase tracking-widest">Promo</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[9px] font-bold text-blue-500 uppercase bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/10">{p.categoria}</span>
                        <span className="text-[10px] text-slate-400 font-bold">S/. {p.precio}</span>
                        <span className={`text-[10px] font-bold ${p.stock <= 3 ? 'text-red-500' : 'text-green-500'}`}>
                          Stock: {p.stock}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => prepararEdicion(p)}
                      className="p-3 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => eliminarProducto(p.id)}
                      className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 text-slate-500 italic text-sm">
                No se encontraron productos con ese nombre.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Admin;