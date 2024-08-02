import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import GameList from '../components/GameList';
import PlaythroughList from '../components/PlaythroughList';

const fetchBoardGames = async (searchTerm) => {
  const response = await fetch(`https://boardgamegeek.com/xmlapi2/search?query=${searchTerm}&type=boardgame`);
  const xmlText = await response.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  const games = Array.from(xmlDoc.getElementsByTagName('item')).map(item => ({
    id: item.getAttribute('id'),
    name: item.querySelector('name').getAttribute('value'),
  }));
  return games;
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGameId, setSelectedGameId] = useState(null);

  const { data: games, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['boardGames', searchTerm],
    queryFn: () => fetchBoardGames(searchTerm),
    enabled: false,
  });

  const handleSearch = () => {
    if (searchTerm.trim()) {
      refetch();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Board Game Explorer</h1>
      <div className="flex space-x-2 mb-6">
        <Input
          type="text"
          placeholder="Search for a board game..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
          Search
        </Button>
      </div>

      {isError && <p className="text-red-500 mb-4">Error: {error.message}</p>}

      {games && games.length > 0 && (
        <GameList games={games} onSelectGame={(id) => setSelectedGameId(id)} />
      )}

      {selectedGameId && (
        <PlaythroughList gameId={selectedGameId} />
      )}
    </div>
  );
};

export default Index;
