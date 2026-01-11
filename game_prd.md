# Product Requirements Document (PRD): Solo Adventure

**Version:** 3.0 (Modern Anime Edition)
**Date:** January 11, 2026
**Target Platform:** Mobile Web (PWA)
**Visual Direction:** "Modern Zen" (High-end Anime Art + Glassmorphism UI)
**Tech Stack:** React (Vite), TypeScript, Tailwind CSS, Framer Motion, Zustand, Lucide React

---

## 1. Executive Summary
**Solo Adventure** is a text-based roguelike RPG that modernizes the *Life in Adventure* formula. It features a rich branching narrative engine driven by pre-generated JSON data. The presentation layer abandons retro pixel art for a high-fidelity **Modern Anime** aesthetic (inspired by *Demon Slayer*), utilizing full-screen immersive backgrounds, frosted glass UI panels, and fluid motion design to create a premium mobile experience.

---

## 2. Design System & Visuals

The UI philosophy is **"Cinematic Immersion."** The UI should feel like a heads-up display floating over a living anime world.

### 2.1. Color Palette
*   **Backgrounds:** Rich, dark, full-screen illustrations (generated).
*   **UI Surface:** `Slate-950` with 85% Opacity (`bg-slate-950/85`) and `backdrop-blur-md` (Frosted Glass).
*   **Text Primary:** `Slate-50` (Off-white for readability).
*   **Text Secondary:** `Slate-400` (Metadata).
*   **Accent (Magic/Interaction):** Indigo Violet (`#6366f1` / `ring-indigo-500`).
*   **Accent (Combat/Danger):** Crimson Red (`#e11d48`).
*   **Borders:** Subtle white gradients (`border-white/10`).

### 2.2. Typography
*   **Headings (Titles/Locations):** *Cinzel* or *Playfair Display* (Elegant, Sharp, Serif).
*   **Body (Narrative):** *Inter* or *Plus Jakarta Sans* (Clean, legible, modern Sans-Serif).
*   **Combat Numbers:** *Oswald* (Bold, condensed).

### 2.3. Layout Structure
*   **Layer 1 (Back):** Full-screen Anime Background Image (Slow Ken-Burns zoom effect).
*   **Layer 2 (Middle):** Optional Character/Enemy Sprite Overlay (Centered).
*   **Layer 3 (Front - Top):** Floating Status Pills (HP, Inventory).
*   **Layer 4 (Front - Bottom):** The **"Story Sheet"**. A bottom-sheet container taking up 50-60% of the screen height containing the scrolling text log and interaction buttons.

---

## 3. Data Architecture (The Engine)

The game logic is driven by a strictly typed JSON structure.

### 3.1. Story Node Schema
```typescript
type NodeType = 'narrative' | 'combat' | 'shop' | 'ending';

interface StoryNode {
  id: string;
  title: string;              // e.g. "The Wisteria House"
  text: string;               // Multi-paragraph narrative text
  imageSrc: string;           // Background asset path
  type: NodeType;
  
  // Audio Ambience (Optional)
  bgm?: string;               // e.g., "rain_storm.mp3"

  choices: Choice[];
}

interface Choice {
  text: string;
  nextNodeId: string;
  
  // Logic: When is this choice visible?
  condition?: {
    reqStat?: 'STR' | 'INT' | 'DEX'; 
    reqValue?: number;
    reqItem?: string;
  };

  // Logic: What happens when clicked?
  effect?: {
    hpChange?: number;        // Negative = Damage
    goldChange?: number;
    addItem?: string;
    removeItem?: string;
  };
}
```

### 3.2. Global State (Zustand Store)
```typescript
interface GameState {
  // Player Data
  hp: number;
  maxHp: number;
  gold: number;
  inventory: string[];
  stats: { str: number; int: number; dex: number };

  // Engine Data
  currentNodeId: string;
  history: string[];          // Array of visited Node IDs
  isAnimating: boolean;       // To block clicks during transitions

  // Actions
  setNode: (id: string) => void;
  applyEffect: (effect: Choice['effect']) => void;
  resetGame: () => void;
}
```

---

## 4. Functional Requirements & Components

### 4.1. `BackgroundLayer` Component
*   **Function:** Renders the `imageSrc` of the current node.
*   **Behavior:**
    *   **Transition:** When `currentNodeId` changes, cross-fade the old image to the new one (Duration: 0.8s).
    *   **Motion:** Apply a slow scale animation (Scale 1.0 → 1.1 over 10 seconds) to make the static art feel alive.
    *   **Overlay:** A gradient overlay (`bg-gradient-to-t`) from the bottom to ensure text readability against the image.

### 4.2. `HUD` Component (Heads-Up Display)
*   **Style:** Minimalist floating pills.
*   **HP Widget:**
    *   Top Left.
    *   Design: A "Slashed" bar (skewed -12deg) filled with a Red gradient.
    *   Label: `HP 15/20`.
