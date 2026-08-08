import React, { useState, useEffect } from 'react';
import {
  Database,
  Search,
  FileText,
  Zap,
  Plus,
  Sparkles,
  Check,
  ExternalLink,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { VectorChunk } from '../types';

interface VectorRagExplorerProps {
  selectedTicker: string;
}

export const VectorRagExplorer: React.FC<VectorRagExplorerProps> = ({ selectedTicker }) => {
  const [query, setQuery] = useState('gross margin supply chain data center');
  const [tickerFilter, setTickerFilter] = useState(selectedTicker);
  const [chunks, setChunks] = useState<VectorChunk[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Modal for manual filing chunk embedding
  const [showIngestModal, setShowIngestModal] = useState(false);
  const [newChunkTicker, setNewChunkTicker] = useState(selectedTicker);
  const [newChunkDocType, setNewChunkDocType] = useState<'10-K' | '10-Q' | 'Earnings Transcript' | 'News Article'>('10-Q');
  const [newChunkSection, setNewChunkSection] = useState('Item 2. MD&A - Liquidity & Capital');
  const [newChunkText, setNewChunkText] = useState('');

  const fetchSearchResults = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/rag/search?q=${encodeURIComponent(query)}&ticker=${encodeURIComponent(tickerFilter)}`);
      const data = await res.json();
      setChunks(data.results || []);
    } catch (err) {
      console.error('RAG Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTickerFilter(selectedTicker);
  }, [selectedTicker]);

  useEffect(() => {
    fetchSearchResults();
  }, [tickerFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSearchResults();
  };

  const handleIngestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChunkText.trim()) return;

    try {
      const res = await fetch('/api/rag/embed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker: newChunkTicker,
          documentType: newChunkDocType,
          periodOrDate: 'Q3 FY2026 Disclosure',
          section: newChunkSection,
          text: newChunkText
        })
      });
      if (res.ok) {
        setShowIngestModal(false);
        setNewChunkText('');
        fetchSearchResults();
      }
    } catch (err) {
      console.error('Ingest error:', err);
    }
  };

  return (
    <div className="bg-[#121214] border border-white/5 rounded p-6 sm:p-8 my-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-white/5 px-2.5 py-1 rounded border border-white/10 uppercase tracking-widest">
              VECTOR DB RAG • QDRANT ENGINE
            </span>
            <span className="text-xs text-slate-400 font-mono">10-K, 10-Q & Transcripts</span>
          </div>
          <h2 className="text-lg font-semibold text-white">Semantic Retrieval-Augmented Knowledge Base</h2>
        </div>

        <button
          onClick={() => setShowIngestModal(true)}
          className="px-4 py-2 rounded text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-2 transition-colors uppercase tracking-wider font-mono"
        >
          <Plus className="w-4 h-4" /> Embed New Filing Chunk
        </button>
      </div>

      {/* Query Bar */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search SEC filings, transcripts, or headlines using vector embeddings..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0b] border border-white/10 rounded text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>

        <input
          type="text"
          value={tickerFilter}
          onChange={e => setTickerFilter(e.target.value.toUpperCase())}
          placeholder="Ticker filter..."
          className="w-32 px-3 py-2.5 bg-[#0a0a0b] border border-white/10 rounded text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 uppercase font-mono text-center"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-semibold text-xs rounded flex items-center justify-center gap-2 transition-colors uppercase tracking-wider font-mono"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 text-emerald-400" />
          )}
          <span>Execute Vector Search</span>
        </button>
      </form>

      {/* RAG Chunks Result Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono uppercase tracking-wider">
          <span>Found {chunks.length} Relevant Vector Chunks</span>
          <span>Similarity Metric: Cosine Distance</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {chunks.map(chunk => (
            <div key={chunk.id} className="bg-[#161618] border border-white/5 hover:border-white/20 rounded p-5 transition-colors space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white/5 text-emerald-400 border border-white/10">
                    {chunk.ticker}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0a0a0b] text-slate-400 border border-white/5">
                    {chunk.documentType}
                  </span>
                  <span className="text-xs font-semibold text-slate-300 font-mono">{chunk.periodOrDate}</span>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-[10px] bg-white/5 px-2.5 py-1 rounded border border-white/10 text-emerald-400 uppercase tracking-wider">
                  <span>Cosine Score:</span>
                  <strong className="text-white font-bold">{chunk.score ? (chunk.score * 100).toFixed(0) + '%' : '92%'}</strong>
                </div>
              </div>

              <div className="text-xs font-semibold text-slate-200 font-mono">{chunk.section}</div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans bg-[#0a0a0b] p-3 rounded border border-white/5">
                "{chunk.text}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Embed New Chunk Modal */}
      {showIngestModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121214] border border-white/10 rounded p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" /> Embed & Upsert Document Chunk
            </h3>

            <form onSubmit={handleIngestSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">Ticker</label>
                <input
                  type="text"
                  value={newChunkTicker}
                  onChange={e => setNewChunkTicker(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-[#0a0a0b] border border-white/10 rounded text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">Document Type</label>
                <select
                  value={newChunkDocType}
                  onChange={e => setNewChunkDocType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#0a0a0b] border border-white/10 rounded text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                >
                  <option value="10-K">SEC Form 10-K (Annual)</option>
                  <option value="10-Q">SEC Form 10-Q (Quarterly)</option>
                  <option value="Earnings Transcript">Earnings Call Transcript</option>
                  <option value="News Article">Financial News Article</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">Section Header</label>
                <input
                  type="text"
                  value={newChunkSection}
                  onChange={e => setNewChunkSection(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0a0a0b] border border-white/10 rounded text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">Chunk Content Text</label>
                <textarea
                  rows={4}
                  value={newChunkText}
                  onChange={e => setNewChunkText(e.target.value)}
                  placeholder="Paste excerpt from SEC filing or transcript here..."
                  className="w-full px-3 py-2 bg-[#0a0a0b] border border-white/10 rounded text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setShowIngestModal(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded uppercase tracking-wider"
                >
                  Upsert into Qdrant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
