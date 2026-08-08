# Meridian Multi-Agent AI Financial Research Platform — Comprehensive Technical & Architecture Guide

> **Author & Owner**: Exclusively Created, Engineered, and Maintained by **Ayan kumar**  
> **Platform**: Meridian Institutional Investment Intelligence  
> **Version**: 1.0.0  

---

## 📖 Executive Summary & Mission

**Meridian** is a full-stack, institutional-grade financial research and portfolio intelligence application. Designed to mirror the depth of institutional wall-street equity research departments, Meridian automates qualitative and quantitative financial analysis using a multi-agent artificial intelligence swarm, vector retrieval-augmented generation (RAG), discounted cash flow (DCF) valuation modeling, real-time market sentiment analysis, executive PDF report compilation, and automated workflow triggers via n8n.

Everything in the platform is engineered to turn raw financial data, SEC filings, earnings transcripts, and market news into actionable, grounded investment insights without hallucinations.

---

## 🎯 What Does Meridian Do?

Meridian provides financial analysts, portfolio managers, and retail investors with six primary capabilities:

1. **Multi-Agent Research Swarm Execution**: Runs 5 specialized domain agents (Financial Statements, News & Sentiment, DCF Valuation, Risk Matrix, Portfolio Advisor) under a Supervisor Orchestrator Agent to generate a unified investment thesis.
2. **Interactive Discounted Cash Flow (DCF) Sandbox**: Allows analysts to adjust revenue growth, operating margins, discount rates (WACC), and terminal growth rates in real-time with instant price target updates.
3. **Vector RAG Knowledge Search**: Vectorizes and indexes SEC 10-K, 10-Q, 8-K filings, earnings call transcripts, and analyst research notes for semantic search and context injection.
4. **Live News Feed & Sentiment Gauge**: Streams business and market news with AI-computed sentiment scores (-1.0 to +1.0) and visual sentiment heat gauges.
5. **Real-time Portfolio Tracking & Position Management**: Tracks portfolio holdings, P&L, sector concentration limits, and position sizing recommendations.
6. **n8n Automation Hub**: Triggers automated webhooks, visualizes node graph workflows, and exports workflow JSON definitions.
7. **Executive PDF Export**: Generates downloadable, multi-page executive research reports in standard PDF format.

---

## ⚙️ How Meridian Works: Architecture & Data Flow

```
                                  ┌────────────────────────┐
                                  │      Ayan kumar        │
                                  │   (Creator & Owner)    │
                                  └───────────┬────────────┘
                                              │
┌─────────────────────────────────────────────▼─────────────────────────────────────────────┐
│                                   React 19 Frontend App                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│  │ Multi-Agent Tab  │  │  Live News Feed  │  │ Portfolio Hub    │  │ DCF Valuation    │ │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘ │
└───────────┼─────────────────────┼─────────────────────┼─────────────────────┼─────────────┘
            │                     │                     │                     │
            └─────────────────────┴──────────┬──────────┴─────────────────────┘
                                             │ HTTP REST Requests
                                  ┌──────────▼──────────┐
                                  │ Express.js Server   │ (server.ts)
                                  └──────────┬──────────┘
                                             │
             ┌───────────────────────────────┼───────────────────────────────┐
             │                               │                               │
┌────────────▼────────────┐     ┌────────────▼────────────┐     ┌────────────▼────────────┐
│   Gemini 3.6 API Swarm  │     │ Vector RAG Engine       │     │  jsPDF Report Engine    │
│ (6 Specialized Agents)  │     │ (SEC Filings Search)    │     │  (PDF Report Generator) │
└─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘
```

---

## 🤖 1. Multi-Agent AI Orchestration Engine

Meridian uses a multi-agent framework powered by Google's **Gemini 3.6 Flash** engine (`@google/genai`). Each agent has a distinct mandate, specialized system instructions, and structured JSON output schemas.

### The 6 Agent Swarm Roles

1. **Financial Statement Analysis Agent (`/api/agents/financial`)**:
   - **Task**: Analyzes balance sheets, income statements, and cash flow reports.
   - **Metrics Evaluated**: YoY Revenue Growth, Operating Margin %, Free Cash Flow Yield, Debt-to-Equity ratio, and Working Capital anomalies.
   - **Output Structure**: Scores financial health (0–100), summarizes balance sheet strength, and lists flagged financial red flags.

