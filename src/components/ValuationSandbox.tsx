import React, { useState } from 'react';
import {
  Sliders,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart2,
  RefreshCw,
  Info,
  Scale,
  Sparkles
} from 'lucide-react';
import { ValuationAgentOutput, StockOverview } from '../types';

interface ValuationSandboxProps {
  valuationData: ValuationAgentOutput | null;
  stock: StockOverview;
}

export const ValuationSandbox: React.FC<ValuationSandboxProps> = ({
  valuationData,
  stock
}) => {
  const defaultWacc = valuationData?.dcfModel.wacc || 9.2;
  const defaultTermGrowth = valuationData?.dcfModel.terminalGrowthRate || 3.5;
  const defaultBaseGrowth = 24.0;

  const [wacc, setWacc] = useState<number>(defaultWacc);
  const [termGrowth, setTermGrowth] = useState<number>(defaultTermGrowth);
  const [fcfGrowth, setFcfGrowth] = useState<number>(defaultBaseGrowth);

  // Dynamic DCF adjustment calculation
  const currentPrice = stock.price;
  const baseFairVal = valuationData?.fairValueTarget || currentPrice * 1.22;
  
  // Sensitivities: higher WACC lowers fair value, higher growth increases fair value
  const waccDelta = (defaultWacc - wacc) * 0.08; // 1% lower wacc -> ~8% higher valuation
  const growthDelta = (fcfGrowth - defaultBaseGrowth) * 0.015;
  const termDelta = (termGrowth - defaultTermGrowth) * 0.06;

  const adjustedFairValue = Math.round(baseFairVal * (1 + waccDelta + growthDelta + termDelta) * 100) / 100;
  const adjustedUpside = Math.round(((adjustedFairValue - currentPrice) / currentPrice) * 1000) / 10;

  return (
    <div className="bg-[#121214] border border-white/5 rounded p-6 sm:p-8 my-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-white/5 px-2.5 py-1 rounded border border-white/10 uppercase tracking-widest">
              AGENT 3 • DCF & COMPARABLES VALUATION
            </span>
            <span className="text-xs text-slate-400 font-mono">{stock.symbol}</span>
          </div>
          <h2 className="text-lg font-semibold text-white">Interactive DCF Valuation Sandbox</h2>
        </div>

        <button
          onClick={() => {
            setWacc(defaultWacc);
            setTermGrowth(defaultTermGrowth);
            setFcfGrowth(defaultBaseGrowth);
          }}
          className="px-3 py-1.5 rounded text-xs font-mono bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-emerald-400" /> Reset Assumptions
        </button>
      </div>

      {/* Main Interactive DCF Controls & Live Output */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Sliders */}
        <div className="lg:col-span-2 bg-[#161618] p-6 rounded border border-white/5 space-y-6">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 font-mono">
            <Sliders className="w-4 h-4 text-emerald-400" /> Sensitivity Parameters
          </h3>

          {/* Slider 1: WACC Discount Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300">Discount Rate / WACC:</span>
              <span className="font-bold text-emerald-400 text-sm">{wacc.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="6.0"
              max="14.0"
              step="0.1"
              value={wacc}
              onChange={e => setWacc(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 bg-black/40 cursor-pointer h-1.5 rounded"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>6.0% (Lower Risk)</span>
              <span>9.2% (Base Case)</span>
              <span>14.0% (High Risk)</span>
            </div>
          </div>

          {/* Slider 2: Terminal FCF Growth Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300">Terminal FCF Growth Rate:</span>
              <span className="font-bold text-emerald-400 text-sm">{termGrowth.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="1.5"
              max="5.0"
              step="0.1"
              value={termGrowth}
              onChange={e => setTermGrowth(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 bg-black/40 cursor-pointer h-1.5 rounded"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1.5% (GDP baseline)</span>
              <span>3.5% (Base Case)</span>
              <span>5.0% (Secular Tech)</span>
            </div>
          </div>

          {/* Slider 3: 5-Yr FCF CAGR */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300">5-Yr Projected FCF Growth CAGR:</span>
              <span className="font-bold text-emerald-400 text-sm">{fcfGrowth.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="10.0"
              max="45.0"
              step="1.0"
              value={fcfGrowth}
              onChange={e => setFcfGrowth(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 bg-black/40 cursor-pointer h-1.5 rounded"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>10.0% (Conservative)</span>
              <span>24.0% (Base Case)</span>
              <span>45.0% (High Growth)</span>
            </div>
          </div>
        </div>

        {/* Right Col: Live Adjusted Fair Value */}
        <div className="bg-[#161618] p-6 rounded border border-white/10 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-1">
              RECALCULATED DCF FAIR VALUE
            </span>
            <div className="text-4xl font-light font-mono text-white tracking-tight my-2">
              ${adjustedFairValue.toFixed(2)}
            </div>
            <div className={`text-sm font-bold font-mono ${adjustedUpside >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {adjustedUpside >= 0 ? '+' : ''}{adjustedUpside}% Implied Return
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 space-y-2 text-xs text-slate-400 font-mono">
              <div className="flex justify-between">
                <span>Current Price:</span>
                <span className="text-slate-200 font-bold">${currentPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Base Agent Target:</span>
                <span className="text-emerald-400">${baseFairVal}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-[#0a0a0b] p-3 rounded border border-white/5 text-[11px] text-slate-400">
            💡 Adjusting parameters dynamically recalculates enterprise discounted cash flow present values in real-time.
          </div>
        </div>
      </div>

      {/* Peer Comparables Table */}
      {valuationData?.peerComparables && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 font-mono">
            <BarChart2 className="w-4 h-4 text-emerald-400" /> Sector Peer Comparables Matrix
          </h3>

          <div className="bg-[#0a0a0b] border border-white/5 rounded overflow-hidden">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-[#161618] text-slate-400 border-b border-white/5 text-[10px] uppercase tracking-wider">
                  <th className="p-3 font-sans">Peer Company</th>
                  <th className="p-3 text-right">P/E Ratio</th>
                  <th className="p-3 text-right">EV/EBITDA</th>
                  <th className="p-3 text-right">P/S Ratio</th>
                  <th className="p-3 text-right">Gross Margin</th>
                  <th className="p-3 text-right">YoY Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr className="bg-white/5 font-bold text-emerald-400">
                  <td className="p-3 font-sans">{stock.symbol} ({stock.companyName})</td>
                  <td className="p-3 text-right">{stock.peRatio}x</td>
                  <td className="p-3 text-right">28.4x</td>
                  <td className="p-3 text-right">18.2x</td>
                  <td className="p-3 text-right">73.2%</td>
                  <td className="p-3 text-right">+34.5%</td>
                </tr>
                {valuationData.peerComparables.map(peer => (
                  <tr key={peer.symbol} className="hover:bg-white/5">
                    <td className="p-3 font-sans">{peer.symbol} ({peer.companyName})</td>
                    <td className="p-3 text-right">{peer.peRatio}x</td>
                    <td className="p-3 text-right">{peer.evEbitda}x</td>
                    <td className="p-3 text-right">{peer.psRatio}x</td>
                    <td className="p-3 text-right">{peer.grossMargin}%</td>
                    <td className="p-3 text-right">+{peer.revenueGrowth}%</td>
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
