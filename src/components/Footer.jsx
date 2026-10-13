import { NAV_ITEMS } from './Navbar.jsx';
import { IMAGE_CREDITS } from '../data/imageCredits.js';
import BrandMark from './BrandMark.jsx';

export default function Footer({ navigate }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <BrandMark size={34} />
              <strong style={{ color: '#fff', fontFamily: 'var(--font-head)', fontSize: '1.15rem' }}>YatraAI Karnataka</strong>
            </div>
            <p style={{ maxWidth: 380 }}>Discover Karnataka. Your Journey, Your Way. A student prototype for the Kannada Digital Innovation Hackathon 2026 - problem statement: AI Travel Planner for Karnataka.</p>
            <p className="small" style={{ opacity: 0.8 }}>All itineraries and costs are estimates for planning only. Verify timings, availability, routes and prices before you travel.</p>
          </div>
          <div>
            <h4>Explore</h4>
            {NAV_ITEMS.map((n) => (
              <button key={n.id} className="link" onClick={() => navigate(n.id)}>{n.label}</button>
            ))}
          </div>
          <div>
            <h4>Responsible travel</h4>
            <p className="small">Respect local customs and heritage sites, dispose of waste properly, support local businesses, and check current travel guidance before setting out.</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 YatraAI Karnataka prototype. Built with React and Vite.</span>
          <details className="credits">
            <summary>Photo credits (Wikimedia Commons)</summary>
            <ul>
              {IMAGE_CREDITS.map((c) => (
                <li key={c.file}>
                  <a href={c.source} target="_blank" rel="noopener noreferrer">{c.title.replace(/\.[a-zA-Z]+$/, '')}</a> - {c.author}, {c.license}
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </footer>
  );
}
