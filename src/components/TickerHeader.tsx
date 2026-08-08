import React, { useMemo, useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Play,
  BookmarkPlus,
  PlusCircle,
  Building2,
  DollarSign,
  Activity,
  BarChart3,
  Sparkles,
  Check,
  Download,
  Maximize2,
  X,
  Clock,
  Radio
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, YAxis, XAxis, Tooltip, CartesianGrid } from 'recharts';
import { StockOverview, MultiAgentPipelineRun } from '../types';

interface TickerHeaderProps {
  stock: StockOverview;
  popularStocks: StockOverview[];
  selectedTicker: string;
  onSelectTicker: (symbol: string) => void;
  onRunOrchestrator: () => void;
  isRunningPipeline: boolean;
  isInWatchlist: boolean;
  onToggleWatchlist: () => void;
  onAddToPortfolio: () => void;
  pipelineRun?: MultiAgentPipelineRun | null;
}

export const TickerHeader: React.FC<TickerHeaderProps> = ({
  stock,
  popularStocks,
  selectedTicker,
  onSelectTicker,
  onRunOrchestrator,
  isRunningPipeline,
  isInWatchlist,
  onToggleWatchlist,
  onAddToPortfolio,
  pipelineRun
}) => {
  const isPositive = stock.changePercent >= 0;
  const strokeColor = isPositive ? '#10b981' : '#f43f5e';
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  // Live Chart state
  const [timeframe, setTimeframe] = useState<'5d' | '1mo' | '3mo' | '1y'>('1mo');
  const [liveChartData, setLiveChartData] = useState<any[]>([]);
  const [chartMeta, setChartMeta] = useState<{ isLive?: boolean; exchangeName?: string; currency?: string; lastUpdated?: string } | null>(null);
  const [isLoadingChart, setIsLoadingChart] = useState<boolean>(false);
  const [showExpandedChart, setShowExpandedChart] = useState<boolean>(false);

  // Fetch live market chart data
  useEffect(() => {
    let isMounted = true;
    setIsLoadingChart(true);

    fetch(`/api/ticker/${stock.symbol}/chart?range=${timeframe}`)
      .then(res => res.json())
      .then(data => {
        if (isMounted) {
          if (data && Array.isArray(data.chart) && data.chart.length > 0) {
            setLiveChartData(data.chart);
            setChartMeta(data.meta || null);
          } else {
            setLiveChartData([]);
          }
        }
      })
      .catch(err => console.error('Error loading live chart:', err))
      .finally(() => {
        if (isMounted) setIsLoadingChart(false);
      });

    return () => {
      isMounted = false;
    };
  }, [stock.symbol, timeframe]);

  const handleDownloadReport = async () => {
    setIsExportingPdf(true);
    try {
      const response = await fetch('/api/report/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker: stock.symbol,
          stock,
          report: pipelineRun?.finalReport || null,
          financialData: pipelineRun?.steps.find(s => s.agentKey === 'financial')?.output,
          newsData: pipelineRun?.steps.find(s => s.agentKey === 'news')?.output,
          valuationData: pipelineRun?.steps.find(s => s.agentKey === 'valuation')?.output,
          riskData: pipelineRun?.steps.find(s => s.agentKey === 'risk')?.output,
          portfolioData: pipelineRun?.steps.find(s => s.agentKey === 'portfolio')?.output
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Meridian_Investment_Report_${stock.symbol}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Failed to export report PDF:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Fallback sparkline if live data loading
  const fallbackSparkline = useMemo(() => {
    const points = 30;
    const data = [];
    const symbol = stock.symbol;
    let seed = 0;
    for (let i = 0; i < symbol.length; i++) {
      seed += symbol.charCodeAt(i);
    }
    const pseudoRandom = (index: number) => {
      const x = Math.sin(seed + index * 1.5) * 10000;
      return x - Math.floor(x);
    };

    const overallTrend = stock.changePercent / 100;
    const startPrice = stock.price / (1 + overallTrend * 0.8);
    const today = new Date();

    for (let i = points - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      let p: number;
      if (i === 0) {
        p = stock.price;
      } else {
        const progress = (points - i) / points;
        const baseVal = startPrice + (stock.price - startPrice) * progress;
        const noise = (pseudoRandom(i) - 0.48) * (stock.price * 0.025);
        p = Math.max(1, baseVal + noise);
      }

      data.push({
        date: dateStr,
        price: Number(p.toFixed(2))
      });
    }

    return data;
  }, [stock.symbol, stock.price, stock.changePercent]);

  const displayChartData = liveChartData.length > 0 ? liveChartData : fallbackSparkline;

  return (
    <div className="bg-[#121214] border-b border-white/5 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Quick Ticker Chips */}
        <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-white/5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap mr-1 font-mono">
              Watchlist:
            </span>
            {popularStocks.map(s => (
              <button
                key={s.symbol}
                onClick={() => onSelectTicker(s.symbol)}
                className={`px-3 py-1 rounded text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
                  selectedTicker === s.symbol
                    ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                <span>{s.symbol}</span>
                <span className={s.changePercent >= 0 ? 'text-emerald-400 text-[10px]' : 'text-rose-400 text-[10px]'}>
                  {s.changePercent >= 0 ? '▲' : '▼'}{Math.abs(s.changePercent).toFixed(1)}%
                </span>
              </button>
            ))}
          </div>

          {/* Timeframe selector */}
          <div className="hidden sm:flex items-center gap-1 bg-[#161618] p-1 rounded border border-white/10 font-mono text-[10px]">
            {(['5d', '1mo', '3mo', '1y'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded font-bold uppercase transition-colors ${
                  timeframe === tf
                    ? 'bg-emerald-500 text-black'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tf === '5d' ? '5D' : tf === '1mo' ? '1M' : tf === '3mo' ? '3M' : '1Y'}
              </button>
            ))}
          </div>
        </div>

        {/* Main Stock Summary Grid */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl font-light tracking-tight text-white font-mono">{stock.symbol}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 text-slate-300 border border-white/10 uppercase font-mono">
                {stock.sector}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 text-slate-400 border border-white/10 uppercase font-mono">
                {stock.industry}
              </span>
              {chartMeta?.isLive && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                  <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-400" />
                  Live Quote
                </span>
              )}
            </div>
            <h1 className="text-xl font-medium text-slate-100 mb-2">{stock.companyName}</h1>
            <p className="text-xs text-slate-400 line-clamp-2 max-w-3xl leading-relaxed">{stock.description}</p>
          </div>

          {/* Pricing & Key Ratios Badge */}
          <div className="flex flex-wrap items-center gap-6 bg-[#161618] p-4 rounded-lg border border-white/10 relative">
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5 font-mono flex items-center gap-1">
                <span>Stock Price</span>
                {chartMeta?.exchangeName && <span className="text-[9px] text-slate-600">({chartMeta.exchangeName})</span>}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-light font-mono text-white">${stock.price.toFixed(2)}</span>
                <span
                  className={`flex items-center text-xs font-bold font-mono ${
                    stock.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {stock.changePercent >= 0 ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
                  {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="h-10 w-px bg-white/10 hidden sm:block" />

            {/* Live Interactive Sparkline Chart */}
            <div className="w-44 h-14 flex flex-col justify-between group relative">
              <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                <span className="flex items-center gap-1">
                  <span>{timeframe.toUpperCase()} Chart</span>
                  {isLoadingChart && <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
                </span>
                <button
                  onClick={() => setShowExpandedChart(!showExpandedChart)}
                  className="text-slate-400 hover:text-emerald-400 transition-colors p-0.5 rounded hover:bg-white/5"
                  title="Expand Live Interactive Chart"
                >
                  <Maximize2 className="w-3 h-3" />
                </button>
              </div>

              <div className="w-full h-9">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={displayChartData} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
                    <defs>
                      <linearGradient id={`sparklineGrad-${stock.symbol}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={strokeColor} stopOpacity={0.45} />
                        <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} hide />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const dataPoint = payload[0].payload;
                          return (
                            <div className="bg-[#0a0a0b] border border-white/20 px-2.5 py-1.5 rounded text-[10px] font-mono shadow-xl z-50">
                              <div className="text-slate-400">{dataPoint.date}</div>
                              <div className="font-bold text-white text-xs">${dataPoint.price.toFixed(2)}</div>
                              {dataPoint.volume > 0 && (
                                <div className="text-[9px] text-slate-500">Vol: {(dataPoint.volume / 1e6).toFixed(1)}M</div>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke={strokeColor}
                      strokeWidth={1.75}
                      fillOpacity={1}
                      fill={`url(#sparklineGrad-${stock.symbol})`}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="h-10 w-px bg-white/10 hidden sm:block" />

            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5 font-mono">Market Cap</div>
              <div className="text-sm font-semibold font-mono text-slate-200">${stock.marketCap}B</div>
            </div>

            <div className="h-10 w-px bg-white/10 hidden sm:block" />

            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5 font-mono">P/E Ratio</div>
              <div className="text-sm font-semibold font-mono text-slate-200">{stock.peRatio}x</div>
            </div>

            <div className="h-10 w-px bg-white/10 hidden sm:block" />

            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5 font-mono">52W Range</div>
              <div className="text-xs font-mono text-slate-300">
                ${stock.fiftyTwoWeekLow} - ${stock.fiftyTwoWeekHigh}
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Chart View (Collapsible) */}
        {showExpandedChart && (
          <div className="mt-6 bg-[#161618] border border-white/10 rounded-xl p-6 relative animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                    {stock.symbol} — Live Market Price & Volume Chart
                  </h3>
                  <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>Range: {timeframe.toUpperCase()}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-bold">${stock.price.toFixed(2)}</span>
                    <span>({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Timeframe Buttons */}
                <div className="flex items-center gap-1 bg-[#0e0e10] p-1 rounded border border-white/10 font-mono text-xs">
                  {(['5d', '1mo', '3mo', '1y'] as const).map(tf => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-3 py-1 rounded font-bold uppercase transition-colors ${
                        timeframe === tf
                          ? 'bg-emerald-500 text-black'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {tf === '5d' ? '5 Days' : tf === '1mo' ? '1 Month' : tf === '3mo' ? '3 Months' : '1 Year'}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowExpandedChart(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Detailed Expanded Area Chart */}
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={displayChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="expandedChartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={strokeColor} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-[#0a0a0b] border border-white/20 p-3 rounded-lg shadow-2xl font-mono text-xs z-50">
                            <div className="text-slate-400 mb-1">{d.date}</div>
                            <div className="text-sm font-bold text-white mb-1">Price: ${d.price.toFixed(2)}</div>
                            {d.open && <div className="text-[11px] text-slate-300">Open: ${d.open} | High: ${d.high} | Low: ${d.low}</div>}
                            {d.volume > 0 && <div className="text-[11px] text-slate-400 mt-1">Volume: {d.volume.toLocaleString()}</div>}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={strokeColor}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#expandedChartGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Action Button Bar */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <button
              onClick={onRunOrchestrator}
              disabled={isRunningPipeline}
              className={`px-6 py-2.5 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${
                isRunningPipeline
                  ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20'
              }`}
            >
              {isRunningPipeline ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Orchestrating 6 Agents...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Multi-Agent Research Pipeline</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadReport}
              disabled={isExportingPdf}
              className="px-4 py-2.5 rounded text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 flex items-center gap-2 transition-colors font-mono uppercase tracking-wider"
              title="Export investment thesis & multi-agent summary as PDF"
            >
              {isExportingPdf ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Download Report</span>
                </>
              )}
            </button>

            <button
              onClick={onAddToPortfolio}
              className="px-4 py-2.5 rounded text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 flex items-center gap-2 transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Add to Portfolio</span>
            </button>

            <button
              onClick={onToggleWatchlist}
              className={`px-4 py-2.5 rounded text-xs font-semibold border flex items-center gap-2 transition-colors ${
                isInWatchlist
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
            >
              {isInWatchlist ? <Check className="w-4 h-4 text-emerald-400" /> : <BookmarkPlus className="w-4 h-4 text-amber-400" />}
              <span>{isInWatchlist ? 'Watchlisted' : 'Watchlist'}</span>
            </button>
          </div>

          <div className="text-[10px] text-slate-500 flex items-center gap-2 font-mono uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Multi-Agent Engine Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};


