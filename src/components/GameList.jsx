import React from 'react';
import { Button } from '@/components/ui/button';

const GameList = ({ games, onSelectGame }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
      <ul className="space-y-2">
        {games.map((game) => (
          <li key={game.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
            <span>{game.name}</span>
            <Button onClick={() => onSelectGame(game.id)}>View Playthroughs</Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameList;
