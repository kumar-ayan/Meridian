import React, { useState } from 'react';
import {
  TrendingUp,
  Cpu,
  PieChart,
  Sliders,
  Database,
  Workflow,
  Search,
  Sparkles,
  ShieldCheck,
  Newspaper
} from 'lucide-react';
import { StockOverview } from '../types';

interface NavbarProps {
  activeTab: 'research' | 'news' | 'portfolio' | 'valuation' | 'rag' | 'n8n';
  setActiveTab: (tab: 'research' | 'news' | 'portfolio' | 'valuation' | 'rag' | 'n8n') => void;
  selectedTicker: string;
  onSelectTicker: (symbol: string) => void;
  popularStocks: StockOverview[];
  watchlist: string[];
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedTicker,
  onSelectTicker,
  popularStocks,
  watchlist
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredStocks = popularStocks.filter(
    s =>
      s.symbol.toLowerCase().includes(searchInput.toLowerCase()) ||
      s.companyName.toLowerCase().includes(searchInput.toLowerCase())
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSelectTicker(searchInput.trim().toUpperCase());
      setSearchInput('');
      setShowDropdown(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0b]/95 backdrop-blur-md border-b border-white/5 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-sm flex items-center justify-center font-bold text-black text-sm">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg tracking-tight text-white">MERIDIAN <span className="text-slate-500 font-normal text-xs font-mono">// INTELLIGENCE</span></span>
                <span className="px-2 py-0.5 text-[10px] font-mono text-emerald-400 bg-white/5 rounded-full border border-white/10 uppercase tracking-widest">
                  Multi-Agent Engine
                </span>
              </div>
            </div>
          </div>

          {/* Quick Ticker Search Bar */}
          <div className="relative flex-1 max-w-xs mx-4 hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search Tickers..."
                value={searchInput}
                onChange={e => {
                  setSearchInput(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full pl-9 pr-3 py-1.5 bg-white/5 border border-white/10 rounded text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
              />
            </form>

            {/* Dropdown Results */}
            {showDropdown && (searchInput.length > 0 || filteredStocks.length > 0) && (
              <div
                className="absolute left-0 right-0 top-10 bg-[#121214] border border-white/10 rounded shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto"
                onMouseLeave={() => setShowDropdown(false)}
              >
                <div className="p-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">
                  Search Tickers
                </div>
                {filteredStocks.map(s => (
                  <button
                    key={s.symbol}
                    onClick={() => {
                      onSelectTicker(s.symbol);
                      setSearchInput('');
                      setShowDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-white/5 transition-colors ${
                      selectedTicker === s.symbol ? 'bg-white/10 text-emerald-400' : 'text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-semibold font-mono text-xs">{s.symbol}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[180px]">{s.companyName}</div>
                    </div>
                    <div className="text-right font-mono text-xs">
                      <div>${s.price.toFixed(2)}</div>
                      <div className={s.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {s.changePercent >= 0 ? '+' : ''}
                        {s.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('research')}
              className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-2 transition-all ${
                activeTab === 'research'
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>Research</span>
            </button>

            <button
              onClick={() => setActiveTab('news')}
              className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-2 transition-all ${
                activeTab === 'news'
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5 text-emerald-400" />
              <span>News</span>
            </button>

            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-2 transition-all ${
                activeTab === 'portfolio'
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <PieChart className="w-3.5 h-3.5 text-emerald-400" />
              <span>Portfolio</span>
            </button>

            <button
              onClick={() => setActiveTab('valuation')}
              className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-2 transition-all ${
                activeTab === 'valuation'
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">DCF Valuation</span>
            </button>

            <button
              onClick={() => setActiveTab('rag')}
              className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-2 transition-all ${
                activeTab === 'rag'
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden lg:inline">Vector RAG</span>
            </button>

            <button
              onClick={() => setActiveTab('n8n')}
              className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-2 transition-all ${
                activeTab === 'n8n'
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Workflow className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden lg:inline">n8n Automation</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
