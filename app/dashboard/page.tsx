'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { FolderOpen, UploadCloud, Settings, LogOut, Loader2, FileText, BrainCircuit, Volume2, Square, Menu, X, Eye, Sparkles } from 'lucide-react';

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
        setUploadMessage('¡Traducción completada!');
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
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-300" />
          <div>
            <h2 className="text-xl font-bold tracking-tight">Signocronía</h2>
            <p className="text-indigo-300 text-xs">Espacio Inclusivo</p>
          </div>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-2 bg-indigo-800 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Menú Lateral Universal */}
      <aside className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex w-full md:w-64 bg-indigo-900 text-white flex-col md:min-h-screen shrink-0 z-10 shadow-xl`}>
        <div className="p-6 hidden md:flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-800 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-indigo-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Signocronía</h2>
            <p className="text-indigo-300 text-xs mt-0.5">Espacio Inclusivo</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 md:py-4 space-y-2">
          {/* Cambiamos "Mis Cursos" por "Mis Documentos" */}
          <a href="#" className="flex items-center gap-3 bg-indigo-800 text-white px-4 py-3 rounded-xl transition-colors shadow-inner border border-indigo-700/50">
            <FolderOpen className="w-5 h-5 text-teal-400" />
            <span className="font-medium">Mis Documentos</span>
          </a>
          <a href="/haptico" className="flex items-center gap-3 hover:bg-indigo-800/50 text-indigo-100 px-4 py-3 rounded-xl transition-colors">
            <Settings className="w-5 h-5" />
            <span>Traductor Háptico</span>
          </a>
          <a href="/avatar" className="flex items-center gap-3 hover:bg-indigo-800/50 text-indigo-100 px-4 py-3 rounded-xl transition-colors">
            <Eye className="w-5 h-5 text-emerald-400" />
            <span>Intérprete 3D</span>
          </a>
        </nav>
        
        <div className="p-4 border-t border-indigo-800/50 mt-auto">
          <button onClick={handleSignOut} className="flex items-center gap-3 text-indigo-300 hover:text-white transition-colors w-full px-4 py-2 rounded-lg hover:bg-indigo-800/50">
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-4 md:p-8 w-full max-w-full overflow-x-hidden">
        <header className="mb-6 md:mb-8 mt-2 md:mt-0">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">Tu centro de accesibilidad</h1>
          <p className="text-slate-500 mt-2">Sube cualquier texto y adáptalo a tus necesidades visuales, auditivas o táctiles.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
          
          {/* Tarjeta Subida */}
          <div className="bg-white border border-slate-200 border-dashed rounded-3xl p-6 md:p-8 text-center flex flex-col items-center justify-center relative shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
              {isUploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <UploadCloud className="w-8 h-8" />}
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">¿Qué quieres leer hoy?</h3>
            <p className="text-sm text-slate-500 mb-6">Sube libros, noticias, o documentos personales.</p>
            
            <div className="relative w-full md:w-auto">
              <input type="file" accept=".pdf,.txt" onChange={handleFileUpload} disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />
              <button className={`w-full md:w-auto px-8 py-3.5 rounded-xl font-bold transition-all ${isUploading ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200'}`}>
                {isUploading ? 'Procesando archivo...' : 'Seleccionar archivo (.txt, .pdf)'}
              </button>
            </div>
            {uploadMessage && <div className="mt-4 p-3 bg-emerald-50 text-sm text-emerald-700 font-bold rounded-lg border border-emerald-100">{uploadMessage}</div>}
          </div>

          {/* Tarjeta IA */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-4 pb-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Resumen Inteligente</h3>
                <p className="text-xs text-slate-500">Texto simplificado por IA</p>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col">
              {aiResponse ? (
                <>
                  <div className="text-slate-700 leading-relaxed text-base bg-slate-50/50 p-5 rounded-2xl border border-slate-100 flex-1 overflow-y-auto max-h-60 md:max-h-full shadow-inner">
                    {aiResponse}
                  </div>
                  <div className="mt-5 flex justify-end">
                    <button
                      onClick={toggleSpeech}
                      className={`flex items-center justify-center gap-2 px-6 py-3.5 w-full md:w-auto rounded-xl font-bold transition-all shadow-md ${
                        isSpeaking 
                        ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' 
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100'
                      }`}
                    >
                      {isSpeaking ? (
                        <><Square className="w-5 h-5 fill-current" /> Detener lectura</>
                      ) : (
                        <><Volume2 className="w-5 h-5" /> Escuchar texto</>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="h-40 md:h-full flex flex-col items-center justify-center text-slate-400 text-sm text-center bg-slate-50/50 rounded-2xl border border-slate-100 border-dashed">
                  <FileText className="w-8 h-8 text-slate-300 mb-2" />
                  <p>El resumen adaptado aparecerá aquí.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lista de Documentos */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-lg">Historial de archivos</h3>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">{documentos.length} guardados</span>
          </div>
          
          <div className="divide-y divide-slate-100">
            {documentos.length === 0 ? (
              <p className="p-8 text-slate-400 text-center text-sm font-medium">Aún no has procesado ningún documento.</p>
            ) : (
              documentos.map((doc) => (
                <div key={doc.id} className="p-4 md:px-6 flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-slate-700 group-hover:text-slate-900 truncate transition-colors">{doc.nombre}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{new Date(doc.creado_en).toLocaleString()}</p>
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