'use client';

import React, { useState, useRef, Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF } from '@react-three/drei';
import { FolderOpen, Settings, LogOut, Menu, X, Play, Square, Eye, Hand, Sparkles, Mic, MicOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import * as THREE from 'three';

// ---------------------------------------------------------
// EL AVATAR HUMANO (Matemáticas de Esqueleto Corregidas)
// ---------------------------------------------------------
function AvatarHumano({ modoAnimacion }: { modoAnimacion: 'reposo' | 'traduciendo' | 'hola' }) {
  const { scene } = useGLTF('/avatar.glb'); 
  const avatarRef = useRef<THREE.Group>(null);
  
  const rightArm = useRef<THREE.Object3D | null>(null);
  const leftArm = useRef<THREE.Object3D | null>(null);
  const rightForeArm = useRef<THREE.Object3D | null>(null);
  const leftForeArm = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Bone).isBone) {
        const name = child.name.toLowerCase();
        if (name.includes('rightarm') || name.includes('right_arm')) rightArm.current = child;
        if (name.includes('leftarm') || name.includes('left_arm')) leftArm.current = child;
        if (name.includes('rightforearm') || name.includes('right_forearm')) rightForeArm.current = child;
        if (name.includes('leftforearm') || name.includes('left_forearm')) leftForeArm.current = child;
      }
    });

    if (rightArm.current) rightArm.current.rotation.z = -1.2;
    if (leftArm.current) leftArm.current.rotation.z = 1.2;
  }, [scene]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (avatarRef.current) avatarRef.current.position.y = -1.5 + Math.sin(t * 2) * 0.02;

    if (modoAnimacion === 'hola') {
      // CORRECCIÓN DEL SALUDO "HOLA"
      if (rightArm.current) {
        rightArm.current.rotation.z = -0.5; // Levanta el hombro a la mitad
        rightArm.current.rotation.x = -0.5; // Lo adelanta hacia el pecho
      }
      if (rightForeArm.current) {
        rightForeArm.current.rotation.x = -1.8; // Dobla el codo hacia la cara
        rightForeArm.current.rotation.z = Math.sin(t * 10) * 0.4; // Mueve la mano de lado a lado
      }
      
      if (leftArm.current) leftArm.current.rotation.z = 1.2;
      if (leftForeArm.current) leftForeArm.current.rotation.x = -0.1;
      
    } else if (modoAnimacion === 'traduciendo') {
      if (rightArm.current) rightArm.current.rotation.z = -0.5 + Math.sin(t * 10) * 0.2;
      if (rightForeArm.current) rightForeArm.current.rotation.x = -1.2 + Math.cos(t * 15) * 0.5;
      
      if (leftArm.current) leftArm.current.rotation.z = 0.5 + Math.sin(t * 12) * 0.2;
      if (leftForeArm.current) leftForeArm.current.rotation.x = -1.0 + Math.cos(t * 14) * 0.4;
      
    } else {
      if (rightArm.current) rightArm.current.rotation.z = -1.2 + Math.sin(t) * 0.05;
      if (rightArm.current) rightArm.current.rotation.x = 0; // Resetea el eje X
      if (rightForeArm.current) rightForeArm.current.rotation.x = -0.1;
      if (rightForeArm.current) rightForeArm.current.rotation.z = 0; // Resetea el eje Z
      
      if (leftArm.current) leftArm.current.rotation.z = 1.2 + Math.sin(t) * 0.05;
      if (leftForeArm.current) leftForeArm.current.rotation.x = -0.1;
    }
  });

  return <primitive ref={avatarRef} object={scene} scale={1.5} position={[0, -1.5, 0]} />;
}

