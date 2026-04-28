import React from 'react';
import { X, Droplets, Send, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hospital } from '../lib/constants';

interface RequestBloodModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospital: Hospital | null;
  onSubmit: (data: any) => void;
}

export const RequestBloodModal = ({ isOpen, onClose, hospital, onSubmit }: RequestBloodModalProps) => {
  const [formData, setFormData] = React.useState({
    bloodGroup: 'O-',
    units: 2,
    urgency: 'medium',
    notes: ''
  });

  if (!hospital) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-[1000]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-bg2 border border-b rounded-[32px] shadow-2xl z-[1001] overflow-hidden"
          >
            <div className="p-8 border-b border-b flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Initiate Blood Request</h3>
                <p className="text-[10px] text-t3 font-black uppercase tracking-widest mt-1">To: {hospital.name}</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-bg3 rounded-xl transition-all"
              >
                <X size={20} className="text-t3" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-t3 uppercase tracking-widest">Blood Group</label>
                  <select 
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="finp w-full"
                  >
                    {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-t3 uppercase tracking-widest">Units Required</label>
                  <input 
                    type="number"
                    min="1"
                    max="10"
                    value={isNaN(formData.units) ? '' : formData.units}
                    onChange={(e) => setFormData({ ...formData, units: parseInt(e.target.value) })}
                    className="finp w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-t3 uppercase tracking-widest">Urgency Protocol</label>
                <div className="grid grid-cols-3 gap-3">
                  {['medium', 'high', 'critical'].map(level => (
                    <button
                      key={level}
                      onClick={() => setFormData({ ...formData, urgency: level })}
                      className={`py-3 px-1 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        formData.urgency === level 
                        ? 'bg-blood/10 border-blood text-blood' 
                        : 'bg-bg3 border-b text-t3 hover:border-t2'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-t3 uppercase tracking-widest">Operational Notes</label>
                <textarea 
                  className="finp w-full min-h-[100px] resize-none"
                  placeholder="Additional trauma notes or transport requirements..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue/5 border border-blue/10 rounded-2xl">
                <Info size={16} className="text-blue shrink-0 mt-0.5" />
                <p className="text-[10px] text-t2 font-medium leading-relaxed">
                  Authentication handoff will be processed via AIIMS secure gate. ETA matching service will notify 4 available responders upon validation.
                </p>
              </div>

              <button 
                onClick={() => onSubmit(formData)}
                className="w-full btn btn-blood py-4 text-xs font-black uppercase tracking-[0.2em] shadow-neon-red flex items-center justify-center gap-3"
              >
                <Send size={16} /> Authenticate & Dispatch
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
