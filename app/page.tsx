'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Menu, X, BrainCircuit, Activity, Volume2, Cloud, 
  ArrowRight, ShieldCheck, Zap, Globe 
} from 'lucide-react';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-200">
      {/* NAVEGACIÓN */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-indigo-600">
                Signocronía
              </span>
            </div>

            {/* Menú de Escritorio */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#soluciones" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Soluciones</a>
              <a href="#tecnologia" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Tecnología</a>
              <Link href="/login" className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
                Iniciar Sesión
              </Link>
              <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-md shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5">
                Empezar Gratis
              </Link>
            </div>

            {/* Botón Menú Móvil */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-600 hover:text-indigo-600 focus:outline-none p-2"
              >
                {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          </div>
        </div>

        {/* Menú Desplegable Móvil */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 shadow-xl absolute w-full">
            <div className="px-4 pt-2 pb-6 space-y-3 flex flex-col">
              <a href="#soluciones" className="block px-3 py-3 text-base font-medium text-slate-700 hover:bg-indigo-50 rounded-lg">Soluciones</a>
              <a href="#tecnologia" className="block px-3 py-3 text-base font-medium text-slate-700 hover:bg-indigo-50 rounded-lg">Tecnología</a>
              <Link href="/login" className="block px-3 py-3 text-base font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg">Iniciar Sesión</Link>
              <Link href="/login" className="block w-full text-center mt-2 bg-indigo-600 text-white px-5 py-3 rounded-xl font-medium shadow-md">
                Empezar Gratis
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* SECCIÓN HERO (Principal) */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-400 via-teal-100 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-sm font-semibold mb-8 shadow-sm">
            <Zap className="w-4 h-4" /> MVP en Beta Abierta
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            Educación Sin Barreras.<br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-teal-500">
              Tecnología Sin Límites.
            </span>
          </h1>
          
          <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed">
            La primera plataforma EdTech impulsada por Inteligencia Artificial que transforma contenido académico complejo en resúmenes accesibles, audio interactivo y patrones hápticos en tiempo real.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl shadow-indigo-200 hover:-translate-y-1 flex items-center justify-center gap-2">
              Probar Módulo PDF <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/haptico" className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" /> Ver Demo Háptica
            </Link>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE CARACTERÍSTICAS (Features) */}
      <section id="tecnologia" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Potenciado por Arquitectura DeepTech</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">Un ecosistema completo diseñado para la accesibilidad universal, procesando la información a la velocidad del pensamiento.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl hover:shadow-xl hover:shadow-indigo-100/50 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <BrainCircuit className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Motor de IA (LLM)</h3>
              <p className="text-slate-600 leading-relaxed">Modelos de lenguaje de última generación procesan y resumen PDFs complejos en milisegundos para fácil lectura.</p>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl hover:shadow-xl hover:shadow-teal-100/50 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mb-6">
                <Volume2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Text-to-Speech Nativo</h3>
              <p className="text-slate-600 leading-relaxed">Conversión automática de texto a voz utilizando sintetizadores neuronales directamente en el navegador del estudiante.</p>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl hover:shadow-xl hover:shadow-purple-100/50 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Activity className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Traducción Háptica</h3>
              <p className="text-slate-600 leading-relaxed">Módulo experimental que transforma datos estructurados en patrones de vibración (Morse) mediante hardware móvil.</p>
            </div>

            {/* Card 4 */}
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl hover:shadow-xl hover:shadow-emerald-100/50 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <Cloud className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Cloud Storage</h3>
              <p className="text-slate-600 leading-relaxed">Infraestructura robusta con bases de datos relacionales para almacenar todo el material educativo de forma segura.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN CALL TO ACTION */}
      <section className="py-24 relative overflow-hidden bg-indigo-900">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">¿Listo para el futuro de la educación inclusiva?</h2>
          <p className="text-indigo-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Únete a la plataforma que está democratizando el acceso a la información académica a través del software.
          </p>
          <Link href="/login" className="inline-flex items-center gap-2 bg-teal-400 hover:bg-teal-300 text-indigo-950 px-10 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-lg shadow-teal-500/30">
            Crear cuenta gratuita <ShieldCheck className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-indigo-500" />
            <span className="text-xl font-bold text-white">Signocronía</span>
          </div>
          <div className="text-sm text-center md:text-right">
            &copy; {new Date().getFullYear()} Proyecto de Software y Accesibilidad.<br />
            Construido para revolucionar el aprendizaje.
          </div>
        </div>
      </footer>
    </div>
  );
}