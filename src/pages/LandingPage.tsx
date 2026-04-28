
import React, { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import { ArrowRight, MapPin, Globe, Zap, ShieldCheck } from 'lucide-react';

// 3D Animated Blood Cells Component
function BloodCells() {
  return (
    <>
      {/* Main Large Cell */}
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[1, 64, 64]} position={[0, 0, 0]} scale={2.4}>
          <MeshDistortMaterial
            color="#d32f2f"
            speed={3}
            distort={0.45}
            radius={1}
            roughness={0.1}
            metalness={0.5}
          />
        </Sphere>
      </Float>
      
      {/* Smaller Floating Cells */}
      <Float speed={2} position={[2.5, -1, -1] as [number, number, number]} scale={0.6}>
        <Sphere args={[1, 32, 32]}>
          <meshStandardMaterial color="#8e0000" roughness={0.2} />
        </Sphere>
      </Float>

      <Float speed={1.8} position={[-2.2, 1.5, -2] as [number, number, number]} scale={0.4}>
        <Sphere args={[1, 32, 32]}>
          <meshStandardMaterial color="#ff1744" roughness={0.2} />
        </Sphere>
      </Float>
    </>
  );
}

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-full bg-[#050505] text-white overflow-hidden font-sans">
      
      {/* LAYER 1: 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#ff0000" />
          <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />
          <Suspense fallback={null}>
            <BloodCells />
          </Suspense>
          {/* Subtle vignette gradient overlay */}
          <mesh position={[0, 0, -1]}>
            <planeGeometry args={[20, 20]} />
            <meshBasicMaterial transparent opacity={0.1} color="black" />
          </mesh>
        </Canvas>
      </div>

      {/* LAYER 2: UI Overlay */}
      <div className="relative z-10 h-full flex flex-col justify-between p-10 md:p-16 pointer-events-none">
        
        {/* Header Status */}
        <div className="flex items-center gap-6 text-[10px] font-mono tracking-[0.3em] text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
            <span>NETWORK LIVE</span>
          </div>
          <span className="hidden md:inline">99.98% UPTIME · 142 NODES</span>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl pointer-events-auto">
            <h1 className="text-7xl md:text-[110px] font-black italic tracking-tighter leading-[0.9] mb-6">
              BLOOD<span className="text-red-600 drop-shadow-[0_0_30px_rgba(220,38,38,0.5)]">BRIDGE</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 font-light max-w-lg leading-relaxed mb-10">
              A real-time emergency blood logistics layer—routing units, donors, and hospitals through a single tactical network.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-3 px-10 py-5 bg-red-600 hover:bg-red-700 font-bold uppercase text-xs tracking-widest transition-all rounded-sm cursor-pointer"
              >
                Enter Dashboard <ArrowRight size={18} />
              </button>
              <button 
                onClick={() => navigate('/map')}
                className="flex items-center gap-3 px-10 py-5 bg-white/5 border border-white/10 backdrop-blur-md font-bold uppercase text-xs tracking-widest hover:bg-white/10 transition-all rounded-sm cursor-pointer"
              >
                Live Map <MapPin size={18} className="text-red-500" />
              </button>
            </div>

            <div className="flex flex-wrap gap-4">
              <Tag icon={<Globe size={14}/>} label="Neural Dispatch" />
              <Tag icon={<Zap size={14}/>} label="Zero Latency" />
              <Tag icon={<ShieldCheck size={14}/>} label="Secure Vectors" />
            </div>
          </div>

          {/* Right Data Panel */}
          <div className="w-full max-w-md bg-black/40 border border-white/10 backdrop-blur-2xl rounded-[2.5rem] p-10 pointer-events-auto shadow-2xl">
            <div className="flex justify-between items-start mb-10 pb-6 border-b border-white/5">
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Status</p>
                <h3 className="text-2xl font-bold italic tracking-tight">BloodFlow Sync<span className="text-red-600">.</span></h3>
              </div>
              <div className="px-3 py-1 border border-red-500/30 rounded text-[9px] font-black text-red-500 uppercase tracking-tighter animate-pulse">Pulse</div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <StatCard label="Active Requests" value="128" desc="Rolling 15m window" />
              <StatCard label="Avg Dispatch" value="4.6m" desc="AI-optimized" />
              <StatCard label="Donor Ping" value="1.2s" desc="Median response" />
              <StatCard label="Coverage" value="DEL-NCR" desc="Live telemetry" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/5 pt-8">
          <div className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">
            Terminal Version 4.2.0-Alpha · Authorized Personnel Only
          </div>
          <div className="text-[10px] font-mono text-slate-400 space-x-4">
            <span>DEEP CRIMSON SYSTEM</span>
            <span>GLASS HUD</span>
            <span>THREE.JS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- UI Sub-Components --- */

const Tag = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-300">
    <span className="text-blue-400">{icon}</span>
    {label}
  </div>
);

const StatCard = ({ label, value, desc }: { label: string, value: string, desc: string }) => (
  <div className="group transition-all">
    <p className="text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-wide group-hover:text-red-500 transition-colors">{label}</p>
    <p className="text-3xl font-black mb-1 group-hover:scale-105 transition-transform origin-left">{value}</p>
    <p className="text-[9px] text-slate-600 font-medium uppercase tracking-tighter leading-none">{desc}</p>
  </div>
);
