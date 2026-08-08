import React, { useState } from 'react';
import {
  PieChart,
  TrendingUp,
  TrendingDown,
  PlusCircle,
  ShieldCheck,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { PortfolioHolding } from '../types';

interface PortfolioDashboardProps {
  portfolio: PortfolioHolding[];
  onAddPosition: (symbol: string, shares: number, costPrice: number) => void;
  onSelectTicker: (symbol: string) => void;
}

export const PortfolioDashboard: React.FC<PortfolioDashboardProps> = ({
  portfolio,
  onAddPosition,
  onSelectTicker
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [addSymbol, setAddSymbol] = useState('NVDA');
  const [addShares, setAddShares] = useState(10);
  const [addCost, setAddCost] = useState(135.00);

  const totalMarketValue = portfolio.reduce((acc, p) => acc + p.marketValue, 0);
  const totalGainLoss = portfolio.reduce((acc, p) => acc + p.unrealizedGainLoss, 0);
  const totalCostBasis = totalMarketValue - totalGainLoss;
  const totalGainLossPercent = totalCostBasis > 0 ? (totalGainLoss / totalCostBasis) * 100 : 0;

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (addSymbol.trim()) {
      onAddPosition(addSymbol.trim().toUpperCase(), Number(addShares), Number(addCost));
      setShowAddModal(false);
    }
  };

  return (
    <div className="bg-[#121214] border border-white/5 rounded p-6 sm:p-8 my-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-white/5 px-2.5 py-1 rounded border border-white/10 uppercase tracking-widest">
              AGENT 5 • PORTFOLIO ADVISOR & FIRESTORE
            </span>
            <span className="text-xs text-slate-400 font-mono">Live Holdings</span>
          </div>
          <h2 className="text-lg font-semibold text-white">Portfolio Asset Allocation & Positions</h2>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-2 transition-colors uppercase tracking-wider font-mono"
        >
          <PlusCircle className="w-4 h-4" /> Add New Position
        </button>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#161618] p-5 rounded border border-white/5">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Total Portfolio Value</div>
          <div className="text-3xl font-light font-mono text-white">${totalMarketValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>

        <div className="bg-[#161618] p-5 rounded border border-white/5">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Unrealized Gain / Loss</div>
          <div className={`text-2xl font-light font-mono flex items-center gap-2 ${totalGainLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            <span>{totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="text-xs font-mono">({totalGainLossPercent >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%)</span>
          </div>
        </div>

        <div className="bg-[#161618] p-5 rounded border border-white/5">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Diversification Score</div>
          <div className="text-2xl font-light font-mono text-emerald-400">78 / 100</div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">Tech sector concentration: 80.9%</div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-[#0a0a0b] border border-white/5 rounded overflow-hidden">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="bg-[#161618] text-slate-400 text-[10px] uppercase tracking-wider border-b border-white/5">
              <th className="p-3 font-sans">Asset Symbol</th>
              <th className="p-3 font-sans">Sector</th>
              <th className="p-3 text-right">Shares</th>
              <th className="p-3 text-right">Avg Cost</th>
              <th className="p-3 text-right">Current Price</th>
              <th className="p-3 text-right">Market Value</th>
              <th className="p-3 text-right">Weight</th>
              <th className="p-3 text-right">Unrealized P&L</th>
              <th className="p-3 text-center font-sans">Research</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {portfolio.map(item => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors">
                <td className="p-3">
                  <div className="font-bold text-white text-sm font-mono">{item.symbol}</div>
                  <div className="text-[10px] text-slate-400 font-sans truncate max-w-[150px]">{item.companyName}</div>
                </td>
                <td className="p-3 font-sans text-slate-300">{item.sector}</td>
                <td className="p-3 text-right text-slate-200">{item.shares}</td>
                <td className="p-3 text-right">${item.avgCostPrice.toFixed(2)}</td>
                <td className="p-3 text-right text-slate-100 font-bold">${item.currentPrice.toFixed(2)}</td>
                <td className="p-3 text-right font-bold text-white">${item.marketValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="p-3 text-right text-emerald-400 font-bold">{item.weightPercent}%</td>
                <td className={`p-3 text-right font-bold ${item.unrealizedGainLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {item.unrealizedGainLoss >= 0 ? '+' : ''}${item.unrealizedGainLoss.toFixed(2)}
                  <div className="text-[10px]">({item.unrealizedGainLossPercent >= 0 ? '+' : ''}{item.unrealizedGainLossPercent.toFixed(1)}%)</div>
                </td>
                <td className="p-3 text-center font-sans">
                  <button
                    onClick={() => onSelectTicker(item.symbol)}
                    className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-emerald-400 border border-white/10 text-[10px] font-mono uppercase tracking-wider transition-colors"
                  >
                    Analyze →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Position Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121214] border border-white/10 rounded p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-emerald-400" /> Add Position to Portfolio
            </h3>

            <form onSubmit={handleSubmitAdd} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">Ticker Symbol</label>
                <input
                  type="text"
                  value={addSymbol}
                  onChange={e => setAddSymbol(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-[#0a0a0b] border border-white/10 rounded text-xs text-white font-mono uppercase focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">Shares Count</label>
                <input
                  type="number"
                  min="1"
                  value={addShares}
                  onChange={e => setAddShares(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-[#0a0a0b] border border-white/10 rounded text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">Average Cost Per Share ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={addCost}
                  onChange={e => setAddCost(parseFloat(e.target.value) || 10.0)}
                  className="w-full px-3 py-2 bg-[#0a0a0b] border border-white/10 rounded text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded uppercase tracking-wider"
                >
                  Save Position
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
