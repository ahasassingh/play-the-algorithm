export interface Character {
  id: string;
  name: string;
  age: number;
  role: string;
  avatar: string;
  quote: string;
  description: string;
  primaryInterests: string[];
  hiddenNiche: string;
  likes: { [category: string]: number }; // scale 0.0 to 1.0
  notInto: string[];
  avatarGradient: string;
}

export interface ContentItem {
  id: string;
  title: string;
  creator: string;
  creatorAvatar: string;
  category: string;
  subcategory: string;
  thumbnail: string;
  caption: string;
  duration: string;
  likesCount: string;
  commentsCount: string;
  emotionalIntensity: number; // 0-1
  novelty: number; // 0-1
  credibility: number; // 0-1
  engagementPotential: number; // 0-1
  diversityCategory: string;
}

export interface Interaction {
  round: number;
  contentId: string;
  characterId: string;
  category: string;
  subcategory: string;
  engagementPercent: number; // e.g. 92
  reactionText: string;
  reactionEmoji: string;
  mode: 'engagement' | 'balanced';
  scoreBreakdown: {
    interestMatch: number;
    engagementPotential: number;
    historyBoost: number;
    noveltyBoost: number;
    credibilityBoost: number;
    diversityBoost: number;
    totalScore: number;
  };
}

export interface AlgorithmWeights {
  interestMatch: number; // default 0.5
  engagementPotential: number; // default 0.3
  diversity: number; // default 0.1
  credibility: number; // default 0.0
  novelty: number; // default 0.1
}
