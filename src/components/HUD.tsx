import { Backpack, Menu, Heart, Coins } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import type { StatKey } from '../types';

const STAT_NAMES: Record<StatKey, string> = {
    STR: '力量',
    DEX: '敏捷',
    INT: '智力',
    SAN: '理智',
    ALI: '善惡'
};

interface HUDProps {
    onOpenBag?: () => void;
}

export function HUD({ onOpenBag }: HUDProps) {
    const { stats } = useGameStore();

    return (
        <div className="w-full h-16 shrink-0 bg-anime-surface border-b-2 border-anime-border flex items-center justify-between px-4 z-10 shadow-sm relative">

            {/* Left Side: HP & Gold */}
            <div className="flex items-center gap-4">
                {/* HP Widget */}
                <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-anime-danger fill-current" />
                    <div className="flex flex-col">
                        <span className="font-mono text-xs leading-none font-bold text-anime-text">
                            HP {stats.hp}/{stats.maxHp}
                        </span>
                        <div className="w-20 h-1.5 bg-black/10 mt-1 rounded-full overflow-hidden border border-black/5">
                            <div
                                className="h-full bg-anime-danger"
                                style={{ width: `${(stats.hp / stats.maxHp) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Gold Widget */}
                <div className="flex items-center gap-1.5 text-anime-text" title={stats.gold.toString()}>
                    <Coins className="w-4 h-4 text-yellow-600 fill-yellow-600/20" />
                    <span className="font-mono text-sm font-bold">
                        {stats.gold > 9999 ? `${(stats.gold / 1000).toFixed(1)}k` : stats.gold}
                    </span>
                </div>
            </div>

            {/* Stats - 1 Line Grid */}
            <div className="hidden md:grid grid-cols-3 gap-4 text-anime-text-dim text-xs font-mono">
                <span>{STAT_NAMES.STR} {stats.attributes.STR}</span>
                <span>{STAT_NAMES.INT} {stats.attributes.INT}</span>
                <span>{STAT_NAMES.DEX} {stats.attributes.DEX}</span>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
                <button
                    onClick={onOpenBag}
                    className="p-2 hover:bg-black/5 rounded transition-colors text-anime-text"
                    title="物品與技能"
                >
                    <Backpack className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-black/5 rounded transition-colors text-anime-text">
                    <Menu className="w-5 h-5" />
                </button>
            </div>

            {/* Ornamental Corner Border */}
            <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-anime-border" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-anime-border" />
        </div>
    );
}
