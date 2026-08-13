'use client'; // Indica que este componente usa funciones del navegador (React)

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // <-- NUEVO: Importamos el enrutador de Next.js
import { supabase } from '@/lib/supabase'; // Importamos tu puente de conexión
import { Building2, KeyRound, Mail, ArrowRight, AudioWaveform } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter(); // <-- NUEVO: Inicializamos el enrutador

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Función para registrar un nuevo usuario
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('¡Registro exitoso! Revisa tu correo para confirmar (si está activado en Supabase) o inicia sesión.');
    }
    setIsLoading(false);
  };

  // Función para iniciar sesión
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('¡Inicio de sesión exitoso! Redirigiendo al panel...');
      router.push('/dashboard'); // <-- NUEVO: Le decimos que nos lleve a la página del dashboard
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-indigo-100/50 p-8 border border-slate-100">
        
        {/* Encabezado */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <AudioWaveform className="text-teal-400 w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Acceso Institucional</h1>
          <p className="text-slate-500 text-sm">Signocronía - EdTech Multi-Tenant</p>
        </div>

        {/* Formulario */}
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Correo Institucional</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                placeholder="coordinador@universidad.edu.pe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Contraseña</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Mensajes de error/éxito */}
          {message && (
             <div className={`p-3 rounded-lg text-sm ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
               {message}
             </div>
          )}

          {/* Botones de acción */}
          <div className="grid grid-cols-2 gap-4">
             <button
                type="button"
                onClick={handleSignUp}
                disabled={isLoading}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Registrar
              </button>
              <button
                type="button"
                onClick={handleSignIn}
                disabled={isLoading}
                className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-md shadow-indigo-200"
              >
                {isLoading ? 'Cargando...' : 'Entrar'} <ArrowRight className="w-4 h-4" />
              </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                <Building2 className="w-3 h-3" /> Entorno Seguro Universitario
            </p>
        </div>
      </div>
    </div>
  );
}