'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, Sparkles, AlertCircle, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados para la interfaz
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (isLogin) {
        // Lógica de Inicio de Sesión
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        // Si todo sale bien, lo mandamos directo al dashboard
        router.push('/dashboard');
        
      } else {
        // Lógica de Registro
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        // Mensaje de éxito amigable en español
        setSuccessMsg('¡Cuenta creada con éxito! Por seguridad, te enviamos un enlace a tu correo. Haz clic ahí para entrar.');
      }
    } catch (error: any) {
      // TRADUCTOR DE ERRORES: Convertimos errores técnicos de Supabase a español amigable
      const mensajeOriginal = error.message || '';
      
      if (mensajeOriginal.includes('Invalid login credentials')) {
        setErrorMsg('El correo o la contraseña son incorrectos. Inténtalo de nuevo.');
      } else if (mensajeOriginal.includes('User already registered')) {
        setErrorMsg('Este correo ya está registrado. Por favor, inicia sesión.');
      } else if (mensajeOriginal.includes('Password should be at least')) {
        setErrorMsg('La contraseña es muy corta. Debe tener al menos 6 caracteres.');
      } else {
        setErrorMsg('Ocurrió un error inesperado. Revisa tu conexión e intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Círculos decorativos de fondo */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-200/40 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white relative z-10">
        
        {/* Cabecera del Login */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 mb-4 hover:scale-105 transition-transform cursor-pointer">
            <Sparkles className="w-8 h-8 text-white" />
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            {isLogin ? 'Ingresa tus datos para acceder a tu panel.' : 'Únete a la educación sin barreras.'}
          </p>
        </div>

        {/* Mensajes de Alerta */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <p className="text-sm text-rose-700 font-medium">{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-700 font-medium">{successMsg}</p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleAuth} className="space-y-5">
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:font-normal placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:font-normal placeholder:text-slate-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-lg shadow-lg ${
              isLoading 
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:shadow-indigo-300'
            }`}
          >
            {isLoading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Procesando...</>
            ) : (
              <>{isLogin ? 'Ingresar a la plataforma' : 'Registrarme ahora'} <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </form>

        {/* Enlace para alternar entre Login y Registro */}
        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <p className="text-slate-500 text-sm">
            {isLogin ? '¿No tienes una cuenta?' : '¿Ya eres parte de Signocronía?'}
          </p>
          <button 
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className="mt-2 font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            {isLogin ? 'Crear una cuenta gratis' : 'Inicia sesión aquí'}
          </button>
        </div>

      </div>
    </div>
  );
}