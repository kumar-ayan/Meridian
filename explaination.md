# Meridian — Complete Codebase Explanation

> **Comprehensive technical documentation for the Meridian Multi-Agent AI Investment Research Platform.**
> Written to give a developer with zero prior context full understanding of every file, function, data flow, and architectural decision in this project.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder / File Structure](#3-folder--file-structure)
4. [Architecture](#4-architecture)
5. [Core Modules / Components](#5-core-modules--components)
6. [Data Models / Schema](#6-data-models--schema)
7. [APIs & Endpoints](#7-apis--endpoints)
8. [Configuration & Environment](#8-configuration--environment)
9. [Key Workflows](#9-key-workflows)
10. [Dependencies Between Files](#10-dependencies-between-files)
11. [Notable Patterns, Conventions & Gotchas](#11-notable-patterns-conventions--gotchas)
12. [Setup & Run Instructions](#12-setup--run-instructions)

---

## 1. Project Overview

### What Meridian Does

Meridian is a **full-stack, institutional-grade AI investment research platform** that orchestrates **6 specialized AI agents** to produce comprehensive equity research reports. It is designed to replicate the research workflow of an investment bank's equity research desk — but powered entirely by AI.

### The Problem It Solves

Traditional equity research requires an analyst to manually:
- Pull and read financial statements (10-K, 10-Q filings)
- Track news and sentiment for a stock
- Build discounted cash flow (DCF) valuation models
- Assess portfolio-level risk and position sizing
- Synthesize all of the above into an investment thesis

Meridian automates this entire pipeline. A user selects a stock ticker (e.g., `NVDA`), clicks one button, and the platform:
1. Runs 6 AI agents in parallel and sequentially
2. Analyzes financials, news sentiment, valuation, risk, and portfolio fit
3. Synthesizes everything into an executive investment report with a rating (STRONG BUY / BUY / HOLD / TRIM / SELL), price target, and confidence score
4. Provides interactive tools — a DCF sandbox with live sliders, a vector RAG knowledge base of SEC filings, a live news feed with AI sentiment scoring, portfolio management, and n8n automation workflows
5. Exports everything as a formatted PDF report

### Author

Created and owned exclusively by **Ayan kumar**.

---

## 2. Tech Stack

### Languages

| Language   | Usage                                    |
|------------|------------------------------------------|
| TypeScript | 100% of application code (frontend + backend) |
| TSX        | React component files (JSX inside TypeScript) |
| CSS        | Tailwind CSS v4 via `@import "tailwindcss"` directive |

### Frontend

| Technology        | Version   | Purpose |
|-------------------|-----------|---------|
| **React**         | 19.0.1    | UI component library. The entire frontend is a single-page application (SPA) built with functional components and hooks (`useState`, `useEffect`, `useMemo`). |
| **Tailwind CSS**  | 4.1.14    | Utility-first CSS framework. Used via the `@tailwindcss/vite` plugin — no `tailwind.config.js` needed in v4. All styling is inline utility classes. |
| **Recharts**      | 3.10.1    | Charting library for the stock price sparkline and expanded interactive area charts in `TickerHeader.tsx`. Uses `ResponsiveContainer`, `AreaChart`, `Area`, `YAxis`, `XAxis`, `Tooltip`, and `CartesianGrid`. |
| **Lucide React**  | 0.546.0   | Icon library. Every icon in the UI (search, trending arrows, CPU, database, etc.) comes from Lucide. |
| **Motion**        | 12.23.24  | Animation library (Framer Motion successor). Listed in dependencies but currently not explicitly imported in components — available for future animation enhancements. |

### Backend

| Technology          | Version   | Purpose |
|---------------------|-----------|---------|
| **Express**         | 4.21.2    | HTTP server framework. Serves all API endpoints and, in dev mode, delegates static file serving to Vite's middleware. |
| **@google/genai**   | 2.4.0     | Google Gemini AI SDK. Used to call the Gemini model (`gemini-2.5-flash` by default) with structured JSON output schemas for each agent. |
| **jsPDF**           | 4.2.1     | Server-side PDF generation. The `/api/report/export-pdf` endpoint builds a formatted institutional research PDF document programmatically. |
| **dotenv**          | 17.2.3    | Loads `.env` file variables into `process.env` at server startup. |

### Build & Dev Tools

| Tool              | Version   | Purpose |
|-------------------|-----------|---------|
| **Vite**          | 6.2.3     | Frontend build tool and dev server. In development, Vite runs as middleware inside Express (via `createViteServer` with `middlewareMode`). In production, Express serves the `dist/` static build. |
| **esbuild**       | 0.25.0    | Bundles `server.ts` into a single CommonJS file (`dist/server.cjs`) for production deployment. |
| **tsx**           | 4.21.0    | TypeScript execution engine. The `npm run dev` script runs `tsx server.ts` directly without a separate compile step. |
| **TypeScript**    | 5.8.2     | Type checking. `tsconfig.json` targets ES2022 with bundler module resolution and React JSX transform. |
| **autoprefixer**  | 10.4.21   | PostCSS plugin for CSS vendor prefixing (part of the Tailwind CSS pipeline). |

### External Data Sources

| Source            | Usage |
|-------------------|-------|
| **Yahoo Finance** | Live stock price data (`query1.finance.yahoo.com/v8/finance/chart/`) and live news search (`query1.finance.yahoo.com/v1/finance/search`). Falls back to mock data if the API is unreachable. |

---

## 3. Folder / File Structure

```
meridian/
├── .env.example               # Template for required environment variables
├── .gitignore                 # Ignores node_modules, dist, .env files, logs
├── index.html                 # Vite SPA entry point — loads /src/main.tsx
├── metadata.json              # AI Studio project metadata (name, author, capabilities)
├── package.json               # NPM dependencies, scripts, and project metadata
├── bun.lock                   # Bun package manager lockfile (alternative to npm)
├── package-lock.json          # NPM lockfile for deterministic installs
├── tsconfig.json              # TypeScript compiler configuration
├── vite.config.ts             # Vite build config — React plugin, Tailwind plugin, path aliases
├── server.ts                  # ★ THE ENTIRE BACKEND — Express server, all 6 AI agents, all API routes
├── readme.md                  # Project overview, feature list, API table, structure diagram
├── EXPLANATION.md             # Previous technical guide (shorter version)
├── explaination.md            # THIS FILE — exhaustive codebase documentation
│
├── assets/                    # Static assets
│   └── data_flow.png          # System architecture diagram image (1.3 MB)
│
├── n8n/                       # Pre-built n8n workflow automation definitions
│   ├── daily_data_refresh.json       # Cron-triggered daily market data sync workflow
│   ├── earnings_news_watcher.json    # 15-min polling workflow for SEC filings & news
│   └── weekly_portfolio_digest.json  # Weekly Sunday portfolio rebalancing digest
│
├── src/                       # Frontend React application source
│   ├── main.tsx               # React DOM entry point — renders <App /> into #root
│   ├── index.css              # Single line: @import "tailwindcss" (Tailwind v4 entry)
│   ├── App.tsx                # ★ Root component — tab routing, global state, API calls
│   ├── types.ts               # ★ All TypeScript interfaces & type definitions (260 lines)
│   │
│   ├── data/
│   │   └── mockDatabase.ts    # ★ Mock data layer — stock overviews, portfolio, vector corpus, n8n workflows
│   │
│   └── components/
│       ├── Navbar.tsx                    # Top navigation bar with tab buttons & ticker search
│       ├── TickerHeader.tsx              # Stock banner — price, chart, action buttons, PDF export
│       ├── MultiAgentPipelineViewer.tsx  # Agent execution trace with status, timing, JSON output
│       ├── InvestmentReportView.tsx      # Executive synthesis report display with sub-tabs
│       ├── FinancialStatementsView.tsx   # Income statement, balance sheet, cash flow tables
│       ├── LiveNewsFeed.tsx             # Real-time news stream with sentiment scoring
│       ├── ValuationSandbox.tsx         # Interactive DCF model with WACC/growth sliders
│       ├── VectorRagExplorer.tsx        # Vector RAG search interface for SEC filings
│       ├── PortfolioDashboard.tsx       # Portfolio holdings table with add-position modal
│       └── N8nAutomationHub.tsx         # n8n workflow viewer, trigger button, JSON export
│
├── dist/                      # Production build output (gitignored)
└── node_modules/              # Installed dependencies (gitignored)
```

### Key Observation

The entire backend lives in a **single file**: `server.ts` (1,529 lines, 63 KB). This is a deliberate monolith approach — all 6 AI agent endpoints, the orchestrator, RAG search, portfolio CRUD, n8n webhooks, live Yahoo Finance data fetching, PDF generation, and Vite/production serving are co-located in one file.

---

## 4. Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          BROWSER (React SPA)                        │
│                                                                     │
│  ┌──────────┐  ┌──────────────┐  ┌──────────┐  ┌───────────────┐  │
│  │  Navbar   │  │ TickerHeader │  │  App.tsx  │  │   Tab Views   │  │
│  │ (search)  │  │ (chart/PDF)  │  │ (router)  │  │ (10 comps)   │  │
│  └──────────┘  └──────────────┘  └──────────┘  └───────────────┘  │
│                         │  fetch() calls  │                         │
└─────────────────────────┼─────────────────┼─────────────────────────┘
                          │                 │
                          ▼                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     EXPRESS SERVER (server.ts)                       │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    AI AGENT ENDPOINTS                        │   │
│  │                                                             │   │
│  │  POST /api/agents/financial   → Financial Statement Agent   │   │
│  │  POST /api/agents/news        → News Research Agent         │   │
│  │  POST /api/agents/valuation   → Valuation & DCF Agent       │   │
│  │  POST /api/agents/risk        → Risk Analysis Agent         │   │
│  │  POST /api/agents/portfolio   → Portfolio Advisor Agent     │   │
│  │  POST /api/agents/report      → Investment Report Agent     │   │
│  │  POST /api/agents/orchestrate → ★ Runs all 6 in pipeline   │   │
│  └────────────────────────┬────────────────────────────────────┘   │
│                           │                                         │
│  ┌────────────────────────▼────────────────────────────────────┐   │
│  │              GOOGLE GEMINI AI (via @google/genai)            │   │
│  │                                                             │   │
│  │  callGeminiStructured<T>()                                  │   │
│  │    → Sends prompt + system instruction + JSON schema        │   │
│  │    → Returns structured typed data                          │   │
│  │    → Falls back to hardcoded mock data if API fails         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────────┐  ┌───────────────┐  ┌────────────────────┐  │
│  │  Yahoo Finance   │  │  In-Memory    │  │  jsPDF Generator   │  │
│  │  Live Data API   │  │  State Store  │  │  (PDF export)      │  │
│  │  (chart + news)  │  │  (portfolio,  │  │                    │  │
│  │                  │  │   watchlist,  │  │                    │  │
│  │                  │  │   RAG corpus, │  │                    │  │
│  │                  │  │   workflows)  │  │                    │  │
│  └──────────────────┘  └───────────────┘  └────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### Frontend Architecture

The frontend uses a **tab-based SPA architecture** without a client-side router (no React Router). `App.tsx` maintains an `activeTab` state variable with 6 possible values:

| Tab Value    | Component Rendered              | Purpose                          |
|-------------|--------------------------------|----------------------------------|
| `research`  | `MultiAgentPipelineViewer` + `InvestmentReportView` + `FinancialStatementsView` | Agent pipeline trace & synthesis report |
| `news`      | `LiveNewsFeed`                  | Real-time market news with sentiment |
| `portfolio` | `PortfolioDashboard`            | Holdings table & allocation metrics |
| `valuation` | `ValuationSandbox`              | Interactive DCF sliders            |
| `rag`       | `VectorRagExplorer`             | Vector similarity search on SEC filings |
| `n8n`       | `N8nAutomationHub`              | n8n workflow viewer & webhook triggers |

All state is **lifted to `App.tsx`** and passed down via props. There is no Redux, Zustand, or Context API — pure prop drilling.

### Backend Architecture

The Express server in `server.ts` follows a **monolithic, stateful** design:

- **In-memory state**: Portfolio holdings, watchlist, vector corpus, and n8n workflows are stored as mutable module-level arrays. They persist only for the lifetime of the server process.
- **AI agent pattern**: Each agent is a single Express route handler that calls `callGeminiStructured()` with a specific system instruction, prompt, JSON schema, and fallback function.
- **Orchestrator pattern**: The `/api/agents/orchestrate` endpoint calls the other 5 agent endpoints via internal `fetch()` calls to `http://127.0.0.1:3000`, then calls the 6th synthesis agent with all outputs combined.

### Data Flow

```
User clicks "Run Multi-Agent Research Pipeline"
  │
  ▼
App.tsx → handleRunOrchestrator()
  │
  ▼ POST /api/agents/orchestrate { ticker: "NVDA" }
  │
  ▼ server.ts orchestrator handler:
  │
  ├── Phase 1 (PARALLEL):
  │   ├── POST /api/agents/financial  → callGeminiStructured() → financial data
  │   ├── POST /api/agents/news       → callGeminiStructured() → news data
  │   └── POST /api/agents/risk       → callGeminiStructured() → risk data
  │
  ├── Phase 2 (SEQUENTIAL, depends on Phase 1):
  │   └── POST /api/agents/valuation  → callGeminiStructured() → valuation data
  │
  ├── Phase 3 (SEQUENTIAL, depends on Phase 2):
  │   └── POST /api/agents/portfolio  → callGeminiStructured() → portfolio advice
  │
  └── Phase 4 (SYNTHESIS, depends on all above):
      └── POST /api/agents/report     → callGeminiStructured() → final report
          │
          ▼
  Response: { runId, ticker, status, steps[], finalReport }
  │
  ▼
App.tsx → setPipelineRun(data) → re-renders MultiAgentPipelineViewer + InvestmentReportView
```

---

## 5. Core Modules / Components

### 5.1 `server.ts` — The Backend

**Lines**: 1,529 | **Size**: 63 KB

This is the single most important file in the project. It contains:

#### `getGenAIClient()` (line 24–34)
Lazy factory that creates a `GoogleGenAI` client using the `GEMINI_API_KEY` environment variable. Falls back to a mock key if none is set.

#### `callGeminiStructured<T>()` (line 43–80)
**The core AI abstraction.** A generic async function that:
1. Accepts a `prompt`, `systemInstruction`, JSON `schema`, and `fallbackFn`
2. Calls `ai.models.generateContent()` with `responseMimeType: 'application/json'` and `responseSchema`
3. Parses the JSON response and returns `{ data: T, tokensUsed, executionTimeMs }`
4. If the API call fails or parsing fails, returns `fallbackFn()` output instead

**Key design decision**: Every agent has a complete fallback function that returns realistic mock data. This means the app is fully functional even without a valid API key — the UI always has data to display.

#### Agent Endpoints (lines 85–700)
Six POST endpoints, each following the exact same pattern:
1. Extract `ticker` from `req.body`
2. Look up stock overview via `getMockStockOverview(symbol)`
3. Define a `systemInstruction` string (the agent's personality/mandate)
4. Define a `prompt` string (the specific analysis request)
5. Define a `schema` object using `@google/genai`'s `Type` enum
6. Define a `fallback()` function returning hardcoded realistic data
7. Call `callGeminiStructured()` and spread the result into the response

| Agent | Endpoint | System Role |
|-------|----------|-------------|
| Financial Statement Analysis | `/api/agents/financial` | Analyze income statements, balance sheets, cash flows. Compute margins, leverage ratios. |
| News Research | `/api/agents/news` | Analyze headlines, SEC filings, earnings transcripts. Score sentiment -1.0 to +1.0. |
| Valuation & DCF | `/api/agents/valuation` | Compute DCF fair values, peer multiples (P/E, EV/EBITDA, P/S). Output fair value range. |
| Risk Analysis | `/api/agents/risk` | Evaluate volatility, sector exposure, regulatory risk. Score 1-100. |
| Portfolio Advisor | `/api/agents/portfolio` | Analyze user holdings, recommend position sizing and action. |
| Investment Report Synthesis | `/api/agents/report` | Synthesize all 5 agent outputs into executive research report. |

#### PDF Export (lines 705–863)
`POST /api/report/export-pdf` — Server-side PDF generation using `jsPDF`:
- Builds a dark-header branded document
- Includes executive summary, thesis bullets, and all 5 agent summaries
- Returns the PDF as a binary `arraybuffer` with proper `Content-Type` and `Content-Disposition` headers

#### Orchestrator (lines 868–944)
`POST /api/agents/orchestrate` — The conductor that runs the full 6-agent pipeline:
- Phase 1: Financial, News, Risk agents run in **parallel** via `Promise.all()`
- Phase 2: Valuation agent runs after Phase 1 (needs financial data)
- Phase 3: Portfolio Advisor runs after Phase 2 (needs valuation + risk data)
- Phase 4: Report Synthesis agent runs last (needs all 5 outputs)
- Uses internal `fetch()` calls to its own endpoints (self-referential HTTP calls)

#### Vector RAG Search (lines 949–988)
- `GET /api/rag/search` — Performs text-based similarity matching against `vectorCorpus[]`. Splits query into terms, counts term matches in each chunk's text/section/documentType, calculates a score as `0.65 + (matches × 0.1)`, capped at 0.98. Sorts by score descending.
- `POST /api/rag/embed` — Adds a new text chunk to the in-memory `vectorCorpus[]` array.

**Important**: This is **not** true vector embedding search. It's a keyword-based term-matching heuristic that simulates cosine similarity scores. There is no actual embedding model or vector database (Qdrant is referenced in the UI but not actually used).

#### n8n Automation (lines 993–1048)
- `GET /api/n8n/workflows` — Returns the `n8nWorkflows[]` in-memory array
- `POST /api/n8n/trigger` — Sets workflow status to `RUNNING`, increments execution count, resets to `ACTIVE` after 1200ms timeout
- Three webhook receiver endpoints (`/api/n8n/daily-refresh`, `/api/n8n/earnings-watcher`, `/api/n8n/weekly-digest`) that return success acknowledgments

#### Portfolio & Watchlist CRUD (lines 1053–1104)
- `GET /api/portfolio` — Returns `userPortfolio[]`
- `POST /api/portfolio/add` — Adds or updates a holding, recalculates weights
- `GET /api/watchlist` — Returns `userWatchlist[]`
- `POST /api/watchlist/toggle` — Toggles a symbol in/out of the watchlist

#### Live Market Data (lines 1109–1501)
- `fetchLiveStockData()` — Calls Yahoo Finance chart API, parses OHLCV data, falls back to `generateMockChart()` if Yahoo is unreachable
- `generateMockChart()` — Produces deterministic-looking price history using a seeded pseudo-random function based on the ticker symbol's character codes
- `fetchLiveNews()` — Calls Yahoo Finance search API for news, applies regex-based sentiment classification (BULLISH/BEARISH/NEUTRAL), falls back to `getFallbackBusinessNews()` with 8 curated mock articles
- `getRelativeTimeStr()` — Converts timestamps to "5m ago", "3h ago" style strings
- `determineNewsCategory()` — Regex-based category classifier for news articles

#### Server Startup (lines 1506–1529)
`startServer()` — Conditional middleware setup:
- **Development**: Creates a Vite dev server in middleware mode and attaches it to Express. Vite handles HMR, module resolution, and serving frontend assets.
- **Production**: Serves the `dist/` directory as static files with a catch-all `*` route for SPA fallback.

---

### 5.2 `src/App.tsx` — Root Component

**Lines**: 232 | **Size**: 8.2 KB

The application shell and state manager:

**State variables**:
- `activeTab` — Which workspace tab is visible (`'research' | 'news' | 'portfolio' | 'valuation' | 'rag' | 'n8n'`)
- `selectedTicker` — Currently selected stock symbol (default: `'NVDA'`)
- `stockOverview` — `StockOverview` object for the selected ticker
- `popularStocks` — Array of preset stock overviews for the watchlist bar
- `pipelineRun` — `MultiAgentPipelineRun | null` — result of the orchestrator
- `isRunningPipeline` — Loading boolean for the orchestrator button
- `portfolio` — `PortfolioHolding[]` from the backend
- `watchlist` — `string[]` of watched ticker symbols

**Key functions**:
- `fetchStockDetails(symbol)` — Calls `GET /api/ticker/:symbol`, falls back to `getMockStockOverview()` client-side
- `fetchPortfolio()` — Calls `GET /api/portfolio` on mount
- `handleRunOrchestrator()` — Calls `POST /api/agents/orchestrate`, stores full result in `pipelineRun`
- `handleToggleWatchlist()` — Calls `POST /api/watchlist/toggle`
- `handleAddPortfolioPosition()` — Calls `POST /api/portfolio/add`

**Rendering structure**:
```
<div> (full-page dark background)
  <Navbar />
  <TickerHeader />
  <main>
    {activeTab === 'research' && <MultiAgentPipelineViewer /> + <InvestmentReportView /> + <FinancialStatementsView />}
    {activeTab === 'news' && <LiveNewsFeed />}
    {activeTab === 'portfolio' && <PortfolioDashboard />}
    {activeTab === 'valuation' && <ValuationSandbox />}
    {activeTab === 'rag' && <VectorRagExplorer />}
    {activeTab === 'n8n' && <N8nAutomationHub />}
  </main>
  <footer />
</div>
```

---

### 5.3 `src/components/Navbar.tsx`

**Lines**: 204 | **Purpose**: Sticky top navigation bar

- Displays the "MERIDIAN // INTELLIGENCE" brand logo with "Multi-Agent Engine" badge
- Contains a **ticker search bar** with a dropdown that filters `popularStocks` by symbol or company name
- Renders 6 **tab navigation buttons** (Research, News, Portfolio, DCF Valuation, Vector RAG, n8n Automation) with active state highlighting
- Icons from Lucide: `Cpu`, `Newspaper`, `PieChart`, `Sliders`, `Database`, `Workflow`

**Props**: `activeTab`, `setActiveTab`, `selectedTicker`, `onSelectTicker`, `popularStocks`, `watchlist`

---

### 5.4 `src/components/TickerHeader.tsx`

**Lines**: 502 | **Size**: 22 KB (largest component)

The main stock information banner that appears on every tab:

**Features**:
- **Watchlist chip bar**: Horizontally scrollable buttons for each stock in `popularStocks`, showing symbol + percent change
- **Timeframe selector**: 5D / 1M / 3M / 1Y buttons that trigger chart data re-fetches
- **Stock info display**: Symbol, sector, industry, company name, description
- **Live price badge**: Current price with trending arrow and percent change
- **Interactive sparkline chart**: Uses `Recharts` `AreaChart` with gradient fill. Fetches data from `/api/ticker/:symbol/chart?range=:timeframe`. Falls back to a client-side `fallbackSparkline` generated with the same seeded pseudo-random algorithm as the server.
- **Expanded chart modal**: Full-width area chart with OHLCV tooltips, grid lines, and axis labels
- **Action buttons**: "Run Multi-Agent Research Pipeline", "Download Report" (PDF), "Add to Portfolio", "Watchlist" toggle
- **"Live Quote" badge**: Shown when `chartMeta.isLive === true` (Yahoo Finance data succeeded)

**Key function**: `handleDownloadReport()` — POSTs to `/api/report/export-pdf` with all pipeline agent outputs, receives a PDF blob, creates a download link, and triggers a click.

---

### 5.5 `src/components/MultiAgentPipelineViewer.tsx`

**Lines**: 274 | **Purpose**: Visualizes the 6-agent pipeline execution

- When no pipeline run exists: Shows an idle state with instructions
- When a pipeline has completed: Shows a **6-column grid** of agent cards, each displaying agent name, icon, status (`Done`), and execution time
- Clicking an agent card opens an **output inspector** with two columns:
  - **Left**: Structured summary — key metrics for Financial agent, sentiment score for News, fair value range for Valuation, risk score for Risk, recommendation for Portfolio, executive summary for Report
  - **Right**: Raw JSON output in a `<pre>` block labeled "Pydantic Schema Output"

**Props**: `pipelineRun: MultiAgentPipelineRun | null`, `selectedTicker: string`

---

### 5.6 `src/components/InvestmentReportView.tsx`

**Lines**: 311 | **Purpose**: Displays the synthesized investment research report

- **Top banner**: Shows recommendation badge (STRONG BUY/BUY/HOLD/TRIM/SELL with color coding), 12-month target price, implied upside percentage
- **Valuation band slider**: Visual bar showing bear/base/bull cases with a white marker for current price
- **Sub-tab navigation**: Executive Summary | Investment Thesis | Key Risks & Portfolio | Data Citations
  - **Executive Summary**: Full text summary + 3 drilldown cards (Financial Statements, DCF Model, News & Sentiment)
  - **Investment Thesis**: Numbered thesis pillars
  - **Key Risks**: Risk factors in rose-colored cards + portfolio allocation guidance
  - **Data Citations**: Table with Claim, Agent Source, and Verification Date columns

**Props**: `report`, `stock`, `onOpenValuationSandbox`, `onOpenFinancials`, `onOpenNews`

---

### 5.7 `src/components/FinancialStatementsView.tsx`

**Lines**: 223 | **Purpose**: Tabbed financial statement viewer

- Conditionally rendered only when `financialAgentOutput` exists (after pipeline runs)
- **Sub-tabs**: Key Metrics | Income Statement | Balance Sheet | Cash Flow
  - **Key Metrics**: 4-card grid (Gross Margin, Operating Margin, YoY Revenue Growth, Debt/Equity) + 3-column narrative analysis (Margins, Growth, Liquidity)
  - **Income/Balance/Cash Flow**: Historical financial tables with 3 periods (FY2023, FY2024, FY2025 TTM), formatted with `$` prefix and `toLocaleString()`
- **Anomalies alert bar**: Shows flagged accounting anomalies with severity badges (HIGH/MEDIUM/LOW)

---

### 5.8 `src/components/LiveNewsFeed.tsx`

**Lines**: 426 | **Purpose**: Real-time financial news stream

- **Header**: "Live Business Stream" badge with last-updated timestamp, "Refresh News" and "Analyze with AI" buttons
- **Filter controls**: "All Market News" vs "Focus on $TICKER" toggle, category tabs (Technology & AI, Macro & Central Banks, Earnings & Financials, M&A & Deals), search bar
- **Sentiment analytics grid**: 4 cards showing Market Sentiment Heat (bullish %), Bullish Catalysts count, Bearish Headwinds count, Active Stream Count
- **News article cards**: Each card shows related ticker chips, source, time ago, category badge, sentiment badge (BULLISH/BEARISH/NEUTRAL with score), impact level, title, summary, and action buttons ("Run AI Thesis", "Search SEC Filings in Vector RAG", "Read Article")

**Data flow**: Fetches from `GET /api/news?ticker=&category=&q=` on mount and when filters change.

---

### 5.9 `src/components/ValuationSandbox.tsx`

**Lines**: 222 | **Purpose**: Interactive DCF valuation model

- **Three sensitivity sliders**:
  1. WACC Discount Rate: 6.0% — 14.0% (default 9.2%)
  2. Terminal FCF Growth Rate: 1.5% — 5.0% (default 3.5%)
  3. 5-Year FCF Growth CAGR: 10.0% — 45.0% (default 24.0%)
- **Live recalculated fair value**: Dynamically computes `adjustedFairValue` based on slider deltas from base case:
  ```typescript
  waccDelta = (defaultWacc - wacc) * 0.08       // 1% lower WACC → ~8% higher valuation
  growthDelta = (fcfGrowth - defaultBaseGrowth) * 0.015
  termDelta = (termGrowth - defaultTermGrowth) * 0.06
  adjustedFairValue = baseFairVal * (1 + waccDelta + growthDelta + termDelta)
  ```
- **"Reset Assumptions" button**: Returns all sliders to default values
- **Peer comparables table**: Shows P/E, EV/EBITDA, P/S, Gross Margin, YoY Growth for the selected stock and its sector peers

---

### 5.10 `src/components/VectorRagExplorer.tsx`

**Lines**: 258 | **Purpose**: Vector RAG knowledge base search interface

- **Search form**: Text query input + ticker filter input + "Execute Vector Search" button
- **Results display**: Cards showing ticker badge, document type (10-K, 10-Q, Earnings Transcript, etc.), period/date, cosine similarity score, section heading, and quoted text excerpt
- **Embed new chunk modal**: Full modal form for manually adding a document chunk to the vector store:
  - Ticker input
  - Document type dropdown (10-K, 10-Q, Earnings Transcript, News Article)
  - Section header text input
  - Chunk content textarea
  - "Upsert into Qdrant" submit button → POSTs to `/api/rag/embed`

**Data flow**: Fetches from `GET /api/rag/search?q=&ticker=` on mount, ticker change, and manual search.

---

### 5.11 `src/components/PortfolioDashboard.tsx`

**Lines**: 202 | **Purpose**: Portfolio holdings management

- **Top metrics**: Total Portfolio Value, Unrealized Gain/Loss (with percent), Diversification Score (hardcoded 78/100)
- **Holdings table**: 9-column table (Symbol, Sector, Shares, Avg Cost, Current Price, Market Value, Weight %, Unrealized P&L, Research button)
- **"Add New Position" modal**: Form with Ticker Symbol, Shares Count, Avg Cost Per Share fields → calls `onAddPosition` prop

---

### 5.12 `src/components/N8nAutomationHub.tsx`

**Lines**: 194 | **Purpose**: n8n workflow automation viewer

- **Workflow cards grid**: 3-column grid of workflow cards showing trigger type, status, name, description, execution count, and schedule info
- **Selected workflow detail panel**:
  - Webhook endpoint display
  - "Trigger Webhook Now" button → POSTs to `/api/n8n/trigger`
  - "Export n8n JSON" button → Downloads workflow JSON definition as a file
  - **Visual node graph**: 4-column grid rendering each n8n node with name and type
  - **Execution log console**: Shows timestamped trigger logs

---

### 5.13 `src/data/mockDatabase.ts`

**Lines**: 437 | **Purpose**: Centralized mock data store

**Exports**:
- `POPULAR_STOCKS: StockOverview[]` — 8 pre-configured stocks: NVDA, AAPL, MSFT, TSLA, AMZN, GOOGL, META, JPM. Each has symbol, company name, sector, industry, price, change %, market cap, P/E, volume, 52-week range, and description.
- `INITIAL_PORTFOLIO: PortfolioHolding[]` — 4 holdings: NVDA (120 shares), MSFT (35), AAPL (40), AMZN (52) with pre-computed market values and unrealized gains.
- `INITIAL_VECTOR_CORPUS: VectorChunk[]` — 18 pre-loaded document chunks covering SEC 10-K filings, earnings transcripts, 8-K forms, and analyst research for NVDA, AAPL, MSFT, AMZN, GOOGL, META, TSLA, and JPM.
- `INITIAL_N8N_WORKFLOWS: N8nWorkflow[]` — 3 workflow definitions with full JSON node definitions for Daily Market Refresh, Earnings Watcher, and Weekly Portfolio Digest.
- `getMockStockOverview(tickerSymbol: string): StockOverview` — Lookup function that returns a matching `POPULAR_STOCKS` entry or generates a generic placeholder for unknown tickers.

---

## 6. Data Models / Schema

All types are defined in `src/types.ts` (260 lines). Here is a field-by-field breakdown:

### `StockOverview`
```typescript
{
  symbol: string;           // e.g. "NVDA"
  companyName: string;      // e.g. "NVIDIA Corporation"
  sector: string;           // e.g. "Technology"
  industry: string;         // e.g. "Semiconductors"
  price: number;            // Current stock price in USD
  changePercent: number;    // Daily % change (e.g. 3.42)
  marketCap: number;        // Market cap in billions (e.g. 3390 = $3.39T)
  peRatio: number;          // Price-to-Earnings ratio (e.g. 52.4)
  volume: number;           // Trading volume (e.g. 48200000)
  avgVolume: number;        // Average trading volume
  fiftyTwoWeekHigh: number; // 52-week high price
  fiftyTwoWeekLow: number;  // 52-week low price
  description: string;      // Company description paragraph
}
```

### `FinancialMetrics`
```typescript
{
  revenueGrowthYoY: number;    // Year-over-year revenue growth (%)
  grossMargin: number;          // Gross profit margin (%)
  operatingMargin: number;      // Operating margin (%)
  netMargin: number;            // Net profit margin (%)
  currentRatio: number;         // Current assets / current liabilities
  quickRatio: number;           // (Current assets - inventory) / current liabilities
  debtToEquity: number;         // Total debt / total equity
  netDebtToEbitda: number;      // Net debt / EBITDA
  freeCashFlowYield: number;    // FCF / Market Cap (%)
  returnOnEquity: number;       // Net income / shareholder equity (%)
}
```

### `StatementDataPoint`
```typescript
{
  period: string;              // e.g. "FY2023", "FY2025 (TTM)"
  revenue: number;             // In millions
  grossProfit: number;
  operatingIncome: number;
  netIncome: number;
  operatingCashFlow: number;
  freeCashFlow: number;
  totalAssets: number;
  totalDebt: number;
  cashAndEquivalents: number;
}
```

### `FinancialStatementAgentOutput`
```typescript
{
  agentName: 'Financial Statement Analysis Agent';
  timestamp: string;           // ISO 8601
  ticker: string;
  keyMetrics: FinancialMetrics;
  historicalStatements: StatementDataPoint[];  // 3 periods typically
  marginsAnalysis: string;     // Narrative text
  growthAnalysis: string;
  liquidityAndLeverageAnalysis: string;
  flaggedAnomalies: {
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    title: string;
    description: string;
  }[];
  citations: string[];         // e.g. "FY2025 Form 10-K (p. 64)"
}
```

### `NewsArticle`
```typescript
{
  id: string;
  title: string;
  source: string;               // e.g. "Bloomberg Technology"
  publishedAt: string;          // ISO 8601 date
  summary: string;
  url: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  impactScore: number;          // 1-10 scale
}
```

### `NewsResearchAgentOutput`
```typescript
{
  agentName: 'News Research Agent';
  timestamp: string;
  ticker: string;
  overallSentimentScore: number;    // -1.0 to +1.0
  sentimentLabel: 'BULLISH' | 'NEUTRAL' | 'BEARISH';
  keyCatalysts: string[];           // 3+ bullish drivers
  redFlags: string[];               // 2+ risk items
  recentNewsArticles: NewsArticle[];
  transcriptHighlights: EarningsTranscriptExcerpt[];
  citations: string[];
}
```

### `ValuationAgentOutput`
```typescript
{
  agentName: 'Valuation Agent';
  ticker: string;
  currentPrice: number;
  fairValueMin: number;             // Bear case price target
  fairValueTarget: number;          // Base case price target
  fairValueMax: number;             // Bull case price target
  impliedUpsidePercent: number;     // % from current to target
  dcfModel: {
    wacc: number;                   // Discount rate (%)
    terminalGrowthRate: number;     // Terminal growth (%)
    forecastYears: number;          // Typically 5
    projectedFcfGrowth: number[];   // e.g. [28, 24, 20, 16, 12]
    dcfFairValue: number;
  };
  multiplesValuation: {
    peFairValue: number;
    evEbitdaFairValue: number;
    psFairValue: number;
    sectorPeerMedians: { pe, evEbitda, ps };
  };
  peerComparables: PeerComparable[];
  assumptions: string[];
  citations: string[];
}
```

### `RiskAnalysisAgentOutput`
```typescript
{
  agentName: 'Risk Analysis Agent';
  ticker: string;
  overallRiskScore: number;          // 1 (lowest) to 100 (highest)
  volatilityMetrics: {
    beta: number;                    // Market sensitivity
    annualizedVolatility: number;    // (%)
    maxDrawdown1Yr: number;          // (%, negative)
  };
  riskCategories: {
    category: 'Valuation' | 'Financial/Solvency' | 'Macro/Sector' | 'Execution/Regulatory' | 'Concentration';
    riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    score: number;                   // 1-10
    description: string;
  }[];
  keyMitigants: string[];
  citations: string[];
}
```

### `PortfolioHolding`
```typescript
{
  id: string;                        // e.g. "hold_1"
  symbol: string;
  companyName: string;
  shares: number;
  avgCostPrice: number;
  currentPrice: number;
  marketValue: number;               // shares × currentPrice
  weightPercent: number;             // % of total portfolio
  unrealizedGainLoss: number;        // $ gain/loss
  unrealizedGainLossPercent: number; // % gain/loss
  sector: string;
}
```

### `PortfolioAdvisorOutput`
```typescript
{
  agentName: 'Portfolio Advisor Agent';
  ticker: string;
  userRiskProfile: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
  recommendedAction: ActionRecommendation;   // STRONG_BUY | BUY | HOLD | TRIM | SELL
  targetPositionSizingPercent: number;
  currentPositionSizingPercent: number;
  recommendedSharesDelta: number;            // +25 or -15
  diversificationImpact: string;
  portfolioAlignmentNotes: string[];
  citations: string[];
}
```

### `InvestmentReportOutput`
```typescript
{
  agentName: 'Investment Report Agent';
  ticker: string;
  companyName: string;
  sector: string;
  currentPrice: number;
  targetPrice: number;
  actionRecommendation: ActionRecommendation;
  confidenceScore: number;                    // 1-100 %
  executiveSummary: string;
  investmentThesis: string[];
  valuationBandSummary: { bearCase, baseCase, bullCase };
  keyRisksSummary: string[];
  portfolioGuidance: string;
  citations: { claim, source, date }[];
}
```

### `AgentExecutionStep` & `MultiAgentPipelineRun`
```typescript
AgentExecutionStep = {
  id: string;                  // "s1" through "s6"
  agentKey: 'financial' | 'news' | 'valuation' | 'risk' | 'portfolio' | 'report';
  agentName: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  executionTimeMs?: number;
  tokensUsed?: number;
  output?: any;                // The agent's full response object
}

MultiAgentPipelineRun = {
  runId: string;               // "run_<timestamp>"
  ticker: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  steps: AgentExecutionStep[];
  finalReport?: InvestmentReportOutput;
}
```

### `VectorChunk`
```typescript
{
  id: string;                  // "chunk_nvda_10k_1"
  ticker: string;
  documentType: '10-K' | '10-Q' | 'Earnings Transcript' | 'News Article' | 'SEC Form 8-K' | 'Analyst Research';
  periodOrDate: string;        // "FY2025 Annual Report (Form 10-K)"
  section: string;             // "Item 7. Management Discussion - Data Center Growth"
  text: string;                // The actual document excerpt
  score?: number;              // Cosine similarity (0-1), set during search
}
```

### `N8nWorkflow`
```typescript
{
  id: string;                  // "wf_daily_refresh"
  name: string;
  description: string;
  triggerType: 'Schedule' | 'Webhook' | 'Event Watcher';
  scheduleInfo: string;        // "Every Weekday at 04:30 PM EST"
  status: 'ACTIVE' | 'INACTIVE' | 'RUNNING';
  lastRunAt: string;
  nextRunAt: string;
  executionCount: number;
  webhookUrl: string;
  jsonDefinition: object;      // Full n8n-compatible workflow JSON
}
```

### `ActionRecommendation` (type alias)
```typescript
type ActionRecommendation = 'STRONG_BUY' | 'BUY' | 'HOLD' | 'TRIM' | 'SELL';
```

---

## 7. APIs & Endpoints

### AI Agent Endpoints

| Method | Endpoint | Request Body | Response | Purpose |
|--------|----------|-------------|----------|---------|
| `POST` | `/api/agents/financial` | `{ ticker: string }` | `FinancialStatementAgentOutput` + `{ tokensUsed, executionTimeMs }` | Run the Financial Statement Analysis Agent |
| `POST` | `/api/agents/news` | `{ ticker: string }` | `NewsResearchAgentOutput` + `{ tokensUsed, executionTimeMs }` | Run the News Research Agent |
| `POST` | `/api/agents/valuation` | `{ ticker: string }` | `ValuationAgentOutput` + `{ tokensUsed, executionTimeMs }` | Run the Valuation & DCF Agent |
| `POST` | `/api/agents/risk` | `{ ticker: string }` | `RiskAnalysisAgentOutput` + `{ tokensUsed, executionTimeMs }` | Run the Risk Analysis Agent |
| `POST` | `/api/agents/portfolio` | `{ ticker, riskProfile?, currentHoldings? }` | `PortfolioAdvisorOutput` + `{ tokensUsed, executionTimeMs }` | Run the Portfolio Advisor Agent |
| `POST` | `/api/agents/report` | `{ ticker, financialData?, newsData?, valuationData?, riskData?, portfolioData? }` | `InvestmentReportOutput` + `{ tokensUsed, executionTimeMs }` | Run the Investment Report Synthesis Agent |
| `POST` | `/api/agents/orchestrate` | `{ ticker: string }` | `MultiAgentPipelineRun` (includes all 6 step outputs + `finalReport`) | Run the full 6-agent pipeline |

### Market Data Endpoints

| Method | Endpoint | Params | Response | Purpose |
|--------|----------|--------|----------|---------|
| `GET` | `/api/ticker/:symbol` | URL param: `symbol` | `StockOverview` | Fetch stock overview (attempts Yahoo Finance, falls back to mock) |
| `GET` | `/api/ticker/:symbol/chart` | URL param: `symbol`, Query: `range`, `interval` | `{ overview, chart[], meta }` | Fetch OHLCV chart data |
| `GET` | `/api/tickers` | — | `StockOverview[]` | Returns the 8 preset popular stocks |
| `GET` | `/api/news` | Query: `ticker?`, `category?`, `q?` | `{ news[], totalCount, lastUpdated, query }` | Fetch live/mock news with sentiment |

### RAG Endpoints

| Method | Endpoint | Params | Response | Purpose |
|--------|----------|--------|----------|---------|
| `GET` | `/api/rag/search` | Query: `q` (search text), `ticker` (filter) | `{ query, ticker, results: VectorChunk[] }` | Search the vector corpus |
| `POST` | `/api/rag/embed` | `{ ticker, documentType, periodOrDate, section, text }` | `{ success, message, chunk }` | Add a new document chunk |

### Portfolio & Watchlist Endpoints

| Method | Endpoint | Body | Response | Purpose |
|--------|----------|------|----------|---------|
| `GET` | `/api/portfolio` | — | `PortfolioHolding[]` | Get all holdings |
| `POST` | `/api/portfolio/add` | `{ symbol, shares, costPrice }` | `PortfolioHolding[]` (updated) | Add/update a position |
| `GET` | `/api/watchlist` | — | `string[]` | Get watchlist symbols |
| `POST` | `/api/watchlist/toggle` | `{ symbol: string }` | `string[]` (updated) | Toggle symbol in watchlist |

### n8n Automation Endpoints

| Method | Endpoint | Body | Response | Purpose |
|--------|----------|------|----------|---------|
| `GET` | `/api/n8n/workflows` | — | `N8nWorkflow[]` | List all n8n workflows |
| `POST` | `/api/n8n/trigger` | `{ workflowId: string }` | `{ success, message, workflow, executionLog }` | Trigger a workflow |
| `POST` | `/api/n8n/daily-refresh` | — | `{ status, action, updatedTickersCount, timestamp }` | Webhook receiver |
| `POST` | `/api/n8n/earnings-watcher` | — | `{ status, action, newFilingsIngested, ... }` | Webhook receiver |
| `POST` | `/api/n8n/weekly-digest` | — | `{ status, action, portfoliosProcessed, ... }` | Webhook receiver |

### PDF Export Endpoint

| Method | Endpoint | Body | Response | Purpose |
|--------|----------|------|----------|---------|
| `POST` | `/api/report/export-pdf` | `{ ticker, report?, financialData?, newsData?, valuationData?, riskData?, portfolioData? }` | Binary PDF (`application/pdf`) | Generate institutional research PDF |

---

## 8. Configuration & Environment

### `.env.example`

```env
GEMINI_API_KEY="MY_GEMINI_API_KEY"    # Required. Google AI Studio API key for Gemini model calls.
APP_URL="MY_APP_URL"                  # Optional. Used for self-referential URLs (Cloud Run deployments).
```

### Environment Variables Used in Code

| Variable | Where Used | Default | Purpose |
|----------|-----------|---------|---------|
| `GEMINI_API_KEY` | `server.ts:25` | `'AIzaSy_MOCK_FALLBACK_KEY'` | Authenticates Gemini API calls. If missing, API calls fail and fallback data is used. |
| `GEMINI_MODEL` | `server.ts:52` | `'gemini-2.5-flash'` | Overrides the Gemini model name. |
| `NODE_ENV` | `server.ts:1507` | `undefined` (dev) | When `'production'`, serves static files from `dist/` instead of running Vite middleware. |
| `DISABLE_HMR` | `vite.config.ts:17` | `undefined` | When `'true'`, disables Vite Hot Module Replacement and file watching (used in AI Studio to prevent flickering). |

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",                // Modern JavaScript output
    "module": "ESNext",                // ES module syntax
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",                // React 17+ JSX transform (no React import needed)
    "moduleResolution": "bundler",     // Vite-compatible resolution
    "paths": { "@/*": ["./*"] },       // Path alias: @/ maps to project root
    "allowImportingTsExtensions": true,
    "noEmit": true,                    // Type checking only, no emit
    "skipLibCheck": true
  }
}
```

### `vite.config.ts`

```typescript
export default defineConfig(() => ({
  plugins: [react(), tailwindcss()],   // React Fast Refresh + Tailwind CSS v4
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') }  // @/ → project root
  },
  server: {
    hmr: process.env.DISABLE_HMR !== 'true',      // Conditionally disable HMR
    watch: process.env.DISABLE_HMR === 'true' ? null : {}
  }
}));
```

### `package.json` Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `tsx server.ts` | Start development server (Express + Vite middleware on port 3000) |
| `build` | `vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs` | Production build: Vite bundles frontend to `dist/`, esbuild bundles backend to `dist/server.cjs` |
| `start` | `node dist/server.cjs` | Start production server |
| `preview` | `vite preview` | Preview the Vite production build |
| `clean` | `rm -rf dist server.js` | Remove build artifacts |
| `lint` | `tsc --noEmit` | TypeScript type checking without emitting files |

### `metadata.json`

```json
{
  "name": "Meridian",
  "author": "Ayan kumar",
  "description": "Full-stack AI Investment Research Platform...",
  "requestFramePermissions": [],
  "majorCapabilities": ["MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"]
}
```

This is a Google AI Studio deployment descriptor. The `majorCapabilities` array indicates the app requires server-side Gemini API access.

---

## 9. Key Workflows

### Workflow 1: User Runs the Full Multi-Agent Research Pipeline

**Trigger**: User clicks "Run Multi-Agent Research Pipeline" button on `TickerHeader`

**Step-by-step trace**:

1. **`TickerHeader.tsx`** → `onRunOrchestrator` prop is called
2. **`App.tsx`** → `handleRunOrchestrator()` executes:
   - Sets `isRunningPipeline = true`, clears previous `pipelineRun`
   - POSTs to `POST /api/agents/orchestrate` with `{ ticker: selectedTicker }`
3. **`server.ts` line 868** → Orchestrate handler:
   - Constructs `baseUrl = http://127.0.0.1:3000`
   - **Phase 1 (parallel)**: `Promise.all([fetch(financial), fetch(news), fetch(risk)])`
     - Each sub-endpoint calls `callGeminiStructured()` with its own prompt + schema
     - `callGeminiStructured()` calls `ai.models.generateContent()` on the Gemini API
     - If Gemini returns valid JSON → parse and return it
     - If Gemini fails → return fallback mock data
   - **Phase 2**: Valuation agent fetched with financial data as context
   - **Phase 3**: Portfolio advisor fetched with valuation + risk data
   - **Phase 4**: Report synthesis fetched with all 5 agent outputs
   - Returns `{ runId, ticker, status: 'completed', steps[], finalReport }`
4. **`App.tsx`** → `setPipelineRun(data)`, sets `isRunningPipeline = false`
5. **Re-render**: `MultiAgentPipelineViewer` shows the 6-agent execution trace, `InvestmentReportView` shows the synthesized report, `FinancialStatementsView` shows financial tables (if on Research tab)

---

### Workflow 2: User Searches the Vector RAG Knowledge Base

**Trigger**: User types a query in the `VectorRagExplorer` search bar and clicks "Execute Vector Search"

**Step-by-step trace**:

1. **`VectorRagExplorer.tsx`** → `handleSearchSubmit(e)` prevents default form submit
2. **`fetchSearchResults()`** → `GET /api/rag/search?q=gross+margin+supply+chain&ticker=NVDA`
3. **`server.ts` line 949** → RAG search handler:
   - Filters `vectorCorpus[]` by ticker if provided
   - Splits query into space-separated terms: `["gross", "margin", "supply", "chain"]`
   - For each chunk, counts how many query terms appear in `(text + section + documentType).toLowerCase()`
   - Calculates score: `min(0.98, 0.65 + (matches × 0.1))`
   - Sorts chunks by score descending
   - Returns `{ query, ticker, results: VectorChunk[] }`
4. **`VectorRagExplorer.tsx`** → `setChunks(data.results)` → re-renders chunk cards with scores

**Example**: Searching "gross margin supply chain" for NVDA would:
- Match `chunk_nvda_10k_1` (text mentions "Data Center revenue") — maybe 0 of 4 terms match → score 0.65
- Match `chunk_nvda_transcript_1` (text mentions "Gross margins") — "gross" + "margin" = 2 matches → score 0.85
- Match `chunk_nvda_10k_2` (text mentions "supply chain") — "supply" + "chain" = 2 matches → score 0.85

---

### Workflow 3: User Downloads a PDF Report

**Trigger**: User clicks "Download Report" button on `TickerHeader`

**Step-by-step trace**:

1. **`TickerHeader.tsx`** → `handleDownloadReport()` executes:
   - Sets `isExportingPdf = true`
   - Extracts agent outputs from `pipelineRun.steps[]` by `agentKey`
   - POSTs to `POST /api/report/export-pdf` with `{ ticker, stock, report, financialData, newsData, valuationData, riskData, portfolioData }`
2. **`server.ts` line 705** → PDF export handler:
   - Creates a new `jsPDF` document
   - Draws dark header bar (`#121214` fill)
   - Writes title in emerald green (`#10b981`): "MERIDIAN MULTI-AGENT INVESTMENT RESEARCH"
   - Writes subtitle: "EXECUTIVE RESEARCH REPORT: NVDA (NVIDIA Corporation)"
   - Writes metadata line: Date, Sector, Price, Market Cap
   - **Section 1**: Executive Summary & Investment Thesis — wraps long text with `doc.splitTextToSize()`, renders thesis bullet points
   - **Section 2**: Agent Research Summaries — loops through 5 agent summaries, handles page breaks when `y > 260`
   - Adds footer with confidentiality notice
   - Exports as `arraybuffer`, converts to Node.js `Buffer`
   - Sets response headers: `Content-Type: application/pdf`, `Content-Disposition: attachment; filename="Meridian_Investment_Report_NVDA.pdf"`
3. **`TickerHeader.tsx`** → Receives PDF blob:
   - Creates `URL.createObjectURL(blob)` 
   - Creates a hidden `<a>` element with `download` attribute
   - Programmatically clicks it to trigger browser download
   - Cleans up URL and element

---

## 10. Dependencies Between Files

### Import Dependency Graph

```
index.html
  └── src/main.tsx
        └── src/App.tsx
              ├── src/types.ts (StockOverview, MultiAgentPipelineRun, PortfolioHolding, InvestmentReportOutput)
              ├── src/data/mockDatabase.ts (POPULAR_STOCKS, getMockStockOverview)
              ├── src/components/Navbar.tsx
              │     └── src/types.ts (StockOverview)
              ├── src/components/TickerHeader.tsx
              │     └── src/types.ts (StockOverview, MultiAgentPipelineRun)
              ├── src/components/MultiAgentPipelineViewer.tsx
              │     └── src/types.ts (MultiAgentPipelineRun, AgentExecutionStep)
              ├── src/components/InvestmentReportView.tsx
              │     └── src/types.ts (InvestmentReportOutput, StockOverview)
              ├── src/components/FinancialStatementsView.tsx
              │     └── src/types.ts (FinancialStatementAgentOutput, StockOverview)
              ├── src/components/LiveNewsFeed.tsx
              │     └── src/types.ts (StockOverview) — also defines local LiveNewsItem interface
              ├── src/components/ValuationSandbox.tsx
              │     └── src/types.ts (ValuationAgentOutput, StockOverview)
              ├── src/components/VectorRagExplorer.tsx
              │     └── src/types.ts (VectorChunk)
              ├── src/components/PortfolioDashboard.tsx
              │     └── src/types.ts (PortfolioHolding)
              └── src/components/N8nAutomationHub.tsx
                    └── src/types.ts (N8nWorkflow)

server.ts (standalone, no src/ imports except mockDatabase)
  ├── express
  ├── vite (createServer)
  ├── @google/genai (GoogleGenAI, Type)
  ├── dotenv
  ├── jspdf
  └── src/data/mockDatabase.js (getMockStockOverview, INITIAL_PORTFOLIO, INITIAL_VECTOR_CORPUS, INITIAL_N8N_WORKFLOWS, POPULAR_STOCKS)
```

### Key Dependency Observations

1. **`types.ts` is the universal contract**: Every component imports from it. Changing a type definition here affects all consumers.
2. **`mockDatabase.ts` is shared between frontend and backend**: Both `App.tsx` (client-side) and `server.ts` (server-side) import from it. The server imports it with a `.js` extension (`./src/data/mockDatabase.js`) because `tsx` resolves `.ts` → `.js` at runtime.
3. **Components are leaf nodes**: No component imports another component. All composition happens in `App.tsx`.
4. **`LiveNewsFeed.tsx` defines its own `LiveNewsItem` interface**: It doesn't use the `NewsArticle` type from `types.ts` because the live news API response has a different shape (includes `timeAgo`, `sentimentScore`, `impact`, `relatedTickers`, `category`).

### "What to Touch" Guide

| To change... | Touch these files |
|--------------|-------------------|
| Add a new AI agent | `server.ts` (new endpoint + schema + fallback), `types.ts` (new output interface), `App.tsx` (extract from pipeline), new or existing component |
| Add a new stock to the preset list | `src/data/mockDatabase.ts` → `POPULAR_STOCKS` array |
| Change the Gemini model | `.env` → `GEMINI_MODEL` variable, or `server.ts` line 52 |
| Add a new navigation tab | `Navbar.tsx` (button), `App.tsx` (state type + conditional render), new component |
| Modify the PDF report format | `server.ts` lines 705–863 (jsPDF drawing commands) |
| Add a new field to stock data | `types.ts` → `StockOverview`, `mockDatabase.ts` → `POPULAR_STOCKS` entries, any component that displays stock info |
| Change the DCF sensitivity math | `ValuationSandbox.tsx` lines 37–42 |

---

## 11. Notable Patterns, Conventions & Gotchas

### Design Patterns

1. **Graceful Degradation / Fallback Pattern**: Every AI agent has a complete `fallback()` function. The app never breaks if the Gemini API is down — it silently falls back to realistic mock data. Similarly, Yahoo Finance data falls back to `generateMockChart()`.

2. **Self-Referential Orchestration**: The orchestrator (`/api/agents/orchestrate`) calls the server's own endpoints via HTTP `fetch()` rather than calling the handler functions directly. This is architecturally simple but adds HTTP overhead for each internal call.

3. **Schema-Driven AI Outputs**: Every Gemini call uses `responseMimeType: 'application/json'` and `responseSchema` to enforce structured output. The schemas use `@google/genai`'s `Type` enum (e.g., `Type.OBJECT`, `Type.STRING`, `Type.NUMBER`, `Type.ARRAY`).

4. **Merge Pattern for Agent Responses**: Agent endpoints merge Gemini's AI-generated data with fallback data using the spread operator:
   ```typescript
   const result = await callGeminiStructured(prompt, systemInstruction, schema, fallback);
   const fb = fallback();
   res.json({
     ...result.data,              // AI-generated fields
     recentNewsArticles: fb.recentNewsArticles,  // Always use fallback for this field
     tokensUsed: result.tokensUsed,
     executionTimeMs: result.executionTimeMs
   });
   ```
   This ensures fields like `recentNewsArticles` and `historicalStatements` always have data even if the AI doesn't generate them.

5. **Deterministic Mock Chart Generation**: Both client (`TickerHeader.tsx`) and server (`server.ts`) use the same seeded pseudo-random algorithm: `Math.sin(seed + index * 1.5) * 10000` where `seed` is the sum of the ticker symbol's character codes. This produces consistent-looking but unique charts per ticker.

### Naming Conventions

- **Files**: PascalCase for React components (`TickerHeader.tsx`), camelCase for data/utility files (`mockDatabase.ts`)
- **Components**: Named exports (`export const Navbar`), except `App.tsx` which uses a default export
- **Types**: PascalCase with descriptive suffixes (`FinancialStatementAgentOutput`, `ValuationAgentOutput`)
- **CSS**: All Tailwind utility classes, no custom CSS classes. Dark theme using Slate color palette (e.g., `bg-slate-950`, `text-slate-100`)
- **API routes**: RESTful with `/api/` prefix. Agent routes use `/api/agents/:agentType`
- **n8n IDs**: Prefixed with `wf_` (e.g., `wf_daily_refresh`)
- **Portfolio IDs**: Prefixed with `hold_` (e.g., `hold_1`)
- **Vector chunk IDs**: Prefixed with `chunk_` (e.g., `chunk_nvda_10k_1`)

### UI Conventions

- **Color system**: Emerald green (`#10b981` / `emerald-400/500`) for positive values, actions, and primary accents. Rose (`#f43f5e` / `rose-400`) for negative values and risk. Amber for warnings. Cyan for the RAG/database feature.
- **Typography**: Monospace font (`font-mono`) for data values, numbers, and labels. Sans-serif for prose and descriptions.
- **Background hierarchy**: `bg-slate-950` → `bg-[#121214]` → `bg-[#161618]` → `bg-[#0a0a0b]` for progressive dark card nesting.
- **Font sizing**: Extensive use of `text-[10px]` for labels and metadata, `text-xs` for body text, `text-sm` for secondary headings.

### Gotchas

1. **No persistent database**: All data is in-memory. Restarting the server resets portfolio, watchlist, and vector corpus to initial values from `mockDatabase.ts`.

2. **No authentication**: All endpoints are publicly accessible. No user sessions, no auth middleware.

3. **RAG is simulated**: The "Vector RAG" feature is keyword matching, not actual vector embedding similarity search. There's no Qdrant, no embedding model, and no real cosine similarity computation.

4. **Yahoo Finance can be blocked**: Yahoo Finance APIs are unofficial and may return 403s or rate-limit. The fallback mechanism handles this, but live data may not be available.

5. **Server import uses `.js` extension**: `server.ts` imports from `'./src/data/mockDatabase.js'` (note `.js`). This is required because `tsx` resolves TypeScript files via the `.js` extension mapping. If you change this to `.ts`, it may break at runtime.

6. **Token estimation is approximate**: `tokensUsed` is calculated as `Math.round(text.length / 4)` — a rough heuristic, not an actual token count from the API.

7. **The orchestrator makes HTTP calls to itself**: This means the server must be listening before orchestration works. If the port is blocked or the server hasn't started, orchestration fails.

8. **Tailwind CSS v4**: Uses the new `@import "tailwindcss"` syntax instead of the v3 `@tailwind base; @tailwind components; @tailwind utilities;`. Configuration is via the `@tailwindcss/vite` plugin — there is no `tailwind.config.js` file.

9. **`motion` library is unused**: The `motion` package (Framer Motion successor) is installed but not imported in any component. It adds ~30KB to the bundle for no current benefit.

---

## 12. Setup & Run Instructions

### Prerequisites

- **Node.js** v18.0.0 or higher
- **npm** (comes with Node.js) or **Bun** (alternative, `bun.lock` is present)
- A **Gemini API key** from [Google AI Studio](https://aistudio.google.com/) (optional — app works with mock data without it)

### Installation

```bash
# 1. Navigate to the project directory
cd meridian

# 2. Install dependencies
npm install
# OR with Bun:
bun install
```

### Environment Setup

```bash
# 3. Create a .env file from the template
cp .env.example .env

# 4. Edit .env and add your Gemini API key
# GEMINI_API_KEY="your_actual_api_key_here"
```

If you don't have a Gemini API key, you can still run the app — all AI features will use realistic fallback data.

### Development

```bash
# 5. Start the development server
npm run dev
```

This runs `tsx server.ts`, which:
- Starts Express on `http://0.0.0.0:3000`
- Creates a Vite dev server in middleware mode (HMR, fast refresh)
- All API routes and frontend are served from the same port

Open **http://localhost:3000** in your browser.

### Production Build

```bash
# Build both frontend (Vite) and backend (esbuild)
npm run build

# Start the production server
npm start
```

The `build` script:
1. `vite build` — Bundles React app to `dist/` with optimized assets
2. `esbuild server.ts --bundle --platform=node --format=cjs --packages=external --outfile=dist/server.cjs` — Bundles the Express server to a single CJS file

The `start` script runs `node dist/server.cjs`, which serves the `dist/` static files.

### Other Scripts

```bash
npm run preview    # Preview Vite production build (frontend only)
npm run clean      # Remove dist/ and server.js build artifacts
npm run lint       # TypeScript type checking (tsc --noEmit)
```

### Verifying the Setup

1. Open `http://localhost:3000`
2. You should see the Meridian dashboard with the NVDA ticker selected
3. Click "Run Multi-Agent Research Pipeline" — the 6-agent pipeline should execute
4. The Research tab should populate with agent outputs and a synthesis report
5. Try other tabs: News (live feed), Portfolio (holdings table), DCF Valuation (sliders), Vector RAG (search), n8n Automation (workflows)
6. Click "Download Report" to generate a PDF

---

*This document was generated by exhaustive analysis of every file in the Meridian codebase. Last updated: August 2026.*
