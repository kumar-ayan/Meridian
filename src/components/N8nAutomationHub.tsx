import React, { useState, useEffect } from 'react';
import {
  Workflow,
  Play,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Code2,
  RefreshCw,
  Sparkles,
  Zap,
  Layers
} from 'lucide-react';
import { N8nWorkflow } from '../types';

export const N8nAutomationHub: React.FC = () => {
  const [workflows, setWorkflows] = useState<N8nWorkflow[]>([]);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>('wf_daily_refresh');
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [isTriggering, setIsTriggering] = useState<boolean>(false);

  const fetchWorkflows = async () => {
    try {
      const res = await fetch('/api/n8n/workflows');
      const data = await res.json();
      setWorkflows(data || []);
    } catch (err) {
      console.error('Failed to fetch n8n workflows:', err);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const activeWf = workflows.find(w => w.id === selectedWorkflowId) || workflows[0];

  const handleTriggerWorkflow = async (wfId: string) => {
    setIsTriggering(true);
    try {
      const res = await fetch('/api/n8n/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId: wfId })
      });
      const data = await res.json();
      if (data.executionLog) {
        setExecutionLogs(prev => [data.executionLog, ...prev]);
      }
      fetchWorkflows();
    } catch (err) {
      console.error('Trigger error:', err);
    } finally {
      setIsTriggering(false);
    }
  };

  const handleDownloadJson = (wf: N8nWorkflow) => {
    const jsonStr = JSON.stringify(wf.jsonDefinition, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${wf.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#121214] border border-white/5 rounded p-6 sm:p-8 my-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-white/5 px-2.5 py-1 rounded border border-white/10 uppercase tracking-widest">
              WORKFLOW ORCHESTRATION • N8N
            </span>
            <span className="text-xs text-slate-400 font-mono">Scheduled & Event Drivers</span>
          </div>
          <h2 className="text-lg font-semibold text-white">n8n External Automation & Trigger Engine</h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-[#0a0a0b] px-3 py-1.5 rounded border border-white/10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>n8n Cloud Webhook Gateway Active</span>
        </div>
      </div>

      {/* Workflows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {workflows.map(wf => {
          const isSelected = wf.id === selectedWorkflowId;
          return (
            <div
              key={wf.id}
              onClick={() => setSelectedWorkflowId(wf.id)}
              className={`p-5 rounded border cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-[#161618] border-white/20'
                  : 'bg-[#0a0a0b] border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-emerald-400 border border-white/10 font-bold uppercase tracking-wider">
                  {wf.triggerType}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {wf.status}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-white mb-2 line-clamp-1">{wf.name}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">{wf.description}</p>

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono border-t border-white/5 pt-3 uppercase tracking-wider">
                <span>Runs: {wf.executionCount}</span>
                <span className="text-slate-400">{wf.scheduleInfo}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Workflow Detailed Graph & Actions */}
      {activeWf && (
        <div className="bg-[#0a0a0b] border border-white/5 rounded p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
            <div>
              <h3 className="text-base font-semibold text-white">{activeWf.name}</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Webhook Endpoint: {activeWf.webhookUrl}</p>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              <button
                onClick={() => handleTriggerWorkflow(activeWf.id)}
                disabled={isTriggering}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded flex items-center gap-2 transition-colors uppercase tracking-wider"
              >
                {isTriggering ? (
                  <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-black" />
                )}
                <span>Trigger Webhook Now</span>
              </button>

              <button
                onClick={() => handleDownloadJson(activeWf)}
                className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-semibold rounded flex items-center gap-1.5 transition-colors uppercase tracking-wider"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export n8n JSON</span>
              </button>
            </div>
          </div>

          {/* n8n Visual Graph Representation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 font-mono">
              <Layers className="w-3.5 h-3.5 text-emerald-400" /> Visual n8n Pipeline Node Graph
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-[#161618] p-4 rounded border border-white/5">
              {(activeWf.jsonDefinition as any)?.nodes?.map((node: any, idx: number) => (
                <div key={idx} className="bg-[#0a0a0b] p-3 rounded border border-white/5 text-xs relative">
                  <div className="text-[10px] text-emerald-400 font-mono font-bold mb-1 uppercase tracking-wider">NODE #{idx + 1}</div>
                  <div className="font-semibold text-slate-200 mb-1">{node.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono truncate">{node.type}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Execution Trigger Log Output */}
          {executionLogs.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 font-mono">
                <Code2 className="w-3.5 h-3.5 text-emerald-400" /> Webhook Trigger Activity Console Log
              </h4>
              <div className="bg-[#161618] border border-white/5 rounded p-3 font-mono text-[11px] text-emerald-400 space-y-1 max-h-36 overflow-y-auto">
                {executionLogs.map((log, idx) => (
                  <div key={idx}>{log}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
