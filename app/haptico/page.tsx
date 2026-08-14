'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Activity, FolderOpen, Settings, LogOut, Menu, X, Play, Square, AlertTriangle, Fingerprint, Eye, Sparkles } from 'lucide-react';

const MORSE_CODE: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.'
};

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
  const [modo, setModo] = useState<'morse' | 'braille'>('morse');

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const testVibration = () => {
    if (!('vibrate' in navigator)) {
      setMensaje('Tu navegador no soporta la vibración web.');
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
    setMensaje(`Traduciendo a ${modo === 'morse' ? 'Morse' : 'Braille Lineal'}...`);

    const pattern: number[] = [];
    const cleanText = texto.toUpperCase();

    if (modo === 'morse') {
      const DOT = 150, DASH = 400, PAUSE_SYMBOL = 150, PAUSE_LETTER = 400, PAUSE_WORD = 800;   
      for (let i = 0; i < cleanText.length; i++) {
        if (cleanText[i] === ' ') { pattern.push(0, PAUSE_WORD); continue; }
        const morseChar = MORSE_CODE[cleanText[i]];
        if (morseChar) {
          for (let j = 0; j < morseChar.length; j++) {
            pattern.push(morseChar[j] === '.' ? DOT : DASH, PAUSE_SYMBOL);                
          }
          pattern.push(0, PAUSE_LETTER);
        }
      }
    } else {
      const DOT_VIBE = 100, SPACE_DOT = 150, PAUSE_LETTER = 500, PAUSE_WORD = 1000;
      for (let i = 0; i < cleanText.length; i++) {
        if (cleanText[i] === ' ') { pattern.push(0, PAUSE_WORD); continue; }
        const brailleChar = BRAILLE_CODE[cleanText[i]];
        if (brailleChar) {
          for (let j = 0; j < 6; j++) {
            pattern.push(brailleChar[j] === '1' ? DOT_VIBE : 0, SPACE_DOT);                
          }
          pattern.push(0, PAUSE_LETTER);
        }
      }
    }

    navigator.vibrate(pattern);
    const totalTime = pattern.reduce((a, b) => a + b, 0);
    setTimeout(() => { setIsVibrating(false); setMensaje('Vibración completada.'); }, totalTime);
  };

  const stopHaptic = () => {
    if ('vibrate' in navigator) navigator.vibrate(0); 
    setIsVibrating(false);
    setMensaje('Vibración detenida.');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* MENÚ MÓVIL ACTUALIZADO */}
      <div className="md:hidden bg-indigo-900 text-white p-4 flex justify-between items-center shadow-md z-20">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-300" />
          <div>
            <h2 className="text-xl font-bold tracking-tight">Signocronía</h2>
            <p className="text-indigo-300 text-xs">Espacio Inclusivo</p>
          </div>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-indigo-800 rounded-lg hover:bg-indigo-700 transition-colors">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MENÚ LATERAL ACTUALIZADO */}
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
          <a href="/dashboard" className="flex items-center gap-3 hover:bg-indigo-800/50 text-indigo-100 px-4 py-3 rounded-xl transition-colors">
            <FolderOpen className="w-5 h-5 text-teal-400" />
            <span className="font-medium">Mis Documentos</span>
          </a>
          <a href="#" className="flex items-center gap-3 bg-indigo-800 text-white px-4 py-3 rounded-xl transition-colors shadow-inner border border-indigo-700/50">
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

      {/* CONTENIDO HÁPTICO */}
      <main className="flex-1 p-4 md:p-8 w-full max-w-full overflow-x-hidden">
        <header className="mb-6 md:mb-8 mt-2 md:mt-0">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">Traductor Háptico</h1>
          <p className="text-slate-500 mt-2">Convierte texto a patrones de vibración física a través de hardware.</p>
        </header>

        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm max-w-2xl">
          
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6 max-w-sm mx-auto sm:mx-0 shadow-inner">
            <button onClick={() => setModo('morse')} className={`flex-1 py-2.5 px-4 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${modo === 'morse' ? 'bg-white shadow-md text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}>
              <Activity className="w-4 h-4" /> Morse
            </button>
            <button onClick={() => setModo('braille')} className={`flex-1 py-2.5 px-4 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${modo === 'braille' ? 'bg-white shadow-md text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}>
              <Fingerprint className="w-4 h-4" /> Braille
            </button>
          </div>

          <label className="block text-sm font-bold text-slate-700 mb-2">
            Texto a traducir:
          </label>
          <textarea 
            rows={4}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escribe una palabra aquí..."
            className="w-full p-5 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none mb-6 resize-none text-slate-900 font-bold text-lg placeholder:text-slate-400 placeholder:font-normal"
          ></textarea>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {!isVibrating ? (
              <button onClick={playHaptic} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200 text-lg">
                <Play className="w-6 h-6" /> Traducir a {modo === 'morse' ? 'Morse' : 'Braille'}
              </button>
            ) : (
              <button onClick={stopHaptic} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-200 animate-pulse text-lg">
                <Square className="w-6 h-6" /> Detener Hardware
              </button>
            )}
            <button onClick={testVibration} className="sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 border-2 border-slate-200 py-3 px-6 rounded-2xl font-bold transition-all">
              Prueba SOS
            </button>
          </div>

          {mensaje && (
            <div className="text-center p-4 rounded-xl bg-indigo-50 text-indigo-800 font-bold text-sm border border-indigo-100">
              {mensaje}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}