2. **News & Market Sentiment Agent (`/api/agents/news`)**:
   - **Task**: Processes real-time news articles, earnings call transcripts, and macroeconomic indicators.
   - **Metrics Evaluated**: Net sentiment index (-1.0 to +1.0), qualitative sentiment label (BULLISH, NEUTRAL, BEARISH), key catalysts, and risk factors.
   - **Output Structure**: Detailed breakdown of positive catalysts vs downside risks.

3. **Valuation & DCF Model Agent (`/api/agents/valuation`)**:
   - **Task**: Constructs multi-stage Discounted Cash Flow valuation models.
   - **Metrics Evaluated**: Discount Rate (WACC), Terminal Growth Rate (g), Fair Value Per Share, Base / Bull / Bear price targets, and Implied Upside/Downside %.
   - **Output Structure**: Numerical valuation parameters and sensitivity assessment.

4. **Risk Matrix Evaluation Agent (`/api/agents/risk`)**:
   - **Task**: Performs systematic risk accounting across operational, financial, macro, and regulatory dimensions.
   - **Metrics Evaluated**: Beta, 30-day Volatility, Overall Risk Score (0–100), Primary Risk Drivers, and Strategic Mitigants.
   - **Output Structure**: Actionable risk matrix with mitigation recommendations.

5. **Portfolio Advisor Agent (`/api/agents/portfolio-advisor`)**:
   - **Task**: Evaluates target ticker against active portfolio holdings and sector allocations.
   - **Metrics Evaluated**: Recommended position sizing (%), portfolio concentration limits, and diversification score impact.
   - **Output Structure**: Rebalancing advice and action (BUY, HOLD, SELL, TRIM).

6. **Supervisor Orchestrator Agent (`/api/agents/orchestrate`)**:
   - **Task**: Dispatches Agents 1–5 in parallel, collects their structured outputs, and synthesizes a master **Executive Investment Thesis**.
   - **Output Structure**: Executive Summary, Rating (STRONG BUY / BUY / HOLD / SELL), Price Target, Confidence Score (0-100%), and key investment rationale.

### Structured Schema & Fallback Reliability
To prevent runtime crashes and ensure continuous operation even during API quota spikes or network latency:
- Requests use `responseMimeType: 'application/json'` with explicit `responseSchema` definitions.
- If Gemini API fails or returns invalid JSON, `callGeminiStructured` catches the error and executes a deterministic domain fallback generator (`fallbackFn`), guaranteeing standard response types.

---

## 📚 2. Vector RAG Engine (Retrieval-Augmented Generation)

The Vector RAG system indexes enterprise financial documentation to ground AI responses in verified primary sources.

### How Vector Search Works in Meridian:
1. **Document Chunking & Storage**: Form 10-K, 10-Q, 8-K filings, earnings transcripts, and analyst research notes are pre-chunked into structured objects (`VectorDocumentChunk`) containing:
   - `id`, `ticker`, `documentType`, `title`, `period`, `content`, `embedding`, and `metadata`.
2. **Natural Language Query Tokenization**: User search queries (e.g., *"What were NVDA's data center revenue numbers?"*) are converted into feature vectors.
3. **Cosine Similarity Computation**:
   \[
   \text{Cosine Similarity} = \frac{\mathbf{A} \cdot \mathbf{B}}{\|\mathbf{A}\| \|\mathbf{B}\|} = \frac{\sum_{i=1}^{n} A_i B_i}{\sqrt{\sum_{i=1}^{n} A_i^2} \sqrt{\sum_{i=1}^{n} B_i^2}}
   \]
   Calculates vector similarity between the query embedding and every chunk in `vectorCorpus`.
4. **Context Retrieval & Ranking**: Chunks are sorted by similarity score. Top matching results are retrieved, highlighted, and injected directly into LLM prompts.

---

## 📊 3. Discounted Cash Flow (DCF) Valuation Engine

The **ValuationSandbox** component implements standard financial valuation mathematics:

### Key Formulas:

1. **Free Cash Flow (FCF) Projections**:
   \[
   \text{FCF}_t = \text{Revenue}_0 \times (1 + g)^t \times \text{Operating Margin} \times (1 - t_{\text{tax}})
   \]

2. **Present Value of Explicit Forecast (PV)**:
   \[
   \text{PV} = \sum_{t=1}^{5} \frac{\text{FCF}_t}{(1 + \text{WACC})^t}
   \]

3. **Terminal Value (Gordon Growth Model)**:
   \[
   \text{Terminal Value (TV)} = \frac{\text{FCF}_5 \times (1 + g_{\text{terminal}})}{\text{WACC} - g_{\text{terminal}}}
   \]

