'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Zap, Cpu, Workflow as WorkflowIcon } from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Welcome to OMEGA INFINITY. I can orchestrate all 10 agents to build, deploy, and manage your projects. What do you want to build?', timestamp: Date.now() },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const responses = {
        build: `I'll orchestrate a full-stack build for you. Here's the plan:\n\n1. Architect Agent → System design\n2. Database Agent → Schema design\n3. API Agent → REST endpoints\n4. Code Generator → Backend + Frontend\n5. QA Agent → Tests\n6. Security Agent → Vulnerability scan\n7. DevOps Agent → CI/CD pipeline\n8. Docs Agent → Documentation\n\nShall I start the workflow?`,
        deploy: `Deployment initiated. DevOps Agent is:\n\n1. Building Docker image\n2. Running health checks\n3. Deploying to staging\n4. Running integration tests\n5. Promoting to production\n\nStatus: In progress...`,
        audit: `Security Agent activated. Scanning for:\n\n1. OWASP Top 10 vulnerabilities\n2. Dependency CVEs\n3. Hardcoded secrets\n4. SQL injection points\n5. XSS attack surfaces\n\nThis will take ~30 seconds. Results will appear in the Security Dashboard.`,
        default: `I can help you build, deploy, audit, or manage any project. Try:\n\n"Build a REST API with PostgreSQL"\n"Deploy the current project"\n"Run a security audit"\n"Generate documentation"`,
      };

      const lower = userMsg.content.toLowerCase();
      let response = responses.default;
      if (lower.includes('build') || lower.includes('create') || lower.includes('generate')) response = responses.build;
      else if (lower.includes('deploy')) response = responses.deploy;
      else if (lower.includes('audit') || lower.includes('security')) response = responses.audit;

      setMessages((prev) => [...prev, { role: 'ai', content: response, timestamp: Date.now() }]);
      setLoading(false);
    }, 1500);
  };

  const quickActions = ['Build a full-stack app', 'Deploy current project', 'Run security audit', 'Generate documentation'];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
        <Zap size={24} className="text-purple-500" /> Agent Chat
      </h1>
      <p className="text-white/40 mb-6">Talk to the orchestrator — it routes to all 10 agents</p>

      <div className="card flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
        <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-tradeos-accent text-black' : 'bg-purple-600 text-white'
              }`}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className={`max-w-[70%] rounded-xl p-3 whitespace-pre-line ${
                msg.role === 'user' ? 'bg-purple-500/20 text-white' : 'bg-white/5 text-white/90'
              }`}>
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center"><Cpu size={18} /></div>
              <div className="bg-white/5 rounded-xl p-3 flex gap-1">
                <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-2 flex gap-2 flex-wrap border-t border-white/5">
          {quickActions.map((q) => (
            <button key={q} onClick={() => setInput(q)} className="px-3 py-1.5 rounded-full text-xs bg-white/5 text-white/60 hover:bg-white/10">
              {q}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-white/5 flex gap-2">
          <input className="input flex-1" placeholder="Tell the orchestrator what to build..." value={input}
            onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} />
          <button onClick={send} className="btn-primary px-4 py-2"><Send size={18} /></button>
        </div>
      </div>
    </div>
  );
}
