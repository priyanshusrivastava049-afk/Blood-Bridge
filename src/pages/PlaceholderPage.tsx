
import React from 'react';
import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  subtitle: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, subtitle }) => {
  return (
    <div className="h-[calc(100vh-120px)] flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-12 hud-card max-w-md w-full"
      >
        <div className="w-20 h-20 rounded-full bg-blue-alpha-10 flex items-center justify-center mx-auto mb-6 shadow-blue-glow border border-blue-alpha-20">
          <Construction size={40} className="text-blue" />
        </div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-2">{title}</h1>
        <p className="text-[10px] text-t3 uppercase font-black tracking-widest mb-8">{subtitle}</p>
        
        <div className="space-y-4">
          <div className="h-1 bg-bg3 rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: "0%" }}
               animate={{ width: "65%" }}
               transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
               className="h-full bg-blue shadow-blue-glow"
             />
          </div>
          <p className="text-[9px] text-t2 uppercase font-black tracking-widest animate-pulse">Synchronizing Neural Vectors...</p>
        </div>
        
        <button 
          onClick={() => window.history.back()}
          className="mt-10 btn btn-ghost w-full py-3 text-[10px] uppercase font-black tracking-[0.2em]"
        >
          Return to Command
        </button>
      </motion.div>
    </div>
  );
};
