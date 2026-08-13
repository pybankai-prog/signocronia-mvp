'use client';

import React, { useState, useRef, Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF } from '@react-three/drei';
import { BookOpen, Settings, LogOut, Menu, X, Play, Square, Eye, Hand } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import * as THREE from 'three';

// ---------------------------------------------------------
// EL AVATAR HUMANO (Con Animación Procedural y Seña "Hola")
// ---------------------------------------------------------
function AvatarHumano({ modoAnimacion }: { modoAnimacion: 'reposo' | 'traduciendo' | 'hola' }) {
  const { scene } = useGLTF('/avatar.glb'); 
  const avatarRef = useRef<THREE.Group>(null);
  
  // Referencias a los huesos del avatar
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

    // Romper la Pose T al inicio
    if (rightArm.current) rightArm.current.rotation.z = -1.2;
    if (leftArm.current) leftArm.current.rotation.z = 1.2;
  }, [scene]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (avatarRef.current) {
      avatarRef.current.position.y = -1.5 + Math.sin(t * 2) * 0.02; // Respiración
    }

    if (modoAnimacion === 'hola') {
      // SEÑA REAL: "Hola" (Saludo)
      // Levanta el brazo derecho y dobla el codo
      if (rightArm.current) {
        rightArm.current.rotation.z = -0.2; // Levanta el brazo a nivel del hombro
        rightArm.current.rotation.y = Math.sin(t * 8) * 0.4; // Movimiento de saludo (saluda con la mano)
      }
      if (rightForeArm.current) {
        rightForeArm.current.rotation.x = -1.0; // Dobla el codo hacia arriba
      }
      // Brazo izquierdo se queda abajo
      if (leftArm.current) leftArm.current.rotation.z = 1.2;
      if (leftForeArm.current) leftForeArm.current.rotation.x = -0.1;
      
    } else if (modoAnimacion === 'traduciendo') {
      // SEÑA PROCEDURAL: Simulación rápida
      if (rightArm.current) rightArm.current.rotation.z = -0.5 + Math.sin(t * 10) * 0.2;
      if (rightForeArm.current) rightForeArm.current.rotation.x = -1.2 + Math.cos(t * 15) * 0.5;
      
      if (leftArm.current) leftArm.current.rotation.z = 0.5 + Math.sin(t * 12) * 0.2;
      if (leftForeArm.current) leftForeArm.current.rotation.x = -1.0 + Math.cos(t * 14) * 0.4;
      
    } else {
      // REPOSO: Brazos abajo relajados
      if (rightArm.current) rightArm.current.rotation.z = -1.2 + Math.sin(t) * 0.05;
      if (rightForeArm.current) rightForeArm.current.rotation.x = -0.1;
      
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
  
  // Estado que controla qué hace el avatar
  const [modoAnimacion, setModoAnimacion] = useState<'reposo' | 'traduciendo' | 'hola'>('reposo');

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const simulateTranslation = () => {
    if (!texto.trim()) return;
    setModoAnimacion('traduciendo');
    setTimeout(() => setModoAnimacion('reposo'), texto.length * 300);
  };

  // Función exclusiva para el saludo "Hola"
  const decirHola = () => {
    setModoAnimacion('hola');
    // Saluda durante 3 segundos y luego vuelve a reposo
    setTimeout(() => setModoAnimacion('reposo'), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <div className="md:hidden bg-indigo-900 text-white p-4 flex justify-between items-center shadow-md z-20">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Signocronía</h2>
          <p className="text-indigo-300 text-xs">Módulo Visual 3D</p>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-indigo-800 rounded-lg">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <aside className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex w-full md:w-64 bg-indigo-900 text-white flex-col md:absolute md:relative z-30 h-full`}>
        <div className="p-6 hidden md:block">
          <h2 className="text-xl font-bold tracking-tight">Signocronía</h2>
          <p className="text-indigo-300 text-xs mt-1">Panel Institucional</p>
        </div>
        <nav className="flex-1 px-4 py-6 md:py-0 space-y-2">
          <a href="/dashboard" className="flex items-center gap-3 hover:bg-indigo-800/50 text-indigo-100 px-4 py-3 rounded-lg transition-colors">
            <BookOpen className="w-5 h-5 text-teal-400" />
            <span className="font-medium">Mis Cursos</span>
          </a>
          <a href="/haptico" className="flex items-center gap-3 hover:bg-indigo-800/50 text-indigo-100 px-4 py-3 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
            <span>Módulo Háptico</span>
          </a>
          <a href="#" className="flex items-center gap-3 bg-indigo-800 text-white px-4 py-3 rounded-lg transition-colors">
            <Eye className="w-5 h-5 text-emerald-400" />
            <span>Avatar 3D</span>
          </a>
        </nav>
        <div className="p-4 border-t border-indigo-800 mt-auto">
          <button onClick={handleSignOut} className="flex items-center gap-3 text-indigo-200 hover:text-white transition-colors w-full px-4 py-2">
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
        
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-0 md:top-6 md:right-6 md:left-auto md:bottom-auto md:w-96 z-10 pointer-events-auto">
             <div className="bg-slate-800/90 backdrop-blur-md p-5 md:p-6 rounded-2xl border border-slate-700 shadow-2xl mb-4 md:mb-0">
                <h1 className="text-xl font-bold text-white mb-2">Traductor Visual 3D</h1>
                <p className="text-slate-400 text-sm mb-4 hidden md:block">Escribe un texto y el motor WebGL simulará la dactilología espacial.</p>
                
                <textarea 
                  rows={2}
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  placeholder="Ingresa texto..."
                  className="w-full p-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white outline-none focus:border-emerald-500 mb-4 resize-none placeholder:text-slate-500"
                ></textarea>

                {/* Contenedor de Botones (Traducción + Hola) */}
                <div className="flex gap-3">
                  <button 
                    onClick={simulateTranslation}
                    disabled={modoAnimacion !== 'reposo'}
                    className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                      modoAnimacion !== 'reposo' 
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                      : 'bg-emerald-500 hover:bg-emerald-600 text-slate-900 shadow-lg shadow-emerald-500/20'
                    }`}
                  >
                    {modoAnimacion === 'traduciendo' ? <><Square className="w-5 h-5 animate-spin" /> Procesando...</> : <><Play className="w-5 h-5" /> Traducir</>}
                  </button>

                  <button 
                    onClick={decirHola}
                    disabled={modoAnimacion !== 'reposo'}
                    className={`py-3 px-4 rounded-xl font-bold flex items-center justify-center transition-all ${
                      modoAnimacion !== 'reposo' 
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                      : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    }`}
                  >
                    <Hand className="w-5 h-5 mr-1" /> Hola
                  </button>
                </div>
             </div>
        </div>
      </main>
    </div>
  );
}