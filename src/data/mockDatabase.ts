import {
  StockOverview,
  FinancialStatementAgentOutput,
  NewsResearchAgentOutput,
  ValuationAgentOutput,
  RiskAnalysisAgentOutput,
  PortfolioAdvisorOutput,
  InvestmentReportOutput,
  VectorChunk,
  N8nWorkflow,
  PortfolioHolding
} from '../types';

export const POPULAR_STOCKS: StockOverview[] = [
  {
    symbol: 'NVDA',
    companyName: 'NVIDIA Corporation',
    sector: 'Technology',
    industry: 'Semiconductors',
    price: 138.25,
    changePercent: 3.42,
    marketCap: 3390,
    peRatio: 52.4,
    volume: 48200000,
    avgVolume: 51000000,
    fiftyTwoWeekHigh: 140.76,
    fiftyTwoWeekLow: 45.12,
    description: 'NVIDIA Corporation designs graphics processing units (GPUs) for the gaming and professional markets, as well as system on a chip units (SoCs) for the mobile computing and automotive market.'
  },
  {
    symbol: 'AAPL',
    companyName: 'Apple Inc.',
    sector: 'Technology',
    industry: 'Consumer Electronics',
    price: 224.50,
    changePercent: -0.85,
    marketCap: 3420,
    peRatio: 34.1,
    volume: 38100000,
    avgVolume: 42000000,
    fiftyTwoWeekHigh: 237.23,
    fiftyTwoWeekLow: 164.08,
    description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories, and sells a variety of related services.'
  },
  {
    symbol: 'MSFT',
    companyName: 'Microsoft Corporation',
    sector: 'Technology',
    industry: 'Software - Infrastructure',
    price: 448.90,
    changePercent: 1.15,
    marketCap: 3330,
    peRatio: 36.8,
    volume: 19500000,
    avgVolume: 21000000,
    fiftyTwoWeekHigh: 468.35,
    fiftyTwoWeekLow: 309.45,
    description: 'Microsoft Corporation develops and supports software, services, devices and solutions. Key drivers include Azure Cloud, AI Copilot, and Office 365 enterprise subscriptions.'
  },
  {
    symbol: 'TSLA',
    companyName: 'Tesla, Inc.',
    sector: 'Consumer Cyclical',
    industry: 'Auto Manufacturers',
    price: 218.40,
    changePercent: 4.80,
    marketCap: 695,
    peRatio: 64.2,
    volume: 85000000,
    avgVolume: 92000000,
    fiftyTwoWeekHigh: 271.00,
    fiftyTwoWeekLow: 138.80,
    description: 'Tesla, Inc. designs, develops, manufactures, sells, and leases electric vehicles, energy storage systems, and solar panels, alongside autonomous driving technologies.'
  },
  {
    symbol: 'AMZN',
    companyName: 'Amazon.com, Inc.',
    sector: 'Consumer Cyclical',
    industry: 'Internet Retail',
    price: 186.10,
    changePercent: 0.65,
    marketCap: 1940,
    peRatio: 42.5,
    volume: 31200000,
    avgVolume: 35000000,
    fiftyTwoWeekHigh: 201.20,
    fiftyTwoWeekLow: 118.35,
    description: 'Amazon.com, Inc. focuses on e-commerce, cloud computing (AWS), online advertising, digital streaming, and artificial intelligence.'
  },
  {
    symbol: 'GOOGL',
    companyName: 'Alphabet Inc.',
    sector: 'Communication Services',
    industry: 'Internet Content & Information',
    price: 174.30,
    changePercent: -1.20,
    marketCap: 2150,
    peRatio: 24.8,
    volume: 24500000,
    avgVolume: 28000000,
    fiftyTwoWeekHigh: 191.75,
    fiftyTwoWeekLow: 120.21,
    description: 'Alphabet Inc. provides search, ads, maps, YouTube, Google Cloud, and hardware products, alongside deep AI research initiatives with Gemini.'
  },
  {
    symbol: 'META',
    companyName: 'Meta Platforms, Inc.',
    sector: 'Communication Services',
    industry: 'Internet Content & Information',
    price: 522.60,
    changePercent: 2.10,
    marketCap: 1320,
    peRatio: 27.4,
    volume: 14200000,
    avgVolume: 16000000,
    fiftyTwoWeekHigh: 542.80,
    fiftyTwoWeekLow: 279.40,
    description: 'Meta Platforms builds products that enable people to connect through mobile devices, personal computers, virtual reality headsets, and AI technologies.'
  },
  {
    symbol: 'JPM',
    companyName: 'JPMorgan Chase & Co.',
    sector: 'Financial',
    industry: 'Banks - Diversified',
    price: 212.80,
    changePercent: 0.45,
    marketCap: 608,
    peRatio: 12.3,
    volume: 8900000,
    avgVolume: 9500000,
    fiftyTwoWeekHigh: 218.90,
    fiftyTwoWeekLow: 142.10,
    description: 'JPMorgan Chase & Co. is a global financial services firm providing investment banking, asset management, treasury, and commercial banking services.'
  }
];

