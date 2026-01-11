import type { Choice, StatKey } from '../types';
import { cn } from '../lib/utils';
import { Clover } from 'lucide-react'; // Using Clover as a flower/ornament icon

const STAT_NAMES: Record<StatKey, string> = {
    STR: '力量',
    DEX: '敏捷',
    INT: '智力',
    SAN: '理智',
    ALI: '善惡'
};

interface ChoiceButtonProps {
    choice: Choice;
    onClick: () => void;
    className?: string;
    stats?: Record<StatKey, number>;
    skills?: string[];
    inventory?: string[];
    gold?: number;
    unlockedEndings?: string[];
}

export function ChoiceButton({ choice, onClick, className, stats, skills, inventory, gold, unlockedEndings }: ChoiceButtonProps) {

    let isMet = true;
    const requirements: string[] = [];

    if (choice.condition) {
        // Check Stats
        if (choice.condition.reqStat && choice.condition.reqValue && stats) {
            const currentVal = stats[choice.condition.reqStat] || 0;
            const met = currentVal >= choice.condition.reqValue;
            if (!met) isMet = false;
            requirements.push(`${STAT_NAMES[choice.condition.reqStat]} ${choice.condition.reqValue}`);
        }

        // Check Item
        if (choice.condition.reqItem && inventory) {
            const hasItem = inventory.includes(choice.condition.reqItem);
            if (!hasItem) isMet = false;
            // Try to translate item name or just show ID for now if no translation map
            requirements.push(`需物品: ${choice.condition.reqItem}`);
        }

        // Check Skill
        if (choice.condition.reqSkill && skills) {
            const hasSkill = skills.includes(choice.condition.reqSkill);
            if (!hasSkill) isMet = false;
            requirements.push(`需技能: ${choice.condition.reqSkill}`);
        }

        // Check Gold
        if (choice.condition.reqGold !== undefined && gold !== undefined) {
            const hasGold = gold >= choice.condition.reqGold;
            if (!hasGold) isMet = false;
            requirements.push(`需金幣: ${choice.condition.reqGold}`);
        }

        // Check Difficulty (Dice Roll)
        if (choice.condition.difficulty && choice.condition.reqStat) {
            requirements.push(`${STAT_NAMES[choice.condition.reqStat]} 判定 [難度: ${choice.condition.difficulty}]`);
            // Note: We don't disable the button for difficulty checks, 
            // as the random result happens ON CLICK. 
            // However, we might want to warn if stat is too low? 
            // For now, let's just show the requirement.
        }
    }

    // Check Unlock Condition (Meta Progression)
    if (choice.unlockCondition && unlockedEndings) {
        if (!unlockedEndings.includes(choice.unlockCondition)) {
            return null; // Don't render if condition not met
        }
    }

    return (
        <button
            onClick={isMet ? onClick : undefined}
            disabled={!isMet}
            className={cn(
                "w-full text-left group flex items-start gap-3 transition-colors",
                !isMet && "opacity-50 cursor-not-allowed",
                className
            )}
        >
            <div className="mt-1 shrink-0">
                <Clover className={cn(
                    "w-4 h-4 text-anime-border transition-transform group-hover:rotate-45",
                    isMet ? "group-hover:text-anime-accent" : "text-gray-400"
                )} />
            </div>

            <div className="flex flex-col">
                <span className={cn(
                    "font-serif font-bold text-lg text-anime-text decoration-anime-accent/50 underline-offset-4",
                    isMet && "group-hover:underline"
                )}>
                    {choice.text}
                </span>

                {/* Requirements Display */}
                {requirements.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-0.5">
                        {requirements.map((req, idx) => (
                            <span key={idx} className={cn(
                                "text-xs font-sans",
                                isMet ? "text-green-700" : "text-red-700"
                            )}>
                                [{req}]
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </button>
    );
}
