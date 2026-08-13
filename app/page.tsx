'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BrainCircuit, Volume2, Activity, Eye, Menu, X, ArrowRight, Sparkles } from 'lucide-react';

export default function LandingPage() {
  // Estado para controlar el menú en teléfonos celulares
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      
      {/* ---------------- NAVBAR ---------------- */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-indigo-950">Signocronía</span>
            </div>
            
            {/* Menú de PC (Oculto en celulares) */}
            <nav className="hidden md:flex items-center gap-8 font-medium text-slate-600">
              <a href="#caracteristicas" className="hover:text-indigo-600 transition-colors">Características</a>
              <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">Iniciar Sesión</Link>
              <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full transition-all shadow-md shadow-indigo-200">
                Probar Gratis
              </Link>
            </nav>

            {/* Botón de Menú para Celulares */}
            <button 
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Menú Desplegable para Celulares */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 shadow-xl absolute w-full left-0">
            <a 
              href="#caracteristicas" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-slate-600 font-medium py-3 border-b border-slate-100"
            >
              Características
            </a>
            <Link href="/login" className="block text-indigo-600 font-bold py-3 mt-2 text-center">
              Iniciar Sesión
            </Link>
            <Link href="/login" className="block bg-indigo-600 text-white text-center px-6 py-3.5 rounded-xl font-bold mt-3 shadow-md">
              Comenzar Gratis Ahora
            </Link>
          </div>
        )}
      </header>

      {/* ---------------- HERO SECTION (Cabecera) ---------------- */}
      <section className="relative pt-16 pb-20 md:pt-32 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold text-xs md:text-sm mb-6">
              <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
              Plataforma DeepTech Inclusiva
            </div>
            
            {/* Título adaptable: Más pequeño en móvil (4xl) y grande en PC (6xl) */}
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
              Educación Sin Barreras con <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500">Inteligencia Artificial</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed px-2 md:px-0">
              Transformamos documentos complejos en experiencias accesibles. Resúmenes con IA, síntesis de voz, dactilología en 3D y traducción háptica en una sola plataforma.
            </p>
            
            {/* Botones adaptables: Ocupan 100% del ancho en móvil */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-2 sm:px-0">
              <Link href="/login" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl md:rounded-full font-bold text-lg transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2">
                Ingresar al Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#caracteristicas" className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 px-8 py-4 rounded-xl md:rounded-full font-bold text-lg transition-all flex items-center justify-center">
                Ver Módulos
              </a>
            </div>
          </div>
        </div>
        
        {/* Fondo decorativo difuminado */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-gradient-to-tr from-indigo-100 to-teal-50 rounded-full blur-3xl opacity-50 -z-10"></div>
      </section>

      {/* ---------------- CARACTERÍSTICAS ---------------- */}
      <section id="caracteristicas" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Nuestra Arquitectura Tecnológica</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">Integramos cuatro motores fundamentales para garantizar que el aprendizaje sea verdaderamente universal.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            
            {/* Tarjeta 1 */}
            <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Motor de IA</h3>
              <p className="text-slate-600 leading-relaxed">
                Procesamiento de lenguaje natural avanzado para analizar PDFs y generar resúmenes estructurados.
              </p>
            </div>

            {/* Tarjeta 2 */}
            <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Volume2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Síntesis de Voz</h3>
              <p className="text-slate-600 leading-relaxed">
                Conversión de texto a audio en tiempo real, adaptado perfectamente para usuarios con discapacidad visual.
              </p>
            </div>

            {/* Tarjeta 3 */}
            <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Activity className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Traductor Háptico</h3>
              <p className="text-slate-600 leading-relaxed">
                Uso de la API de vibración física de hardware para traducir textos a Braille Lineal y Código Morse.
              </p>
            </div>

            {/* Tarjeta 4 */}
            <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Eye className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Avatar WebGL 3D</h3>
              <p className="text-slate-600 leading-relaxed">
                Renderizado tridimensional directo en el navegador para simular dactilología procedural.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-indigo-500" />
            <span className="font-bold text-xl text-white tracking-tight">Signocronía</span>
          </div>
          <p className="mb-6 text-sm">Construido desde Loreto, Perú, para revolucionar la educación inclusiva.</p>
          <p className="text-xs">© {new Date().getFullYear()} Signocronía. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}