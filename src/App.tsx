import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TickerHeader } from './components/TickerHeader';
import { MultiAgentPipelineViewer } from './components/MultiAgentPipelineViewer';
import { InvestmentReportView } from './components/InvestmentReportView';
import { FinancialStatementsView } from './components/FinancialStatementsView';
import { ValuationSandbox } from './components/ValuationSandbox';
import { VectorRagExplorer } from './components/VectorRagExplorer';
import { PortfolioDashboard } from './components/PortfolioDashboard';
import { N8nAutomationHub } from './components/N8nAutomationHub';
import { LiveNewsFeed } from './components/LiveNewsFeed';
import { StockOverview, MultiAgentPipelineRun, PortfolioHolding, InvestmentReportOutput } from './types';
import { POPULAR_STOCKS, getMockStockOverview } from './data/mockDatabase';

export default function App() {
  const [activeTab, setActiveTab] = useState<'research' | 'news' | 'portfolio' | 'valuation' | 'rag' | 'n8n'>('research');
  const [selectedTicker, setSelectedTicker] = useState<string>('NVDA');
  const [stockOverview, setStockOverview] = useState<StockOverview>(getMockStockOverview('NVDA'));
  const [popularStocks, setPopularStocks] = useState<StockOverview[]>(POPULAR_STOCKS);

  const [pipelineRun, setPipelineRun] = useState<MultiAgentPipelineRun | null>(null);
  const [isRunningPipeline, setIsRunningPipeline] = useState<boolean>(false);

  const [portfolio, setPortfolio] = useState<PortfolioHolding[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>(['NVDA', 'AAPL', 'MSFT', 'TSLA', 'AMZN', 'GOOGL', 'META']);

  // Fetch stock details when ticker changes
  useEffect(() => {
    fetchStockDetails(selectedTicker);
  }, [selectedTicker]);

  // Load initial portfolio on mount
  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchStockDetails = async (symbol: string) => {
    try {
      const res = await fetch(`/api/ticker/${symbol}`);
      if (res.ok) {
        const data = await res.json();
        setStockOverview(data);
      } else {
        setStockOverview(getMockStockOverview(symbol));
      }
    } catch {
      setStockOverview(getMockStockOverview(symbol));
    }
  };

  const fetchPortfolio = async () => {
    try {
      const res = await fetch('/api/portfolio');
      if (res.ok) {
        const data = await res.json();
        setPortfolio(data);
      }
    } catch (err) {
      console.error('Failed to fetch portfolio:', err);
    }
  };

  // Run the full 6-agent orchestration pipeline
  const handleRunOrchestrator = async () => {
    setIsRunningPipeline(true);
    setPipelineRun(null);

    try {
      const res = await fetch('/api/agents/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: selectedTicker })
      });

      if (res.ok) {
        const data = await res.json();
        setPipelineRun(data);
      }
    } catch (err) {
      console.error('Orchestrator error:', err);
    } finally {
      setIsRunningPipeline(false);
    }
  };

  const handleToggleWatchlist = async () => {
    try {
      const res = await fetch('/api/watchlist/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: selectedTicker })
      });
      if (res.ok) {
        const updated = await res.json();
        setWatchlist(updated);
      }
    } catch (err) {
      console.error('Watchlist toggle error:', err);
    }
  };

  const handleAddPortfolioPosition = async (symbol: string, shares: number, costPrice: number) => {
    try {
      const res = await fetch('/api/portfolio/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, shares, costPrice })
      });
      if (res.ok) {
        const updated = await res.json();
        setPortfolio(updated);
      }
    } catch (err) {
      console.error('Add portfolio error:', err);
    }
  };

  // Helper extracts
  const financialAgentOutput = pipelineRun?.steps.find(s => s.agentKey === 'financial')?.output;
  const valuationAgentOutput = pipelineRun?.steps.find(s => s.agentKey === 'valuation')?.output;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedTicker={selectedTicker}
        onSelectTicker={setSelectedTicker}
        popularStocks={popularStocks}
        watchlist={watchlist}
      />

      {/* Main Stock Banner */}
      <TickerHeader
        stock={stockOverview}
        popularStocks={popularStocks}
        selectedTicker={selectedTicker}
        onSelectTicker={setSelectedTicker}
        onRunOrchestrator={handleRunOrchestrator}
        isRunningPipeline={isRunningPipeline}
        isInWatchlist={watchlist.includes(selectedTicker)}
        onToggleWatchlist={handleToggleWatchlist}
        onAddToPortfolio={() => handleAddPortfolioPosition(selectedTicker, 10, stockOverview.price)}
        pipelineRun={pipelineRun}
      />

      {/* Main Body Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab 1: Multi-Agent Research & Investment Report */}
        {activeTab === 'research' && (
          <div className="space-y-6">
            {/* Multi-Agent Pipeline Trace */}
            <MultiAgentPipelineViewer
              pipelineRun={pipelineRun}
              selectedTicker={selectedTicker}
            />

            {/* Generated Synthesis Report */}
            <InvestmentReportView
              report={pipelineRun?.finalReport || null}
              stock={stockOverview}
              onOpenValuationSandbox={() => setActiveTab('valuation')}
              onOpenFinancials={() => setActiveTab('valuation')}
              onOpenNews={() => setActiveTab('news')}
            />

            {/* Financial Statements Sub-Component */}
            {financialAgentOutput && (
              <FinancialStatementsView
                financialData={financialAgentOutput}
                stock={stockOverview}
              />
            )}
          </div>
        )}

        {/* Tab: Live Business News Feed */}
        {activeTab === 'news' && (
          <LiveNewsFeed
            selectedTicker={selectedTicker}
            onSelectTicker={(symbol) => setSelectedTicker(symbol)}
            onRunOrchestrator={() => {
              setActiveTab('research');
              handleRunOrchestrator();
            }}
            onOpenRag={() => setActiveTab('rag')}
          />
        )}

        {/* Tab 2: Portfolio Dashboard */}
        {activeTab === 'portfolio' && (
          <PortfolioDashboard
            portfolio={portfolio}
            onAddPosition={handleAddPortfolioPosition}
            onSelectTicker={(symbol) => {
              setSelectedTicker(symbol);
              setActiveTab('research');
            }}
          />
        )}

        {/* Tab 3: Interactive DCF Valuation Sandbox */}
        {activeTab === 'valuation' && (
          <ValuationSandbox
            valuationData={valuationAgentOutput || null}
            stock={stockOverview}
          />
        )}

        {/* Tab 4: Vector RAG Search Explorer */}
        {activeTab === 'rag' && (
          <VectorRagExplorer selectedTicker={selectedTicker} />
        )}

        {/* Tab 5: n8n Automation Engine */}
        {activeTab === 'n8n' && (
          <N8nAutomationHub />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/50 py-8 mt-16 text-xs text-slate-500 font-mono text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="mb-2 text-slate-300 font-semibold">MERIDIAN • Multi-Agent AI Investment Research Platform • Created & Owned by Ayan kumar</p>
          <p className="text-slate-500">Powered by OpenAI SDK Agents &bull; Multi-Agent RAG Engine &bull; n8n Automation Engine &bull; Developed by Ayan kumar</p>
        </div>
      </footer>
    </div>
  );
}
