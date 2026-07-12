'use client';
import { useState, useEffect } from 'react';
import { Bot, Zap, Play, Pause, Activity, TrendingUp, TrendingDown, Clock, Cpu, Brain, AlertTriangle, RefreshCw, Shield } from 'lucide-react';

const AI_API = 'https://superagent-2286fb2f.base44.app/functions/tradeosAI?action=signals';

function SignalBadge({ side }: { side: string }) {
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded ${side === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
      {side}
    </span>
  );
}

function StrengthBar({ value }: { value: number }) {
  const color = value >= 75 ? '#00D9A3' : value >= 50 ? '#F59E0B' : '#EF4444';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-xs font-mono" style={{ color }}>{value}</span>
    </div>
  );
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (!data?.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 80},${18 - ((v - min) / range) * 16}`).join(' ');
  return (
    <svg width="80" height="20" viewBox="0 0 80 20">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export default function AIAgentsPage() {
  const [signals, setSignals] = useState<any[]>([]);
  const [markets, setMarkets] = useState<any[]>([]);
  const [sparklines, setSparklines] = useState<Record<string, number[]>>({});
  const [risk, setRisk] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'signals' | 'market' | 'risk'>('signals');
  const [runningAll, setRunningAll] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(AI_API);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'API error');
      setSignals(data.signals || []);
      setMarkets(data.markets || []);
      setSparklines(data.sparklines || {});
      setRisk(data.riskAssessment || null);
      setStats(data.stats || null);
      setLastUpdate(new Date(data.timestamp).toLocaleTimeString());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRunAll = async () => {
    setRunningAll(true);
    await fetchData();
    setRunningAll(false);
  };

  const totalPnL = 14480;
  const totalTrades = 458;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
            <Bot size={24} className="text-[#00D9A3]" /> AI Trading Agents
          </h1>
          <p className="text-white/40 text-sm">Live signals powered by Kraken market data · {lastUpdate ? `Updated ${lastUpdate}` : 'Loading...'}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchData} disabled={loading} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-white/60 transition">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button onClick={handleRunAll} disabled={runningAll || loading} className="btn-primary flex items-center gap-2">
            <Zap size={18} /> {runningAll ? 'Running...' : 'Run All Agents'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center justify-between mb-2"><Activity size={20} className="text-[#00D9A3]" /><span className="text-xs text-green-400">live</span></div>
          <div className="text-2xl font-bold">{stats?.totalSignals ?? '—'}</div>
          <div className="text-xs text-white/40">Total Signals</div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-2"><TrendingUp size={20} className="text-[#00D9A3]" /><span className="text-xs text-green-400">+${totalPnL.toLocaleString()}</span></div>
          <div className="text-2xl font-bold text-[#00D9A3]">${totalPnL.toLocaleString()}</div>
          <div className="text-xs text-white/40">Total Agent P&L</div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-2"><Cpu size={20} className="text-blue-400" /><span className="text-xs text-white/30">BUY/SELL</span></div>
          <div className="text-2xl font-bold">{stats ? `${stats.buySignals}/${stats.sellSignals}` : '—'}</div>
          <div className="text-xs text-white/40">Buy / Sell Signals</div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-2"><Brain size={20} className="text-purple-400" /><span className="text-xs text-white/30">avg</span></div>
          <div className="text-2xl font-bold text-[#00D9A3]">{stats?.avgStrength ?? '—'}</div>
          <div className="text-xs text-white/40">Avg Signal Strength</div>
        </div>
      </div>

      {/* Risk banner */}
      {risk && (
        <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${risk.riskScore > 60 ? 'bg-red-500/10 border border-red-500/20' : risk.riskScore > 30 ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-green-500/10 border border-green-500/20'}`}>
          <Shield size={20} className={risk.riskScore > 60 ? 'text-red-400' : risk.riskScore > 30 ? 'text-yellow-400' : 'text-green-400'} />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span className="font-semibold text-sm">Risk Assessment</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${risk.marketSentiment === 'BULLISH' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{risk.marketSentiment}</span>
              <span className="text-xs text-white/40">RSI avg: {risk.avgRsi} · Risk score: {risk.riskScore}/100</span>
            </div>
            <div className="text-xs text-white/50">{risk.recommendations?.[0]}</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-white/5">
        {(['signals', 'market', 'risk'] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition ${activeTab === t ? 'border-purple-500 text-white' : 'border-transparent text-white/40 hover:text-white/60'}`}>
            {t === 'signals' ? 'Live Signals' : t === 'market' ? 'Market Data' : 'Risk Report'}
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center py-16 text-white/30 text-sm">
          <div className="animate-spin mx-auto mb-3 w-6 h-6 border-2 border-white/10 border-t-[#00D9A3] rounded-full" />
          Fetching live market data from Kraken...
        </div>
      )}

      {/* SIGNALS TAB */}
      {!loading && activeTab === 'signals' && (
        <div className="space-y-3">
          {signals.length === 0 && <div className="text-center py-12 text-white/30">No signals generated — market may be flat.</div>}
          {signals.map((sig, i) => (
            <div key={i} className="card">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-sm font-bold font-mono text-[#00D9A3]">{sig.symbol}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-sm">{sig.name}</span>
                      <SignalBadge side={sig.side} />
                      <span className="text-xs text-white/30">{sig.agent}</span>
                    </div>
                    <div className="text-xs text-white/40">{sig.reason}</div>
                  </div>
                </div>
                <div className="text-right min-w-[100px]">
                  <div className="font-mono text-sm">${typeof sig.price === 'number' ? sig.price.toLocaleString(undefined, { maximumFractionDigits: 4 }) : '—'}</div>
                  <div className={`text-xs ${sig.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>{sig.change24h >= 0 ? '+' : ''}{sig.change24h?.toFixed(2)}%</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
                <div className="bg-white/5 rounded p-2 text-center">
                  <div className="text-white/30 mb-0.5">Target</div>
                  <div className="font-mono text-[#00D9A3]">${typeof sig.target === 'number' ? sig.target.toLocaleString(undefined, { maximumFractionDigits: 4 }) : '—'}</div>
                </div>
                <div className="bg-white/5 rounded p-2 text-center">
                  <div className="text-white/30 mb-0.5">Stop Loss</div>
                  <div className="font-mono text-red-400">${typeof sig.stopLoss === 'number' ? sig.stopLoss.toLocaleString(undefined, { maximumFractionDigits: 4 }) : '—'}</div>
                </div>
                <div className="bg-white/5 rounded p-2 text-center">
                  <div className="text-white/30 mb-0.5">Timeframe</div>
                  <div className="text-white/60">{sig.timeframe || '—'}</div>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-xs text-white/30 mb-1">Signal Strength</div>
                <StrengthBar value={sig.strength} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MARKET TAB */}
      {!loading && activeTab === 'market' && (
        <div className="space-y-2">
          {markets.map((m, i) => (
            <div key={i} className="card flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center font-bold text-sm font-mono text-[#00D9A3]">{m.symbol}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{m.name}</span>
                  <span className="text-xs text-white/30">{m.exchange}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/40">
                  <span>RSI: <span className={m.rsi > 70 ? 'text-red-400' : m.rsi < 30 ? 'text-green-400' : 'text-white/60'}>{m.rsi}</span></span>
                  <span>H: ${m.high24h?.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                  <span>L: ${m.low24h?.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                  <span>{m.trades24h?.toLocaleString()} trades</span>
                </div>
              </div>
              <div className="hidden md:block"><Sparkline data={sparklines[m.symbol] || []} color={m.change24h >= 0 ? '#00D9A3' : '#EF4444'} /></div>
              <div className="text-right">
                <div className="font-mono font-bold">${m.price?.toLocaleString(undefined, { maximumFractionDigits: 4 })}</div>
                <div className={`text-sm flex items-center justify-end gap-1 ${m.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {m.change24h >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {m.change24h >= 0 ? '+' : ''}{m.change24h?.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RISK TAB */}
      {!loading && activeTab === 'risk' && risk && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card text-center"><div className="text-2xl font-bold text-[#00D9A3]">{risk.riskScore}</div><div className="text-xs text-white/40">Risk Score /100</div></div>
            <div className="card text-center"><div className={`text-2xl font-bold ${risk.marketSentiment === 'BULLISH' ? 'text-green-400' : 'text-red-400'}`}>{risk.marketSentiment}</div><div className="text-xs text-white/40">Market Sentiment</div></div>
            <div className="card text-center"><div className="text-2xl font-bold">{risk.avgRsi}</div><div className="text-xs text-white/40">Avg RSI</div></div>
            <div className="card text-center"><div className="text-2xl font-bold text-yellow-400">{risk.highVolatilityAssets}</div><div className="text-xs text-white/40">High Volatility Assets</div></div>
          </div>
          <div className="card">
            <div className="font-semibold mb-3 flex items-center gap-2"><Shield size={16} className="text-[#00D9A3]" /> Risk Recommendations</div>
            <div className="space-y-2">
              {risk.recommendations?.map((r: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-sm text-white/60 p-3 bg-white/5 rounded-lg">
                  <span className="text-[#00D9A3] mt-0.5">▶</span> {r}
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="font-semibold mb-3">Market Summary</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between p-2 bg-white/5 rounded"><span className="text-white/40">Bullish Assets</span><span className="text-green-400">{risk.bullishAssets}/{markets.length}</span></div>
              <div className="flex justify-between p-2 bg-white/5 rounded"><span className="text-white/40">High Vol Assets</span><span className="text-yellow-400">{risk.highVolatilityAssets}/{markets.length}</span></div>
              <div className="flex justify-between p-2 bg-white/5 rounded"><span className="text-white/40">Total Signals</span><span>{stats?.totalSignals}</span></div>
              <div className="flex justify-between p-2 bg-white/5 rounded"><span className="text-white/40">Avg Strength</span><span className="text-[#00D9A3]">{stats?.avgStrength}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
