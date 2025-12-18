
export interface AnalysisResult {
  score: number;
  strengths: string[];
  improvements: string[];
  suggestions: string;
}

export interface ResearchResult {
  summary: string;
  sources: { title: string; uri: string }[];
}

export enum View {
  HOME = 'home',
  RESUME = 'resume',
  INTERVIEW = 'interview',
  RESEARCH = 'research',
  PRICING = 'pricing'
}

export enum UserTier {
  FREE = 'FREE',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE'
}

export interface UserProfile {
  tier: UserTier;
  credits: number;
  sessionsUsed: number;
}
