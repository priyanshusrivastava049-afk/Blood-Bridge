import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Zap, Navigation, Heart, Info, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { TRANSLATIONS } from '../i18n';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

interface ChatBotProps {
  currentLang: string;
  onNavigate: (id: any) => void;
  locationContext?: string;
}

export default function ChatBot({ currentLang, onNavigate, locationContext }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Initiating neural connection... Hello! I am the BloodBridge AI Assistant. How can I facilitate your mission today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.EN;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const systemPrompt = `
        You are the BloodBridge AI Assistant, a high-tech medical triage AI.
        Pulse: Professional, Efficient, Empathetic, and Technical.
        Context: The user is interacting with BloodBridge, a next-gen blood donation platform.
        Capabilities: You provide info on blood donation eligibility, explain app features (Emergency Map, AI Triage, Donor Portal), and help with navigation.
        Geospatial Context: ${locationContext || 'No active tactical pins.'}
        Language: Current interface language is ${currentLang}. Please respond in ${currentLang === 'EN' ? 'English' : currentLang === 'HI' ? 'Hindi' : 'Marathi'}.
        
        Navigation Commands (if user asks to go somewhere):
        - Dashboard: /dash
        - Tactical Map: /map
        - Create Request: /req
        - Donor Portal: /donor
        - Notifications: /notify
        
        Guidelines:
        1. If they ask about blood, be medically accurate but accessible.
        2. If they ask "where am I" or "what is this", explain the current view or the app's purpose.
        3. Keep responses concise (under 3 sentences unless complex).
        4. Use terms like "Mission Control", "Tactical", "Neural Sync", "Asset Deployment" to match the Medical-Tech vibe.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: userMsg }] }
        ],
        config: {
          systemInstruction: systemPrompt
        }
      });

      const botResponse = response.text || "Connection interupted. Please retry.";
      
      // Handle Navigation simulation
      if (botResponse.includes('/dash')) onNavigate('dash');
      if (botResponse.includes('/map')) onNavigate('map');
      if (botResponse.includes('/req')) onNavigate('req');
      if (botResponse.includes('/donor')) onNavigate('donor');
      if (botResponse.includes('/notify')) onNavigate('notify');

      setMessages(prev => [...prev, { role: 'bot', text: botResponse.replace(/\/[a-z]+/g, '').trim() }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Protocol error: AI engine unresponsive. Please check your neural link.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const SUGGESTIONS = [
    { text: 'How to donate?', icon: <Heart size={12} /> },
    { text: 'View Tactical Map', icon: <Navigation size={12} /> },
    { text: 'O- Availability', icon: <Info size={12} /> },
  ];

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col items-start gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom left' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-[360px] h-[520px] bg-[var(--bg2)] border border-[var(--b)] rounded-[24px] shadow-2xl flex flex-col overflow-hidden glass"
          >
            {/* Header */}
            <div className="p-4 border-b border-[var(--b)] bg-[var(--bg3)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--blue-alpha-10)] text-[var(--blue)] flex items-center justify-center border border-[var(--blue-alpha-20)]">
                  <Bot size={20} />
                </div>
                <div>
                  <div className="text-xs font-black text-[var(--t1)] uppercase tracking-tight">BloodBridge AI</div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] animate-pulse shadow-[0_0_8px_var(--green)]"></span>
                    <span className="text-[9px] font-bold text-[var(--t3)] uppercase tracking-widest">Neural Link Active</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-[var(--bg4)] flex items-center justify-center transition-colors text-[var(--t3)] hover:text-[var(--t1)]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 scroll-smooth scrollbar-hide"
            >
              <div className="flex flex-col gap-1 items-center justify-center opacity-30 mt-4 mb-2">
                <Shield size={24} className="text-[var(--t3)]" />
                <span className="text-[9px] font-black font-mono tracking-widest uppercase">Encrypted Multi-channel Link</span>
              </div>
              
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] flex flex-col gap-1.5 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-[8px] font-black text-[var(--t3)] uppercase tracking-widest">
                        {m.role === 'user' ? 'Human Operator' : 'AI Core'}
                      </span>
                    </div>
                    <div className={`p-3.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                      m.role === 'user' 
                        ? 'bg-[var(--blue)] text-white' 
                        : 'bg-[var(--bg4)] text-[var(--t2)] border border-[var(--b)]'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[8px] font-black text-[var(--t3)] uppercase tracking-widest px-1">AI Core</span>
                    <div className="bg-[var(--bg4)] p-3 rounded-2xl border border-[var(--b)] flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin text-[var(--blue)]" />
                      <span className="text-[11px] font-bold text-[var(--t3)] tracking-tight">Processing telemetry...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[var(--b)] bg-[var(--bg3)] flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s, i) => (
                  <button 
                    key={i}
                    onClick={() => setInput(s.text)}
                    className="px-3 py-1.5 rounded-lg bg-[var(--bg4)] border border-[var(--b)] text-[10px] font-black text-[var(--t2)] hover:border-[var(--blue-alpha-20)] hover:text-[var(--blue)] transition-all flex items-center gap-2"
                  >
                    {s.icon}
                    {s.text}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input 
                  autoFocus
                  placeholder="Ask concerning mission protocols..." 
                  className="flex-1 bg-[var(--bg4)] border border-[var(--b)] rounded-xl px-4 py-3 text-xs font-medium focus:border-[var(--blue)] outline-none"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <button 
                  onClick={handleSend}
                  className="w-11 h-11 rounded-xl bg-[var(--blue)] text-white flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        layout
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-2xl bg-[var(--blue)] text-white shadow-blue-glow flex items-center justify-center group relative"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div key="msg" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageSquare size={24} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--green)] rounded-full border-2 border-[var(--bg)] animate-pulse"></div>
        )}
      </motion.button>
    </div>
  );
}

function Shield(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
    </svg>
  );
}
