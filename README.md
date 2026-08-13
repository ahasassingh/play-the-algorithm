# 🌐 Play the Algorithm (Algorithm Lens)

> **An Interactive Educational Serious Game for Media & Information Literacy**  
> *Developed for UNESCO Youth Hackathon 2026*

---

## 📌 Project Overview

### 🎯 Why We Built This Project
In the modern digital landscape, social media recommendation engines dictate what billions of people read, watch, and believe every day. These algorithms are optimized almost exclusively for **user engagement**—maximizing watch time, clicks, and shares.

Because users rarely see *how* these decisions are made behind the scenes, they often assume their feeds represent an objective view of the world. In reality, engagement-driven optimization systematically isolates users inside **filter bubbles** and **echo chambers**. 

We built **Play the Algorithm** to bridge this gap. Rather than lecturing users on media literacy through static articles or videos, we give them direct agency to experience how recommendation algorithms shape human perception.

---

### 🕹️ What the Project Is About
**Play the Algorithm** is an interactive, gamified simulation where **you step into the role of the algorithm itself**.

Instead of consuming a feed, you curate one for virtual human personas with distinct personalities, interests, and behavioral habits.

#### Core Gameplay & Features:
- **🎴 Physical Character Selection Deck**: Swipe and inspect target user personas (e.g., Aarav, an engineering student).
- **🔮 Prediction Mechanic**: Before recommending content, predict how the target user will react (**HIGH**, **MEDIUM**, or **LOW** engagement) to test your understanding of their preferences.
- **📱 Flying Card Recommendation Chain**: Watch selected content physically fly into a virtual phone, followed by a suspenseful watching animation.
- **🧠 Live "What We Know" Preference Model**: Observe internal machine learning weight matrices update dynamically after every interaction.
- **⚔️ Competing Objectives & Filter Bubble Progression**: Balance **Engagement** against **Feed Diversity**. Experience how optimizing purely for watch time narrows topic variety and forms an information bubble.
- **⚡ Level 2 Challenge ("Break the Bubble")**: Re-engineer your recommendation strategy to balance engagement, diversity, novelty, and credibility.
- **💡 Final Archetype & Reveal**: Receive your final algorithm profile card (*"Engagement Optimizer"*) and experience the central realization: **"You were the algorithm."**
- **🔊 Web Audio API Synthesizer**: Subtle UI audio feedback (card swipes, recommendation pops, score chimes) with full user audio control.

---

### 🧠 How It Empowers Users in Media & Information Literacy (MIL)

1. **Experiential Learning Over Passive Information**:
   Users don't just read about filter bubbles—they actively *build* one through their own optimization decisions, creating a memorable "aha!" moment.
2. **Demystifying Algorithmic Signals**:
   By exposing score breakdowns (Base Interest + History + Novelty), users learn how their daily digital interactions (likes, watch time) signal algorithms to alter future content.
3. **Fostering Algorithmic & Critical Thinking**:
   Equips users with the critical mindset to question why certain topics dominate their personal feeds and empowers them to break out of digital echo chambers.

---

## 🛠️ Tech Stack

- **Core Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Physics & Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Audio Engine**: Custom zero-dependency Web Audio API Synthesizer
- **Linter**: [Oxlint](https://oxc.rs/)

---

## 🚀 Getting Started

Follow these steps to run **Play the Algorithm** locally on your system.

### Prerequisites
- **Node.js** (version 18.0 or higher)
- **npm** (comes bundled with Node.js)

---

### Installation & Running Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ahasassingh/play-the-algorithm.git
   cd play-the-algorithm
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Open in Browser**:
   Navigate to `http://localhost:5173` (or the URL displayed in your terminal).

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the local Vite development server |
| `npm run build` | Runs TypeScript type checking (`tsc -b`) and builds production assets in `dist/` |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs `oxlint` for fast code linting |

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
"# play-the-algorithm" 
