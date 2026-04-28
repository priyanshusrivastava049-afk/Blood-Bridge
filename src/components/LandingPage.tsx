import { motion } from 'framer-motion';
import { Droplets, Shield, Zap, Globe, Heart, ChevronRight, Activity, Users, Hospital, ShieldCheck } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Sphere, PerspectiveCamera } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function BloodCell({ position, scale, speed, distort }: any) {
  const mesh = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    mesh.current.rotation.x = Math.cos(time / 4) * 0.2;
    mesh.current.rotation.y = Math.sin(time / 2) * 0.2;
  });

  return (
    <Float speed={speed} rotationIntensity={1.5} floatIntensity={2}>
      <Sphere ref={mesh} args={[1, 64, 64]} position={position} scale={scale}>
        <MeshDistortMaterial
          color="#E8001A"
          speed={speed}
          distort={distort}
          radius={1}
          roughness={0.2}
          metalness={0.8}
          emissive="#550000"
        />
      </Sphere>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#E8001A" />
      
      <BloodCell position={[-4, 2, 0]} scale={2.2} speed={1.5} distort={0.4} />
      <BloodCell position={[5, -1, 2]} scale={1.8} speed={2} distort={0.5} />
      <BloodCell position={[-2, -4, -2]} scale={1.2} speed={1} distort={0.3} />
      <BloodCell position={[3, 4, -3]} scale={1.5} speed={1.2} distort={0.4} />
      <BloodCell position={[0, 0, -5]} scale={3} speed={0.8} distort={0.2} />
    </>
  );
}

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="bg-[#07090F] text-[#EEF3FF] min-h-screen font-sans selection:bg-[var(--blood)] selection:text-white relative">
      {/* 3D BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <Canvas>
          <Scene />
        </Canvas>
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Ambient background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[rgba(232,0,26,0.08)] blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[rgba(45,139,255,0.08)] blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--blood-alpha-20)] bg-[var(--blood-alpha-5)] text-[var(--blood)] text-[10px] font-black uppercase tracking-[0.2em] mb-8"
          >
            <div className="w-2 h-2 rounded-full bg-[var(--blood)] animate-pulse"></div>
            Next-Gen Emergency Infrastructure
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8"
          >
            SAVING LIVES<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--blood)] to-[var(--rose)]">ONE PACKET</span> AT A TIME
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-[var(--t2)] max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
          >
            BloodBridge is an AI-orchestrated tactical response network for critical blood supply. 
            Real-time tracking, predictive demand analysis, and instant matching.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <button 
              onClick={onStart}
              className="group relative px-8 py-4 bg-[var(--blood)] text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center gap-3 hover:bg-[var(--crimson)] transition-all shadow-[0_10px_30px_var(--blood-alpha-20)]"
            >
              Initialize Command Center
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center gap-3 text-[var(--t3)] font-black text-[10px] uppercase tracking-widest">
              <span className="w-10 h-px bg-[var(--b)]"></span>
              Or scan to donate
              <span className="w-10 h-px bg-[var(--b)]"></span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="text-2xl font-black text-[var(--t1)]">4.2m</div>
              <div className="text-[10px] font-bold text-[var(--t3)] uppercase tracking-widest">Avg Response</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-[var(--blood)]">98%</div>
              <div className="text-[10px] font-bold text-[var(--t3)] uppercase tracking-widest">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-[var(--t1)]">14k+</div>
              <div className="text-[10px] font-bold text-[var(--t3)] uppercase tracking-widest">Live Donors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-[var(--blue)]">240+</div>
              <div className="text-[10px] font-bold text-[var(--t3)] uppercase tracking-widest">Linked Hospitals</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-32 px-6 bg-[var(--bg2)] border-y border-[var(--b)] grid-dots">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-xl">
              <div className="text-[var(--blue)] font-black text-[10px] uppercase tracking-[0.3em] mb-4">Tactical Flow</div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-white">How BloodBridge Architected for Emergencies</h2>
            </div>
            <p className="text-[var(--t2)] font-medium max-w-md">Our proprietary matching engine handles the complexity of supply variance and emergency logistics autonomously.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <StepCard 
              num="01" 
              icon={<Shield className="text-[var(--blood)]" />} 
              title="Request Entry" 
              desc="Hospitals log critical blood requirements through an AI-verified tactical portal." 
            />
            <StepCard 
              num="02" 
              icon={<Zap className="text-[var(--gold)]" />} 
              title="Intelligent Vectoring" 
              desc="Cortex Engine analyzes donor proximity, blood compatibility, and traffic telemetry." 
            />
            <StepCard 
              num="03" 
              icon={<Globe className="text-[var(--blue)]" />} 
              title="Autonomous Dispatch" 
              desc="Precise notifications are routed to ideal donors via encrypted blockchain handshake." 
            />
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-white mb-6">Mission Critical Infrastructure</h2>
              <p className="text-[var(--t2)] max-w-2xl mx-auto">Engineered to perform in high-stress clinical environments where every second dictates the outcome.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard icon={<Activity size={24} />} title="Live Telemetry" desc="Every donor is tracked with sub-meter precision to ensure accurate ETAs and routing." />
              <FeatureCard icon={<Users size={24} />} title="Donor Engagement" desc="Gamified metrics and transparency build a high-retention donor community." />
              <FeatureCard icon={<Hospital size={24} />} title="EHR Core Sync" desc="Native integration with major hospital management systems for zero-latency data." />
              <FeatureCard icon={<Droplets size={24} />} title="Blood Logic" desc="Proprietary O-negative reserve management protects the city's most critical assets." />
              <FeatureCard icon={<ShieldCheck size={24} />} title="Verified Chain" desc="Blockchain-backed donation logging ensures complete provenance and trust." />
              <FeatureCard icon={<Zap size={24} />} title="Predictive AI" desc="ML models forecast city-wide shortages up to 72 hours before they occur." />
           </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto glass p-16 rounded-[40px] text-center border border-[var(--b)] shadow-blue-glow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--blue-alpha-10)] blur-[100px] pointer-events-none"></div>
          <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">Ready to fortify your city's emergency network?</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <button onClick={onStart} className="btn btn-blood !rounded-2xl !px-10 !py-5 uppercase text-sm font-black tracking-widest">Access Dashboard</button>
             <button className="btn btn-ghost !rounded-2xl !px-10 !py-5 uppercase text-sm font-black tracking-widest">Partner with us</button>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-[var(--b)] px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--blood)] rounded-xl flex items-center justify-center text-white">
                <Heart size={20} fill="white" />
              </div>
              <span className="font-black tracking-tighter text-xl">BLOOD<span className="text-[var(--t2)]">BRIDGE</span></span>
           </div>
           <div className="flex items-center gap-8 text-[11px] font-bold text-[var(--t3)] uppercase tracking-widest">
              <a href="#" className="hover:text-white">Status</a>
              <a href="#" className="hover:text-white">Security</a>
              <a href="#" className="hover:text-white">Network</a>
              <a href="#" className="hover:text-white">Legal</a>
           </div>
           <div className="text-[10px] font-mono text-[var(--t3)]">Cortex v4.51.0 | Signal Strength: High</div>
        </div>
      </footer>
    </div>
  );
}

function StepCard({ num, icon, title, desc }: any) {
  return (
    <div className="p-8 bg-[var(--bg3)] border border-[var(--b)] rounded-3xl group hover:border-[var(--blood-alpha-40)] transition-all">
      <div className="flex justify-between items-start mb-10">
        <div className="w-14 h-14 bg-[var(--bg2)] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className="text-4xl font-black text-[var(--t3)] opacity-20 font-mono italic">{num}</div>
      </div>
      <h3 className="text-xl font-black mb-4 text-white uppercase tracking-tight">{title}</h3>
      <p className="text-[var(--t2)] text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="p-8 border border-[var(--b)] rounded-3xl hover:bg-[var(--bg3)] transition-all">
       <div className="text-[var(--blue)] mb-6">{icon}</div>
       <h3 className="text-lg font-black mb-3 text-white">{title}</h3>
       <p className="text-[var(--t3)] text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