export const INITIAL_PORTFOLIO: PortfolioHolding[] = [
  {
    id: 'hold_1',
    symbol: 'NVDA',
    companyName: 'NVIDIA Corporation',
    shares: 120,
    avgCostPrice: 95.50,
    currentPrice: 138.25,
    marketValue: 16590,
    weightPercent: 32.5,
    unrealizedGainLoss: 5130,
    unrealizedGainLossPercent: 44.76,
    sector: 'Technology'
  },
  {
    id: 'hold_2',
    symbol: 'MSFT',
    companyName: 'Microsoft Corporation',
    shares: 35,
    avgCostPrice: 385.00,
    currentPrice: 448.90,
    marketValue: 15711.5,
    weightPercent: 30.8,
    unrealizedGainLoss: 2236.5,
    unrealizedGainLossPercent: 16.60,
    sector: 'Technology'
  },
  {
    id: 'hold_3',
    symbol: 'AAPL',
    companyName: 'Apple Inc.',
    shares: 40,
    avgCostPrice: 190.20,
    currentPrice: 224.50,
    marketValue: 8980,
    weightPercent: 17.6,
    unrealizedGainLoss: 1372,
    unrealizedGainLossPercent: 18.03,
    sector: 'Technology'
  },
  {
    id: 'hold_4',
    symbol: 'AMZN',
    companyName: 'Amazon.com, Inc.',
    shares: 52,
    avgCostPrice: 162.00,
    currentPrice: 186.10,
    marketValue: 9677.2,
    weightPercent: 19.1,
    unrealizedGainLoss: 1253.2,
    unrealizedGainLossPercent: 14.88,
    sector: 'Consumer Cyclical'
  }
];

