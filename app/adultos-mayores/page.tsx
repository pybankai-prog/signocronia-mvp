'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Mic, MicOff, Volume2, ArrowLeft, Send, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Inicializar Gemini con la llave de tu archivo .env.local
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export default function AdultosMayoresPage() {
  const [mensaje, setMensaje] = useState('');
  const [historial, setHistorial] = useState<{rol: string, texto: string}[]>([]);
  const [isCargando, setIsCargando] = useState(false);
  const [isEscuchando, setIsEscuchando] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const chatFinalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    chatFinalRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [historial]);

  const enviarMensaje = async (textoAEnviar: string) => {
    if (!textoAEnviar.trim()) return;

    // Agregar el mensaje del usuario a la pantalla
    const nuevoHistorial = [...historial, { rol: 'usuario', texto: textoAEnviar }];
    setHistorial(nuevoHistorial);
    setMensaje('');
    setIsCargando(true);

    try {
      // Configuración de GEMINI con el PROMPT para TERCERA EDAD
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        systemInstruction: "Eres un asistente virtual diseñado exclusivamente para adultos mayores. Tu objetivo es acompañar y ayudar. Tono: extremadamente paciente, respetuoso (trata de 'Usted'), afectuoso. Regla ESTRICTA: Tus respuestas deben ser MUY cortas (máximo 2 o 3 oraciones). Cero palabras técnicas, cero anglicismos (no digas link, app, click). Si el usuario se frustra, cálmalo diciendo 'No se preocupe, vamos paso a paso'. Cada cierto tiempo recuérdale beber agua o descansar la vista."
      });

      // Enviamos el historial de la conversación para que tenga memoria
      const chat = model.startChat({
        history: nuevoHistorial.filter(m => m.rol !== 'sistema').map(m => ({
          role: m.rol === 'usuario' ? 'user' : 'model',
          parts: [{ text: m.texto }],
        })),
      });

      const result = await chat.sendMessage(textoAEnviar);
      const respuestaIA = result.response.text();

      setHistorial([...nuevoHistorial, { rol: 'asistente', texto: respuestaIA }]);
      leerEnVozAlta(respuestaIA); // La IA le habla automáticamente al abuelo

    } catch (error) {
      console.error(error);
      setHistorial([...nuevoHistorial, { rol: 'asistente', texto: 'Perdón, tuve un pequeño problema técnico. ¿Podría repetirme lo que dijo?' }]);
    } finally {
      setIsCargando(false);
    }
  };

  // Lector de Voz (La IA responde hablando)
  const leerEnVozAlta = (texto: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9; // Habla un poco más lento para que entiendan mejor
      window.speechSynthesis.speak(utterance);
    }
  };

  // Micrófono (Para que el abuelo hable en lugar de escribir)
  const toggleMicrofono = () => {
    if (isEscuchando) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsEscuchando(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('El micrófono no es compatible con este navegador.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'es-PE';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsEscuchando(true);
    
    recognition.onresult = (event: any) => {
      const transcripcion = event.results[0][0].transcript;
      enviarMensaje(transcripcion); // Envía el mensaje automáticamente al terminar de hablar
    };

    recognition.onerror = () => setIsEscuchando(false);
    recognition.onend = () => setIsEscuchando(false);

    recognition.start();
  };

  return (
    <div className="min-h-screen bg-[#003366] font-sans flex flex-col">
      {/* Cabecera GIGANTE */}
      <header className="bg-[#002244] p-6 shadow-md flex items-center gap-6">
        <Link href="/" className="bg-white/10 p-4 rounded-full text-white hover:bg-white/20 transition-colors">
          <ArrowLeft className="w-8 h-8 md:w-12 md:h-12" />
        </Link>
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white">Su Asistente Personal</h1>
          <p className="text-xl md:text-2xl text-yellow-300 mt-2 font-medium">Toque el micrófono amarillo para hablar conmigo.</p>
        </div>
      </header>

      {/* Historial de Chat (Letras gigantes) */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto space-y-8 max-w-5xl mx-auto w-full">
        {historial.length === 0 && (
          <div className="text-center mt-20">
            <Volume2 className="w-24 h-24 text-white/20 mx-auto mb-6" />
            <p className="text-3xl md:text-4xl text-white/50 font-bold leading-relaxed">
              ¡Hola! Estoy listo para ayudarle. <br/> Presione el micrófono abajo y cuénteme qué necesita.
            </p>
          </div>
        )}

        {historial.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.rol === 'usuario' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-6 md:p-8 rounded-3xl max-w-[85%] shadow-lg ${
              msg.rol === 'usuario' 
              ? 'bg-blue-500 text-white rounded-br-none' 
              : 'bg-white text-black rounded-bl-none border-4 border-yellow-400'
            }`}>
              <p className="text-2xl md:text-4xl font-medium leading-normal">{msg.texto}</p>
            </div>
          </div>
        ))}
        {isCargando && (
          <div className="flex justify-start">
            <div className="bg-white p-6 rounded-3xl rounded-bl-none shadow-lg flex items-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-[#003366]" />
              <p className="text-2xl font-medium text-slate-500">Escribiendo...</p>
            </div>
          </div>
        )}
        <div ref={chatFinalRef} />
      </main>

      {/* Panel Inferior (Botones inmensos) */}
      <footer className="bg-[#002244] p-6 md:p-10 border-t-8 border-yellow-400">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
          <button 
            onClick={toggleMicrofono}
            className={`flex-none p-8 md:p-10 rounded-full flex items-center justify-center transition-all shadow-[0_10px_20px_rgba(0,0,0,0.4)] ${
              isEscuchando 
              ? 'bg-rose-500 text-white animate-pulse scale-105' 
              : 'bg-[#FFD700] hover:bg-[#FFC000] text-black'
            }`}
          >
            {isEscuchando ? <MicOff className="w-16 h-16" /> : <Mic className="w-16 h-16" />}
          </button>
          
          <div className="flex-1 flex gap-4">
            <input 
              type="text" 
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && enviarMensaje(mensaje)}
              placeholder="O escriba aquí si prefiere..."
              className="flex-1 text-2xl md:text-3xl p-6 md:p-8 rounded-3xl font-medium text-black focus:outline-none focus:ring-8 focus:ring-blue-400"
            />
            <button 
              onClick={() => enviarMensaje(mensaje)}
              disabled={!mensaje.trim() || isCargando}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white p-6 md:p-8 rounded-3xl transition-colors shadow-lg"
            >
              <Send className="w-12 h-12 md:w-16 md:h-16" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}