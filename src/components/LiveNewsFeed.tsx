import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  Radio,
  Search,
  RefreshCw,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Filter,
  Tag,
  Clock,
  ArrowRight,
  ShieldAlert,
  BarChart2,
  Database,
  Cpu
} from 'lucide-react';
import { StockOverview } from '../types';

interface LiveNewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  timeAgo: string;
  summary: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  sentimentScore: number;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  relatedTickers: string[];
  category: string;
}

interface LiveNewsFeedProps {
  selectedTicker: string;
  onSelectTicker: (symbol: string) => void;
  onRunOrchestrator: () => void;
  onOpenRag: () => void;
}

export const LiveNewsFeed: React.FC<LiveNewsFeedProps> = ({
  selectedTicker,
  onSelectTicker,
  onRunOrchestrator,
  onOpenRag
}) => {
  const [news, setNews] = useState<LiveNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [filterMode, setFilterMode] = useState<'all' | 'ticker'>('all');

  const categories = [
    'All',
    'Technology & AI',
    'Macro & Central Banks',
    'Earnings & Financials',
    'M&A & Deals'
  ];

  const loadNews = async () => {
    setIsLoading(true);
    try {
      let url = '/api/news?';
      if (filterMode === 'ticker' && selectedTicker) {
        url += `ticker=${encodeURIComponent(selectedTicker)}&`;
      }
      if (activeCategory !== 'All') {
        url += `category=${encodeURIComponent(activeCategory)}&`;
      }
      if (searchQuery.trim()) {
        url += `q=${encodeURIComponent(searchQuery.trim())}&`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setNews(data.news || []);
        setLastUpdated(data.lastUpdated ? new Date(data.lastUpdated).toLocaleTimeString() : new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error('Error fetching news:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, [selectedTicker, activeCategory, filterMode]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadNews();
  };

  // Sentiment Analytics Breakdown
  const totalNews = news.length;
  const bullishCount = news.filter(n => n.sentiment === 'BULLISH').length;
  const bearishCount = news.filter(n => n.sentiment === 'BEARISH').length;
  const neutralCount = news.filter(n => n.sentiment === 'NEUTRAL').length;

  const bullishPercent = totalNews > 0 ? Math.round((bullishCount / totalNews) * 100) : 0;
  const bearishPercent = totalNews > 0 ? Math.round((bearishCount / totalNews) * 100) : 0;
  const neutralPercent = totalNews > 0 ? Math.round((neutralCount / totalNews) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#121214] border border-white/10 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
                Live Business Stream
              </span>
              {lastUpdated && (
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Updated {lastUpdated}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Newspaper className="w-7 h-7 text-emerald-400" />
              Live Market & Financial News Feed
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Real-time financial headlines, SEC disclosures, and earnings catalyst intelligence enriched with AI sentiment scoring and market impact analysis.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadNews}
              disabled={isLoading}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh News
            </button>

            <button
              onClick={onRunOrchestrator}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg text-xs font-mono flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
            >
              <Cpu className="w-3.5 h-3.5" />
              Analyze {selectedTicker} with AI
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Filter Modes */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                filterMode === 'all'
                  ? 'bg-emerald-500 text-black font-bold'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              All Market News
            </button>
            <button
              onClick={() => setFilterMode('ticker')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
                filterMode === 'ticker'
                  ? 'bg-emerald-500 text-black font-bold'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              <span>Focus on ${selectedTicker}</span>
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-white/20 text-white font-bold border border-white/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative min-w-[220px]">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search news & topics..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#0a0a0b] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 font-mono"
            />
          </form>
        </div>
      </div>

      {/* Sentiment Intelligence Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Sentiment Gauge */}
        <div className="bg-[#121214] border border-white/10 p-4 rounded-xl flex flex-col justify-between">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Market Sentiment Heat</span>
            <BarChart2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">{bullishPercent}%</span>
            <span className="text-xs text-slate-400 font-mono">Net Bullish Ratio</span>
          </div>
          {/* Sentiment Progress Bar */}
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden flex mt-3">
            <div style={{ width: `${bullishPercent}%` }} className="bg-emerald-500 h-full" />
            <div style={{ width: `${neutralPercent}%` }} className="bg-slate-500 h-full" />
            <div style={{ width: `${bearishPercent}%` }} className="bg-rose-500 h-full" />
          </div>
        </div>

        {/* Bullish Volume */}
        <div className="bg-[#121214] border border-white/10 p-4 rounded-xl">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Bullish Catalysts</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{bullishCount} <span className="text-xs font-normal text-slate-400">articles</span></div>
          <p className="text-[11px] text-slate-400 mt-1">Positive growth, AI capacity, and strong guidance</p>
        </div>

        {/* Bearish Headwinds */}
        <div className="bg-[#121214] border border-white/10 p-4 rounded-xl">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Bearish Headwinds</span>
            <TrendingDown className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{bearishCount} <span className="text-xs font-normal text-slate-400">articles</span></div>
          <p className="text-[11px] text-slate-400 mt-1">Regulatory filings, export limits & valuation caution</p>
        </div>

        {/* Total Analyzed */}
        <div className="bg-[#121214] border border-white/10 p-4 rounded-xl">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Active Stream Count</span>
            <Tag className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{totalNews} <span className="text-xs font-normal text-slate-400">live stories</span></div>
          <p className="text-[11px] text-slate-400 mt-1">Auto-parsed with AI tags and sentiment scoring</p>
        </div>
      </div>

      {/* Main News List Stream */}
      {isLoading ? (
        <div className="bg-[#121214] border border-white/10 rounded-xl p-12 text-center">
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-300 font-mono">Fetching live financial stream & parsing sentiment...</p>
        </div>
      ) : news.length === 0 ? (
        <div className="bg-[#121214] border border-white/10 rounded-xl p-12 text-center">
          <Newspaper className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No articles matched your filter</h3>
          <p className="text-xs text-slate-400 mt-1">Try resetting the category filter or searching for a broader market term.</p>
          <button
            onClick={() => {
              setActiveCategory('All');
              setFilterMode('all');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-mono font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {news.map(article => {
            const isBullish = article.sentiment === 'BULLISH';
            const isBearish = article.sentiment === 'BEARISH';

            return (
              <div
                key={article.id}
                className="bg-[#121214] border border-white/10 hover:border-white/20 p-5 rounded-xl transition-all hover:bg-[#161618] group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Tickers */}
                    {article.relatedTickers.map(t => (
                      <button
                        key={t}
                        onClick={() => onSelectTicker(t)}
                        className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-colors ${
                          selectedTicker === t
                            ? 'bg-emerald-500 text-black'
                            : 'bg-white/10 text-emerald-400 hover:bg-emerald-500/20'
                        }`}
                      >
                        ${t}
                      </button>
                    ))}

                    <span className="text-slate-600">•</span>

                    {/* Source */}
                    <span className="text-xs font-semibold text-slate-300 font-mono">
                      {article.source}
                    </span>

                    <span className="text-slate-600">•</span>

                    {/* Published time */}
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {article.timeAgo}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Category */}
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-slate-400 border border-white/10">
                      {article.category}
                    </span>

                    {/* Sentiment Badge */}
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase flex items-center gap-1 border ${
                        isBullish
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : isBearish
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-slate-500/10 text-slate-300 border-slate-500/30'
                      }`}
                    >
                      {isBullish ? (
                        <TrendingUp className="w-3 h-3 text-emerald-400" />
                      ) : isBearish ? (
                        <TrendingDown className="w-3 h-3 text-rose-400" />
                      ) : (
                        <Minus className="w-3 h-3 text-slate-400" />
                      )}
                      {article.sentiment} ({article.sentimentScore > 0 ? '+' : ''}{article.sentimentScore})
                    </span>

                    {/* Impact Level */}
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        article.impact === 'HIGH'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      {article.impact} IMPACT
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-white group-hover:text-emerald-400 transition-colors leading-snug mb-2">
                  {article.title}
                </h3>

                {/* Summary */}
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {article.summary}
                </p>

                {/* Actions Row */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        if (article.relatedTickers.length > 0) {
                          onSelectTicker(article.relatedTickers[0]);
                        }
                        onRunOrchestrator();
                      }}
                      className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      Run AI Thesis for {article.relatedTickers[0] || selectedTicker}
                    </button>

                    <button
                      onClick={onOpenRag}
                      className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                    >
                      <Database className="w-3.5 h-3.5 text-cyan-400" />
                      Search SEC Filings in Vector RAG
                    </button>
                  </div>

                  <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded text-xs"
                  >
                    <span>Read Article</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
