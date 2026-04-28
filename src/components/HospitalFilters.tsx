import { useState } from 'react';
import { Search } from 'lucide-react';

interface Props {
  onFilter: (q: string, type: string, emergency: string) => void;
}

export default function HospitalFilters({ onFilter }: Props) {
  const [q, setQ] = useState('');
  const [type, setType] = useState('All');
  const [emergency, setEmergency] = useState('All');

  const emit = (nq: string, nt: string, ne: string) => onFilter(nq, nt, ne);

  const handleQ = (val: string) => { setQ(val); emit(val, type, emergency); };
  const handleT = (val: string) => { setType(val); emit(q, val, emergency); };
  const handleE = (val: string) => { setEmergency(val); emit(q, type, val); };

  return (
    <div className="flex flex-wrap gap-2 p-3 bg-[var(--bg2)] border-b border-[var(--b)]">
      <div className="flex items-center gap-2 bg-[var(--bg3)] border border-[var(--b)] rounded-lg px-3 py-1.5 flex-1 min-w-[200px]">
        <Search size={14} className="text-[var(--t3)]" />
        <input
          className="bg-transparent text-sm outline-none w-full text-[var(--t1)]"
          placeholder="Search tactical grid..."
          value={q}
          onChange={e => handleQ(e.target.value)}
        />
      </div>
      <div className="flex gap-1 bg-[var(--bg3)] p-1 rounded-lg border border-[var(--b)]">
        {['All','Government','Private'].map(t => (
          <button key={t}
            onClick={() => handleT(t)}
            className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${type === t ? 'bg-[var(--blue-alpha-20)] text-[var(--blue)]' : 'text-[var(--t3)] hover:text-[var(--t2)]'}`}>
            {t}
          </button>
        ))}
      </div>
      <div className="flex gap-1 bg-[var(--bg3)] p-1 rounded-lg border border-[var(--b)]">
        {['All','Emergency','Unknown'].map(e => (
          <button key={e}
            onClick={() => handleE(e)}
            className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${emergency === e ? 'bg-[var(--blood-alpha-20)] text-[var(--blood)] shadow-[0_0_10px_var(--blood-alpha-10)]' : 'text-[var(--t3)] hover:text-[var(--t2)]'}`}>
            {e === 'Emergency' ? '🏥 EMRG' : e}
          </button>
        ))}
      </div>
    </div>
  );
}
