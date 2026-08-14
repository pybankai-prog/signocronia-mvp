'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { UploadCloud, ArrowLeft, BookA, Loader2, CheckCircle2, Edit, Trash2, X, FileText } from 'lucide-react';

export default function AdminModulosPage() {
  const [modulos, setModulos] = useState<any[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);

  // Estados del formulario
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [volumen, setVolumen] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [file, setFile] = useState<File | null>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    cargarModulos();
  }, []);

  const cargarModulos = async () => {
    setIsLoadingList(true);
    const { data, error } = await supabase
      .from('modulos_ingles')
      .select('*')
      .order('volumen', { ascending: true });
    
    if (data) setModulos(data);
    setIsLoadingList(false);
  };

  const cargarParaEditar = (modulo: any) => {
    setEditandoId(modulo.id);
    setVolumen(modulo.volumen.toString());
    setTitulo(modulo.titulo);
    setDescripcion(modulo.descripcion);
    setFile(null); // No cargamos el archivo anterior, si no sube uno nuevo, se queda el mismo
    setMensaje({ tipo: 'info', texto: 'Modo edición activado. Si no seleccionas un PDF nuevo, se mantendrá el anterior.' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setVolumen('');
    setTitulo('');
    setDescripcion('');
    setFile(null);
    setMensaje({ tipo: '', texto: '' });
  };

  const handleEliminar = async (id: string, url_pdf: string) => {
    if (!window.confirm("¿Estás seguro de eliminar este módulo? Perderás los datos.")) return;

    try {
      // 1. Borrar de la base de datos
      await supabase.from('modulos_ingles').delete().eq('id', id);

      // 2. Intentar borrar el archivo físico de Supabase Storage (Opcional pero recomendado para ahorrar espacio)
      const fileName = url_pdf.split('/').pop();
      if (fileName) {
        await supabase.storage.from('modulos_publicos').remove([fileName]);
      }

      setMensaje({ tipo: 'exito', texto: 'Módulo eliminado correctamente.' });
      cargarModulos();
    } catch (error: any) {
      console.error(error);
      setMensaje({ tipo: 'error', texto: 'Error al eliminar el módulo.' });
    }
  };

  const handleGuardarModulo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!volumen || !titulo || !descripcion) {
      setMensaje({ tipo: 'error', texto: 'Por favor, completa los datos de texto.' });
      return;
    }

    if (!editandoId && !file) {
      setMensaje({ tipo: 'error', texto: 'Para un módulo nuevo, debes subir un PDF obligatoriamente.' });
      return;
    }

    setIsUploading(true);
    setMensaje({ tipo: 'info', texto: 'Procesando en la nube...' });

    try {
      let urlDirecta = null;

      // Si subió un archivo nuevo (ya sea creando o editando), lo guardamos en Storage
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `Volumen_${volumen}_${Date.now()}.${fileExt}`;

        const { error: storageError } = await supabase.storage
          .from('modulos_publicos')
          .upload(fileName, file);

        if (storageError) throw storageError;

        const { data: publicUrlData } = supabase.storage
          .from('modulos_publicos')
          .getPublicUrl(fileName);

        urlDirecta = publicUrlData.publicUrl;
      }

      if (editandoId) {
        // ACTUALIZAR MÓDULO EXISTENTE
        const datosAActualizar: any = {
          volumen: parseInt(volumen),
          titulo: titulo,
          descripcion: descripcion,
        };
        // Solo actualizamos la URL si subió un archivo nuevo
        if (urlDirecta) datosAActualizar.url_pdf = urlDirecta;

        const { error: dbError } = await supabase
          .from('modulos_ingles')
          .update(datosAActualizar)
          .eq('id', editandoId);

        if (dbError) throw dbError;
        setMensaje({ tipo: 'exito', texto: '¡Módulo editado con éxito!' });

      } else {
        // CREAR MÓDULO NUEVO
        const { error: dbError } = await supabase
          .from('modulos_ingles')
          .insert([{
            volumen: parseInt(volumen),
            titulo: titulo,
            descripcion: descripcion,
            url_pdf: urlDirecta
          }]);

        if (dbError) throw dbError;
        setMensaje({ tipo: 'exito', texto: '¡Módulo publicado con éxito!' });
      }
      
      cancelarEdicion();
      cargarModulos(); // Refrescamos la tabla de abajo

    } catch (error: any) {
      console.error("Error:", error);
      setMensaje({ tipo: 'error', texto: `Error: ${error.message}` });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      <header className="bg-slate-900 p-6 shadow-md flex items-center gap-4 sticky top-0 z-20">
        <Link href="/dashboard" className="bg-white/10 p-3 rounded-full text-white hover:bg-white/20 transition-colors shrink-0">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <BookA className="w-8 h-8 text-emerald-400" />
            Gestión de Módulos
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">Panel exclusivo para administradores</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-10">
        
        {/* ZONA DE FORMULARIO (Crear / Editar) */}
        <div className={`bg-white rounded-3xl p-8 border shadow-sm transition-colors ${editandoId ? 'border-amber-400 shadow-amber-100' : 'border-slate-200'}`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              {editandoId ? 'Editar Módulo Existente' : 'Subir Nuevo Volumen'}
            </h2>
            {editandoId && (
              <button onClick={cancelarEdicion} className="text-slate-500 hover:text-rose-600 flex items-center gap-1 font-bold text-sm bg-slate-100 px-3 py-1.5 rounded-full transition-colors">
                <X className="w-4 h-4" /> Cancelar Edición
              </button>
            )}
          </div>
          
          <form onSubmit={handleGuardarModulo} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <label className="block text-sm font-bold text-slate-700 mb-2">Volumen N°</label>
                <input 
                  type="number" 
                  value={volumen}
                  onChange={(e) => setVolumen(e.target.value)}
                  placeholder="Ej: 1"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-bold text-slate-700 mb-2">Título del Módulo</label>
                <input 
                  type="text" 
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej: Fundamentos"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Descripción</label>
              <textarea 
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Lo que aprenderán..."
                rows={3}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Archivo PDF {editandoId && '(Opcional: Solo si quieres reemplazar el actual)'}</label>
              <div className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${file ? 'border-indigo-400 bg-indigo-50' : 'border-slate-300 hover:bg-slate-50'}`}>
                <input 
                  type="file" 
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <UploadCloud className={`w-10 h-10 mx-auto mb-3 ${file ? 'text-indigo-600' : 'text-slate-400'}`} />
                {file ? (
                  <p className="font-bold text-indigo-600">{file.name}</p>
                ) : (
                  <p className="text-slate-500 font-medium">
                    {editandoId ? 'Haz clic para subir un PDF nuevo (o déjalo en blanco)' : 'Haz clic aquí para seleccionar el PDF'}
                  </p>
                )}
              </div>
            </div>

            {mensaje.texto && (
              <div className={`p-4 rounded-xl flex items-center gap-3 font-bold ${
                mensaje.tipo === 'error' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 
                mensaje.tipo === 'exito' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
                'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {mensaje.tipo === 'exito' && <CheckCircle2 className="w-5 h-5" />}
                {mensaje.texto}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isUploading}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all ${
                isUploading 
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                : editandoId 
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-200'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200'
              }`}
            >
              {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : editandoId ? <Edit className="w-6 h-6" /> : <UploadCloud className="w-6 h-6" />}
              {isUploading ? 'Procesando...' : editandoId ? 'Guardar Cambios' : 'Publicar Nuevo Módulo'}
            </button>
          </form>
        </div>

        {/* ZONA DE ADMINISTRACIÓN (Listado de módulos) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-lg">Módulos Publicados</h3>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">{modulos.length} módulos</span>
          </div>

          <div className="divide-y divide-slate-100">
            {isLoadingList ? (
              <div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-400" /></div>
            ) : modulos.length === 0 ? (
              <p className="p-10 text-center text-slate-500 font-medium">Aún no has publicado ningún módulo.</p>
            ) : (
              modulos.map((modulo) => (
                <div key={modulo.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                      <span className="font-black text-xl">{modulo.volumen}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">{modulo.titulo}</h4>
                      <p className="text-slate-500 text-sm line-clamp-1 max-w-lg">{modulo.descripcion}</p>
                      <a href={modulo.url_pdf} target="_blank" className="text-indigo-500 text-xs font-bold mt-1 inline-flex items-center gap-1 hover:underline">
                        <FileText className="w-3 h-3" /> Ver PDF actual
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => cargarParaEditar(modulo)}
                      className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Editar módulo"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleEliminar(modulo.id, modulo.url_pdf)}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Eliminar módulo"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
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