export enum BusinessType {
  SERVICE = 'Service Business',
  DIGITAL_PRODUCT = 'Digital Product',
  PLATFORM = 'Platform/Freelance',
  OTHER = 'Other'
}

export enum PlanPhase {
  VALIDATION = 'Idea Validation',
  MVP = 'Build MVP',
  MARKETING = 'Marketing Strategy',
  FINANCE = 'Financial Planning',
  OPERATIONS = 'Operational Efficiency'
}

export interface UserInput {
  businessIdea: string;
  businessType: BusinessType;
  targetAudience?: string;
}

export interface ChartPoint {
  name: string;
  value: number;
}

export interface ChartData {
  title: string;
  type: 'bar' | 'pie' | 'line' | 'area';
  data: ChartPoint[];
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export interface GeneratedPlan {
  phase: PlanPhase;
  content: string;
  chart?: ChartData;
  timestamp: number;
}

export interface PromptTemplate {
  id: PlanPhase;
  title: string;
  description: string;
  icon: string;
  promptBuilder: (input: UserInput) => string;
}