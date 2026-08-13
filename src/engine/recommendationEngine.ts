import { Character, ContentItem, Interaction, AlgorithmWeights } from '../types';
import { CONTENT_ITEMS } from '../data/content';

/**
 * Calculates the engagement percentage (0-100) for a given character watching a specific content item.
 */
export function calculateEngagement(
  character: Character,
  content: ContentItem,
  history: Interaction[]
): { engagementPercent: number; reactionText: string; reactionEmoji: string } {
  const baseAffinity = character.likes[content.category] ?? 0.3;
  
  // Bonus if subtopic matches character's hidden niche
  let subtopicBonus = 0;
  if (content.subcategory.toLowerCase().includes(character.hiddenNiche.toLowerCase()) || 
      character.hiddenNiche.toLowerCase().includes(content.subcategory.toLowerCase())) {
    subtopicBonus = 0.15;
  }

  // Calculate repetition fatigue penalty if user has seen same category many times in recent rounds
  const recentSameCat = history.slice(-3).filter(h => h.category === content.category).length;
  const fatiguePenalty = recentSameCat >= 3 ? 0.08 : 0;

  // Engagement formula
  let rawScore = (baseAffinity * 0.55) + (content.engagementPotential * 0.25) + (content.emotionalIntensity * 0.10) + subtopicBonus - fatiguePenalty;
  
  // Add small human variation noise (+/- 4%)
  const noise = (Math.random() * 0.08) - 0.04;
  rawScore = Math.min(0.99, Math.max(0.10, rawScore + noise));

  const percent = Math.round(rawScore * 100);

  // Qualitative feedback text
  if (percent >= 85) {
    return {
      engagementPercent: percent,
      reactionText: `${character.name} watched 100% of this video and rewatched it twice! 🔥`,
      reactionEmoji: '🤩'
    };
  } else if (percent >= 70) {
    return {
      engagementPercent: percent,
      reactionText: `${character.name} watched most of the video and tapped like! 👍`,
      reactionEmoji: '😊'
    };
  } else if (percent >= 45) {
    return {
      engagementPercent: percent,
      reactionText: `${character.name} watched half of the video before scrolling past. 😐`,
      reactionEmoji: '🤔'
    };
  } else {
    return {
      engagementPercent: percent,
      reactionText: `${character.name} skipped this video after 2 seconds. ⏭️`,
      reactionEmoji: '🥱'
    };
  }
}

/**
 * Calculates the recommendation ranking score for a content item under given algorithm weights and interaction history.
 */
export function calculateRecommendationScore(
  character: Character,
  content: ContentItem,
  history: Interaction[],
  learnedPreferences: { [category: string]: number },
  weights: AlgorithmWeights
): { totalScore: number; breakdown: Interaction['scoreBreakdown'] } {
  // 1. Interest match score (based on algorithm's learned preferences, not ground truth)
  const learnedAffinity = learnedPreferences[content.category] ?? 0.5;
  const interestMatch = learnedAffinity * 100;

  // 2. Engagement potential
  const engagementPotential = content.engagementPotential * 100;

  // 3. History boost (how heavily recent recommendations favor this category)
  const recentCount = history.filter(h => h.category === content.category).length;
  const historyBoost = Math.min(30, recentCount * 10);

  // 4. Novelty boost
  const noveltyBoost = content.novelty * 100;

  // 5. Credibility boost
  const credibilityBoost = content.credibility * 100;

  // 6. Diversity boost (penalize categories already heavily represented in history)
  const isAlreadySeen = history.some(h => h.contentId === content.id);
  const categoryFreq = history.filter(h => h.category === content.category).length;
  const diversityBoost = isAlreadySeen ? 0 : Math.max(0, 100 - (categoryFreq * 25));

  // Weighted total
  const totalScore = Math.round(
    (interestMatch * weights.interestMatch) +
    (engagementPotential * weights.engagementPotential) +
    (diversityBoost * weights.diversity) +
    (credibilityBoost * weights.credibility) +
    (noveltyBoost * weights.novelty) +
    (historyBoost * 0.1)
  );

  return {
    totalScore,
    breakdown: {
      interestMatch: Math.round(interestMatch),
      engagementPotential: Math.round(engagementPotential),
      historyBoost: Math.round(historyBoost),
      noveltyBoost: Math.round(noveltyBoost),
      credibilityBoost: Math.round(credibilityBoost),
      diversityBoost: Math.round(diversityBoost),
      totalScore
    }
  };
}

/**
 * Selects 4 content options to display for the recommendation decision phase.
 */
export function getRecommendationCandidates(
  character: Character,
  history: Interaction[],
  learnedPreferences: { [category: string]: number },
  weights: AlgorithmWeights
): ContentItem[] {
  const unselectedContent = CONTENT_ITEMS.filter(item => !history.some(h => h.contentId === item.id));
  const pool = unselectedContent.length >= 4 ? unselectedContent : CONTENT_ITEMS;

  const scored = pool.map(item => ({
    item,
    score: calculateRecommendationScore(character, item, history, learnedPreferences, weights).totalScore
  }));

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // Top candidates with slight variation so the 4 choices aren't 100% identical category unless heavily narrowed
  const top4 = scored.slice(0, 4).map(s => s.item);

  return top4;
}
