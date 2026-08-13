'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { BookOpen, Settings, LogOut, Menu, X, Play, Square, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import * as THREE from 'three';

// Componente 3D del Avatar Holográfico
function AvatarRobot({ isTranslating }: { isTranslating: boolean }) {
  const rightHandRef = useRef<THREE.Mesh>(null);
  const leftHandRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (isTranslating) {
      if (rightHandRef.current && leftHandRef.current && headRef.current) {
        rightHandRef.current.position.y = Math.sin(t * 15) * 0.4 + 0.5;
        rightHandRef.current.position.x = 1.2 + Math.cos(t * 10) * 0.3;
        
        leftHandRef.current.position.y = Math.cos(t * 12) * 0.4 + 0.5;
        leftHandRef.current.position.x = -1.2 + Math.sin(t * 14) * 0.3;
        
        headRef.current.rotation.y = Math.sin(t * 5) * 0.1;
      }
    } else {
      if (rightHandRef.current && leftHandRef.current && headRef.current) {
        rightHandRef.current.position.y = Math.sin(t * 2) * 0.1;
        rightHandRef.current.position.x = 1.5;
        
        leftHandRef.current.position.y = Math.sin(t * 2 + 1) * 0.1;
        leftHandRef.current.position.x = -1.5;
        
        headRef.current.rotation.y = Math.sin(t * 0.5) * 0.05;
      }
    }
  });

  return (
    // <-- AQUÍ ESTÁ EL CAMBIO: x=1.5 para moverlo a la derecha
    <group position={[1.5, -1, 0]}>
      <mesh ref={headRef} position={[0, 2, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#4f46e5" metalness={0.5} roughness={0.2} emissive="#4f46e5" emissiveIntensity={0.2} />
      </mesh>
      
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 1.5]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
      </mesh>

      <mesh ref={rightHandRef} position={[1.5, 0, 0]}>
        <boxGeometry args={[0.2, 0.4, 0.1]} />
        <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={0.5} />
      </mesh>

      <mesh ref={leftHandRef} position={[-1.5, 0, 0]}>
        <boxGeometry args={[0.2, 0.4, 0.1]} />
        <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

export default function AvatarPage() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [texto, setTexto] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const simulateTranslation = () => {
    if (!texto.trim()) return;
    setIsTranslating(true);
    const timeToTranslate = texto.length * 300; 
    
    setTimeout(() => {
      setIsTranslating(false);
    }, timeToTranslate);
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

      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-900">
        <div className="flex-1 relative cursor-move">
          <Canvas camera={{ position: [0, 1.5, 6], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <Environment preset="city" />
            <AvatarRobot isTranslating={isTranslating} />
            {/* <-- CAMBIO: La sombra también se mueve a x=1.5 */}
            <ContactShadows position={[1.5, -1, 0]} opacity={0.5} scale={10} blur={2} far={4} />
            <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} />
          </Canvas>
          
          <div className="absolute top-6 left-6 right-6 md:right-auto md:w-96 pointer-events-auto">
             <div className="bg-slate-800/80 backdrop-blur-md p-6 rounded-2xl border border-slate-700 shadow-2xl">
                <h1 className="text-xl font-bold text-white mb-2">Traductor Visual 3D</h1>
                <p className="text-slate-400 text-sm mb-4">Escribe un texto y el motor WebGL simulará la dactilología espacial.</p>
                
                <textarea 
                  rows={3}
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  placeholder="Ingresa texto para el avatar..."
                  className="w-full p-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white outline-none focus:border-emerald-500 mb-4 resize-none placeholder:text-slate-500"
                ></textarea>

                <button 
                  onClick={simulateTranslation}
                  disabled={isTranslating}
                  className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    isTranslating 
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                    : 'bg-emerald-500 hover:bg-emerald-600 text-slate-900 shadow-lg shadow-emerald-500/20'
                  }`}
                >
                  {isTranslating ? <><Square className="w-5 h-5 animate-spin" /> Procesando Señas...</> : <><Play className="w-5 h-5" /> Iniciar Traducción 3D</>}
                </button>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}