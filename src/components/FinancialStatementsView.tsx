import React, { useState } from 'react';
import {
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Scale,
  DollarSign,
  Info
} from 'lucide-react';
import { FinancialStatementAgentOutput, StockOverview } from '../types';

interface FinancialStatementsViewProps {
  financialData: FinancialStatementAgentOutput | null;
  stock: StockOverview;
}

export const FinancialStatementsView: React.FC<FinancialStatementsViewProps> = ({
  financialData,
  stock
}) => {
  const [activeTab, setActiveTab] = useState<'income' | 'balance' | 'cashflow' | 'ratios'>('ratios');

  if (!financialData) {
    return (
      <div className="bg-[#121214] border border-white/5 rounded p-8 text-center my-6">
        <FileText className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">Financial Data Ready to Ingest</h3>
        <p className="text-xs text-slate-400">Run the multi-agent pipeline to pull statements for {stock.symbol}.</p>
      </div>
    );
  }

  const { keyMetrics, historicalStatements, flaggedAnomalies, marginsAnalysis, growthAnalysis, liquidityAndLeverageAnalysis } = financialData;

  return (
    <div className="bg-[#121214] border border-white/5 rounded p-6 sm:p-8 my-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-white/5 px-2.5 py-1 rounded border border-white/10 uppercase tracking-widest">
              AGENT 1 • FINANCIAL STATEMENT ANALYSIS
            </span>
            <span className="text-xs text-slate-400 font-mono">{stock.symbol}</span>
          </div>
          <h2 className="text-lg font-semibold text-white">Financial Statement & Ratio Engine</h2>
        </div>

        <div className="flex items-center gap-1 bg-[#0a0a0b] p-1 rounded border border-white/10 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('ratios')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'ratios' ? 'bg-white/10 text-white border border-white/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            Key Metrics
          </button>
          <button
            onClick={() => setActiveTab('income')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'income' ? 'bg-white/10 text-white border border-white/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            Income Statement
          </button>
          <button
            onClick={() => setActiveTab('balance')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'balance' ? 'bg-white/10 text-white border border-white/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            Balance Sheet
          </button>
          <button
            onClick={() => setActiveTab('cashflow')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'cashflow' ? 'bg-white/10 text-white border border-white/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            Cash Flow
          </button>
        </div>
      </div>

      {/* Flagged Anomalies Alert Bar */}
      {flaggedAnomalies && flaggedAnomalies.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2 font-mono">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Flagged Accounting Anomalies ({flaggedAnomalies.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {flaggedAnomalies.map((anom, idx) => (
              <div key={idx} className="bg-amber-950/10 border border-amber-900/30 rounded p-4 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-amber-300 font-mono">{anom.title}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20 uppercase tracking-wider">
                    {anom.severity} SEVERITY
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">{anom.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ratios Breakdown Grid */}
      {activeTab === 'ratios' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#161618] p-4 rounded border border-white/5">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-mono">Gross Margin</div>
              <div className="text-xl font-light font-mono text-emerald-400">{keyMetrics.grossMargin}%</div>
            </div>

            <div className="bg-[#161618] p-4 rounded border border-white/5">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-mono">Operating Margin</div>
              <div className="text-xl font-light font-mono text-white">{keyMetrics.operatingMargin}%</div>
            </div>

            <div className="bg-[#161618] p-4 rounded border border-white/5">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-mono">YoY Revenue Growth</div>
              <div className="text-xl font-light font-mono text-emerald-400">+{keyMetrics.revenueGrowthYoY}%</div>
            </div>

            <div className="bg-[#161618] p-4 rounded border border-white/5">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-mono">Debt to Equity</div>
              <div className="text-xl font-light font-mono text-slate-200">{keyMetrics.debtToEquity}x</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#161618] p-4 rounded border border-white/5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 font-mono">Margins Analysis</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{marginsAnalysis}</p>
            </div>

            <div className="bg-[#161618] p-4 rounded border border-white/5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 font-mono">Growth Dynamics</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{growthAnalysis}</p>
            </div>

            <div className="bg-[#161618] p-4 rounded border border-white/5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 font-mono">Liquidity & Solvency</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{liquidityAndLeverageAnalysis}</p>
            </div>
          </div>
        </div>
      )}

      {/* Historical Financial Tables */}
      {(activeTab === 'income' || activeTab === 'balance' || activeTab === 'cashflow') && (
        <div className="bg-[#0a0a0b] border border-white/5 rounded overflow-hidden">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-[#161618] text-slate-400 border-b border-white/5 text-[10px] uppercase tracking-wider">
                <th className="p-3 text-slate-300 font-sans">Line Item ($ Millions)</th>
                {historicalStatements.map(s => (
                  <th key={s.period} className="p-3 text-right">{s.period}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {activeTab === 'income' && (
                <>
                  <tr className="hover:bg-white/5">
                    <td className="p-3 font-semibold text-white font-sans">Total Revenue</td>
                    {historicalStatements.map(s => <td key={s.period} className="p-3 text-right font-bold text-emerald-400">${s.revenue.toLocaleString()}</td>)}
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="p-3 font-sans">Gross Profit</td>
                    {historicalStatements.map(s => <td key={s.period} className="p-3 text-right">${s.grossProfit.toLocaleString()}</td>)}
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="p-3 font-sans">Operating Income (EBIT)</td>
                    {historicalStatements.map(s => <td key={s.period} className="p-3 text-right text-white">${s.operatingIncome.toLocaleString()}</td>)}
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="p-3 font-semibold text-white font-sans">Net Income</td>
                    {historicalStatements.map(s => <td key={s.period} className="p-3 text-right font-bold text-emerald-400">${s.netIncome.toLocaleString()}</td>)}
                  </tr>
                </>
              )}

              {activeTab === 'balance' && (
                <>
                  <tr className="hover:bg-white/5">
                    <td className="p-3 font-semibold text-white font-sans">Cash & Equivalents</td>
                    {historicalStatements.map(s => <td key={s.period} className="p-3 text-right font-bold text-emerald-400">${s.cashAndEquivalents.toLocaleString()}</td>)}
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="p-3 font-sans">Total Debt</td>
                    {historicalStatements.map(s => <td key={s.period} className="p-3 text-right text-amber-400">${s.totalDebt.toLocaleString()}</td>)}
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="p-3 font-semibold text-white font-sans">Total Assets</td>
                    {historicalStatements.map(s => <td key={s.period} className="p-3 text-right font-bold text-white">${s.totalAssets.toLocaleString()}</td>)}
                  </tr>
                </>
              )}

              {activeTab === 'cashflow' && (
                <>
                  <tr className="hover:bg-white/5">
                    <td className="p-3 font-sans">Operating Cash Flow</td>
                    {historicalStatements.map(s => <td key={s.period} className="p-3 text-right">${s.operatingCashFlow.toLocaleString()}</td>)}
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="p-3 font-semibold text-white font-sans">Free Cash Flow (FCF)</td>
                    {historicalStatements.map(s => <td key={s.period} className="p-3 text-right font-bold text-emerald-400">${s.freeCashFlow.toLocaleString()}</td>)}
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
