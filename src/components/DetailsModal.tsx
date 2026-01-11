import { X, Sword, Book, Scroll } from 'lucide-react';
import type { PlayerStats } from '../types';

interface DetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    stats: PlayerStats;
    inventory: string[];
}



export function DetailsModal({ isOpen, onClose, stats, inventory }: DetailsModalProps) {
    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-anime-surface rounded-lg shadow-2xl border-2 border-anime-border flex flex-col max-h-[80vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-anime-border/30 bg-anime-border/5">
                    <h2 className="font-serif font-bold text-lg text-anime-text flex items-center gap-2">
                        <Sword className="w-5 h-5" />
                        冒險手冊
                    </h2>
                    <button onClick={onClose} className="text-anime-text-dim hover:text-anime-danger transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-4 space-y-6">


                    {/* Skills */}
                    <div>
                        <h3 className="text-sm font-bold text-anime-text-dim uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <Book className="w-4 h-4" />
                            已習得技能
                        </h3>
                        {stats.skills.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">尚未習得任何技能</p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {stats.skills.map((skill) => (
                                    <span key={skill} className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-sm font-medium">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Inventory */}
                    <div>
                        <h3 className="text-sm font-bold text-anime-text-dim uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <Scroll className="w-4 h-4" />
                            背包物品
                        </h3>
                        {inventory.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">背包是空的</p>
                        ) : (
                            <div className="space-y-2">
                                {inventory.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-2 bg-white/50 border border-anime-border/10 rounded hover:bg-white/80 transition-colors">
                                        <div className="w-8 h-8 rounded bg-anime-border/10 flex items-center justify-center text-xl">
                                            📦
                                        </div>
                                        <span className="text-anime-text font-serif">{item}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </div>
    );
}
