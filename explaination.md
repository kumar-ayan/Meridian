# Meridian Multi-Agent AI Financial Research Platform — Architectural Deep Dive

> **Author & Owner**: Exclusively Created, Engineered, and Maintained by **Ayan kumar**  
> **Platform**: Meridian Institutional Investment Intelligence  
> **Version**: 1.0.0  

---

## 📖 System Overview & Architecture

**Meridian** is a full-stack, institutional-grade equity research and portfolio intelligence platform designed to deliver quantitative financial analysis, DCF valuation modeling, real-time market sentiment analysis, risk assessment, and portfolio optimization.

The platform utilizes a hybrid multi-agent orchestration model powered by the **Gemini 3.6 Flash API** (`@google/genai`) and Express backend service.

---

## 🤖 1. Multi-Agent Pipeline & Specialized Roles

Meridian coordinates **5 specialized AI agents** supervised by an **Orchestrator Supervisor Agent**:

1. **Agent 1: Financial Statement Analysis Agent (`/api/agents/financial`)**
   - **Role**: Parses income statements, balance sheets, and cash flow reports.
   - **Outputs**: Revenue growth trajectories, gross/operating margins, operating leverage metrics, capital efficiency, working capital health, and debt-to-equity safety ratios.

2. **Agent 2: News & Sentiment Research Agent (`/api/agents/news`)**
   - **Role**: Analyzes real-time market sentiment, institutional news, earnings call commentary, and macroeconomic catalysts.
   - **Outputs**: Sentiment scores (-1.0 to +1.0), qualitative sentiment labels (BULLISH, NEUTRAL, BEARISH), key catalysts, and risk factors.

3. **Agent 3: Valuation & DCF Model Agent (`/api/agents/valuation`)**
   - **Role**: Builds a multi-stage Discounted Cash Flow (DCF) model and calculates enterprise fair value targets.
   - **Outputs**: WACC (Weighted Average Cost of Capital), terminal growth rates, base/bull/bear price targets, and implied upside/downside percentages.

4. **Agent 4: Risk Matrix Evaluation Agent (`/api/agents/risk`)**
   - **Role**: Evaluates systemic and company-specific risks, volatility metrics, beta, liquidity risks, and geopolitical headwinds.
   - **Outputs**: Comprehensive risk score (0-100), volatility breakdown, primary risk drivers, and strategic mitigants.

5. **Agent 5: Portfolio Advisor Agent (`/api/agents/portfolio-advisor`)**
   - **Role**: Evaluates ticker allocations against active portfolio holdings, sector concentrations, and risk profiles.
   - **Outputs**: Recommended position sizing (%), diversification score impact, position management advice, and portfolio database sync.

6. **Supervisor / Orchestrator Agent (`/api/agents/orchestrate`)**
   - **Role**: Controls execution flow, handles parallel agent dispatch, aggregates agent findings, and generates a unified Executive Investment Thesis report with price targets and investment rating.

---

## 📚 2. Vector RAG Engine (Retrieval-Augmented Generation)

The system features an integrated Vector RAG Knowledge Base indexing 15+ SEC filings, earnings transcripts, 8-K reports, and analyst research notes.

### How RAG Works in Meridian:
- **Knowledge Store**: Contains SEC Form 10-K, Form 10-Q, Form 8-K filings, earnings call transcripts, and analyst research notes for major tickers (`NVDA`, `AAPL`, `MSFT`, `AMZN`, `GOOGL`, `META`, `TSLA`, `JPM`).
- **Cosine Similarity Search**: Computes vector similarities between user natural language queries and chunked document embeddings.
- **Context Injection**: Top relevant chunks are formatted into prompt context strings for Gemini API reasoning, eliminating hallucinations and ensuring factual grounding.

---

## ⚡ 3. n8n Automation Engine & Webhooks

Meridian connects directly to external automation pipelines via **n8n Automation Engine**:
- **Triggers**: Scheduled daily SEC filing watchers, event-driven sentiment alerts, portfolio rebalancing schedules, and earnings report triggers.
- **Visual Pipeline Node Graph**: Provides interactive inspection of n8n node workflows (Webhook → HTTP Request → Gemini AI node → Discord/Slack alert).
- **JSON Export**: Export n8n workflow definitions for immediate deployment to local or self-hosted n8n instances.

---

## 📊 4. Interactive DCF Valuation Sandbox

- Parameter sliders for Revenue Growth Rate (%), Discount Rate / WACC (%), Terminal Growth Rate (%), and Operating Margin (%).
- Instant client-side recalculation of Enterprise Value, Net Debt, Equity Value, Fair Value per share, and Implied Upside/Downside vs current market price.
- Dynamic scenario comparison matrix across Base, Bull, and Bear cases.

---

## 📰 5. Live Business & Market News Feed

- **Backend Endpoint**: `GET /api/news`
- **Component**: `LiveNewsFeed.tsx`
- **Functionality**:
  1. Fetches real-time financial news, SEC announcements, and earnings disclosures from live news endpoints.
  2. Enriches each article with AI sentiment analysis (BULLISH, BEARISH, NEUTRAL) and sentiment scores (-1.0 to +1.0).
  3. Provides category filters (Technology & AI, Macro & Central Banks, Earnings, M&A) and ticker focus modes.
  4. Features a live sentiment heat gauge displaying net bullish/bearish ratios across active market streams.

---

## 📄 6. Executive PDF Report Export Engine

- **Backend API Endpoint**: `POST /api/report/export-pdf`
- **Library**: `jsPDF`
- **Functionality**:
  1. Accepts active ticker data, executive summary, investment thesis, and agent findings.
  2. Generates a styled, multi-page PDF executive research report.
  3. Returns a binary PDF stream with headers set for automatic download (`Meridian_Investment_Report_[TICKER].pdf`).

---

## 👤 Author & Ownership Notice

This software and all associated documentation were authored, engineered, and designed exclusively by **Ayan kumar**.

*Copyright © 2026 Ayan kumar. All rights reserved.*
