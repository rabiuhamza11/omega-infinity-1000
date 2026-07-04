'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Cpu, Zap, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  agent?: string;
  timestamp: string;
}

const AGENTS = [
  { name: 'Orchestrator', desc: 'Coordinates all agents', icon: '🧠' },
  { name: 'Architect', desc: 'System design', icon: '🏗️' },
  { name: 'Code Generator', desc: 'Generates code', icon: '💻' },
  { name: 'DevOps', desc: 'CI/CD & deploy', icon: '🚀' },
  { name: 'QA Agent', desc: 'Tests & quality', icon: '🧪' },
  { name: 'Security', desc: 'Security audits', icon: '🛡️' },
];

const initialMessages: Message[] = [
  { id: '1', role: 'agent', agent: 'Orchestrator', content: "Hello Rabiu! I'm the Orchestrator agent. I coordinate all 10 agents in the OMEGA INFINITY platform. How can I help you today?", timestamp: '14:30' },
  { id: '2', role: 'user', content: "Create a new e-commerce project with Next.js, Stripe, and PostgreSQL", timestamp: '14:31' },
  { id: '3', role: 'agent', agent: 'Orchestrator', content: "I'll coordinate the team for this. Here's the plan:\n\n1. Architect Agent → Design system architecture\n2. Database Agent → Create PostgreSQL schema\n3. API Agent → Build REST endpoints\n4. Code Generator → Generate full-stack code\n5. Frontend Agent → Create UI components\n6. QA Agent → Write tests\n7. Security Agent → Audit code\n8. DevOps Agent → Set up CI/CD\n\nShall I proceed?", timestamp: '14:31' },
  { id: '4', role: 'user', content: "Yes, proceed", timestamp: '14:32' },
  { id: '5', role: 'agent', agent: 'Architect', content: "System architecture designed:\n- Frontend: Next.js 14 (App Router, SSR)\n- Backend: NestJS with Prisma ORM\n- Database: PostgreSQL (12 tables)\n- Payments: Stripe Checkout + Webhooks\n- Cache: Redis for sessions\n- Deploy: Vercel (frontend) + Render (backend)\n\n✅ Architecture approved. Passing to Database Agent.", timestamp: '14:33' },
  { id: '6', role: 'agent', agent: 'Code Generator', content: "Code generation complete:\n- 342 files generated\n- 24 API endpoints\n- 18 React components\n- 12 database models\n- Stripe integration with webhooks\n\n✅ All code generated. Passing to QA Agent.", timestamp: '14:38' },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('Orchestrator');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      const responses = [
        "I'll get started on that right away. Let me coordinate with the relevant agents.",
        "Understood. I'm analyzing the requirements and will generate the necessary code.",
        "On it! I'll design the architecture and pass it to the code generator.",
        "Running security checks now. I'll report any findings shortly.",
        "Tests are being written. I'll make sure everything passes before deployment.",
      ];
      const agentMsg: Message = {
        id: Date.now().toString() + '-agent',
        role: 'agent',
        agent: selectedAgent,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      };
      setMessages((prev) => [...prev, agentMsg]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      {/* Agent Selector */}
      <div className="w-64 border-r border-white/5 p-4 overflow-y-auto hidden md:block">
        <h3 className="font-semibold mb-3 text-sm text-white/40">Select Agent</h3>
        <div className="space-y-1">
          {AGENTS.map((agent) => (
            <button key={agent.name} onClick={() => setSelectedAgent(agent.name)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-sm ${
                selectedAgent === agent.name ? 'bg-purple-600/20 text-purple-400' : 'text-white/50 hover:bg-white/5'
              }`}>
              <span className="text-lg">{agent.icon}</span>
              <div className="text-left">
                <div className="font-medium">{agent.name}</div>
                <div className="text-xs text-white/30">{agent.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="px-6 py-3 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center text-xl">
            {AGENTS.find((a) => a.name === selectedAgent)?.icon || '🤖'}
          </div>
          <div>
            <div className="font-semibold">{selectedAgent}</div>
            <div className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400" /> Online
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-blue-500' : 'bg-purple-600/30'
              }`}>
                {msg.role === 'user' ? <User size={16} className="text-white" /> : <Cpu size={16} className="text-purple-400" />}
              </div>
              <div className={`max-w-[70%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                {msg.role === 'agent' && (
                  <div className="text-xs text-purple-400 mb-1">{msg.agent}</div>
                )}
                <div className={`rounded-2xl p-3.5 text-sm whitespace-pre-wrap ${
                  msg.role === 'user' ? 'bg-blue-500 text-white rounded-tr-sm' : 'bg-white/5 text-white/90 rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
                <div className="text-xs text-white/20 mt-1 px-2">{msg.timestamp}</div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600/30 flex items-center justify-center flex-shrink-0">
                <Cpu size={16} className="text-purple-400" />
              </div>
              <div className="bg-white/5 rounded-2xl rounded-tl-sm p-4">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEnd} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <input
              className="input flex-1"
              placeholder={`Message ${selectedAgent}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage} disabled={!input.trim()}
              className="btn-primary p-3 disabled:opacity-30">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
