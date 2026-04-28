
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Filter, Droplets, MapPin, Phone, MessageSquare, ChevronRight, Activity, ShieldCheck, Heart } from 'lucide-react';
import { MOCK_DONORS } from '../lib/constants';

export const DonorPage = () => {
  const [search, setSearch] = useState('');
  const [bgFilter, setBgFilter] = useState('All');

  const filteredDonors = MOCK_DONORS.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.loc.toLowerCase().includes(search.toLowerCase());
    const matchesBg = bgFilter === 'All' || d.bg === bgFilter;
    return matchesSearch && matchesBg;
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter flex items-center gap-3">
            DONOR NETWORK
            <span className="text-[10px] not-italic font-black border border-green/40 text-green px-2 py-0.5 rounded shadow-neon-green">ENCRYPTED_FEED</span>
          </h1>
          <p className="text-[10px] text-t3 font-black uppercase tracking-[0.4em] mt-2">Verified Neural Registry · Global Blood Source</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-t3" />
            <input 
              type="text"
              placeholder="Search by name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder:text-t3 focus:outline-none focus:border-blue transition-all w-64"
            />
          </div>
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
            {['All', 'O−', 'A+', 'B+'].map(bg => (
              <button
                key={bg}
                onClick={() => setBgFilter(bg)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${bgFilter === bg ? 'bg-blue text-white shadow-neon-blue' : 'text-t3 hover:text-white'}`}
              >
                {bg}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDonors.map((donor, i) => (
          <motion.div
            key={donor.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="hud-card group hover:border-blue/50 transition-all p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <ShieldCheck size={48} className="text-blue" />
            </div>
            
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue/10 border border-blue/20 flex items-center justify-center font-black text-2xl text-blue shadow-neon-blue">
                  {donor.bg}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white italic tracking-tight">{donor.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin size={10} className="text-blue" />
                    <span className="text-[10px] font-black text-t3 uppercase tracking-widest">{donor.loc}</span>
                  </div>
                </div>
              </div>
              <div className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border ${
                donor.status === 'available' ? 'bg-green/10 text-green border-green/30' : 'bg-gold/10 text-gold border-gold/30'
              }`}>
                {donor.status}
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-t3">Last Donation</span>
                <span className="text-white">{donor.lastDon}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-t3">Tactical Range</span>
                <span className="text-blue">{donor.dist} km</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "98%" }}
                  className="h-full bg-blue shadow-neon-blue"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-t1 hover:text-white transition-all flex items-center justify-center gap-2">
                <Phone size={14} /> Contact
              </button>
              <button className="flex-1 py-3 bg-blue hover:bg-blue/90 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-neon-blue">
                <MessageSquare size={14} /> Dispatch
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Global Activity */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-[40px] p-8 backdrop-blur-xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-scan-pattern opacity-5" />
        <div className="flex flex-col lg:flex-row gap-12 relative z-10">
          <div className="flex-1">
            <h2 className="text-xl font-black text-white uppercase italic tracking-tight flex items-center gap-3 mb-6">
              <Activity className="text-blue shadow-neon-blue" size={24} />
              Network Vitality
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Active Donors', val: '1,248', color: 'blue' },
                { label: 'Standby Units', val: '842', color: 'green' },
                { label: 'Requests (24h)', val: '156', color: 'blood' },
                { label: 'Success Rate', val: '99.2%', color: 'gold' }
              ].map((stat, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-t3 font-black uppercase tracking-widest block mb-1">{stat.label}</span>
                  <span className="text-2xl font-black text-white italic">{stat.val}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="w-full lg:w-80 p-6 rounded-3xl bg-blue/10 border border-blue/20 flex flex-col justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue/10 border border-blue/30 flex items-center justify-center mx-auto mb-4 animate-pulse">
               <Heart size={32} className="text-blue shadow-neon-blue" />
            </div>
            <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em] mb-2">Join Neural Network</h3>
            <p className="text-[10px] text-t2 font-bold mb-6 italic opacity-80">Sync your profile to the global dispatch grid.</p>
            <button className="w-full py-4 bg-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-neon-blue hover:scale-105 active:scale-95 transition-all">
              Initialize Enrollment
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