*   **Utility Widget:**
    *   Top Right.
    *   Icons: `<Menu />` (Lucide) and `<Backpack />`.
    *   Clicking Backpack opens a glass modal showing inventory items as grid tiles.

### 4.3. `StorySheet` Component (The Core UI)
*   **Style:** A container fixed to the bottom of the viewport (`h-[55vh]`).
    *   Background: Dark Glass (`bg-slate-900/90`, `backdrop-blur-xl`).
    *   Border: Top border (`border-t border-white/10`).
    *   Shape: Top-left and Top-right rounded corners (`rounded-t-3xl`).
*   **Content - Narrative Log:**
    *   Displays the `node.text`.
    *   **Typewriter Effect:** Text reveals character by character (`framer-motion` stagger).
    *   **Scroll:** If text is long, the area scrolls vertically.
*   **Content - Choice Deck:**
    *   Pinned to the bottom of the Sheet.
    *   Layout: Vertical stack of buttons.

### 4.4. `ChoiceButton` Component
*   **Design:** Modern, sleek, "Tech-Samurai".
    *   Shape: Rectangular with a **cut corner** (clip-path) on the bottom-right.
    *   Bg: `bg-slate-800` (Default) → `bg-indigo-600` (Hover/Active).
    *   Border: Thin left border (`border-l-4`) indicating the type (Red for Combat, Blue for Magic, White for Move).
*   **Stat Checks:**
    *   If a choice requires stats (e.g., DEX > 10), display a small pill on the right side of the button: `[DEX 12]`.
    *   Color code the check: Green (Pass), Red (Fail - Button Disabled).

---

## 5. Asset Generation Guidelines (For AI)

To achieve the "Demon Slayer" + "Modern" look, use these prompts for the Gemini generation step.

*   **Art Style:** *"Anime art style, Ufotable aesthetic, high fidelity, 2D digital illustration, cel shaded with soft gradient lighting, atmospheric, wide angle."*
*   **Subject Matter:**
    *   **Locations:** *"A misty mountain path at twilight, purple wisteria flowers hanging, cinematic lighting."*
    *   **Combat:** *"First-person view of a demon lunging forward, speed lines, glowing eyes, dynamic angle."*
*   **Aspect Ratio:** 9:16 (Vertical) or 1:1 (Square) — *Note: Since we use full-screen cover, 9:16 is preferred for mobile.*

---

## 6. Implementation Roadmap

### Phase 1: Engine Scaffold
1.  Initialize **Vite + React + TS**.
2.  Install dependencies: `zustand`, `framer-motion`, `clsx`, `tailwind-merge`, `lucide-react`.
3.  Create the `story.json` file with 3 test nodes (Intro -> Combat -> Win/Loss).
4.  Set up the Zustand store logic.

### Phase 2: The "Modern Kimetsu" UI
1.  Implement **Tailwind** configuration (Fonts, Custom Colors).
2.  Build the `BackgroundLayer` with the "Ken Burns" zoom effect.
3.  Build the `StorySheet` with the frosted glass CSS (`backdrop-filter: blur(12px)`).

### Phase 3: Text & Interaction
1.  Create the `TypewriterText` component using Framer Motion.
2.  Build the `ChoiceButton` component with the "Cut Corner" design.
3.  Connect Buttons to the Store (Change Node, Update HP).

### Phase 4: Polish
1.  Add screen shake (x/y random offset) when taking damage.
2.  Add a "Flash" effect (white overlay opacity 1 -> 0) when changing scenes.
3.  Deploy to Vercel/Netlify.

---

## 7. Sample Data (JSON)

```json
[
  {
    "id": "intro_forest",
    "title": "The Wisteria Woods",
    "text": "The scent of wisteria is heavy in the air, a sweet poison to demons, but a comfort to you. You have been tracking the creature for three days.\n\nAhead, the path splits. To the left, the sound of rushing water. To the right, an unnatural silence hangs over the thicket.",
    "imageSrc": "assets/wisteria_forest.jpg",
    "type": "narrative",
    "choices": [
      {
        "text": "Follow the water (Rest)",
        "nextNodeId": "river_rest",
        "effect": { "hpChange": 2 }
      },
      {
        "text": "Enter the silent thicket",
        "nextNodeId": "demon_ambush",
        "condition": { "reqStat": "DEX", "reqValue": 5 }
      }
    ]
  },
  {
    "id": "demon_ambush",
    "title": "Ambush!",
    "text": "A shadow detaches itself from the canopy! Razor-sharp claws slash through the air where your head was a moment ago. The demon hisses, its eyes glowing crimson in the dark.",
    "imageSrc": "assets/demon_eyes.jpg",
    "type": "combat",
    "choices": [
      {
        "text": "Water Breathing: First Form",
        "nextNodeId": "victory_demon",
        "condition": { "reqStat": "STR", "reqValue": 12 },
        "effect": { "hpChange": -2 }
      },
      {
        "text": "Dodge and Retreat",
        "nextNodeId": "intro_forest",
        "effect": { "hpChange": -5 }
      }
    ]
  }
]
```