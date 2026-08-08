import React, { useState } from 'react';
import {
  Cpu,
  CheckCircle2,
  Clock,
  Code2,
  FileText,
  DollarSign,
  ShieldAlert,
  PieChart,
  Layers,
  Zap,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Search
} from 'lucide-react';
import { MultiAgentPipelineRun, AgentExecutionStep } from '../types';

interface MultiAgentPipelineViewerProps {
  pipelineRun: MultiAgentPipelineRun | null;
  selectedTicker: string;
}

export const MultiAgentPipelineViewer: React.FC<MultiAgentPipelineViewerProps> = ({
  pipelineRun,
  selectedTicker
}) => {
  const [selectedStepId, setSelectedStepId] = useState<string>('s6');

  if (!pipelineRun) {
    return (
      <div className="bg-[#121214] border border-white/5 rounded p-8 text-center my-6">
        <div className="w-12 h-12 rounded bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
          <Cpu className="w-6 h-6 text-emerald-400" />
        </div>
        <h3 className="text-sm font-semibold text-white mb-1 uppercase tracking-wider font-mono">Multi-Agent Pipeline Idle</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
          Click <span className="text-emerald-400 font-semibold">"Run Multi-Agent Research Pipeline"</span> to orchestrate all 6 agents (Financial, News, Valuation, Risk, Portfolio, Synthesis Report) for {selectedTicker}.
        </p>
      </div>
    );
  }

  const activeStep = pipelineRun.steps.find(s => s.id === selectedStepId) || pipelineRun.steps[0];

  const getAgentIcon = (key: string) => {
    switch (key) {
      case 'financial':
        return <FileText className="w-3.5 h-3.5 text-emerald-400" />;
      case 'news':
        return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      case 'valuation':
        return <DollarSign className="w-3.5 h-3.5 text-emerald-400" />;
      case 'risk':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />;
      case 'portfolio':
        return <PieChart className="w-3.5 h-3.5 text-emerald-400" />;
      case 'report':
        return <Sparkles className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Cpu className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="bg-[#121214] border border-white/5 rounded p-6 my-6">
      {/* Header Pipeline Summary */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-emerald-400 border border-white/10 uppercase tracking-widest">
              RUN #{pipelineRun.runId.slice(-6)}
            </span>
            <span className="text-xs text-slate-400 font-mono">Target: {selectedTicker}</span>
          </div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <span>Multi-Agent Execution Pipeline</span>
            {pipelineRun.status === 'completed' && (
              <span className="text-[10px] font-mono text-emerald-400 bg-white/5 px-2 py-0.5 rounded border border-white/10 flex items-center gap-1 uppercase tracking-wider">
                <CheckCircle2 className="w-3 h-3" /> 6/6 Agents Done
              </span>
            )}
          </h2>
        </div>

        <div className="flex items-center gap-4 bg-[#161618] px-4 py-2 rounded border border-white/10 font-mono text-xs">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Total Latency</span>
            <span className="text-emerald-400 font-bold">{pipelineRun.totalExecutionTimeMs || 1850} ms</span>
          </div>
          <div className="w-px h-6 bg-white/5" />
          <div>
            <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Architecture</span>
            <span className="text-slate-200">OpenAI SDK + Structured Outputs</span>
          </div>
        </div>
      </div>

      {/* Agent Workflow Execution Map */}
      <div className="my-6 overflow-x-auto pb-2">
        <div className="min-w-[700px] grid grid-cols-6 gap-3">
          {pipelineRun.steps.map((step, idx) => {
            const isSelected = step.id === selectedStepId;
            return (
              <button
                key={step.id}
                onClick={() => setSelectedStepId(step.id)}
                className={`p-3 rounded text-left border transition-all relative ${
                  isSelected
                    ? 'bg-white/10 border-white/20 text-white'
                    : 'bg-[#161618] border-white/5 hover:border-white/10 hover:bg-white/5 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1 rounded bg-black/40 border border-white/5">
                    {getAgentIcon(step.agentKey)}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">0{idx + 1}</span>
                </div>
                <div className="text-xs font-semibold line-clamp-1 mb-1">{step.agentName.replace(' Agent', '')}</div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span className="text-emerald-400">Done</span>
                  <span>{step.executionTimeMs}ms</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Agent Output Inspector */}
      {activeStep && (
        <div className="bg-[#161618] border border-white/10 rounded p-5">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-black/40 border border-white/5">
                {getAgentIcon(activeStep.agentKey)}
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">{activeStep.agentName}</h3>
                <p className="text-[10px] text-slate-400 font-mono">
                  Time: {activeStep.executionTimeMs}ms • Tokens: ~{activeStep.tokensUsed} • Schema: Pydantic Typed
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-mono bg-white/5 text-emerald-400 border border-white/10 rounded uppercase tracking-wider">
                VALIDATED SCHEMA
              </span>
            </div>
          </div>

          {/* Structured Summary & Tool Citations */}
          {activeStep.output && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Key Findings */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" /> Structured Agent Output
                </h4>

                {activeStep.agentKey === 'financial' && (
                  <div className="space-y-3 text-xs text-slate-300">
                    <div className="grid grid-cols-2 gap-2 bg-[#0a0a0b] p-3 rounded border border-white/5 font-mono">
                      <div>YoY Growth: <span className="text-emerald-400 font-bold">{activeStep.output.keyMetrics?.revenueGrowthYoY}%</span></div>
                      <div>Gross Margin: <span className="text-slate-200 font-bold">{activeStep.output.keyMetrics?.grossMargin}%</span></div>
                      <div>Operating Margin: <span className="text-slate-200 font-bold">{activeStep.output.keyMetrics?.operatingMargin}%</span></div>
                      <div>Debt/Equity: <span className="text-slate-200 font-bold">{activeStep.output.keyMetrics?.debtToEquity}x</span></div>
                    </div>
                    <p><strong className="text-slate-200">Margins:</strong> {activeStep.output.marginsAnalysis}</p>
                    <p><strong className="text-slate-200">Growth:</strong> {activeStep.output.growthAnalysis}</p>
                  </div>
                )}

                {activeStep.agentKey === 'news' && (
                  <div className="space-y-3 text-xs text-slate-300">
                    <div className="flex items-center gap-3 bg-[#0a0a0b] p-3 rounded border border-white/5 font-mono">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Sentiment Score</div>
                        <div className="text-base font-bold text-emerald-400">{activeStep.output.overallSentimentScore}</div>
                      </div>
                      <div className="h-6 w-px bg-white/5" />
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Outlook</div>
                        <div className="text-sm font-semibold text-white">{activeStep.output.sentimentLabel}</div>
                      </div>
                    </div>
                    <div>
                      <strong className="text-slate-200 block mb-1">Key Catalysts:</strong>
                      <ul className="list-disc pl-4 space-y-1 text-slate-400">
                        {activeStep.output.keyCatalysts?.map((c: string, idx: number) => (
                          <li key={idx}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeStep.agentKey === 'valuation' && (
                  <div className="space-y-3 text-xs text-slate-300">
                    <div className="grid grid-cols-3 gap-2 bg-[#0a0a0b] p-3 rounded border border-white/5 font-mono text-center">
                      <div>
                        <div className="text-[10px] text-slate-500">Bear Case</div>
                        <div className="text-slate-300 font-bold">${activeStep.output.fairValueMin}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-emerald-400 font-bold">Base Target</div>
                        <div className="text-emerald-400 font-bold text-sm">${activeStep.output.fairValueTarget}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500">Bull Case</div>
                        <div className="text-slate-300 font-bold">${activeStep.output.fairValueMax}</div>
                      </div>
                    </div>
                    <p><strong className="text-slate-200">Implied Upside:</strong> +{activeStep.output.impliedUpsidePercent}%</p>
                    <p><strong className="text-slate-200">WACC Discount Rate:</strong> {activeStep.output.dcfModel?.wacc}%</p>
                  </div>
                )}

                {activeStep.agentKey === 'risk' && (
                  <div className="space-y-3 text-xs text-slate-300">
                    <div className="flex items-center gap-3 bg-[#0a0a0b] p-3 rounded border border-white/5 font-mono">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Risk Score</div>
                        <div className="text-base font-bold text-amber-400">{activeStep.output.overallRiskScore}/100</div>
                      </div>
                      <div className="h-6 w-px bg-white/5" />
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Beta / Max Drawdown</div>
                        <div className="text-sm font-semibold text-slate-200">{activeStep.output.volatilityMetrics?.beta} / {activeStep.output.volatilityMetrics?.maxDrawdown1Yr}%</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeStep.agentKey === 'portfolio' && (
                  <div className="space-y-3 text-xs text-slate-300">
                    <div className="bg-[#0a0a0b] p-3 rounded border border-white/5 font-mono">
                      <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                        Recommendation: {activeStep.output.recommendedAction}
                      </div>
                      <p className="text-slate-300">Target Position Weight: {activeStep.output.targetPositionSizingPercent}%</p>
                    </div>
                  </div>
                )}

                {activeStep.agentKey === 'report' && (
                  <div className="space-y-3 text-xs text-slate-300">
                    <p className="text-slate-300 italic leading-relaxed bg-[#0a0a0b] p-3 rounded border border-white/5">
                      "{activeStep.output.executiveSummary}"
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column: Raw Pydantic JSON Output View */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2 font-mono">
                  <Code2 className="w-3.5 h-3.5 text-emerald-400" /> Pydantic Schema Output
                </h4>
                <div className="bg-[#0a0a0b] border border-white/5 rounded p-3 max-h-60 overflow-y-auto font-mono text-[11px] text-slate-300">
                  <pre>{JSON.stringify(activeStep.output, null, 2)}</pre>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
