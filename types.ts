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

export interface GeneratedPlan {
  phase: PlanPhase;
  content: string;
  timestamp: number;
}

export interface PromptTemplate {
  id: PlanPhase;
  title: string;
  description: string;
  icon: string;
  promptBuilder: (input: UserInput) => string;
}