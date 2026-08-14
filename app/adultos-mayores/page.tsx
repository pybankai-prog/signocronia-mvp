'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Mic, MicOff, Volume2, ArrowLeft, Send, Loader2, AlertCircle } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function AdultosMayoresPage() {
  const [mensaje, setMensaje] = useState('');
  const [historial, setHistorial] = useState<{rol: string, texto: string}[]>([]);
  const [isCargando, setIsCargando] = useState(false);
  const [isEscuchando, setIsEscuchando] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const chatFinalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatFinalRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [historial]);

  // Hack para desbloquear el audio en navegadores estrictos
  const desbloquearAudio = () => {
    if ('speechSynthesis' in window) {
      const dummy = new SpeechSynthesisUtterance('');
      window.speechSynthesis.speak(dummy);
    }
  };

  const enviarMensaje = async (textoAEnviar: string) => {
    if (!textoAEnviar.trim()) return;

    // Desbloqueamos el audio en el primer clic
    if (historial.length === 0) desbloquearAudio();

    const nuevoHistorial = [...historial, { rol: 'usuario', texto: textoAEnviar }];
    setHistorial(nuevoHistorial);
    setMensaje('');
    setIsCargando(true);

    try {
      // 1. VERIFICAR QUE LA LLAVE EXISTA
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Falta la Llave de API. Por favor, asegúrate de haber creado el archivo .env.local y de haber REINICIADO tu servidor (Ctrl+C y npm run dev).");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        systemInstruction: "Eres un asistente virtual diseñado exclusivamente para adultos mayores. Tu objetivo es acompañar y ayudar. Tono: extremadamente paciente, respetuoso (trata de 'Usted'), afectuoso. Regla ESTRICTA: Tus respuestas deben ser MUY cortas (máximo 2 o 3 oraciones). Cero palabras técnicas, cero anglicismos (no digas link, app, click). Si el usuario se frustra, cálmalo diciendo 'No se preocupe, vamos paso a paso'. Cada cierto tiempo recuérdale beber agua o descansar la vista."
      });

      const chat = model.startChat({
        history: nuevoHistorial.filter(m => m.rol !== 'sistema').map(m => ({
          role: m.rol === 'usuario' ? 'user' : 'model',
          parts: [{ text: m.texto }],
        })),
      });

      const result = await chat.sendMessage(textoAEnviar);
      const respuestaIA = result.response.text();

      setHistorial([...nuevoHistorial, { rol: 'asistente', texto: respuestaIA }]);
      leerEnVozAlta(respuestaIA); 

    } catch (error: any) {
      console.error("Error técnico de Gemini:", error);
      const motivo = error.message || "Error desconocido de conexión.";
      setHistorial([...nuevoHistorial, { rol: 'sistema', texto: `⚠️ Problema Técnico: ${motivo}` }]);
    } finally {
      setIsCargando(false);
    }
  };

  const leerEnVozAlta = (texto: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Quitamos emojis e íconos para que la voz no los lea raro
      const textoLimpio = texto.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}]/gu, '');
      
      const utterance = new SpeechSynthesisUtterance(textoLimpio);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleMicrofono = () => {
    if (historial.length === 0) desbloquearAudio();
    
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
      enviarMensaje(transcripcion); 
    };

    recognition.onerror = () => setIsEscuchando(false);
    recognition.onend = () => setIsEscuchando(false);

    recognition.start();
  };

  return (
    <div className="min-h-screen bg-[#003366] font-sans flex flex-col">
      <header className="bg-[#002244] p-6 shadow-md flex items-center gap-6">
        <Link href="/" className="bg-white/10 p-4 rounded-full text-white hover:bg-white/20 transition-colors">
          <ArrowLeft className="w-8 h-8 md:w-12 md:h-12" />
        </Link>
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white">Su Asistente Personal</h1>
          <p className="text-xl md:text-2xl text-yellow-300 mt-2 font-medium">Toque el micrófono amarillo para hablar conmigo.</p>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto space-y-8 max-w-5xl mx-auto w-full pb-32">
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
              : msg.rol === 'sistema'
              ? 'bg-rose-100 text-rose-800 border-4 border-rose-400 rounded-bl-none'
              : 'bg-white text-black rounded-bl-none border-4 border-yellow-400'
            }`}>
              {msg.rol === 'sistema' && <AlertCircle className="w-10 h-10 mb-4 text-rose-600" />}
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

      <footer className="bg-[#002244] p-6 md:p-10 border-t-8 border-yellow-400 fixed bottom-0 w-full z-10">
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