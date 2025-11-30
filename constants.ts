import { PlanPhase, PromptTemplate, UserInput, BusinessType } from './types';

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: PlanPhase.VALIDATION,
    title: 'Idea Validation',
    description: 'Find niches, validate demand, and check competition.',
    icon: 'target',
    promptBuilder: (input: UserInput) => `
      I want to start a ${input.businessType} specifically focused on "${input.businessIdea}" with zero budget. 
      Help me:
      - Identify 5 specific underserved niches in this field
      - Find 3 free tools I can use to validate demand
      - Suggest low-competition keywords to target
      - List forums and online communities where my ideal customers hang out
    `
  },
  {
    id: PlanPhase.MVP,
    title: 'Build Your MVP',
    description: 'Create a minimum viable product with free tools.',
    icon: 'hammer',
    promptBuilder: (input: UserInput) => `
      Create a step-by-step plan to build a minimum viable product for my ${input.businessIdea} business with zero cash. 
      Include:
      - How to create a basic portfolio or prototype with free tools
      - Where to find 3 initial beta testers
      - How to structure a compelling free offer in exchange for testimonials
      - Free platforms to host/showcase my work
    `
  },
  {
    id: PlanPhase.MARKETING,
    title: 'Marketing Strategy',
    description: 'A 30-day zero-budget marketing plan.',
    icon: 'megaphone',
    promptBuilder: (input: UserInput) => `
      Generate a 30-day zero-budget marketing plan for a ${input.businessIdea} (${input.businessType}). 
      Include:
      - Daily social media activities (specific platforms)
      - Exactly what to post each day for the first week
      - Free tools for scheduling and analytics
      - Cold outreach templates that don't sound spammy
      - How to leverage content marketing with no budget
    `
  },
  {
    id: PlanPhase.FINANCE,
    title: 'Financial Planning',
    description: 'Revenue reinvestment and break-even analysis.',
    icon: 'pie-chart',
    promptBuilder: (input: UserInput) => `
      Create a revenue reinvestment strategy for a ${input.businessIdea} business starting with zero cash. 
      Outline:
      - What percentage of first earnings should go to which expenses
      - The exact order of business investments (website → marketing tools → etc.)
      - Free alternatives to paid business tools
      - How to calculate my 'break-free' point from my day job
    `
  },
  {
    id: PlanPhase.OPERATIONS,
    title: 'Operational Efficiency',
    description: 'Free tools and workflows to manage the business.',
    icon: 'settings',
    promptBuilder: (input: UserInput) => `
      List free alternatives to paid business tools for a ${input.businessIdea} business. Cover: CRM, Project Management, Accounting, and Design.
      For each free tool, include:
      - Specific limitations I should know about
      - Workarounds for those limitations
      - When I should consider upgrading to paid versions
    `
  }
];

export const BUSINESS_TYPES = [
  { value: BusinessType.SERVICE, label: 'Service (Freelance, Consulting)' },
  { value: BusinessType.DIGITAL_PRODUCT, label: 'Digital Product (E-books, Courses)' },
  { value: BusinessType.PLATFORM, label: 'Platform Based (Upwork, Fiverr, Etsy)' },
  { value: BusinessType.OTHER, label: 'Other' },
];