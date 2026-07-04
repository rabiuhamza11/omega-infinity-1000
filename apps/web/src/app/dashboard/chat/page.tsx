'use client';

import { useState, useRef, useEffect } from 'react';
import { agentsApi } from '@/lib/api';
import { Send, Bot } from 'lucide-react';

interface Msg { role: string; content: string; agent?: string }

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: 'Hello! I am the OMEGA AI Orchestrator. Describe the application you want to build and I will coordinate the agents to create it.', agent: 'EXECUTIVE' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // In production: call AI orchestrator endpoint
      setTimeout(() => {
        setMessages((m) => [...m, {
          role: 'assistant',
          content: 'I have analyzed your request. I will coordinate the following agents:\n\n1. PLANNER — Create task breakdown\n2. DATABASE — Design schema\n3. BACKEND — Generate API\n4. FRONTEND — Build UI\n5. QA — Write tests\n6. DEVOPS — Set up CI/CD\n\nShall I proceed?',
          agent: 'EXECUTIVE'
        }]);
        setLoading(false);
      }, 1500);
    } catch { setLoading(false); }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <h1 className="text-2xl font-bold mb-1">AI Chat</h1>
      <p className="text-white/40 mb-6">Describe your project in natural language</p>

      <div className="card flex-1 flex flex-col p-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-omega-accent' : 'bg-white/10'}`}>
                {m.role === 'user' ? 'U' : <Bot size={16} />}
              </div>
              <div className={`max-w-[70%] rounded-lg p-4 ${m.role === 'user' ? 'bg-omega-accent text-white' : 'bg-white/5'}`}>
                {m.agent && <p className="text-xs text-omega-glow mb-1">{m.agent}</p>}
                <p className="text-sm whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          ))}
          {loading && <div className="text-white/30 text-sm">Agent is thinking...</div>}
          <div ref={endRef} />
        </div>

        <div className="border-t border-white/5 p-4 flex gap-3">
          <input className="input flex-1" placeholder="Describe the app you want to build..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} />
          <button onClick={send} className="btn-primary px-4"><Send size={18} /></button>
        </div>
      </div>
    </div>
  );
}
