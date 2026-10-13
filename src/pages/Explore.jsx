import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { DESTINATIONS, CATEGORIES, INTERESTS } from '../data/destinations.js';
import ImageWithFallback from '../components/ImageWithFallback.jsx';

export function filterDestinations(list, { query, category, interest }) {
  const q = (query || '').trim().toLowerCase();
  return list.filter((d) => {
    if (category && d.category !== category) return false;
    if (interest && !d.interests.includes(interest)) return false;
    if (q && !(d.name.toLowerCase().includes(q) || d.district.toLowerCase().includes(q) || d.region.toLowerCase().includes(q))) return false;
    return true;
  });
}

export default function Explore({ onOpenDestination }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [interest, setInterest] = useState('');
  const results = useMemo(() => filterDestinations(DESTINATIONS, { query, category, interest }), [query, category, interest]);
  const hasFilters = query || category || interest;
  const clear = () => { setQuery(''); setCategory(''); setInterest(''); };

  return (
    <section className="section" style={{ paddingTop: '2rem' }}>
      <div className="container">
        <div className="section-head" style={{ marginBottom: '1.25rem' }}>
          <div className="eyebrow">Explore Karnataka</div>
          <h2>Discover the diversity of Karnataka</h2>
          <p>{DESTINATIONS.length} curated destinations with cultural context, practical notes and honest verification status.</p>
        </div>

        <div className="toolbar">
          <div className="search">
            <Search size={18} aria-hidden="true" />
            <label htmlFor="dest-search" className="visually-hidden">Search destinations</label>
            <input id="dest-search" className="input" type="search" placeholder="Search by name, district or region" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div>
            <label htmlFor="cat-select" className="visually-hidden">Filter by category</label>
            <select id="cat-select" className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="filter-row" role="group" aria-label="Filter by interest">
          <span className="label">Interest</span>
          <button className={`filter-chip ${interest === '' ? 'active' : ''}`} onClick={() => setInterest('')} aria-pressed={interest === ''}>All</button>
          {INTERESTS.map((i) => (
            <button key={i} className={`filter-chip ${interest === i ? 'active' : ''}`} onClick={() => setInterest(interest === i ? '' : i)} aria-pressed={interest === i}>{i}</button>
          ))}
          {hasFilters ? <button className="btn btn-ghost btn-sm" onClick={clear}><X size={14} aria-hidden="true" /> Clear filters</button> : null}
        </div>

        <p className="results-count" aria-live="polite">{results.length} destination{results.length === 1 ? '' : 's'}{hasFilters ? ' match your filters' : ''}</p>

        {results.length ? (
          <div className="grid grid-3">
            {results.map((d) => (
              <button className="dest-card fade-in" key={d.id} onClick={() => onOpenDestination(d.id)}>
                <div className="dest-media"><ImageWithFallback src={d.image} alt={d.name} label={d.name} /><span className="dest-tag">{d.category}</span></div>
                <div className="dest-body">
                  <h3>{d.name}</h3>
                  <div className="district">{d.district} · {d.region}</div>
                  <p>{d.tagline}</p>
                  <div className="tags">{d.interests.slice(0, 4).map((i) => <span className="tag" key={i}>{i}</span>)}</div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No destinations match</h3>
            <p className="muted">Try a different search term or clear the filters.</p>
            <button className="btn btn-outline" onClick={clear}>Clear filters</button>
          </div>
        )}
      </div>
    </section>
  );
}
