import { useState } from 'react';
import { useGameStore } from './store/gameStore';
import { MainContainer } from './components/MainContainer';
import { HUD } from './components/HUD';
import { AdventureLog } from './components/AdventureLog';
import { DetailsModal } from './components/DetailsModal';

function App() {
  const { currentNodeId, nodes, resetGame, makeChoice, stats, inventory, unlockedEndings, history } = useGameStore();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const currentNode = nodes[currentNodeId];

  if (!currentNode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#E6E2D3] text-red-800 font-mono">
        <p>錯誤：找不到節點 '{currentNodeId}'。</p>
        <button
          onClick={resetGame}
          className="mt-4 px-4 py-2 border border-red-800/20 rounded hover:bg-red-800/5 text-anime-text"
        >
          重置系統
        </button>
      </div>
    );
  }

  return (
    <MainContainer>
      <HUD onOpenBag={() => setIsDetailsOpen(true)} />
      <AdventureLog
        nodes={nodes}
        history={history}
        makeChoice={makeChoice}
        stats={stats.attributes}
        skills={stats.skills}
        inventory={inventory}
        gold={stats.gold}
        unlockedEndings={unlockedEndings}
      />
      <DetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        stats={stats}
        inventory={inventory}
      />
    </MainContainer>
  );
}

export default App;