4. **Implied Enterprise & Equity Value**:
   \[
   \text{PV of TV} = \frac{\text{TV}}{(1 + \text{WACC})^5}
   \]
   \[
   \text{Enterprise Value (EV)} = \text{PV} + \text{PV of TV}
   \]
   \[
   \text{Equity Value} = \text{EV} + \text{Cash} - \text{Total Debt}
   \]
   \[
   \text{Fair Value Per Share} = \frac{\text{Equity Value}}{\text{Shares Outstanding}}
   \]

Users can drag sliders in the UI to recalculate these formulas instantly and inspect base, bull, and bear scenario targets.

---

## ⚡ 4. n8n Automation Engine & Webhook Hub

Meridian integrates with **n8n** to automate external financial workflows:
- **Daily SEC Watcher**: Automated polling for new Form 8-K or 10-Q filings.
- **Earnings News Watcher**: Event-driven webhook triggering sentiment checks upon news publication.
- **Weekly Portfolio Digest**: Scheduled automated summary sent to Slack or Discord webhooks.

Users can view the workflow node graph visually, trigger test webhooks directly from the UI, and download workflow JSON definitions for local or cloud n8n instances.

---

## 📄 5. Executive PDF Report Export Engine

When analysts click **"Export Executive PDF Report"**:
1. The client sends a request to `/api/report/export-pdf` containing stock details, executive summary, investment thesis, and agent findings.
2. The server initializes a `jsPDF` canvas.
3. Formats header title, metadata blocks, key metrics tables, rating callouts, and multi-agent section breakdowns.
4. Streams the compiled binary PDF back to the browser with headers `Content-Disposition: attachment; filename="Meridian_Investment_Report_[TICKER].pdf"`.

---

## 📂 Codebase File & Module Guide

| File Path | Description & Responsibility |
| :--- | :--- |
| `server.ts` | Backend Express application. Hosts Gemini 3.6 agent endpoints, vector search, portfolio API, PDF generator, and Vite middleware integration. |
| `src/App.tsx` | Main application shell. Controls global state (`selectedTicker`, `activeTab`, `pipelineRun`, `portfolio`), theme, and workspace tab routing. |
| `src/types.ts` | Global TypeScript interfaces defining agent outputs, stock overviews, vector chunks, portfolio positions, and n8n workflows. |
| `src/data/mockDatabase.ts` | Initial state database containing vector document chunks, stock financials, default portfolio holdings, and n8n workflow definitions. |
| `src/components/Navbar.tsx` | Header bar with brand logo, workspace tabs, ticker search bar, and autocomplete search dropdown. |
| `src/components/TickerHeader.tsx` | Main ticker banner displaying company price, market cap, P/E, 30-day Recharts sparkline, and PDF Export button. |
| `src/components/MultiAgentPipelineViewer.tsx` | Visualizes real-time status, token count, execution latency, and step-by-step trace of the 6 AI agents. |
| `src/components/InvestmentReportView.tsx` | Displays the final synthesized investment thesis, overall rating badge, price target, and agent summaries. |
| `src/components/FinancialStatementsView.tsx` | Income statement, balance sheet, and cash flow analysis dashboard with key financial ratio cards. |
| `src/components/LiveNewsFeed.tsx` | Market news feed with AI sentiment analysis, category filters, and live net sentiment gauge. |
| `src/components/ValuationSandbox.tsx` | Interactive DCF model sandbox with parameter sliders, sensitivity matrix, and scenario comparisons. |
| `src/components/VectorRagExplorer.tsx` | RAG search workspace for querying indexed SEC filings, viewing document chunks, and inspecting similarity scores. |
| `src/components/PortfolioDashboard.tsx` | Portfolio tracker displaying asset allocation, market value, unrealized P&L, and position manager. |
| `src/components/N8nAutomationHub.tsx` | n8n automation control center with node graph preview, webhook triggers, and JSON workflow exporter. |

---

## 🛠️ How to Run & Verify

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set API Key**:
   Set `GEMINI_API_KEY` in `.env`.

3. **Launch Dev Server**:
   ```bash
   npm run dev
   ```

4. **Verify Application**:
   - Access `http://localhost:3000`.
   - Run the Multi-Agent Research pipeline on tickers like `NVDA`, `AAPL`, `MSFT`, or `TSLA`.
   - Test the DCF Valuation sliders, Vector RAG search, News feed, Portfolio updates, n8n triggers, and Executive PDF report export.

---

## 👤 Author & Ownership Statement

This entire codebase, architecture, design system, documentation, and agent orchestration logic is created, owned, and maintained exclusively by **Ayan kumar**.

*Copyright © 2026 Ayan kumar. All rights reserved.*