export default function AvatarPage() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [texto, setTexto] = useState('');
  const [modoAnimacion, setModoAnimacion] = useState<'reposo' | 'traduciendo' | 'hola'>('reposo');
  
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const simulateTranslation = () => {
    if (!texto.trim()) return;
    setModoAnimacion('traduciendo');
    setTimeout(() => setModoAnimacion('reposo'), texto.length * 300);
  };

  const decirHola = () => {
    setModoAnimacion('hola');
    setTimeout(() => setModoAnimacion('reposo'), 3000);
  };

  // Función de Reconocimiento de Voz con Capturador de Errores
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Tu navegador no soporta el reconocimiento de voz. Intenta desde Google Chrome.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'es-PE';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => setIsListening(true);
      
      recognition.onresult = (event: any) => {
        let transcripcionActual = '';
        for (let i = 0; i < event.results.length; i++) {
          transcripcionActual += event.results[i][0].transcript;
        }
        setTexto(transcripcionActual);
      };

      // DETECTOR DE ERRORES EXACTOS
      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          alert('Permiso denegado. Tienes que permitir el uso del micrófono en la configuración de tu navegador.');
        } else {
          alert(`El micrófono se detuvo por este error: ${event.error}`);
        }
      };

      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (error) {
      console.error(error);
      alert('Hubo un problema al encender el micrófono de tu dispositivo.');
      setIsListening(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <div className="md:hidden bg-indigo-900 text-white p-4 flex justify-between items-center shadow-md z-20">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-300" />
          <div>
            <h2 className="text-xl font-bold tracking-tight">Signocronía</h2>
            <p className="text-indigo-300 text-xs">Espacio Inclusivo</p>
          </div>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-indigo-800 rounded-lg">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <aside className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex w-full md:w-64 bg-indigo-900 text-white flex-col md:absolute md:relative z-30 h-full shadow-xl`}>
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
          <a href="/haptico" className="flex items-center gap-3 hover:bg-indigo-800/50 text-indigo-100 px-4 py-3 rounded-xl transition-colors">
            <Settings className="w-5 h-5" />
            <span>Traductor Háptico</span>
          </a>
          <a href="#" className="flex items-center gap-3 bg-indigo-800 text-white px-4 py-3 rounded-xl transition-colors shadow-inner border border-indigo-700/50">
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

      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-900 relative">
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 1.5, 6], fov: 45 }}>
            <ambientLight intensity={0.6} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
            <Environment preset="city" />
            <Suspense fallback={null}>
              <AvatarHumano modoAnimacion={modoAnimacion} />
            </Suspense>
            <ContactShadows position={[0, -1.2, 0]} opacity={0.6} scale={10} blur={2} far={4} />
            <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} />
          </Canvas>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-0 md:top-6 md:right-6 md:left-auto md:bottom-auto md:w-[420px] z-10 pointer-events-auto">
             <div className="bg-slate-800/90 backdrop-blur-md p-5 md:p-6 rounded-3xl border border-slate-700 shadow-2xl mb-4 md:mb-0">
                <h1 className="text-xl font-bold text-white mb-2">Intérprete Virtual 3D</h1>
                <p className="text-slate-400 text-sm mb-4 hidden md:block">Dicta o escribe un texto para ver la simulación de señas.</p>
                
                <div className="relative mb-4">
                  <textarea 
                    rows={3}
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    placeholder="Escribe o dicta tu mensaje..."
                    className="w-full p-4 pr-14 bg-slate-900/60 border-2 border-slate-700 rounded-2xl text-white outline-none focus:border-emerald-500 resize-none font-medium placeholder:text-slate-500"
                  ></textarea>
                  
                  <button 
                    onClick={toggleListening}
                    className={`absolute bottom-4 right-4 p-3 rounded-xl transition-all shadow-md ${
                      isListening 
                      ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30 animate-pulse' 
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                    }`}
                    title={isListening ? 'Detener micrófono' : 'Hablar por micrófono'}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={simulateTranslation}
                    disabled={modoAnimacion !== 'reposo' || !texto.trim()}
                    className={`flex-1 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                      modoAnimacion !== 'reposo' || !texto.trim()
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                      : 'bg-emerald-500 hover:bg-emerald-600 text-slate-900 shadow-lg shadow-emerald-500/20'
                    }`}
                  >
                    {modoAnimacion === 'traduciendo' ? <><Square className="w-5 h-5 animate-spin" /> Simulando...</> : <><Play className="w-5 h-5" /> Traducir</>}
                  </button>

                  <button 
                    onClick={decirHola}
                    disabled={modoAnimacion !== 'reposo'}
                    className={`py-3.5 px-5 rounded-xl font-bold flex items-center justify-center transition-all ${
                      modoAnimacion !== 'reposo' 
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                      : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    }`}
                  >
                    <Hand className="w-5 h-5 mr-1.5" /> Hola
                  </button>
                </div>
             </div>
        </div>
      </main>
    </div>
  );
}