export const INITIAL_VECTOR_CORPUS: VectorChunk[] = [
  {
    id: 'chunk_nvda_10k_1',
    ticker: 'NVDA',
    documentType: '10-K',
    periodOrDate: 'FY2025 Annual Report (Form 10-K)',
    section: 'Item 7. Management Discussion - Data Center Growth',
    text: 'Data Center revenue for FY2025 reached $115.2 billion, representing an increase of 144% YoY, driven primarily by strong demand for the Blackwell architecture and Hopper H200 platforms across cloud service providers and enterprise customer AI clusters.'
  },
  {
    id: 'chunk_nvda_10k_2',
    ticker: 'NVDA',
    documentType: '10-K',
    periodOrDate: 'FY2025 Annual Report (Form 10-K)',
    section: 'Item 1A. Risk Factors - Supply Chain & Fab Concentration',
    text: 'We rely heavily on single-source wafer fabrication partners, principally TSMC, for manufacturing our advanced process node GPUs. Any geo-political disruption or capacity constraints in Taiwan wafer production could materially impact chip delivery schedules and gross margins.'
  },
  {
    id: 'chunk_nvda_transcript_1',
    ticker: 'NVDA',
    documentType: 'Earnings Transcript',
    periodOrDate: 'Q4 FY2025 Earnings Call',
    section: 'CEO Remarks - Jensen Huang',
    text: 'Demand for Blackwell remains extraordinary. We are ramping production as fast as packaging capabilities allow. Gross margins are expected to normalize around 73-75% as Blackwell yield curves mature over the coming quarters.'
  },
  {
    id: 'chunk_nvda_8k_1',
    ticker: 'NVDA',
    documentType: 'SEC Form 8-K',
    periodOrDate: 'SEC Filing (Form 8-K) - Nov 2025',
    section: 'Item 8.01 Other Events - Sovereign AI & Supercomputing',
    text: 'NVIDIA announced multi-billion dollar sovereign AI infrastructure contracts in France, Japan, and the United Arab Emirates. Sovereign nations are building domestic AI supercomputers powered by NVLink-connected Blackwell clusters to ensure data sovereignty and localized LLM model training.'
  },
  {
    id: 'chunk_nvda_research_1',
    ticker: 'NVDA',
    documentType: 'Analyst Research',
    periodOrDate: 'Morgan Stanley Research Note - Q1 2026',
    section: 'CoWoS Advanced Packaging & B200 Yield Assessment',
    text: 'TSMC CoWoS packaging capacity expansion to 65k wafers/month by late 2026 substantially alleviates NVDA Blackwell shipment bottlenecks. We project B200 Ultra chip shipments to reach 1.8M units in 2026, supporting a revised target price of $175 per share.'
  },
  {
    id: 'chunk_aapl_10k_1',
    ticker: 'AAPL',
    documentType: '10-K',
    periodOrDate: 'FY2024 Annual Report (Form 10-K)',
    section: 'Item 7. Services Revenue & Apple Intelligence',
    text: 'Services revenue grew to $96.2 billion in FY2024, representing 74.0% gross margin. Apple Intelligence features launched across iOS 18 are projected to accelerate hardware upgrade cycles across iPhone 15 Pro and iPhone 16 device installed bases.'
  },
  {
    id: 'chunk_aapl_transcript_1',
    ticker: 'AAPL',
    documentType: 'Earnings Transcript',
    periodOrDate: 'Q4 FY2024 Earnings Call',
    section: 'CEO Remarks - Tim Cook',
    text: 'Our active installed base of devices has reached a new all-time high of over 2.2 billion active devices across all geographic segments. Apple Intelligence represents a fundamental shift in user experience, driving privacy-first localized AI processing on A18 Pro and M4 silicon.'
  },
  {
    id: 'chunk_aapl_10q_1',
    ticker: 'AAPL',
    documentType: '10-Q',
    periodOrDate: 'Q3 FY2025 Form 10-Q',
    section: 'Item 2. MD&A - Greater China Revenue & Supply Resiliency',
    text: 'Net sales in Greater China were $15.0 billion, down 2.8% YoY due to local market competition, offset by expanding sales in India and Southeast Asia (+18% YoY). Supply chain diversification initiatives in Vietnam and India now account for 22% of total assembly output.'
  },
  {
    id: 'chunk_msft_10k_1',
    ticker: 'MSFT',
    documentType: '10-K',
    periodOrDate: 'FY2024 Annual Report (Form 10-K)',
    section: 'Item 7. Azure Cloud & Capital Expenditures',
    text: 'Server and cloud infrastructure capex increased to $55.7 billion in FY2024 to support generative AI workloads. Azure AI customer count exceeded 60,000 enterprise organizations with average spend per customer increasing 38%.'
  },
  {
    id: 'chunk_msft_transcript_1',
    ticker: 'MSFT',
    documentType: 'Earnings Transcript',
    periodOrDate: 'Q4 FY2024 Earnings Call',
    section: 'CEO Remarks - Satya Nadella',
    text: 'M365 Copilot adoption grew 60% quarter-over-quarter among Fortune 500 enterprises. Azure AI revenue contribution accelerated to 11 percentage points of total Azure growth, demonstrating monetization of our foundational model investments.'
  },
  {
    id: 'chunk_msft_8k_1',
    ticker: 'MSFT',
    documentType: 'SEC Form 8-K',
    periodOrDate: 'SEC Filing (Form 8-K) - Oct 2025',
    section: 'Item 8.01 - Custom AI Silicon Maia 100 & Cobalt Deployment',
    text: 'Microsoft disclosed production deployment of Maia 100 custom AI accelerators and Cobalt 100 ARM-based CPUs across 8 Azure cloud datacenter regions, reducing operational inferencing costs by up to 30% compared to commodity commercial GPUs.'
  },
  {
    id: 'chunk_amzn_10k_1',
    ticker: 'AMZN',
    documentType: '10-K',
    periodOrDate: 'FY2024 Annual Report (Form 10-K)',
    section: 'Item 7. AWS Operating Income & Custom Silicon',
    text: 'AWS segment net sales reached $105.4 billion in FY2024 with operating margins expanding to 38.1%. Adoption of Trainium2 and Inferentia2 proprietary silicon grew 210% YoY, providing cost-efficient model training for Anthropic and AWS Bedrock users.'
  },
  {
    id: 'chunk_amzn_transcript_1',
    ticker: 'AMZN',
    documentType: 'Earnings Transcript',
    periodOrDate: 'Q3 FY2025 Earnings Call',
    section: 'CEO Remarks - Andy Jassy',
    text: 'AWS annualized revenue run-rate has surpassed $110 billion. Enterprise customers have completed their post-pandemic cloud cost optimization cycles and are aggressively re-engaging in net-new AI migration projects.'
  },
  {
    id: 'chunk_googl_10k_1',
    ticker: 'GOOGL',
    documentType: '10-K',
    periodOrDate: 'FY2024 Annual Report (Form 10-K)',
    section: 'Item 7. Google Cloud Revenue & TPU v5p Clusters',
    text: 'Google Cloud segment revenue accelerated to $43.2 billion with operating income reaching $6.2 billion. Cloud TPU v5p supercomputing clusters enabled 4x faster training speeds for Gemini 1.5 Pro multimodal models compared to TPU v4.'
  },
  {
    id: 'chunk_googl_transcript_1',
    ticker: 'GOOGL',
    documentType: 'Earnings Transcript',
    periodOrDate: 'Q4 FY2024 Earnings Call',
    section: 'CEO Remarks - Sundar Pichai',
    text: 'AI Overviews in Search are now served to over 1 billion users monthly. Monetization of AI Overviews queries is matching traditional web search ad performance with higher user satisfaction and longer session engagement times.'
  },
  {
    id: 'chunk_meta_10k_1',
    ticker: 'META',
    documentType: '10-K',
    periodOrDate: 'FY2024 Annual Report (Form 10-K)',
    section: 'Item 7. Ad Monetization & Llama Open Source Ecosystem',
    text: 'Total revenue reached $164.5 billion, up 22% YoY, led by Family of Apps ad impression growth (+11%) and higher average price per ad (+10%). Advantage+ AI ad recommendations generated over $15 billion in incremental advertiser value.'
  },
  {
    id: 'chunk_meta_research_1',
    ticker: 'META',
    documentType: 'Analyst Research',
    periodOrDate: 'Goldman Sachs Equity Research - Q1 2026',
    section: 'MTIA v2 Silicon & Reality Labs Capex Trajectory',
    text: 'Meta’s deployment of MTIA v2 in-house inference silicon across Instagram Reels recommendation engines is expected to yield $1.2B in annual capex savings. We rate META as a Conviction Buy with a $620 target price.'
  },
  {
    id: 'chunk_tsla_10k_1',
    ticker: 'TSLA',
    documentType: '10-K',
    periodOrDate: 'FY2024 Annual Report (Form 10-K)',
    section: 'Item 7. Energy Storage Deployments & FSD Supercomputing',
    text: 'Energy storage deployments grew to 31.4 GWh in FY2024 (+113% YoY), driven by Megapack factory production in Lathrop. Cortex AI supercomputer cluster with 50k H100 GPUs reached operational status for FSD v13 neural network training.'
  },
  {
    id: 'chunk_jpm_10k_1',
    ticker: 'JPM',
    documentType: '10-K',
    periodOrDate: 'FY2024 Annual Report (Form 10-K)',
    section: 'Item 7. Net Interest Income & AI Fraud Prevention Platform',
    text: 'Total net revenue (managed basis) reached $175.4 billion, supported by $91.2 billion in Net Interest Income. Over 2,000 AI and machine learning models are active across payment routing, consumer credit scoring, and real-time fraud prevention.'
  }
];

