const Footer = () => {
  return (
    <footer className="bg-[#0f172a] border-t border-slate-800 py-12 px-8 mt-20">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
        <div>
          <h4 className="text-white font-black italic uppercase tracking-tighter mb-4">Domotek Casma</h4>
          <p className="text-slate-500 text-sm leading-relaxed">
            Especialistas en seguridad electrónica, cámaras de vigilancia y soluciones tecnológicas para el hogar y la empresa.
          </p>
        </div>
        <div>
          <h4 className="text-white font-black italic uppercase tracking-tighter mb-4">Horario</h4>
          <p className="text-slate-500 text-sm">Lunes a Sábado: 8:30 AM - 7:00 PM</p>
          <p className="text-slate-500 text-sm">Domingo: 8: 30 AM - 12:30 AM</p>
        </div>
        <div>
          <h4 className="text-white font-black italic uppercase tracking-tighter mb-4">Ubicación</h4>
          <p className="text-slate-500 text-sm">Mercado Modelo, Campo Ferial</p>
          <p className="text-slate-500 text-sm italic text-blue-500">Casma, Ancash - Perú</p>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-slate-800/50 text-center text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">
        © {new Date().getFullYear()} Domotek Store
      </div>
    </footer>
  );
};

export default Footer;