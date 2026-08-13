import { Character } from '../types';

export const CHARACTERS: Character[] = [
  {
    id: 'aarav',
    name: 'Aarav',
    age: 20,
    role: 'Engineering Student',
    avatar: '/avatars/aarav.png',
    quote: 'Tech enthusiast who loves football and exploring new technology.',
    description: 'Analytical and curious, Aarav loves high-energy Premier League breakdowns, gadget reviews, and tech innovations.',
    primaryInterests: ['Football', 'Technology', 'Gaming', 'Science'],
    hiddenNiche: 'Transfer Rumors & Deadline Day Analysis',
    likes: {
      'Football': 0.95,
      'Technology': 0.80,
      'Gaming': 0.65,
      'Science': 0.60,
      'Cooking': 0.25,
      'Fashion': 0.15,
      'Music': 0.40,
      'Travel': 0.30,
      'Environment': 0.45,
      'Finance': 0.50
    },
    notInto: ['Fashion', 'Cooking'],
    avatarGradient: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'maya',
    name: 'Maya',
    age: 22,
    role: 'Design Student',
    avatar: '/avatars/maya.png',
    quote: 'Creative soul passionate about minimalist fashion and travel visual vlogs.',
    description: 'Creative and visual-oriented, Maya stays up to date with streetwear trends, eco-friendly coffee recipes, and indie music releases.',
    primaryInterests: ['Fashion', 'Travel', 'Cooking', 'Music'],
    hiddenNiche: 'Sustainable Vintage Upcycling',
    likes: {
      'Fashion': 0.92,
      'Travel': 0.85,
      'Cooking': 0.78,
      'Music': 0.70,
      'Environment': 0.65,
      'Technology': 0.35,
      'Gaming': 0.20,
      'Football': 0.10,
      'Science': 0.40,
      'Finance': 0.30
    },
    notInto: ['Gaming', 'Football'],
    avatarGradient: 'from-purple-500 to-pink-600'
  },
  {
    id: 'kabir',
    name: 'Kabir',
    age: 19,
    role: 'Game Developer',
    avatar: '/avatars/kabir.png',
    quote: 'Competitive gamer and tech dev who loves late-night esports sessions.',
    description: 'Always online, Kabir follows open-world gaming leaks, hardware benchmark tests, and tactical football breakdowns.',
    primaryInterests: ['Gaming', 'Technology', 'Football'],
    hiddenNiche: 'Retro Console Hardware Modding',
    likes: {
      'Gaming': 0.96,
      'Football': 0.88,
      'Technology': 0.82,
      'Science': 0.65,
      'Finance': 0.40,
      'Music': 0.35,
      'Travel': 0.25,
      'Cooking': 0.20,
      'Fashion': 0.15,
      'Environment': 0.30
    },
    notInto: ['Cooking', 'Fashion'],
    avatarGradient: 'from-emerald-500 to-teal-700'
  },
  {
    id: 'sara',
    name: 'Sara',
    age: 21,
    role: 'Music Enthusiast',
    avatar: '/avatars/sara.png',
    quote: 'Melophile who enjoys live music, concerts, and cinema podcasts.',
    description: 'Sara loves thought-provoking documentaries, eco-travel guides, scientific discoveries, and cinema analysis.',
    primaryInterests: ['Music', 'Movies', 'Travel'],
    hiddenNiche: 'Biodiversity Conservation Micro-Docs',
    likes: {
      'Environment': 0.94,
      'Science': 0.86,
      'Travel': 0.80,
      'Movies': 0.75,
      'Music': 0.68,
      'Cooking': 0.50,
      'Technology': 0.45,
      'Finance': 0.35,
      'Fashion': 0.30,
      'Gaming': 0.15
    },
    notInto: ['Gaming', 'Sports'],
    avatarGradient: 'from-amber-500 to-orange-600'
  },
  {
    id: 'rohan',
    name: 'Rohan',
    age: 20,
    role: 'Sports Enthusiast',
    avatar: '/avatars/rohan.png',
    quote: 'Sports fanatic and fitness enthusiast always tracking live games.',
    description: 'Rohan spends his weekends training, watching matches, and staying updated with the latest in tech and sports gear.',
    primaryInterests: ['Football', 'Fitness', 'Gaming'],
    hiddenNiche: 'High-Performance Sports Analytics',
    likes: {
      'Football': 0.95,
      'Technology': 0.70,
      'Gaming': 0.60,
      'Science': 0.50,
      'Cooking': 0.30,
      'Fashion': 0.20,
      'Music': 0.45,
      'Travel': 0.40,
      'Environment': 0.35,
      'Finance': 0.40
    },
    notInto: ['Fashion'],
    avatarGradient: 'from-red-500 to-rose-600'
  }
];