export const INITIAL_N8N_WORKFLOWS: N8nWorkflow[] = [
  {
    id: 'wf_daily_refresh',
    name: 'Daily Market Fundamentals & Price Sync',
    description: 'Scheduled daily workflow polling Financial Modeling Prep / Alpha Vantage for updated prices, P/E multiples, and filings, upserting directly into Postgres.',
    triggerType: 'Schedule',
    scheduleInfo: 'Every Weekday at 04:30 PM EST',
    status: 'ACTIVE',
    lastRunAt: '2026-08-07 16:30:00',
    nextRunAt: '2026-08-10 16:30:00',
    executionCount: 248,
    webhookUrl: '/api/n8n/daily-refresh',
    jsonDefinition: {
      name: 'Meridian - Daily Market Data Refresh',
      nodes: [
        { name: 'Cron Trigger (Market Close)', type: 'n8n-nodes-base.cron', parameters: { triggerTimes: { item: [{ mode: 'everyWeekday', hour: 16, minute: 30 }] } } },
        { name: 'Get Watchlist Tickers', type: 'n8n-nodes-base.postgres', parameters: { operation: 'executeQuery', query: 'SELECT DISTINCT symbol FROM portfolio_watchlists;' } },
        { name: 'Fetch Financial Statements API', type: 'n8n-nodes-base.httpRequest', parameters: { url: 'https://financialmodelingprep.com/api/v3/profile/{{$node["Get Watchlist Tickers"].json["symbol"]}}' } },
        { name: 'Meridian FastAPI Upsert Webhook', type: 'n8n-nodes-base.httpRequest', parameters: { method: 'POST', url: 'https://meridian-api.internal/api/n8n/daily-refresh' } }
      ]
    }
  },
  {
    id: 'wf_earnings_watcher',
    name: 'Earnings & News Sentiment Watcher',
    description: 'Polls SEC EDGAR & News API for watchlisted tickers, embeds new 10-K/10-Q/transcripts into Qdrant vector store, and triggers News Research Agent alert on sentiment shift.',
    triggerType: 'Event Watcher',
    scheduleInfo: 'Polled Every 15 Minutes',
    status: 'ACTIVE',
    lastRunAt: '2026-08-08 01:45:00',
    nextRunAt: '2026-08-08 02:00:00',
    executionCount: 1420,
    webhookUrl: '/api/n8n/earnings-watcher',
    jsonDefinition: {
      name: 'Meridian - Earnings & News Watcher',
      nodes: [
        { name: 'Poll Filing & News API', type: 'n8n-nodes-base.interval', parameters: { interval: 15, unit: 'minutes' } },
        { name: 'Chunk Text & Generate Embeddings', type: 'n8n-nodes-base.httpRequest', parameters: { url: 'https://meridian-api.internal/api/rag/embed' } },
        { name: 'Upsert Qdrant Vector Store', type: 'n8n-nodes-base.qdrant', parameters: { collection: 'sec_filings_and_transcripts' } },
        { name: 'Trigger News Research Agent', type: 'n8n-nodes-base.httpRequest', parameters: { method: 'POST', url: 'https://meridian-api.internal/api/agents/news' } },
        { name: 'Send Alert If Material Shift', type: 'n8n-nodes-base.emailSend', parameters: { subject: 'Meridian Alert: Material Sentiment Shift Detected' } }
      ]
    }
  },
  {
    id: 'wf_weekly_digest',
    name: 'Weekly Portfolio Advisor Digest',
    description: 'Runs Portfolio Advisor Agent across user holdings every Sunday evening, generating position rebalancing calls and emailing structured executive report digests.',
    triggerType: 'Schedule',
    scheduleInfo: 'Every Sunday at 08:00 PM EST',
    status: 'ACTIVE',
    lastRunAt: '2026-08-03 20:00:00',
    nextRunAt: '2026-08-10 20:00:00',
    executionCount: 52,
    webhookUrl: '/api/n8n/weekly-digest',
    jsonDefinition: {
      name: 'Meridian - Weekly Portfolio Digest',
      nodes: [
        { name: 'Sunday Cron Trigger', type: 'n8n-nodes-base.cron', parameters: { triggerTimes: { item: [{ mode: 'custom', cronExpression: '0 20 * * 0' }] } } },
        { name: 'Fetch Active User Portfolios', type: 'n8n-nodes-base.firestore', parameters: { operation: 'getAll', collection: 'user_portfolios' } },
        { name: 'Invoke Portfolio Advisor Agent', type: 'n8n-nodes-base.httpRequest', parameters: { method: 'POST', url: 'https://meridian-api.internal/api/agents/portfolio' } },
        { name: 'Generate Investment Digest PDF', type: 'n8n-nodes-base.markdownToPdf' },
        { name: 'Send Weekly Digest Email', type: 'n8n-nodes-base.emailSend' }
      ]
    }
  }
];

export function getMockStockOverview(tickerSymbol: string): StockOverview {
  const upper = tickerSymbol.toUpperCase();
  const existing = POPULAR_STOCKS.find(s => s.symbol === upper);
  if (existing) return existing;

  // Generate realistic data for any unknown ticker
  return {
    symbol: upper,
    companyName: `${upper} Holdings Corp.`,
    sector: 'Technology',
    industry: 'Software & Cloud Services',
    price: 154.60,
    changePercent: 1.85,
    marketCap: 125,
    peRatio: 28.5,
    volume: 12400000,
    avgVolume: 15000000,
    fiftyTwoWeekHigh: 172.00,
    fiftyTwoWeekLow: 98.40,
    description: `${upper} is a global growth company focusing on enterprise infrastructure, digital transformation, and scalable software solutions.`
  };
}
