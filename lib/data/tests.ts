import { TestDef } from "@/lib/types";

export const TESTS: TestDef[] = [
  {
    slug:        "memory-sequence",
    title:       "Memory Sequence",
    subtitle:    "Working Memory",
    icon:        "🧠",
    color:       "brand",
    available:   true,
    duration:    150,
    totalTakers: 48_200,
    bronzeMin:   50,
    silverMin:   72,
    goldMin:     88,
    rewards:     { bronze: 5, silver: 15, gold: 30 },
    description: "Memorize and recall number sequences of increasing length. Each round adds complexity.",
    longDesc:    "Working memory is the cognitive system responsible for holding and processing information in the short term. Research shows it is one of the strongest predictors of learning speed, problem-solving ability, and professional performance. Used by Fortune 500 companies in executive hiring and by research institutions to measure cognitive capacity.",
    industryBenchmark: {
      "Software Engineer": 74,
      "Data Scientist": 79,
      "Product Manager": 68,
      "Finance Analyst": 72,
      "General Population": 58,
    },
  },
  {
    slug:        "pattern-logic",
    title:       "Pattern Logic",
    subtitle:    "Analytical Reasoning",
    icon:        "◈",
    color:       "secure",
    available:   true,
    duration:    120,
    totalTakers: 41_800,
    bronzeMin:   45,
    silverMin:   68,
    goldMin:     85,
    rewards:     { bronze: 5, silver: 15, gold: 30 },
    description: "Identify rules in numerical and visual patterns. Tests abstract reasoning under time pressure.",
    longDesc:    "Analytical reasoning tests are used by McKinsey, BCG, and Google as core hiring filters. The ability to identify non-obvious patterns predicts success in roles that require rapid hypothesis generation and structured problem solving. This test is calibrated against standardized IQ assessment norms.",
    industryBenchmark: {
      "Software Engineer": 76,
      "Data Scientist": 82,
      "Product Manager": 71,
      "Finance Analyst": 75,
      "General Population": 55,
    },
  },
  {
    slug:        "speed-math",
    title:       "Speed Math",
    subtitle:    "Numerical Aptitude",
    icon:        "⚡",
    color:       "gold",
    available:   true,
    duration:    60,
    totalTakers: 37_400,
    bronzeMin:   40,
    silverMin:   65,
    goldMin:     85,
    rewards:     { bronze: 5, silver: 15, gold: 30 },
    description: "Solve 15 arithmetic problems with increasing difficulty. Accuracy and speed both matter.",
    longDesc:    "Quantitative speed — the ability to process numerical information rapidly — is a key predictor of performance in finance, data engineering, and trading roles. This test mirrors the numerical reasoning sections used by investment banks and quantitative firms in their recruitment pipelines.",
    industryBenchmark: {
      "Finance Analyst": 81,
      "Data Scientist": 78,
      "Software Engineer": 73,
      "Product Manager": 64,
      "General Population": 52,
    },
  },
  {
    slug:        "focus-attention",
    title:       "Focus & Attention",
    subtitle:    "Sustained Attention",
    icon:        "◎",
    color:       "secure",
    available:   false,
    duration:    120,
    totalTakers: 0,
    bronzeMin:   50,
    silverMin:   72,
    goldMin:     90,
    rewards:     { bronze: 5, silver: 15, gold: 30 },
    description: "Track targets while ignoring distractors under cognitive load. Critical for high-stakes roles.",
    longDesc:    "Coming soon.",
    industryBenchmark: {},
  },
];

export function getTest(slug: string) {
  return TESTS.find(t => t.slug === slug);
}

export function getTier(score: number, test: TestDef) {
  if (score >= test.goldMin)   return "gold"   as const;
  if (score >= test.silverMin) return "silver" as const;
  if (score >= test.bronzeMin) return "bronze" as const;
  return null;
}

export function getReward(tier: "gold"|"silver"|"bronze", test: TestDef) {
  return test.rewards[tier];
}

export function getPercentile(score: number, test: TestDef): number {
  const { bronzeMin, silverMin, goldMin } = test;
  if (score >= goldMin)   return Math.round(100 - (score - goldMin) * 0.5);
  if (score >= silverMin) return Math.round(30 - (score - silverMin) * 0.8);
  if (score >= bronzeMin) return Math.round(55 - (score - bronzeMin) * 1.2);
  return Math.max(1, score);
}
