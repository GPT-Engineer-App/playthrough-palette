import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

const fetchPlaythroughs = async (gameId) => {
  const response = await fetch(`https://boardgamegeek.com/xmlapi2/plays?id=${gameId}&type=thing`);
  const xmlText = await response.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  const plays = Array.from(xmlDoc.getElementsByTagName('play')).map(play => ({
    id: play.getAttribute('id'),
    date: play.getAttribute('date'),
    players: Array.from(play.getElementsByTagName('player')).map(player => player.getAttribute('name')).join(', '),
  }));
  return plays;
};

const PlaythroughList = ({ gameId }) => {
  const { data: playthroughs, isLoading, isError, error } = useQuery({
    queryKey: ['playthroughs', gameId],
    queryFn: () => fetchPlaythroughs(gameId),
  });

  if (isLoading) {
    return <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (isError) {
    return <p className="text-red-500">Error loading playthroughs: {error.message}</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Recent Playthroughs</h2>
      {playthroughs.length === 0 ? (
        <p>No playthroughs found for this game.</p>
      ) : (
        <ul className="space-y-2">
          {playthroughs.map((playthrough) => (
            <li key={playthrough.id} className="bg-white p-4 rounded-lg shadow">
              <p><strong>Date:</strong> {playthrough.date}</p>
              <p><strong>Players:</strong> {playthrough.players}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlaythroughList;
