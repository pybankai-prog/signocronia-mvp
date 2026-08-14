'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Mic, MicOff, Volume2, ArrowLeft, Send, Loader2, AlertCircle } from 'lucide-react';

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

  const desbloquearAudio = () => {
    if ('speechSynthesis' in window) {
      const dummy = new SpeechSynthesisUtterance('');
      window.speechSynthesis.speak(dummy);
    }
  };

  const enviarMensaje = async (textoAEnviar: string) => {
    if (!textoAEnviar.trim()) return;

    if (historial.length === 0) desbloquearAudio();

    const nuevoHistorial = [...historial, { rol: 'usuario', texto: textoAEnviar }];
    setHistorial(nuevoHistorial);
    setMensaje('');
    setIsCargando(true);

    try {
      // 1. LEEMOS LA LLAVE DE GROQ
      const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
      if (!apiKey) {
        throw new Error("Llave de Groq no detectada.");
      }

      // 2. PREPARAMOS LA MEMORIA PARA GROQ
      const historialParaGroq = nuevoHistorial.filter(m => m.rol !== 'sistema').map(m => ({
        role: m.rol === 'usuario' ? 'user' : 'assistant',
        content: m.texto
      }));

      // 3. INSTRUCCIONES DE PERSONALIDAD
      const instruccionSistema = {
        role: "system",
        content: "Eres un asistente virtual empático para adultos mayores en Perú. Trata de 'Usted'. Regla ESTRICTA: Tus respuestas deben ser MUY cortas (máximo 2 oraciones). Cero palabras técnicas."
      };

      // 4. LLAMAMOS A GROQ DIRECTAMENTE (Súper rápido)
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3-8b-8192", // Modelo ultra rápido
          messages: [instruccionSistema, ...historialParaGroq],
          temperature: 0.7,
          max_tokens: 150
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Error conectando a Groq");
      }

      const data = await response.json();
      const respuestaIA = data.choices[0].message.content;

      // 5. GUARDAMOS Y HABLAMOS
      setHistorial([...nuevoHistorial, { rol: 'asistente', texto: respuestaIA }]);
      leerEnVozAlta(respuestaIA); 

    } catch (error: any) {
      console.error("Error técnico:", error);
      const mensajeAmigable = `ERROR REAL: ${error.message}`;
      setHistorial([...nuevoHistorial, { rol: 'sistema', texto: mensajeAmigable }]);
    } finally {
      setIsCargando(false);
    }
  };

  const leerEnVozAlta = (texto: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textoLimpio = texto.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}]/gu, '');
      const utterance = new SpeechSynthesisUtterance(textoLimpio);
      utterance.lang = 'es-PE';
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
      <header className="bg-[#002244] p-4 md:p-6 shadow-md flex items-center gap-4 md:gap-6 fixed top-0 w-full z-20">
        <Link href="/" className="bg-white/10 p-3 md:p-4 rounded-full text-white hover:bg-white/20 transition-colors shrink-0">
          <ArrowLeft className="w-6 h-6 md:w-12 md:h-12" />
        </Link>
        <div className="min-w-0">
          <h1 className="text-2xl md:text-5xl font-extrabold text-white truncate">Su Asistente Personal</h1>
          <p className="text-sm md:text-2xl text-yellow-300 mt-1 md:mt-2 font-medium truncate">Toque el micrófono amarillo.</p>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-10 overflow-y-auto space-y-6 max-w-5xl mx-auto w-full pt-28 md:pt-36 pb-[280px] md:pb-48">
        {historial.length === 0 && (
          <div className="text-center mt-10 md:mt-20">
            <Volume2 className="w-16 h-16 md:w-24 md:h-24 text-white/20 mx-auto mb-4 md:mb-6" />
            <p className="text-xl md:text-4xl text-white/50 font-bold leading-relaxed">
              ¡Hola! Estoy listo para ayudarle. <br className="hidden md:block"/> Presione el micrófono abajo.
            </p>
          </div>
        )}

        {historial.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.rol === 'usuario' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-4 md:p-8 rounded-3xl max-w-[90%] shadow-lg ${
              msg.rol === 'usuario' 
              ? 'bg-blue-500 text-white rounded-br-none' 
              : msg.rol === 'sistema'
              ? 'bg-amber-100 text-amber-900 border-4 border-amber-400 rounded-bl-none'
              : 'bg-white text-black rounded-bl-none border-4 border-yellow-400'
            }`}>
              {msg.rol === 'sistema' && <AlertCircle className="w-6 h-6 md:w-10 md:h-10 mb-2 md:mb-4 text-amber-600" />}
              <p className="text-lg md:text-4xl font-medium leading-relaxed">{msg.texto}</p>
            </div>
          </div>
        ))}
        {isCargando && (
          <div className="flex justify-start">
            <div className="bg-white p-4 md:p-6 rounded-3xl rounded-bl-none shadow-lg flex items-center gap-3">
              <Loader2 className="w-6 h-6 md:w-10 md:h-10 animate-spin text-[#003366]" />
              <p className="text-lg md:text-2xl font-medium text-slate-500">Escribiendo...</p>
            </div>
          </div>
        )}
        <div ref={chatFinalRef} />
      </main>

      <footer className="bg-[#002244] p-4 md:p-8 border-t-4 md:border-t-8 border-yellow-400 fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-3 md:gap-6">
          <button 
            onClick={toggleMicrofono}
            className={`w-full md:w-auto p-4 md:p-8 rounded-full flex items-center justify-center transition-all shadow-[0_5px_15px_rgba(0,0,0,0.4)] ${
              isEscuchando 
              ? 'bg-rose-500 text-white animate-pulse' 
              : 'bg-[#FFD700] hover:bg-[#FFC000] text-black'
            }`}
          >
            {isEscuchando ? <MicOff className="w-10 h-10 md:w-16 md:h-16" /> : <Mic className="w-10 h-10 md:w-16 md:h-16" />}
          </button>
          
          <div className="flex flex-1 w-full gap-2 md:gap-4">
            <input 
              type="text" 
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && enviarMensaje(mensaje)}
              placeholder="O escriba aquí..."
              className="flex-1 min-w-0 text-base md:text-3xl p-4 md:p-8 rounded-2xl md:rounded-3xl font-medium text-black focus:outline-none focus:ring-4 focus:ring-blue-400"
            />
            <button 
              onClick={() => enviarMensaje(mensaje)}
              disabled={!mensaje.trim() || isCargando}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white p-4 md:p-8 rounded-2xl md:rounded-3xl transition-colors shadow-lg shrink-0"
            >
              <Send className="w-6 h-6 md:w-16 md:h-16" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}