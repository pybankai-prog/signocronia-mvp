'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BrainCircuit, Volume2, Activity, Eye, Menu, X, ArrowRight, Sparkles, Mic, ShieldCheck, Globe, Users, Ear } from 'lucide-react';

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-indigo-950">Signocronía</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8 font-medium text-slate-600">
              <a href="#impacto" className="hover:text-indigo-600 transition-colors">Impacto Social</a>
              <a href="#tecnologia" className="hover:text-indigo-600 transition-colors">Tecnología</a>
              <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-bold">Iniciar Sesión</Link>
              <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full transition-all shadow-md shadow-indigo-200 font-bold">
                Acceso a la Plataforma
              </Link>
            </nav>

            <button 
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 shadow-xl absolute w-full left-0 animate-in slide-in-from-top-2">
            <a href="#impacto" onClick={() => setIsMobileMenuOpen(false)} className="block text-slate-600 font-medium py-3 border-b border-slate-100">Impacto Social</a>
            <a href="#tecnologia" onClick={() => setIsMobileMenuOpen(false)} className="block text-slate-600 font-medium py-3 border-b border-slate-100">Tecnología Base</a>
            <Link href="/login" className="block text-indigo-600 font-bold py-3 mt-2 text-center">Iniciar Sesión</Link>
            <Link href="/login" className="block bg-indigo-600 text-white text-center px-6 py-3.5 rounded-xl font-bold mt-3 shadow-md">Acceder a la Plataforma</Link>
          </div>
        )}
      </header>

      <section className="relative pt-20 pb-24 md:pt-32 md:pb-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold text-xs md:text-sm mb-8 shadow-sm">
              <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
              Plataforma DeepTech B2C de Inclusión Digital
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-tight">
              Educación Sin Barreras impulsada por <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500">Inteligencia Artificial</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-12 leading-relaxed px-4 md:px-12 font-medium">
              Diseñada para personas sordas, personas ciegas, personas no verbales y adultos mayores. Transformamos la información a través de IA, síntesis de voz nativa y dactilología holográfica.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 px-4 sm:px-0">
              <Link href="/login" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4.5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2">
                Ingresar al Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/adultos-mayores" className="w-full sm:w-auto bg-amber-400 hover:bg-amber-500 text-slate-900 px-8 py-4.5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-amber-200/50 flex items-center justify-center gap-2">
                <Mic className="w-5 h-5" /> Módulo Adultos Mayores
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] md:w-[1000px] md:h-[1000px] bg-gradient-to-tr from-indigo-100/60 to-teal-50/60 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      </section>

      <section id="impacto" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Diseñado para incluir a todos</h2>
            <p className="text-slate-400 max-w-3xl mx-auto text-lg leading-relaxed">
              La tecnología pierde su propósito si deja a las minorías atrás. Hemos construido interfaces que responden a las necesidades específicas de cada grupo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 hover:bg-slate-800 transition-colors">
              <Globe className="w-10 h-10 text-teal-400 mb-5" />
              <h3 className="text-xl font-bold mb-3">Personas Sordas y No Verbales</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                El motor WebGL 3D proyecta Lengua de Señas (LSP) y dactilología espacial interactiva para facilitar la comunicación bidireccional.
              </p>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 hover:bg-slate-800 transition-colors">
              <Ear className="w-10 h-10 text-rose-400 mb-5" />
              <h3 className="text-xl font-bold mb-3">Personas Ciegas</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Lectura automatizada mediante síntesis de voz nativa y traducción física de hardware a Braille Lineal para quienes presentan sordoceguera.
              </p>
            </div>
            
            <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 hover:bg-slate-800 transition-colors">
              <Users className="w-10 h-10 text-amber-400 mb-5" />
              <h3 className="text-xl font-bold mb-3">Adultos Mayores</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Interfaces de ultra-alto contraste y un asistente conversacional paciente por voz, diseñado para romper la brecha tecnológica.
              </p>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 hover:bg-slate-800 transition-colors">
              <ShieldCheck className="w-10 h-10 text-indigo-400 mb-5" />
              <h3 className="text-xl font-bold mb-3">Estudiantes</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Procesamiento de Inteligencia Artificial capaz de leer documentos densos y estructurar resúmenes exactos para optimizar el aprendizaje.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="tecnologia" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Arquitectura Tecnológica Profunda</h2>
            <p className="text-slate-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Signocronía se apoya en cuatro motores fundamentales de desarrollo avanzado (DeepTech).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Motor de Inteligencia Artificial</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Analiza semánticamente la información para reestructurarla en formatos más fáciles de digerir.
              </p>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Volume2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Síntesis de Voz Nativa</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Web Speech API para convertir texto a audio, vital para personas con ceguera y adultos mayores.
              </p>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Activity className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Traductor Háptico Universal</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Sincroniza el texto con el motor físico del hardware para emitir pulsaciones táctiles a través de la piel.
              </p>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Eye className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Renderizado WebGL 3D</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Computer Vision y un avatar holográfico para comunicarse con personas sordas y no verbales mediante señas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-indigo-900 py-16 border-y border-indigo-800">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Asistente Especializado para la Tercera Edad</h2>
          <p className="text-indigo-200 mb-10 max-w-2xl mx-auto text-lg">
            Hemos configurado un agente de Inteligencia Artificial paciente que responde con voz y usa letras grandes.
          </p>
          <Link 
            href="/adultos-mayores" 
            className="inline-flex items-center justify-center gap-3 bg-amber-400 hover:bg-amber-500 text-slate-900 px-10 py-5 rounded-2xl font-bold text-xl transition-transform hover:scale-105 shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
          >
            <Mic className="w-7 h-7" />
            Acceder al Módulo de Voz
          </Link>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-500 py-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-500" />
            <span className="font-bold text-xl text-white tracking-tight">Signocronía</span>
          </div>
          <p className="text-sm text-center md:text-left">
            Construido con propósito desde Loreto, Perú. <br className="md:hidden" />
            Para revolucionar la educación inclusiva a nivel global.
          </p>
          <p className="text-sm font-medium">© {new Date().getFullYear()} Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}