'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Activity, BookOpen, Settings, LogOut, Menu, X, Play, Square, AlertTriangle } from 'lucide-react';

// Diccionario de Código Morse
const MORSE_CODE: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.'
};

export default function HapticoPage() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [texto, setTexto] = useState('');
  const [isVibrating, setIsVibrating] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Función para probar si el dispositivo soporta vibración
  const testVibration = () => {
    if (!('vibrate' in navigator)) {
      setMensaje('Tu navegador o dispositivo no soporta la vibración web (navigator.vibrate).');
      return;
    }
    // Vibra SOS (... --- ...) para probar
    navigator.vibrate([100, 100, 100, 100, 100, 300, 300, 100, 300, 100, 300, 300, 100, 100, 100, 100, 100]);
    setMensaje('¡Prueba SOS enviada al motor vibrador!');
  };

  // Función principal: Texto a Morse Háptico
  const playHaptic = () => {
    if (!('vibrate' in navigator)) {
      setMensaje('Dispositivo incompatible con vibración.');
      return;
    }

    if (!texto.trim()) {
      setMensaje('Por favor, ingresa un texto.');
      return;
    }

    setIsVibrating(true);
    setMensaje('Traduciendo y vibrando...');

    const pattern: number[] = [];
    const DOT = 150;      // ms de vibración corta
    const DASH = 400;     // ms de vibración larga
    const PAUSE_SYMBOL = 150; // ms de pausa entre puntos/rayas
    const PAUSE_LETTER = 400; // ms de pausa entre letras
    const PAUSE_WORD = 800;   // ms de pausa entre palabras

    const cleanText = texto.toUpperCase();

    for (let i = 0; i < cleanText.length; i++) {
      const char = cleanText[i];

      if (char === ' ') {
        pattern.push(0); // 0 vibración
        pattern.push(PAUSE_WORD);
        continue;
      }

      const morseChar = MORSE_CODE[char];
      if (morseChar) {
        for (let j = 0; j < morseChar.length; j++) {
          const symbol = morseChar[j];
          pattern.push(symbol === '.' ? DOT : DASH); // Vibra
          pattern.push(PAUSE_SYMBOL);                // Pausa
        }
        pattern.push(0);
        pattern.push(PAUSE_LETTER);
      }
    }

    // Ejecuta el patrón completo en el hardware del celular
    navigator.vibrate(pattern);

    // Calculamos más o menos cuándo termina para resetear el botón
    const totalTime = pattern.reduce((a, b) => a + b, 0);
    setTimeout(() => {
      setIsVibrating(false);
      setMensaje('Vibración completada.');
    }, totalTime);
  };

  const stopHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(0); // Un array vacío o 0 detiene cualquier vibración activa
    }
    setIsVibrating(false);
    setMensaje('Vibración detenida por el usuario.');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Barra superior móvil */}
      <div className="md:hidden bg-indigo-900 text-white p-4 flex justify-between items-center shadow-md z-20">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Signocronía</h2>
          <p className="text-indigo-300 text-xs">Módulo Háptico</p>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-2 bg-indigo-800 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Menú Lateral (Igual que en el Dashboard) */}
      <aside className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex w-full md:w-64 bg-indigo-900 text-white flex-col md:min-h-screen shrink-0 z-10`}>
        <div className="p-6 hidden md:block">
          <h2 className="text-xl font-bold tracking-tight">Signocronía</h2>
          <p className="text-indigo-300 text-xs mt-1">Panel Institucional</p>
        </div>
        <nav className="flex-1 px-4 py-6 md:py-0 space-y-2">
          <a href="/dashboard" className="flex items-center gap-3 hover:bg-indigo-800/50 text-indigo-100 px-4 py-3 rounded-lg transition-colors">
            <BookOpen className="w-5 h-5 text-teal-400" />
            <span className="font-medium">Mis Cursos</span>
          </a>
          <a href="#" className="flex items-center gap-3 bg-indigo-800 text-white px-4 py-3 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
            <span>Módulo Háptico</span>
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
        <header className="mb-6 md:mb-8 mt-2 md:mt-0">
          <h1 className="text-2xl font-bold text-slate-800">Traductor Háptico (Morse)</h1>
          <p className="text-slate-500 mt-1">Convierte texto a patrones de vibración física.</p>
        </header>

        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm max-w-2xl">
          
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-blue-600 shrink-0" />
            <p className="text-sm text-blue-800">
              <strong>Aviso:</strong> La vibración solo funciona en dispositivos móviles (Android). Asegúrate de no tener el celular en modo "No Molestar" absoluto.
            </p>
          </div>

          <label className="block text-sm font-bold text-slate-700 mb-2">
            Texto a traducir:
          </label>
          <textarea 
            rows={4}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escribe una palabra corta aquí (ej. HOLA)"
            className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none mb-6 resize-none"
          ></textarea>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {!isVibrating ? (
              <button 
                onClick={playHaptic}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-200"
              >
                <Play className="w-5 h-5" /> Iniciar Vibración
              </button>
            ) : (
              <button 
                onClick={stopHaptic}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-200 animate-pulse"
              >
                <Square className="w-5 h-5" /> Detener
              </button>
            )}

            <button 
              onClick={testVibration}
              className="sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 py-3 px-6 rounded-xl font-medium transition-all"
            >
              Prueba SOS
            </button>
          </div>

          {mensaje && (
            <div className="text-center p-3 rounded-lg bg-slate-50 text-slate-600 font-medium text-sm border border-slate-100">
              {mensaje}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}