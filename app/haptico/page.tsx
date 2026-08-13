'use client';

import React, { useState } from 'react';
import { HandMetal, Play, Square, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Diccionario Morse simplificado (Coste 0, lógica en el cliente)
const MORSE_TABLE: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.',
  H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.',
  O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-',
  V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..'
};

export default function HapticoPage() {
  const [text, setText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  // Motor de conversión Texto -> Patrón Háptico (Código Morse)
  const textToHapticPattern = (textStr: string) => {
    const unitMs = 200; // Duración de 1 punto en milisegundos
    const DOT = 1;
    const DASH = 3;
    const SYMBOL_GAP = 1;
    const LETTER_GAP = 3;
    const WORD_GAP = 7;

    const pattern: number[] = [];
    const words = textStr.trim().toUpperCase().split(/\s+/);

    words.forEach((word, wordIndex) => {
      const letters = word.split('');
      letters.forEach((char, letterIndex) => {
        const morseStr = MORSE_TABLE[char];
        if (!morseStr) return;

        const symbols = morseStr.split('');
        symbols.forEach((symbol, symbolIndex) => {
          const durationUnits = symbol === '.' ? DOT : DASH;
          pattern.push(durationUnits * unitMs); // VIBRAR

          if (symbolIndex < symbols.length - 1) {
            pattern.push(SYMBOL_GAP * unitMs); // PAUSAR intra-letra
          }
        });

        if (letterIndex < letters.length - 1) {
          pattern.push(LETTER_GAP * unitMs); // PAUSAR entre letras
        }
      });

      if (wordIndex < words.length - 1) {
        pattern.push(WORD_GAP * unitMs); // PAUSAR entre palabras
      }
    });

    return pattern;
  };

  const playHaptics = () => {
    if (!('vibrate' in navigator)) {
      alert('Tu navegador/dispositivo no soporta la API de vibración (navigator.vibrate). Prueba en un celular Android.');
      return;
    }

    if (!text) return;
    
    setIsPlaying(true);
    const pattern = textToHapticPattern(text);
    
    // Disparar motor de vibración nativo
    navigator.vibrate(pattern);
    
    // Calcular tiempo total para apagar el estado visual
    const totalTimeMs = pattern.reduce((sum, current) => sum + current, 0);
    setTimeout(() => setIsPlaying(false), totalTimeMs);
  };

  const stopHaptics = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(0); // Detiene la vibración
    }
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/dashboard" className="inline-flex items-center text-teal-400 hover:text-teal-300 mb-8 font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Dashboard
        </Link>
        
        <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl">
          <div className="flex items-center justify-center w-16 h-16 bg-teal-500/20 rounded-2xl mb-6 mx-auto">
            <HandMetal className="w-8 h-8 text-teal-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-2">Simulador Háptico</h1>
          <p className="text-slate-400 text-center text-sm mb-8">
            Convierte texto plano a código Morse usando el motor de vibración de tu dispositivo (coste $0).
          </p>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribe una palabra (ej. HOLA)"
            className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 mb-6 resize-none"
          />

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={playHaptics}
              disabled={isPlaying || !text}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all
                ${isPlaying || !text ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-400 text-slate-900'}`}
            >
              <Play className="w-5 h-5" /> Vibrar
            </button>
            <button
              onClick={stopHaptics}
              disabled={!isPlaying}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all
                ${!isPlaying ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-rose-500 hover:bg-rose-400 text-white'}`}
            >
              <Square className="w-5 h-5" /> Detener
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}