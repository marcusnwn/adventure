import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { GameState, PlayerStats, StoryNode, Choice, StatKey } from '../types';
import storyData from '../data/story.json';

interface GameStore extends GameState {
    nodes: Record<string, StoryNode>;

    // Actions
    initializeGame: () => void;
    makeChoice: (choice: Choice) => void;
    resetGame: () => void;
    setIsAnimating: (isAnimating: boolean) => void;
}

const INITIAL_STATS: PlayerStats = {
    hp: 20,
    maxHp: 20,
    gold: 0,
    attributes: {
        STR: 10,
        INT: 10,
        DEX: 10,
        SAN: 100,
        ALI: 0,
    },
    skills: [],
};

const storyNodes: Record<string, StoryNode> = storyData.reduce((acc, node) => {
    acc[node.id] = node as StoryNode;
    return acc;
}, {} as Record<string, StoryNode>);

export const useGameStore = create<GameStore>()(
    devtools(
        persist(
            (set) => ({
                currentNodeId: 'character_creation', // Updated start node
                nodes: storyNodes,
                stats: INITIAL_STATS,
                inventory: [],
                history: [{ nodeId: 'character_creation' }],
                unlockedEndings: [],
                isAnimating: false,

                initializeGame: () => { },

                resetGame: () => {
                    set({
                        currentNodeId: 'character_creation',
                        stats: INITIAL_STATS,
                        inventory: [],
                        history: [{ nodeId: 'character_creation' }],
                        isAnimating: false,
                    });
                },

                setIsAnimating: (isAnimating) => set({ isAnimating }),

                makeChoice: (choice: Choice) => {
                    const { nextNodeId, failureNodeId, condition, effect } = choice;

                    set((state) => {
                        const newStats = { ...state.stats };
                        const newInventory = [...state.inventory];
                        const newUnlockedEndings = [...state.unlockedEndings];
                        let currentHistory = [...state.history];

                        // Ensure skills array exists
                        if (!newStats.skills) newStats.skills = [];

                        // 1. Dice Roll Check
                        let targetNodeId = nextNodeId;
                        if (condition?.difficulty && condition.reqStat) {
                            const playerStat = newStats.attributes[condition.reqStat] || 0;
                            const roll = Math.floor(Math.random() * 20) + 1; // D20
                            const total = roll + playerStat;

                            // console.log(`[Dice Roll] Stat: ${condition.reqStat} (${playerStat}) + Roll: ${roll} = ${total} vs Diff: ${condition.difficulty}`);

                            if (total < condition.difficulty) {
                                // Failure!
                                if (failureNodeId) {
                                    targetNodeId = failureNodeId;
                                }
                            }
                        }

                        // 2. Apply Effects (Only if we are moving to nextNodeId or failureNodeId logic allows)
                        // Note: Usually effects are applied regardless of success/fail unless specifically separated, 
                        // but for now we apply impacts of the *choice* itself. 
                        // If failure has different effects, those should be on the failure node itself or handled here complexity.
                        // Simplified: Apply effects defined on the choice.

                        if (effect) {
                            if (effect.hpChange) newStats.hp = Math.min(newStats.hp + effect.hpChange, newStats.maxHp);
                            if (effect.goldChange) newStats.gold += effect.goldChange;
                            if (effect.addItem) newInventory.push(effect.addItem);
                            if (effect.removeItem) {
                                const index = newInventory.indexOf(effect.removeItem);
                                if (index > -1) newInventory.splice(index, 1);
                            }
                            if (effect.addSkill && !newStats.skills.includes(effect.addSkill)) {
                                newStats.skills.push(effect.addSkill);
                            }
                            if (effect.statChange) {
                                Object.entries(effect.statChange).forEach(([key, value]) => {
                                    newStats.attributes[key as StatKey] += value;
                                });
                            }
                            if (effect.sanity) newStats.attributes.SAN += effect.sanity;
                            if (effect.alignment) newStats.attributes.ALI += effect.alignment;
                        }

                        // 3. Check for Ending Unlock
                        const targetNode = state.nodes[targetNodeId];
                        if (targetNode?.type === 'ending') {
                            if (!newUnlockedEndings.includes(targetNodeId)) {
                                newUnlockedEndings.push(targetNodeId);
                            }
                        }

                        // 4. Update History
                        // Update the LAST entry in history (the node we are leaving) with the choice details
                        if (currentHistory.length > 0) {
                            const lastIndex = currentHistory.length - 1;
                            currentHistory[lastIndex] = {
                                ...currentHistory[lastIndex],
                                choiceText: choice.text,
                                responseText: choice.responseText
                            };
                        }

                        // Add the NEW node to history
                        currentHistory.push({ nodeId: targetNodeId });

                        return {
                            currentNodeId: targetNodeId,
                            stats: newStats,
                            inventory: newInventory,
                            unlockedEndings: newUnlockedEndings,
                            history: currentHistory,
                            isAnimating: true
                        };
                    });
                },
            }),
            {
                name: 'solo-adventure-storage-v2', // Bump version to clear old incompatible state
                partialize: (state) => ({
                    currentNodeId: state.currentNodeId,
                    stats: state.stats,
                    inventory: state.inventory,
                    history: state.history,
                    unlockedEndings: state.unlockedEndings
                }),
            }
        )
    )
);
