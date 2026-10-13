import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { PHRASES, PHRASE_CATEGORIES } from '../data/phrases.js';

export function filterPhrases(list, { query, category }) {
  const q = (query || '').trim().toLowerCase();
  return list.filter((p) => {
    if (category && p.category !== category) return false;
    if (q && !(p.english.toLowerCase().includes(q) || p.pronunciation.toLowerCase().includes(q) || p.kannada.includes(q))) return false;
    return true;
  });
}

export default function KannadaGuide() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const results = useMemo(() => filterPhrases(PHRASES, { query, category }), [query, category]);
  const hasFilters = query || category;

  return (
    <section className="section" style={{ paddingTop: '2rem' }}>
      <div className="container">
        <div className="section-head" style={{ marginBottom: '1.25rem' }}>
          <div className="eyebrow">Kannada Companion</div>
          <h2>Useful Kannada for travellers</h2>
          <p>{PHRASES.length} everyday phrases in Kannada script with English meanings and simple pronunciations. Kannada is the official language of Karnataka; even a greeting is warmly received.</p>
        </div>

        <div className="toolbar">
          <div className="search">
            <Search size={18} aria-hidden="true" />
            <label htmlFor="phrase-search" className="visually-hidden">Search phrases</label>
            <input id="phrase-search" className="input" type="search" placeholder="Search in English, pronunciation or Kannada" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          {hasFilters ? <button className="btn btn-ghost btn-sm" onClick={() => { setQuery(''); setCategory(''); }}><X size={14} aria-hidden="true" /> Clear</button> : null}
        </div>
        <div className="filter-row" role="group" aria-label="Filter by category">
          <button className={`filter-chip ${category === '' ? 'active' : ''}`} onClick={() => setCategory('')} aria-pressed={category === ''}>All</button>
          {PHRASE_CATEGORIES.map((c) => (
            <button key={c} className={`filter-chip ${category === c ? 'active' : ''}`} onClick={() => setCategory(category === c ? '' : c)} aria-pressed={category === c}>{c}</button>
          ))}
        </div>

        <p className="results-count" aria-live="polite">{results.length} phrase{results.length === 1 ? '' : 's'}</p>
        {results.length ? (
          <div className="grid grid-3">
            {results.map((p) => (
              <div className="phrase-card fade-in" key={p.id}>
                <div className="kannada" lang="kn">{p.kannada}</div>
                <div className="pron">{p.pronunciation}</div>
                <div className="eng">{p.english}</div>
                {p.note ? <div className="note">{p.note}</div> : null}
                <div className="cat">{p.category}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No phrases found</h3>
            <p className="muted">Try another word, for example "bus", "water" or "thank".</p>
          </div>
        )}
        <p className="small muted" style={{ marginTop: '1.5rem' }}>Pronunciations are approximate guides for English speakers. Regional accents vary across Karnataka.</p>
      </div>
    </section>
  );
}
