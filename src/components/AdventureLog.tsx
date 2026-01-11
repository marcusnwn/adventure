import { useRef, useEffect } from 'react';
import type { StoryNode, Choice, StatKey } from '../types';
import { ChoiceButton } from './ChoiceButton';

interface AdventureLogProps {
    nodes: Record<string, StoryNode>;
    history: { nodeId: string; choiceText?: string; responseText?: string }[];
    makeChoice: (choice: Choice) => void;
    stats: Record<StatKey, number>;
    skills: string[];
    inventory: string[];
    gold: number;
    unlockedEndings: string[];
}

const STAT_NAMES: Record<StatKey, string> = {
    STR: '力量',
    DEX: '敏捷',
    INT: '智力',
    SAN: '理智',
    ALI: '善惡'
};


export function AdventureLog({ nodes, history, makeChoice, stats, skills, inventory, gold, unlockedEndings }: AdventureLogProps) {
    const bottomRef = useRef<HTMLDivElement>(null);
    const latestResponseRef = useRef<HTMLDivElement>(null);

    const performScroll = () => {
        if (latestResponseRef.current) {
            // Scroll to the response of the choice we just made
            latestResponseRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (bottomRef.current) {
            // Fallback
            bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    };

    // Auto-scroll to bottom when history updates
    useEffect(() => {
        performScroll();
        // Backup timeout for layout shifts
        const timer = setTimeout(performScroll, 50);
        return () => clearTimeout(timer);
    }, [history, nodes]);

    return (
        <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6 no-scrollbar pb-32">
            {history.map((entry, index) => {
                const node = nodes[entry.nodeId];
                if (!node) return null;
                const isLast = index === history.length - 1;
                // Identify if this entry contains the response for the choice that led to the CURRENT (last) node.
                // Mechanism: current node is at `history.length - 1`.
                // The choice was made at `history.length - 2`.
                const isLatestResponse = index === history.length - 2;

                return (
                    <div key={`${entry.nodeId}-${index}`} className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Title */}
                        <p className="text-anime-text-dim font-serif text-sm italic text-center opacity-70 mt-8">
                            -- {node.title} --
                        </p>

                        {/* Main Text & Illustration */}
                        <div className="space-y-6">
                            <div className="text-anime-text text-lg leading-relaxed font-serif whitespace-pre-wrap">
                                {node.text}
                            </div>

                            {node.imageSrc && (
                                <div className="w-full rounded-lg border-2 border-anime-border p-1 bg-anime-surface shadow-sm transform -rotate-1">
                                    <img
                                        src={node.imageSrc}
                                        alt=""
                                        className="w-full h-auto rounded filter sepia-[0.3] contrast-[1.1]"
                                        onLoad={isLast && !latestResponseRef.current ? performScroll : undefined}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Selected Choice & Response (History) */}
                        {entry.choiceText && (
                            <div
                                ref={isLatestResponse ? latestResponseRef : undefined}
                                className="my-4 pl-4 border-l-2 border-anime-accent/30 space-y-2 scroll-mt-24"
                            >
                                <p className="text-anime-accent font-bold text-sm">
                                    ➜ 選項: {entry.choiceText}
                                </p>
                                {entry.responseText && (
                                    <p className="text-anime-text-dim italic text-base">
                                        "{entry.responseText}"
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Divider */}
                        {!isLast && <div className="w-full h-px bg-anime-border/20 my-2" />}

                        {/* Active Choices (Current Node only) */}
                        {isLast && (
                            <div className="flex flex-col gap-4 mt-4">
                                {node.choices.map((choice, idx) => (
                                    <ChoiceButton
                                        key={idx}
                                        choice={choice}
                                        onClick={() => makeChoice(choice)}
                                        stats={stats}
                                        skills={skills}
                                        inventory={inventory}
                                        gold={gold}
                                        unlockedEndings={unlockedEndings}
                                    />
                                ))}
                                {node.choices.length === 0 && (
                                    <ChoiceButton
                                        choice={{ text: "轉生 (重新開始)", nextNodeId: 'character_creation' }}
                                        onClick={() => window.location.reload()}
                                        stats={stats}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
            <div ref={bottomRef} />
        </div>
    );
}
