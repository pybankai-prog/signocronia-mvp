import React from 'react';
import { 
  AudioWaveform, 
  BookOpen, 
  BrainCircuit, 
  HandMetal, 
  ArrowRight, 
  PlayCircle,
  Building2,
  ShieldCheck
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-300 selection:text-indigo-900">
      
      {/* NAVEGACIÓN */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-700 flex items-center justify-center">
              <AudioWaveform className="text-teal-400 w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-indigo-900">Signocronía</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            <a href="#soluciones" className="hover:text-indigo-700 transition-colors">Soluciones</a>
            <a href="#tecnologia" className="hover:text-indigo-700 transition-colors">Tecnología</a>
            <a href="#instituciones" className="hover:text-indigo-700 transition-colors">Para Universidades</a>
          </nav>
          <div className="flex gap-4">
            <button className="hidden md:block text-sm font-medium text-indigo-700 hover:text-indigo-800">
              Iniciar Sesión
            </button>
            <button className="bg-indigo-700 hover:bg-indigo-800 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-md shadow-indigo-200 flex items-center gap-2">
              Empezar Gratis <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-slate-50 -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold tracking-wide uppercase mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            MVP en Beta Cerrada
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 max-w-4xl mx-auto leading-tight">
            Educación Sin Barreras. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-teal-500">
              Tecnología Sin Límites.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            La primera plataforma EdTech impulsada por IA que transforma contenido académico pesado en Lengua de Señas, patrones hápticos y audio interactivo en tiempo real.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-indigo-700 hover:bg-indigo-800 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
              Prueba el Módulo PDF
            </button>
            <button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-full text-lg font-semibold transition-all flex items-center justify-center gap-2">
              <PlayCircle className="w-5 h-5 text-indigo-600" /> Ver Demo Técnica
            </button>
          </div>
        </div>
      </section>

      {/* MÓDULOS CORE */}
      <section id="soluciones" className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Arquitectura Modular de Accesibilidad</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Procesamiento asíncrono diseñado para escalar. Cada módulo funciona de manera independiente para garantizar resiliencia total.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Tarjeta 1 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50 transition-all group">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="text-indigo-700 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Ciegos y Neurodiversidad</h3>
              <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                Extracción OCR de PDFs y Word. Motor RAG (Retrieval-Augmented Generation) para conversar por voz con cualquier documento académico.
              </p>
              <ul className="text-sm text-slate-500 space-y-2 font-medium">
                <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3 text-teal-500"/> OCR de tablas complejas</li>
                <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3 text-teal-500"/> Embeddings ultrarrápidos</li>
              </ul>
            </div>

            {/* Tarjeta 2 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-teal-100 hover:shadow-xl hover:shadow-teal-50 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-teal-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">EN DESARROLLO</div>
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <HandMetal className="text-teal-700 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Sordociegos (Háptica)</h3>
              <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                Traducción determinística de texto a código Morse mediante patrones de vibración nativos del dispositivo móvil. Cero latencia.
              </p>
              <ul className="text-sm text-slate-500 space-y-2 font-medium">
                <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3 text-indigo-500"/> Procesamiento Local (Costo $0)</li>
                <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3 text-indigo-500"/> Integración nativa Web/App</li>
              </ul>
            </div>

            {/* Tarjeta 3 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50 transition-all group">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BrainCircuit className="text-indigo-700 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Comunidad Sorda (LSP)</h3>
              <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                Speech-to-Text de alta precisión y futura integración con Avatar 3D animado proceduralmente para Lengua de Señas Peruana.
              </p>
              <ul className="text-sm text-slate-500 space-y-2 font-medium">
                <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3 text-teal-500"/> Subtítulos enriquecidos</li>
                <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3 text-teal-500"/> Diccionario de glosas modular</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* B2B / MULTI-TENANT */}
      <section id="instituciones" className="py-24 bg-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-6">Infraestructura Multi-Tenant para Educación Superior</h2>
            <p className="text-indigo-200 mb-8 leading-relaxed">
              Diseñado desde cero con Row Level Security (RLS) en Supabase Postgres. Los datos de tus estudiantes y currículos están aislados de forma segura, cumpliendo normativas internacionales de accesibilidad (WCAG) sin fricción técnica.
            </p>
            <div className="flex gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-800 p-2 rounded-lg"><Building2 className="text-teal-400 w-5 h-5"/></div>
                <span className="font-medium">Gestión de Aulas</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-indigo-800 p-2 rounded-lg"><ShieldCheck className="text-teal-400 w-5 h-5"/></div>
                <span className="font-medium">Aislamiento de Datos</span>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full bg-indigo-950 rounded-2xl border border-indigo-800 p-6 shadow-2xl">
            {/* Mockup de código / terminal para el toque "CTO" */}
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-indigo-800">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-xs text-indigo-400 font-mono ml-2">supabase_rls_policy.sql</span>
            </div>
            <pre className="text-xs sm:text-sm font-mono text-indigo-300 overflow-x-auto">
              <code>
                <span className="text-teal-400">CREATE POLICY</span> "tenant_isolation"<br/>
                <span className="text-teal-400">ON</span> contents <span className="text-teal-400">FOR SELECT</span><br/>
                <span className="text-teal-400">USING</span> (<br/>
                &nbsp;&nbsp;organization_id = (auth.jwt() -&gt;&gt; 'org_id')::uuid<br/>
                );
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <AudioWaveform className="text-indigo-700 w-6 h-6" />
            <span className="font-bold text-slate-900">Signocronía</span>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Signocronía. Accesibilidad Universal EdTech.
          </p>
        </div>
      </footer>
    </div>
  );
}