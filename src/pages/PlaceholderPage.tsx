
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Construction, 
  BarChart3, 
  Package, 
  FileText, 
  Bell, 
  Settings, 
  History,
  Activity,
  TrendingUp,
  Database,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface PlaceholderPageProps {
  title: string;
  subtitle: string;
}

const MOCK_CHART_DATA = [
  { name: '00:00', val: 45 },
  { name: '04:00', val: 32 },
  { name: '08:00', val: 68 },
  { name: '12:00', val: 84 },
  { name: '16:00', val: 56 },
  { name: '20:00', val: 92 },
  { name: '23:59', val: 74 },
];

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, subtitle }) => {
  const isAnalytics = title.toLowerCase().includes('analytics');
  const isInventory = title.toLowerCase().includes('inventory');
  const isReports = title.toLowerCase().includes('reports');
  const isAlerts = title.toLowerCase().includes('alerts');
  
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
            {title.toUpperCase()}
            <span className="text-[10px] not-italic font-black border border-blue/40 text-blue px-2 py-0.5 rounded shadow-neon-blue uppercase">Local_Cache</span>
          </h1>
          <p className="text-[10px] text-t3 font-black uppercase tracking-[0.4em] mt-2">{subtitle}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {isAnalytics && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="hud-card p-8 bg-white/5 border border-white/10 rounded-[40px] backdrop-blur-xl"
             >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-white italic tracking-tight uppercase flex items-center gap-3">
                    <TrendingUp className="text-blue" size={24} />
                    Throughput Efficiency
                  </h3>
                  <div className="flex gap-2">
                    {['1H', '6H', '24H', '7D'].map(t => (
                      <button key={t} className={`px-3 py-1 rounded-lg text-[9px] font-black tracking-widest ${t === '24H' ? 'bg-blue text-white shadow-neon-blue' : 'text-t3 hover:text-white'}`}>{t}</button>
                    ))}
                  </div>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MOCK_CHART_DATA}>
                      <defs>
                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3498db" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3498db" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="name" stroke="#526484" fontSize={9} tickLine={false} axisLine={false} />
                      <YAxis stroke="#526484" fontSize={9} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px', fontFamily: 'Inter' }}
                        itemStyle={{ color: '#3498db' }}
                      />
                      <Area type="monotone" dataKey="val" stroke="#3498db" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
             </motion.div>
          )}

          {isInventory && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'O- PACKS', val: '42', max: '60', color: 'blood' },
                { name: 'A+ PACKS', val: '88', max: '100', color: 'blue' },
                { name: 'B+ PACKS', val: '156', max: '200', color: 'green' },
                { name: 'PLASMA (AB)', val: '24', max: '50', color: 'gold' }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="hud-card p-6 bg-white/5 border border-white/10 rounded-3xl group hover:border-blue/50 transition-all"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-t3 uppercase tracking-widest">{item.name}</span>
                    <span className="text-[14px] font-black text-white italic">{item.val} <span className="text-[9px] text-t3 opacity-50">/ {item.max}</span></span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(parseInt(item.val)/parseInt(item.max))*100}%` }}
                      className={`h-full shadow-neon-${item.color}`}
                      style={{ backgroundColor: `var(--${item.color})` }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {isReports && (
            <div className="space-y-4">
              {[
                { id: 'LOG_821', type: 'MISSION_SUCCESS', pat: 'Aakash Verma', time: '12:42', detail: 'Vector transition complete. Patient stable at AIIMS.' },
                { id: 'LOG_820', type: 'STOCK_RESTOCK', pat: 'Central Hub', time: '11:15', detail: '20 units of O- transferred from Red Cross to Max.' },
                { id: 'LOG_819', type: 'NEURAL_FAULT', pat: 'Sector 62', time: '10:04', detail: 'Minor packet loss detected in node 04. Auto-corrected.' }
              ].map((log, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-blue/30 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center text-blue">
                         <FileText size={20} />
                      </div>
                      <div>
                        <h4 className="text-[12px] font-black text-white uppercase tracking-tight">{log.id} · {log.type}</h4>
                        <p className="text-[10px] text-t3 uppercase tracking-widest mt-1">{log.time} · {log.pat}</p>
                      </div>
                    </div>
                    <button className="text-[9px] font-black text-blue uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">View Decrypted</button>
                  </div>
                  <p className="text-[11px] text-t2 font-medium italic opacity-80 leading-relaxed pl-14">
                    "{log.detail}"
                  </p>
                </motion.div>
              ))}
            </div>
          )}

          {!isAnalytics && !isInventory && !isReports && (
            <div className="text-center py-20 hud-card bg-white/5 border border-white/10 rounded-[40px]">
              <div className="w-20 h-20 rounded-full bg-blue/10 flex items-center justify-center mx-auto mb-6 shadow-neon-blue border border-blue/20">
                <Construction size={40} className="text-blue" />
              </div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Neural Link Under Construction</h2>
              <p className="text-xs text-t3 font-black uppercase tracking-widest">Sector 09 is currently undergoing protocol updates.</p>
            </div>
          )}
        </div>

        {/* Sidebar Diagnostics */}
        <div className="space-y-8">
           <div className="hud-card p-8 bg-white/5 border border-white/10 rounded-[40px] backdrop-blur-xl">
             <div className="w-16 h-16 rounded-[24px] bg-blue/10 border border-blue/20 flex items-center justify-center mb-6 shadow-neon-blue">
               <Activity size={32} className="text-blue" />
             </div>
             <h3 className="text-xl font-black text-white uppercase italic tracking-tight mb-2">Sector Status</h3>
             <p className="text-[11px] text-t2 font-bold mb-8 italic leading-relaxed opacity-80">Telemetry indicates all local nodes are operating within standard performance envelopes.</p>
             
             <div className="space-y-3">
               {[
                 { label: 'Uptime', val: '99.98%' },
                 { label: 'Latency', val: '4ms' },
                 { label: 'Sync Status', val: 'Current' }
               ].map((item, i) => (
                 <div key={i} className="flex justify-between items-center p-3 border-b border-white/5">
                   <span className="text-[9px] font-black text-t3 uppercase tracking-widest">{item.label}</span>
                   <span className="text-[9px] font-black text-blue uppercase tracking-widest">{item.val}</span>
                 </div>
               ))}
             </div>
           </div>

           <div className="p-8 rounded-[40px] bg-gold/10 border border-gold/20 group hover:border-gold transition-all cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <ShieldCheck className="text-gold shadow-neon-gold" size={24} />
                <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Tactical Lockdown</h4>
              </div>
              <p className="text-[10px] text-t2 font-black uppercase tracking-widest opacity-70 mb-6">Emergency override initialized for all vector 04 sectors.</p>
              <button className="w-full py-3 bg-white/10 hover:bg-gold hover:text-black rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Deactivate</button>
           </div>
        </div>
      </div>
    </div>
  );
};
