import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { api } from '../services/api';

const AssistantPanel = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Ask me how to reduce transport, electricity, fuel, or overall carbon footprint.' },
  ]);

  const send = async () => {
    if (!input.trim()) return;
    const prompt = input.trim();
    const userMessage = { role: 'user', text: prompt };
    setMessages((current) => [...current, userMessage]);
    setInput('');
    setTyping(true);
    try {
      const res = await api.askAssistant({ message: prompt });
      setMessages((current) => [
        ...current,
        { role: 'assistant', text: res.reply || 'I could not generate a recommendation right now.' },
      ]);
    } catch (err) {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text: 'Backend is offline right now. Start the backend server, then ask again. For now: focus on your biggest source, reduce one repeated weekly habit, and log the change in your ledger.',
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="fixed right-5 bottom-5 z-[70]">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            className="w-[340px] max-w-[calc(100vw-2rem)] h-[460px] bg-white border border-outline-variant rounded-3xl shadow-luxury mb-4 flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center">
              <div>
                <h3 className="font-literata text-lg font-bold text-primary">AI Sustainability Assistant</h3>
                <p className="font-mono text-[9px] uppercase tracking-wider text-outline">CarbonLens Copilot</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-secondary hover:text-primary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`p-3 rounded-2xl text-xs leading-relaxed ${message.role === 'assistant' ? 'bg-surface-container-low text-on-surface' : 'bg-primary text-white ml-8'}`}>
                  {message.text}
                </div>
              ))}
              {typing && <div className="text-xs text-secondary font-mono">Assistant is typing...</div>}
            </div>
            <div className="p-3 border-t border-outline-variant/30 flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !typing && send()} disabled={typing} className="flex-1 px-3 py-2 rounded-xl border border-outline-variant/40 text-xs focus:outline-none disabled:opacity-60" placeholder="Ask for eco recommendations..." />
              <button onClick={send} disabled={typing} className="px-3 py-2 bg-primary text-white rounded-xl disabled:opacity-60">
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button onClick={() => setOpen(!open)} className="w-14 h-14 rounded-full bg-primary text-white shadow-luxury flex items-center justify-center">
        <span className="material-symbols-outlined">auto_awesome</span>
      </button>
    </div>
  );
};

export default AssistantPanel;
