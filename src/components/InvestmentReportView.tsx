import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  PieChart,
  FileText,
  DollarSign,
  Zap,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  Share2,
  Bookmark,
  ExternalLink,
  Target,
  BarChart3,
  Scale
} from 'lucide-react';
import { InvestmentReportOutput, StockOverview } from '../types';

interface InvestmentReportViewProps {
  report: InvestmentReportOutput | null;
  stock: StockOverview;
  onOpenValuationSandbox: () => void;
  onOpenFinancials: () => void;
  onOpenNews: () => void;
}

export const InvestmentReportView: React.FC<InvestmentReportViewProps> = ({
  report,
  stock,
  onOpenValuationSandbox,
  onOpenFinancials,
  onOpenNews
}) => {
  const [activeSubSection, setActiveSubSection] = useState<'summary' | 'thesis' | 'valuation' | 'risks' | 'citations'>('summary');

  if (!report) {
    return (
      <div className="bg-[#121214] border border-white/5 rounded p-10 text-center my-6">
        <Sparkles className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">No Generated Report for {stock.symbol} Yet</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
          Click "Run Multi-Agent Research Pipeline" above to perform financial statement, news, DCF valuation, risk, and portfolio analysis.
        </p>
      </div>
    );
  }

  const getRecBadgeClass = (rec: string) => {
    switch (rec) {
      case 'STRONG_BUY':
      case 'BUY':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'HOLD':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'TRIM':
      case 'SELL':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-white/5 text-slate-200 border-white/10';
    }
  };

  const upsidePercent = Math.round(((report.targetPrice - report.currentPrice) / report.currentPrice) * 1000) / 10;

  return (
    <div className="bg-[#121214] border border-white/5 rounded p-6 sm:p-8 my-6 space-y-8">
      {/* Top Banner: Recommendation & Target Band */}
      <div className="bg-[#161618] border border-white/10 rounded p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-white/5 px-2.5 py-1 rounded border border-white/10 uppercase tracking-widest">
                INSTITUTIONAL RESEARCH REPORT
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {new Date(report.timestamp).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight flex items-center gap-3">
              <span>{report.ticker}</span>
              <span className="text-slate-400 font-normal text-lg sm:text-xl">({report.companyName})</span>
            </h1>
          </div>

          {/* Action Recommendation Callout */}
          <div className="flex flex-wrap items-center gap-4">
            <div className={`px-5 py-3 rounded border text-center font-mono ${getRecBadgeClass(report.actionRecommendation)}`}>
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">RECOMMENDATION</div>
              <div className="text-xl font-bold">{report.actionRecommendation}</div>
            </div>

            <div className="bg-[#0a0a0b] p-3 rounded border border-white/5 font-mono text-right">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">12M Target Price</div>
              <div className="text-2xl font-light text-white">${report.targetPrice.toFixed(2)}</div>
              <div className={upsidePercent >= 0 ? 'text-xs text-emerald-400 font-bold' : 'text-xs text-rose-400 font-bold'}>
                {upsidePercent >= 0 ? '+' : ''}{upsidePercent}% Upside
              </div>
            </div>
          </div>
        </div>

        {/* Valuation Band Slider Representation */}
        <div className="mt-8 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>Bear Case: <strong className="text-rose-400">${report.valuationBandSummary.bearCase}</strong></span>
            <span className="text-emerald-400 font-bold">Base Target: ${report.valuationBandSummary.baseCase}</span>
            <span>Bull Case: <strong className="text-emerald-400">${report.valuationBandSummary.bullCase}</strong></span>
          </div>

          <div className="w-full h-2.5 bg-[#0a0a0b] rounded border border-white/5 relative overflow-hidden flex items-center">
            <div className="absolute inset-y-0 left-0 bg-rose-500/20 w-1/4" />
            <div className="absolute inset-y-0 left-1/4 bg-white/10 w-1/2" />
            <div className="absolute inset-y-0 right-0 bg-emerald-500/20 w-1/4" />

            {/* Current Price Marker */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow z-20"
              style={{
                left: `${Math.min(95, Math.max(5, ((report.currentPrice - report.valuationBandSummary.bearCase) / (report.valuationBandSummary.bullCase - report.valuationBandSummary.bearCase)) * 100))}%`
              }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-1">
            <span>Current Price: ${report.currentPrice}</span>
            <span>Confidence Level: {report.confidenceScore}%</span>
          </div>
        </div>
      </div>

      {/* Report Section Navigation */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-3">
        <button
          onClick={() => setActiveSubSection('summary')}
          className={`px-4 py-2 rounded text-xs font-semibold transition-all ${
            activeSubSection === 'summary'
              ? 'bg-white/10 text-white border border-white/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Executive Summary
        </button>

        <button
          onClick={() => setActiveSubSection('thesis')}
          className={`px-4 py-2 rounded text-xs font-semibold transition-all ${
            activeSubSection === 'thesis'
              ? 'bg-white/10 text-white border border-white/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Investment Thesis
        </button>

        <button
          onClick={() => setActiveSubSection('risks')}
          className={`px-4 py-2 rounded text-xs font-semibold transition-all ${
            activeSubSection === 'risks'
              ? 'bg-white/10 text-white border border-white/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Key Risks & Portfolio
        </button>

        <button
          onClick={() => setActiveSubSection('citations')}
          className={`px-4 py-2 rounded text-xs font-semibold transition-all ${
            activeSubSection === 'citations'
              ? 'bg-white/10 text-white border border-white/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Data Citations ({report.citations.length})
        </button>
      </div>

      {/* Active Section Details */}
      {activeSubSection === 'summary' && (
        <div className="space-y-6">
          <div className="bg-[#161618] p-6 rounded border border-white/5">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2 font-mono">
              <FileText className="w-4 h-4 text-emerald-400" /> Executive Research Summary
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {report.executiveSummary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={onOpenFinancials}
              className="p-4 rounded bg-[#161618] border border-white/5 hover:border-white/20 transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <span className="text-[10px] font-mono text-emerald-400">Drilldown →</span>
              </div>
              <div className="text-xs font-semibold text-white mb-1">Financial Statements</div>
              <p className="text-[11px] text-slate-400">View margins, YoY revenue growth, cash flow, & anomalies.</p>
            </button>

            <button
              onClick={onOpenValuationSandbox}
              className="p-4 rounded bg-[#161618] border border-white/5 hover:border-white/20 transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <span className="text-[10px] font-mono text-emerald-400">Interactive Sandbox →</span>
              </div>
              <div className="text-xs font-semibold text-white mb-1">DCF & Comps Model</div>
              <p className="text-[11px] text-slate-400">Adjust WACC, terminal growth rates, and peer multiples.</p>
            </button>

            <button
              onClick={onOpenNews}
              className="p-4 rounded bg-[#161618] border border-white/5 hover:border-white/20 transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <span className="text-[10px] font-mono text-amber-400">RAG Explorer →</span>
              </div>
              <div className="text-xs font-semibold text-white mb-1">News & Sentiment</div>
              <p className="text-[11px] text-slate-400">Search SEC 10-K/10-Q filing chunks and earnings call transcripts.</p>
            </button>
          </div>
        </div>
      )}

      {activeSubSection === 'thesis' && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 font-mono">
            <Target className="w-4 h-4 text-emerald-400" /> Investment Thesis Pillars
          </h3>

          <div className="space-y-3">
            {report.investmentThesis.map((thesisPillar, idx) => (
              <div key={idx} className="bg-[#161618] border border-white/5 rounded p-4 flex items-start gap-3">
                <div className="w-5 h-5 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 font-mono text-xs font-bold text-emerald-400 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">{thesisPillar}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubSection === 'risks' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2 font-mono">
              <ShieldAlert className="w-4 h-4 text-rose-400" /> Key Risk Factors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {report.keyRisksSummary.map((risk, idx) => (
                <div key={idx} className="bg-rose-950/10 border border-rose-900/20 rounded p-4 text-xs text-rose-200/90 leading-relaxed">
                  • {risk}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#161618] border border-white/5 rounded p-5">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-2 font-mono">
              <PieChart className="w-4 h-4 text-emerald-400" /> Portfolio Advisor Allocation Guidance
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">{report.portfolioGuidance}</p>
          </div>
        </div>
      )}

      {activeSubSection === 'citations' && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Agent Data Citations Matrix
          </h3>
          <p className="text-xs text-slate-400">
            Every numeric claim or recommendation in this report traces directly to an agent execution output.
          </p>

          <div className="bg-[#0a0a0b] border border-white/5 rounded overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#161618] text-slate-400 font-mono text-[10px] uppercase tracking-wider border-b border-white/5">
                  <th className="p-3">Claim / Data Point</th>
                  <th className="p-3">Agent Source</th>
                  <th className="p-3">Verification Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300 font-mono text-xs">
                {report.citations.map((c, idx) => (
                  <tr key={idx} className="hover:bg-white/5">
                    <td className="p-3 font-sans font-medium text-slate-200">{c.claim}</td>
                    <td className="p-3 text-emerald-400">{c.source}</td>
                    <td className="p-3 text-slate-500">{c.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
