'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
// <-- NUEVO: Agregamos el ícono Eye a las importaciones
import { BookOpen, UploadCloud, Users, Settings, LogOut, Loader2, FileText, BrainCircuit, Volume2, Square, Menu, X, Eye } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [aiResponse, setAiResponse] = useState('');
  
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchDocumentos();
    
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const fetchDocumentos = async () => {
    const { data, error } = await supabase
      .from('documentos_procesados')
      .select('*')
      .order('creado_en', { ascending: false });
    
    if (data) setDocumentos(data);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadMessage('Subiendo documento...');
    setAiResponse('');
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

    const { error: storageError } = await supabase.storage
      .from('documentos')
      .upload(fileName, file);

    if (storageError) {
      setUploadMessage(`Error al subir: ${storageError.message}`);
      setIsUploading(false);
      return;
    }

    const { error: dbError } = await supabase
      .from('documentos_procesados')
      .insert([{ nombre: file.name, ruta_storage: fileName }]);

    if (dbError) {
      setUploadMessage(`Error en BD: ${dbError.message}`);
      setIsUploading(false);
      return;
    }

    fetchDocumentos();
    setUploadMessage('Procesando con IA...');

    try {
      let textoParaIA = "La fotosíntesis es un proceso biológico vital...";
      if (file.name.toLowerCase().endsWith('.txt')) {
        textoParaIA = await file.text();
      }

      const res = await fetch('/api/procesar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textoDelPdf: textoParaIA }),
      });

      const data = await res.json();

      if (data.resultado) {
        setAiResponse(data.resultado);
        setUploadMessage('¡Éxito!');
      } else {
        setUploadMessage('Error en la IA.');
      }
    } catch (error) {
      setUploadMessage('Fallo de conexión IA.');
      console.error(error);
    }
    
    setIsUploading(false);
  };

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Tu navegador no soporta lectura por voz.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(aiResponse);
      utterance.lang = 'es-ES';
      
      const voces = window.speechSynthesis.getVoices();
      
      const vozNatural = voces.find(v => 
        v.name.includes('Google español') || 
        v.name.includes('Microsoft Sabina') || 
        v.name.includes('Microsoft Elena') ||
        v.name.includes('Natural')
      ) || voces.find(v => v.lang.startsWith('es')); 

      if (vozNatural) {
        utterance.voice = vozNatural;
      }

      utterance.rate = 0.95; 
      utterance.pitch = 1.05; 
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Barra superior móvil */}
      <div className="md:hidden bg-indigo-900 text-white p-4 flex justify-between items-center shadow-md z-20">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Signocronía</h2>
          <p className="text-indigo-300 text-xs">Panel Institucional</p>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-2 bg-indigo-800 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Menú Lateral */}
      <aside className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex w-full md:w-64 bg-indigo-900 text-white flex-col md:min-h-screen shrink-0 z-10`}>
        <div className="p-6 hidden md:block">
          <h2 className="text-xl font-bold tracking-tight">Signocronía</h2>
          <p className="text-indigo-300 text-xs mt-1">Panel Institucional</p>
        </div>
        <nav className="flex-1 px-4 py-6 md:py-0 space-y-2">
          <a href="#" className="flex items-center gap-3 bg-indigo-800 text-white px-4 py-3 rounded-lg transition-colors">
            <BookOpen className="w-5 h-5 text-teal-400" />
            <span className="font-medium">Mis Cursos</span>
          </a>
          <a href="/haptico" className="flex items-center gap-3 hover:bg-indigo-800/50 text-indigo-100 px-4 py-3 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
            <span>Módulo Háptico</span>
          </a>
          {/* <-- NUEVO: Enlace al Avatar 3D */}
          <a href="/avatar" className="flex items-center gap-3 hover:bg-indigo-800/50 text-indigo-100 px-4 py-3 rounded-lg transition-colors">
            <Eye className="w-5 h-5 text-emerald-400" />
            <span>Avatar 3D</span>
          </a>
        </nav>
        <div className="p-4 border-t border-indigo-800 mt-auto">
          <button onClick={handleSignOut} className="flex items-center gap-3 text-indigo-200 hover:text-white transition-colors w-full px-4 py-2">
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-4 md:p-8 w-full max-w-full overflow-x-hidden">
        <header className="flex justify-between items-center mb-6 md:mb-8 mt-2 md:mt-0">
          <h1 className="text-2xl font-bold text-slate-800">Resumen de Actividad</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <div className="text-slate-500 text-sm font-medium mb-1">Documentos Procesados</div>
            <div className="text-3xl font-bold text-slate-800">{documentos.length}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
          <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-6 md:p-8 text-center flex flex-col items-center justify-center relative">
            <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mb-4">
              {isUploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <UploadCloud className="w-8 h-8" />}
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Sube tu documento</h3>
            <div className="relative mt-4 w-full md:w-auto">
              <input type="file" accept=".pdf,.txt" onChange={handleFileUpload} disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />
              <button className={`w-full md:w-auto px-6 py-3 rounded-lg font-medium transition-colors shadow-md ${isUploading ? 'bg-slate-300 text-slate-500 shadow-none' : 'bg-indigo-700 hover:bg-indigo-800 text-white shadow-indigo-200'}`}>
                {isUploading ? 'Procesando archivo...' : 'Seleccionar .TXT o .PDF'}
              </button>
            </div>
            {uploadMessage && <div className="mt-4 p-2 text-sm text-emerald-700 font-medium">{uploadMessage}</div>}
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center shrink-0">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800">Resultado de Inteligencia Artificial</h3>
            </div>
            <div className="flex-1 flex flex-col">
              {aiResponse ? (
                <>
                  <div className="text-slate-700 leading-relaxed text-sm bg-slate-50 p-4 rounded-lg border border-slate-100 flex-1 overflow-y-auto max-h-60 md:max-h-full">
                    {aiResponse}
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={toggleSpeech}
                      className={`flex items-center justify-center gap-2 px-4 py-3 md:py-2 w-full md:w-auto rounded-lg font-medium transition-colors shadow-sm ${
                        isSpeaking 
                        ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' 
                        : 'bg-teal-100 text-teal-800 hover:bg-teal-200'
                      }`}
                    >
                      {isSpeaking ? (
                        <><Square className="w-4 h-4" /> Detener Audio</>
                      ) : (
                        <><Volume2 className="w-4 h-4" /> Escuchar Resumen</>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="h-40 md:h-full flex items-center justify-center text-slate-400 text-sm text-center">
                  Sube un documento para ver el resumen adaptado por IA aquí.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 md:px-6 py-4 border-b border-slate-200">
            <h3 className="font-bold text-slate-800">Archivos en la Nube</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {documentos.length === 0 ? (
              <p className="p-6 text-slate-500 text-center text-sm">Aún no hay documentos subidos.</p>
            ) : (
              documentos.map((doc) => (
                <div key={doc.id} className="p-4 md:px-6 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-medium text-slate-800 truncate">{doc.nombre}</p>
                    <p className="text-xs text-slate-400">{new Date(doc.creado_en).toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}