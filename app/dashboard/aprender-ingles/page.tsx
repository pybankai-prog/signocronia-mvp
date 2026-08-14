'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { BookOpen, ArrowLeft, CheckCircle2, Eye, Sparkles, Layers, BookA, Loader2 } from 'lucide-react';

export default function AprenderInglesPage() {
  const [modulos, setModulos] = useState<any[]>([]);
  const [modulosCompletados, setModulosCompletados] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setIsLoading(true);
    try {
      // 1. Cargar Módulos disponibles desde tu base de datos (Dinámico)
      const { data: modulosData, error: modulosError } = await supabase
        .from('modulos_ingles')
        .select('*')
        .order('volumen', { ascending: true });
        
      if (modulosData) setModulos(modulosData);

      // 2. Cargar Progreso del Usuario
      const { data: { user: usuarioActual } } = await supabase.auth.getUser();
      if (usuarioActual) {
        setUser(usuarioActual);
        
        const { data: progresoData } = await supabase
          .from('progreso_estudiantes')
          .select('modulo_id')
          .eq('user_id', usuarioActual.id);

        if (progresoData) {
          setModulosCompletados(progresoData.map(item => item.modulo_id));
        }
      }
    } catch (error) {
      console.error("Error al cargar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const marcarComoCompletado = async (moduloId: string) => {
    if (!user) {
      alert("Debes iniciar sesión para guardar tu progreso.");
      return;
    }
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('progreso_estudiantes')
        .insert([{ user_id: user.id, modulo_id: moduloId }]);
      
      if (error && error.code !== '23505') throw error;
      
      // Actualizamos la pantalla instantáneamente
      setModulosCompletados([...modulosCompletados, moduloId]);
    } catch (error) {
      console.error("Error al guardar progreso:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Cálculo matemático del porcentaje (Evita dividir entre 0 si aún no subes módulos)
  const totalModulos = modulos.length > 0 ? modulos.length : 1;
  const porcentajeProgreso = modulos.length === 0 ? 0 : Math.round((modulosCompletados.length / totalModulos) * 100);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      <header className="bg-indigo-950 p-6 shadow-md flex items-center gap-4 sticky top-0 z-20">
        <Link href="/dashboard" className="bg-white/10 p-3 rounded-full text-white hover:bg-white/20 transition-colors shrink-0">
          <ArrowLeft className="w-6 h-6 md:w-8 md:h-8" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white flex items-center gap-3">
            <BookA className="w-8 h-8 text-amber-400" />
            Academia de Inglés
          </h1>
          <p className="text-sm md:text-lg text-indigo-200 mt-1 font-medium">De la Lengua de Señas Peruana (LSP) al Inglés Escrito</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Sección Hero con Barra Animada Matemática */}
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-200 mb-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100 rounded-full blur-3xl -z-10 opacity-50 translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              Educación Sin Barreras
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
              Aprende a tu propio ritmo
            </h2>
            <p className="text-lg text-slate-600 mb-6 max-w-2xl leading-relaxed">
              Este material ha sido diseñado exclusivamente para la comunidad sorda, respetando tu identidad lingüística. Aquí aprenderás usando la gramática visual como puente hacia el inglés escrito.
            </p>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 min-w-[250px] text-center shadow-inner">
            <p className="text-slate-500 font-bold mb-2 uppercase tracking-wider text-sm">Tu Progreso</p>
            {isLoading ? (
              <Loader2 className="w-10 h-10 animate-spin text-indigo-400 mx-auto my-4" />
            ) : (
              <>
                <p className="text-5xl font-black text-indigo-600 mb-2">{porcentajeProgreso}%</p>
                <div className="w-full bg-slate-200 rounded-full h-3 mb-2 overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${porcentajeProgreso}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  {modulosCompletados.length} de {modulos.length} módulos completados
                </p>
              </>
            )}
          </div>
        </div>

        <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Layers className="w-6 h-6 text-indigo-500" />
          Módulos de Estudio
        </h3>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-400" />
          </div>
        ) : modulos.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl text-center border border-slate-200">
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-600">Aún no hay módulos disponibles</h3>
            <p className="text-slate-500 mt-2">Los administradores están preparando el material. Vuelve pronto.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* RENDERIZADO DINÁMICO DESDE SUPABASE */}
            {modulos.map((modulo) => {
              // Convertimos el ID a string por si acaso, para evitar errores de tipo
              const idString = modulo.id.toString();
              const isCompletado = modulosCompletados.includes(idString);

              return (
                <div key={modulo.id} className={`bg-white rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 border transition-transform hover:-translate-y-1 group flex flex-col ${isCompletado ? 'border-emerald-400' : 'border-slate-200'}`}>
                  <div className={`h-32 p-6 flex flex-col justify-end relative overflow-hidden ${isCompletado ? 'bg-gradient-to-br from-emerald-500 to-teal-400' : 'bg-gradient-to-br from-indigo-500 to-teal-400'}`}>
                    <BookOpen className="absolute -top-6 -right-6 w-32 h-32 text-white/20 -rotate-12" />
                    <div className="bg-white/20 w-fit px-3 py-1 rounded-full text-white text-xs font-bold backdrop-blur-md mb-2 flex items-center gap-1">
                      {isCompletado && <CheckCircle2 className="w-3 h-3" />}
                      Volumen {modulo.volumen}
                    </div>
                    <h4 className="text-2xl font-bold text-white relative z-10">{modulo.titulo}</h4>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-slate-600 text-sm mb-6">
                      {modulo.descripcion}
                    </p>
                    
                    <div className="space-y-3 mt-auto">
                      <a 
                        href={modulo.url_pdf} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md shadow-indigo-200"
                      >
                        <Eye className="w-5 h-5" />
                        Leer Libro Interactivo
                      </a>
                      
                      {!isCompletado ? (
                        <button 
                          onClick={() => marcarComoCompletado(idString)}
                          disabled={isSaving}
                          className="w-full mt-2 flex items-center justify-center gap-2 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 font-bold py-3 px-4 rounded-xl transition-colors"
                        >
                          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                          Marcar como leído
                        </button>
                      ) : (
                        <div className="w-full mt-2 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 font-bold py-3 px-4 rounded-xl border border-emerald-200">
                          <CheckCircle2 className="w-5 h-5" />
                          ¡Completado!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}