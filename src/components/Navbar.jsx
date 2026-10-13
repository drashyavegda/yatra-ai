import { useState } from 'react';
import { Menu, X, Home, Route, Compass, Languages, Bookmark } from 'lucide-react';
import BrandMark from './BrandMark.jsx';

export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'plan', label: 'Plan My Trip', icon: Route },
  { id: 'explore', label: 'Explore Karnataka', icon: Compass },
  { id: 'guide', label: 'Kannada Guide', icon: Languages },
  { id: 'saved', label: 'Saved Trips', icon: Bookmark },
];

export default function Navbar({ route, navigate, savedCount }) {
  const [open, setOpen] = useState(false);
  const go = (id) => {
    navigate(id);
    setOpen(false);
  };
  return (
    <header className="nav">
      <div className="container nav-inner">
        <button className="brand" onClick={() => go('home')} aria-label="YatraAI Karnataka home">
          <BrandMark />
          <span>
            <span className="brand-name">Yatra<span>AI</span></span>
            <span className="brand-sub">Karnataka</span>
          </span>
        </button>
        <nav aria-label="Main navigation">
          <ul id="primary-nav" className={`nav-links ${open ? 'open' : ''}`}>
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button className={`nav-link ${route === id ? 'active' : ''}`} onClick={() => go(id)} aria-current={route === id ? 'page' : undefined}>
                  <Icon size={16} aria-hidden="true" />
                  {label}
                  {id === 'saved' && savedCount > 0 ? <span className="badge">{savedCount}</span> : null}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button className="btn btn-primary btn-sm nav-cta" onClick={() => go('plan')}>Plan My Trip</button>
          <button className="nav-toggle" aria-expanded={open} aria-controls="primary-nav" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((o) => !o)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}
