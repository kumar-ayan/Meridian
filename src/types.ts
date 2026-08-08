export type ActionRecommendation = 'STRONG_BUY' | 'BUY' | 'HOLD' | 'TRIM' | 'SELL';

export interface FinancialMetrics {
  revenueGrowthYoY: number; // e.g. 26.5 (%)
  grossMargin: number; // e.g. 74.2 (%)
  operatingMargin: number; // e.g. 52.1 (%)
  netMargin: number; // e.g. 45.8 (%)
  currentRatio: number; // liquidity ratio
  quickRatio: number;
  debtToEquity: number; // leverage
  netDebtToEbitda: number;
  freeCashFlowYield: number; // (%)
  returnOnEquity: number; // (%)
}

export interface StatementDataPoint {
  period: string; // e.g. "FY2023", "FY2024", "Q3 2025"
  revenue: number; // in millions
  grossProfit: number;
  operatingIncome: number;
  netIncome: number;
  operatingCashFlow: number;
  freeCashFlow: number;
  totalAssets: number;
  totalDebt: number;
  cashAndEquivalents: number;
}

export interface FinancialStatementAgentOutput {
  agentName: 'Financial Statement Analysis Agent';
  timestamp: string;
  ticker: string;
  keyMetrics: FinancialMetrics;
  historicalStatements: StatementDataPoint[];
  marginsAnalysis: string;
  growthAnalysis: string;
  liquidityAndLeverageAnalysis: string;
  flaggedAnomalies: {
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    title: string;
    description: string;
  }[];
  citations: string[];
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  summary: string;
  url: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  impactScore: number; // 1-10
}

export interface EarningsTranscriptExcerpt {
  quarter: string;
  speaker: string;
  role: string;
  text: string;
  topic: string;
}

export interface NewsResearchAgentOutput {
  agentName: 'News Research Agent';
  timestamp: string;
  ticker: string;
  overallSentimentScore: number; // -1.0 to +1.0
  sentimentLabel: 'BULLISH' | 'NEUTRAL' | 'BEARISH';
  keyCatalysts: string[];
  redFlags: string[];
  recentNewsArticles: NewsArticle[];
  transcriptHighlights: EarningsTranscriptExcerpt[];
  citations: string[];
}

export interface PeerComparable {
  symbol: string;
  companyName: string;
  peRatio: number;
  evEbitda: number;
  psRatio: number;
  grossMargin: number;
  revenueGrowth: number;
}

export interface ValuationAgentOutput {
  agentName: 'Valuation Agent';
  timestamp: string;
  ticker: string;
  currentPrice: number;
  fairValueMin: number;
  fairValueTarget: number;
  fairValueMax: number;
  impliedUpsidePercent: number;
  dcfModel: {
    wacc: number; // discount rate (%)
    terminalGrowthRate: number; // (%)
    forecastYears: number;
    projectedFcfGrowth: number[];
    dcfFairValue: number;
  };
  multiplesValuation: {
    peFairValue: number;
    evEbitdaFairValue: number;
    psFairValue: number;
    sectorPeerMedians: {
      pe: number;
      evEbitda: number;
      ps: number;
    };
  };
  peerComparables: PeerComparable[];
  assumptions: string[];
  citations: string[];
}

export interface RiskAnalysisAgentOutput {
  agentName: 'Risk Analysis Agent';
  timestamp: string;
  ticker: string;
  overallRiskScore: number; // 1 (lowest) to 100 (highest)
  volatilityMetrics: {
    beta: number;
    annualizedVolatility: number; // (%)
    maxDrawdown1Yr: number; // (%)
  };
  riskCategories: {
    category: 'Valuation' | 'Financial/Solvency' | 'Macro/Sector' | 'Execution/Regulatory' | 'Concentration';
    riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    score: number; // 1-10
    description: string;
  }[];
  keyMitigants: string[];
  citations: string[];
}

export interface PortfolioHolding {
  id: string;
  symbol: string;
  companyName: string;
  shares: number;
  avgCostPrice: number;
  currentPrice: number;
  marketValue: number;
  weightPercent: number;
  unrealizedGainLoss: number;
  unrealizedGainLossPercent: number;
  sector: string;
}

export interface PortfolioAdvisorOutput {
  agentName: 'Portfolio Advisor Agent';
  timestamp: string;
  ticker: string;
  userRiskProfile: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
  recommendedAction: ActionRecommendation;
  targetPositionSizingPercent: number; // e.g. 5.0%
  currentPositionSizingPercent: number; // e.g. 2.5%
  recommendedSharesDelta: number; // +50 or -20
  diversificationImpact: string;
  portfolioAlignmentNotes: string[];
  citations: string[];
}

export interface InvestmentReportOutput {
  agentName: 'Investment Report Agent';
  timestamp: string;
  ticker: string;
  companyName: string;
  sector: string;
  currentPrice: number;
  targetPrice: number;
  actionRecommendation: ActionRecommendation;
  confidenceScore: number; // 1-100 %
  executiveSummary: string;
  investmentThesis: string[];
  valuationBandSummary: {
    bearCase: number;
    baseCase: number;
    bullCase: number;
  };
  keyRisksSummary: string[];
  portfolioGuidance: string;
  citations: {
    claim: string;
    source: string;
    date: string;
  }[];
}

export interface AgentExecutionStep {
  id: string;
  agentKey: 'financial' | 'news' | 'valuation' | 'risk' | 'portfolio' | 'report';
  agentName: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt?: string;
  completedAt?: string;
  executionTimeMs?: number;
  tokensUsed?: number;
  output?: any;
  error?: string;
  toolCalls?: {
    toolName: string;
    params: any;
    resultSummary: string;
  }[];
}

export interface MultiAgentPipelineRun {
  runId: string;
  ticker: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  startedAt?: string;
  completedAt?: string;
  steps: AgentExecutionStep[];
  finalReport?: InvestmentReportOutput;
}

export interface VectorChunk {
  id: string;
  ticker: string;
  documentType: '10-K' | '10-Q' | 'Earnings Transcript' | 'News Article' | 'SEC Form 8-K' | 'Analyst Research' | string;
  periodOrDate: string;
  section: string;
  text: string;
  score?: number; // cosine similarity score
}

export interface N8nWorkflow {
  id: string;
  name: string;
  description: string;
  triggerType: 'Schedule' | 'Webhook' | 'Event Watcher';
  scheduleInfo: string;
  status: 'ACTIVE' | 'INACTIVE' | 'RUNNING';
  lastRunAt: string;
  nextRunAt: string;
  executionCount: number;
  webhookUrl: string;
  jsonDefinition: object;
}

export interface StockOverview {
  symbol: string;
  companyName: string;
  sector: string;
  industry: string;
  price: number;
  changePercent: number;
  marketCap: number; // in billions
  peRatio: number;
  volume: number;
  avgVolume: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  description: string;
}
