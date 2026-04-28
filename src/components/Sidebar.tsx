
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Activity, 
  Map as MapIcon, 
  Radio, 
  Users, 
  Briefcase, 
  BarChart3, 
  ClipboardList, 
  Bell, 
  ShieldCheck, 
  Settings,
  ShieldAlert,
  Globe,
  Package,
  LogOut,
  LogIn,
  User as UserIcon
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useFirebase } from '../hooks/useFirebase';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  badge?: string | number;
  isLive?: boolean;
}

const NavItem = ({ icon, label, to, badge, isLive }: NavItemProps) => (
  <NavLink 
    to={to}
    className={({ isActive }) => cn(
      "flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border border-transparent",
      isActive ? "bg-blood/10 text-blood border-blood/20 shadow-inner-glow" : "text-t2 hover:bg-white/5 hover:text-white"
    )}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-[13px] font-black uppercase tracking-tight">{label}</span>
    </div>
    {isLive && (
      <span className="bg-blood text-white text-[8px] px-1.5 py-0.5 rounded-full animate-pulse font-black shadow-neon-red">
        LIVE
      </span>
    )}
    {badge && (
      <span className="text-[10px] font-black text-blood bg-blood/10 px-1.5 py-0.5 rounded border border-blood/20">
        {badge}
      </span>
    )}
  </NavLink>
);

export const Sidebar = ({ currentPath }: { currentPath: string }) => {
  const { user, signInWithGoogle, logout, loading, isSigningIn, appUser } = useFirebase();

  return (
    <aside className="w-72 border-r border-white/5 flex flex-col p-6 bg-bg/50 backdrop-blur-xl h-full overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-3 mb-10 group cursor-pointer">
        <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center group-hover:shadow-neon-red transition-all">
          <ShieldAlert className="text-blood" size={24} />
        </div>
        <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">
          BLOOD<span className="text-blood">BRIDGE</span>
        </h1>
      </div>

      <nav className="space-y-8">
        <div>
          <p className="text-[10px] font-black text-t3 uppercase tracking-[0.3em] mb-4 opacity-50">Tactical Overview</p>
          <div className="space-y-1">
            <NavItem icon={<Activity size={18}/>} label="Situation Room" to="/dashboard" />
            <NavItem icon={<MapIcon size={18}/>} label="Tactical Map" to="/map" />
          </div>
        </div>
        
        <div>
          <p className="text-[10px] font-black text-t3 uppercase tracking-[0.3em] mb-4 opacity-50">Ops Center</p>
          <div className="space-y-1">
            <NavItem icon={<Globe size={18}/>} label="Live Dispatch" to="/dispatch" isLive />
            <NavItem icon={<Users size={18}/>} label="Donor Network" to="/donors" />
            <NavItem icon={<Package size={18}/>} label="Inventory" to="/inventory" />
          </div>
        </div>

        <div>
          <p className="text-[10px] font-black text-t3 uppercase tracking-[0.3em] mb-4 opacity-50">Intelligence</p>
          <div className="space-y-1">
            <NavItem icon={<BarChart3 size={18}/>} label="Analytics" to="/analytics" />
            <NavItem icon={<ClipboardList size={18}/>} label="Reports" to="/reports" />
            <NavItem icon={<Bell size={18}/>} label="Alerts system" to="/alerts" badge="3" />
          </div>
        </div>
      </nav>

      <div className="mt-auto pt-8 space-y-4">
         {user ? (
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blood/20 border border-blood/40 flex items-center justify-center">
                  <UserIcon size={14} className="text-blood" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-white truncate max-w-[120px]">{user.displayName || 'User'}</span>
                  <span className="text-[8px] font-black text-t3 uppercase tracking-widest">{appUser?.role || 'Guest'}</span>
                </div>
              </div>
              <button 
                onClick={logout}
                className="p-2 hover:bg-white/10 rounded-lg text-t3 hover:text-white transition-all"
                title="Logout"
              >
                <LogOut size={14} />
              </button>
            </div>
         ) : (
            <button 
              onClick={signInWithGoogle}
              disabled={loading || isSigningIn}
              className="w-full flex items-center justify-center gap-2 p-3 bg-blood hover:bg-blood/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-neon-red"
            >
              <LogIn size={14} />
              {loading || isSigningIn ? 'INITIALIZING...' : 'SYNC WITH NEURAL GRID'}
            </button>
         )}

         <div className="p-5 rounded-2xl bg-white/5 border border-white/5 shadow-inner-glow relative overflow-hidden group">
            <div className="absolute inset-0 bg-scan-pattern opacity-5" />
            <div className="flex items-center gap-2 mb-4 relative z-10">
               <div className="w-1.5 h-1.5 rounded-full bg-blue shadow-neon-blue animate-pulse" />
               <span className="text-[8px] font-black text-white uppercase tracking-[0.2em]">Neural Status: 100%</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 relative z-10">
               {['O-', 'A+', 'B-', 'AB+'].map(t => (
                 <div key={t} className="flex flex-col items-center py-1 bg-black/20 rounded border border-white/5">
                    <span className="text-[8px] font-black text-t3">{t}</span>
                    <span className={`text-[10px] font-black ${t === 'O-' ? 'text-blood' : 'text-green'}`}>{t === 'O-' ? 'L' : 'H'}</span>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </aside>
  );
};
