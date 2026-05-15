import { useEffect, useMemo, useState } from 'react';
import type { Invitee, ContactedMap } from './lib/types';
import { groupAndSortByHall } from './lib/grouping';
import { filterBySearch } from './lib/search';
import { loadContacted, saveContacted, toggleContacted } from './lib/contacted';
import { HallSection } from './components/HallSection';
import { SearchBox } from './components/SearchBox';

export function App() {
  const [invitees, setInvitees] = useState<Invitee[]>([]);
  const [contacted, setContacted] = useState<ContactedMap>(() => loadContacted());
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}convention.json`)
      .then(r => r.json())
      .then(setInvitees);
  }, []);

  const filtered = useMemo(() => filterBySearch(invitees, query), [invitees, query]);
  const grouped = useMemo(() => groupAndSortByHall(filtered, contacted), [filtered, contacted]);

  const handleToggle = (slug: string) => {
    const next = toggleContacted(contacted, slug);
    setContacted(next);
    saveContacted(next);
  };

  const searching = query.trim().length > 0;

  return (
    <div className="app">
      <header className="app-header">
        <h1>DoKomi Invitees</h1>
        <SearchBox value={query} onChange={setQuery} />
      </header>
      <main>
        {grouped.halls.map(({ hall, invitees }) => (
          <HallSection
            key={hall}
            title={hall}
            invitees={invitees}
            contactedMap={contacted}
            onToggleContacted={handleToggle}
            defaultOpen={true}
          />
        ))}
        <HallSection
          title="Contacted"
          invitees={grouped.contacted}
          contactedMap={contacted}
          onToggleContacted={handleToggle}
          defaultOpen={searching}
        />
      </main>
    </div>
  );
}
