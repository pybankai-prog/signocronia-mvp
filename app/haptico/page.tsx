'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Activity, BookOpen, Settings, LogOut, Menu, X, Play, Square, AlertTriangle, Fingerprint } from 'lucide-react';

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

// Diccionario Braille (6 puntos: 1=Relieve/Vibra, 0=Plano/Pausa)
// Orden de lectura: Columna izquierda (arriba a abajo) -> Columna derecha (arriba a abajo)
const BRAILLE_CODE: Record<string, string> = {
  'A': '100000', 'B': '110000', 'C': '100100', 'D': '100110', 'E': '100010',
  'F': '110100', 'G': '110110', 'H': '110010', 'I': '010100', 'J': '010110',
  'K': '101000', 'L': '111000', 'M': '101100', 'N': '101110', 'O': '101010',
  'P': '111100', 'Q': '111110', 'R': '111010', 'S': '011100', 'T': '011110',
  'U': '101001', 'V': '111001', 'W': '010111', 'X': '101101', 'Y': '101111', 'Z': '101011',
  '0': '010111', '1': '100000', '2': '110000', '3': '100100', '4': '100110', '5': '100010',
  '6': '110100', '7': '110110', '8': '110010', '9': '010100'
};

export default function HapticoPage() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [texto, setTexto] = useState('');
  const [isVibrating, setIsVibrating] = useState(false);
  const [mensaje, setMensaje] = useState('');
  
  // <-- NUEVO: Estado para alternar entre Morse y Braille
  const [modo, setModo] = useState<'morse' | 'braille'>('morse');

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const testVibration = () => {
    if (!('vibrate' in navigator)) {
      setMensaje('Tu navegador o dispositivo no soporta la vibración web.');
      return;
    }
    navigator.vibrate([100, 100, 100, 100, 100, 300, 300, 100, 300, 100, 300, 300, 100, 100, 100, 100, 100]);
    setMensaje('¡Prueba SOS enviada al hardware!');
  };

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
    setMensaje(`Traduciendo a ${modo === 'morse' ? 'Morse' : 'Braille Lineal'} y vibrando...`);

    const pattern: number[] = [];
    const cleanText = texto.toUpperCase();

    // LÓGICA PARA MORSE
    if (modo === 'morse') {
      const DOT = 150;      
      const DASH = 400;     
      const PAUSE_SYMBOL = 150; 
      const PAUSE_LETTER = 400; 
      const PAUSE_WORD = 800;   

      for (let i = 0; i < cleanText.length; i++) {
        const char = cleanText[i];
        if (char === ' ') {
          pattern.push(0); pattern.push(PAUSE_WORD);
          continue;
        }
        const morseChar = MORSE_CODE[char];
        if (morseChar) {
          for (let j = 0; j < morseChar.length; j++) {
            pattern.push(morseChar[j] === '.' ? DOT : DASH);
            pattern.push(PAUSE_SYMBOL);                
          }
          pattern.push(0); pattern.push(PAUSE_LETTER);
        }
      }
    } 
    // LÓGICA PARA BRAILLE
    else {
      const DOT_VIBE = 100;     // Vibración seca y rápida para un punto Braille
      const SPACE_DOT = 150;    // Pausa entre puntos de una misma letra
      const PAUSE_LETTER = 500; // Pausa entre letras
      const PAUSE_WORD = 1000;  // Pausa entre palabras

      for (let i = 0; i < cleanText.length; i++) {
        const char = cleanText[i];
        if (char === ' ') {
          pattern.push(0); pattern.push(PAUSE_WORD);
          continue;
        }
        const brailleChar = BRAILLE_CODE[char];
        if (brailleChar) {
          for (let j = 0; j < 6; j++) {
            if (brailleChar[j] === '1') {
              pattern.push(DOT_VIBE); 
            } else {
              pattern.push(0); // Cero vibración (punto plano)
            }
            pattern.push(SPACE_DOT);                
          }
          pattern.push(0); pattern.push(PAUSE_LETTER);
        }
      }
    }

    navigator.vibrate(pattern);

    const totalTime = pattern.reduce((a, b) => a + b, 0);
    setTimeout(() => {
      setIsVibrating(false);
      setMensaje('Vibración completada.');
    }, totalTime);
  };

  const stopHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(0); 
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

      {/* Menú Lateral */}
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
          <h1 className="text-2xl font-bold text-slate-800">Traductor Háptico</h1>
          <p className="text-slate-500 mt-1">Convierte texto a patrones de vibración física a través de hardware.</p>
        </header>

        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm max-w-2xl">
          
          {/* <-- NUEVO: Selector de Modo (Morse / Braille) */}
          <div className="flex bg-slate-100 p-1.5 rounded-xl mb-6 max-w-sm mx-auto sm:mx-0 shadow-inner">
            <button
              onClick={() => setModo('morse')}
              className={`flex-1 py-2.5 px-4 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${modo === 'morse' ? 'bg-white shadow-md text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Activity className="w-4 h-4" /> Morse
            </button>
            <button
              onClick={() => setModo('braille')}
              className={`flex-1 py-2.5 px-4 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${modo === 'braille' ? 'bg-white shadow-md text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Fingerprint className="w-4 h-4" /> Braille
            </button>
          </div>

          <label className="block text-sm font-bold text-slate-700 mb-2">
            Texto a traducir:
          </label>
          {/* <-- MODIFICADO: Clases actualizadas para letras oscuras y bien legibles */}
          <textarea 
            rows={4}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escribe una palabra aquí..."
            className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none mb-6 resize-none text-slate-900 font-semibold text-lg placeholder:text-slate-400 placeholder:font-normal"
          ></textarea>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {!isVibrating ? (
              <button 
                onClick={playHaptic}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-200 text-lg"
              >
                <Play className="w-6 h-6" /> Traducir a {modo === 'morse' ? 'Morse' : 'Braille'}
              </button>
            ) : (
              <button 
                onClick={stopHaptic}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-200 animate-pulse text-lg"
              >
                <Square className="w-6 h-6" /> Detener Hardware
              </button>
            )}

            <button 
              onClick={testVibration}
              className="sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 border-2 border-slate-200 py-3 px-6 rounded-xl font-bold transition-all"
            >
              Prueba SOS
            </button>
          </div>

          {mensaje && (
            <div className="text-center p-4 rounded-lg bg-indigo-50 text-indigo-800 font-medium text-sm border border-indigo-100">
              {mensaje}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}