export type NodeType = 'narrative' | 'combat' | 'shop' | 'ending';

export type StatKey = 'STR' | 'INT' | 'DEX' | 'SAN' | 'ALI';

export interface StoryNode {
    id: string;
    title: string;
    text: string;
    imageSrc: string;
    bgm?: string;
    type: NodeType;
    choices: Choice[];
}

export interface Choice {
    text: string;
    responseText?: string; // Text shown after selecting this choice
    nextNodeId: string;
    failureNodeId?: string; // For dice roll failure
    unlockCondition?: string; // For meta-progression
    condition?: {
        reqStat?: StatKey;
        reqValue?: number;
        reqItem?: string;
        reqSkill?: string;
        reqGold?: number;
        difficulty?: number; // Dice roll DC
    };
    effect?: {
        hpChange?: number;
        goldChange?: number;
        addItem?: string;
        removeItem?: string;
        addSkill?: string;
        statChange?: Partial<Record<StatKey, number>>;
        sanity?: number; // Shortcut for statChange.SAN
        alignment?: number; // Shortcut for statChange.ALI
    };
}

export interface PlayerStats {
    hp: number;
    maxHp: number;
    gold: number;
    attributes: Record<StatKey, number>;
    skills: string[];
}

export interface RollDetails {
    roll: number;
    bonus: number;
    total: number;
    difficulty: number;
    stat: StatKey;
    passed: boolean;
}

export interface HistoryEntry {
    nodeId: string;
    choiceText?: string;
    responseText?: string;
    rollDetails?: RollDetails;
}

export interface GameState {
    currentNodeId: string;
    stats: PlayerStats;
    inventory: string[];
    history: HistoryEntry[];
    unlockedEndings: string[]; // Track unlocked endings
    isAnimating: boolean;
}
