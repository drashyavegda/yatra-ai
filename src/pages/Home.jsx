import { ArrowRight, Route, Wallet, Compass, Languages, Leaf, ShieldCheck, Sparkles, Database } from 'lucide-react';
import { DESTINATIONS } from '../data/destinations.js';
import { PHRASES } from '../data/phrases.js';
import { IMAGE_CREDITS } from '../data/imageCredits.js';
import ImageWithFallback from '../components/ImageWithFallback.jsx';

const FEATURED_IDS = ['hampi', 'mysuru', 'coorg', 'gokarna', 'belur', 'chikkamagaluru'];

export default function Home({ navigate, onOpenDestination }) {
  const featured = FEATURED_IDS.map((id) => DESTINATIONS.find((d) => d.id === id)).filter(Boolean);
  const previewPhrases = PHRASES.filter((p) => [1, 4, 27].includes(p.id));
  const heroCredit = IMAGE_CREDITS.find((c) => c.file === '/images/hero.jpg');

  return (
    <>
      <section className="hero">
        <img className="hero-bg" src="/images/hero.jpg" alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        <div className="container hero-inner">
          <div className="eyebrow" style={{ color: 'var(--gold)' }}>Kannada Digital Innovation Hackathon 2026 · AI Travel Planner for Karnataka</div>
          <h1>Your Karnataka Journey, Intelligently Planned.</h1>
          <p>Discover incredible destinations, plan around your budget, and explore Karnataka with a travel companion designed around you.</p>
          <div className="hero-actions">
            <button className="btn btn-gold" onClick={() => navigate('plan')}>Plan My Trip <ArrowRight size={18} aria-hidden="true" /></button>
            <button className="btn btn-light" onClick={() => navigate('explore')}>Explore Karnataka</button>
          </div>
          <div className="hero-chips">
            <span className="chip"><Route size={14} aria-hidden="true" /> Day-by-day itineraries</span>
            <span className="chip"><Wallet size={14} aria-hidden="true" /> Budget estimates in ₹</span>
            <span className="chip"><Languages size={14} aria-hidden="true" /> Kannada phrasebook</span>
            <span className="chip"><Database size={14} aria-hidden="true" /> Works without an API key</span>
          </div>
        </div>
        {heroCredit ? <div className="hero-credit">Photo: <a href={heroCredit.source} target="_blank" rel="noopener noreferrer">{heroCredit.author}</a>, {heroCredit.license}</div> : null}
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Featured destinations</div>
            <h2>From Hoysala temples to misty coffee hills</h2>
            <p>A few of the places in our curated Karnataka dataset. Open any destination for context, practical notes and what is - and is not - verified.</p>
          </div>
          <div className="grid grid-3">
            {featured.map((d) => (
              <button className="dest-card" key={d.id} onClick={() => onOpenDestination(d.id)}>
                <div className="dest-media"><ImageWithFallback src={d.image} alt={d.name} label={d.name} /><span className="dest-tag">{d.category}</span></div>
                <div className="dest-body">
                  <h3>{d.name}</h3>
                  <div className="district">{d.district}</div>
                  <p>{d.tagline}</p>
                </div>
              </button>
            ))}
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <button className="btn btn-outline" onClick={() => navigate('explore')}>See all {DESTINATIONS.length} destinations <ArrowRight size={16} aria-hidden="true" /></button>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--white)', borderBlock: '1px solid var(--line)' }}>
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">How it works</div>
            <h2>Four steps to a plan you can actually use</h2>
          </div>
          <div className="grid grid-4">
            {[
              ['Tell us about your trip', 'Starting city, days, budget, travellers and travel style.'],
              ['Pick your interests', 'Nature, heritage, beaches, food, wildlife, architecture and more.'],
              ['Get a day-by-day plan', 'Relevant destinations grouped sensibly, with reasons for each pick.'],
              ['Refine and save', 'Change a preference, regenerate, and keep trips in your browser.'],
            ].map(([t, d], i) => (
              <div className="feature" key={t}>
                <div className="step-num">{i + 1}</div>
                <div><h3 style={{ fontSize: '1.05rem' }}>{t}</h3><p className="small muted" style={{ margin: 0 }}>{d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <div className="eyebrow">Smart budget planning</div>
            <h2>Know roughly what your trip will cost before you go</h2>
            <p>Every plan comes with an estimate split into transportation, accommodation, food, activities and a contingency buffer - scaled to your group size, days and travel style. If the estimate exceeds your budget, we show practical alternatives such as a cheaper travel style or a shorter trip.</p>
            <p className="small muted">Estimates are based on clearly stated assumptions, not live prices. Always verify current costs.</p>
            <button className="btn btn-primary" onClick={() => navigate('plan')}>Try the budget planner <ArrowRight size={16} aria-hidden="true" /></button>
          </div>
          <div className="card card-pad">
            <div className="eyebrow">Example (illustrative)</div>
            <h3>3 days · 2 travellers · Balanced style</h3>
            <div className="budget-row"><span>Transportation</span><strong>Depends on route</strong></div>
            <div className="budget-row"><span>Accommodation</span><strong>Nights × rooms</strong></div>
            <div className="budget-row"><span>Food</span><strong>Per person per day</strong></div>
            <div className="budget-row"><span>Activities & entry fees</span><strong>Per person per day</strong></div>
            <div className="budget-row"><span>Contingency</span><strong>10% buffer</strong></div>
            <p className="small muted" style={{ marginTop: '0.75rem', marginBottom: 0 }}>Generate a trip to see real figures for your inputs.</p>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--white)', borderBlock: '1px solid var(--line)' }}>
        <div className="container split">
          <div className="phrase-preview">
            {previewPhrases.map((p) => (
              <div className="phrase-card" key={p.id}>
                <div className="kannada" lang="kn">{p.kannada}</div>
                <div className="pron">{p.pronunciation}</div>
                <div className="eng">{p.english}</div>
              </div>
            ))}
          </div>
          <div>
            <div className="eyebrow">Kannada Companion</div>
            <h2>A few words go a long way</h2>
            <p>Greetings, directions, transport, food and shopping phrases in Kannada script with English meanings and simple pronunciations - readable on your phone when you need them.</p>
            <button className="btn btn-outline" onClick={() => navigate('guide')}><Languages size={16} aria-hidden="true" /> Open the Kannada Guide</button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="band">
            <div className="split" style={{ alignItems: 'start' }}>
              <div>
                <div className="eyebrow">Responsible travel</div>
                <h2>Travel well, leave places better</h2>
                <p>Karnataka's heritage sites, forests and coasts are shared spaces. We encourage respectful visits and we tell you plainly when information - such as accessibility or timings - is not verified rather than guessing.</p>
              </div>
              <div className="stack" style={{ gap: '0.75rem' }}>
                {[
                  [Leaf, 'Respect local customs and dress codes at temples and villages.'],
                  [ShieldCheck, 'Protect heritage sites: no climbing on monuments, no graffiti.'],
                  [Compass, 'Dispose of waste properly; carry a refillable bottle.'],
                  [Sparkles, 'Verify current travel guidance, safety advice and permissions locally.'],
                ].map(([Icon, t]) => (
                  <div className="feature" key={t}>
                    <div className="icon-tile" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--gold)' }}><Icon size={20} aria-hidden="true" /></div>
                    <p style={{ margin: 0, paddingTop: '0.6rem' }}>{t}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 640 }}>
          <h2>Ready to plan your Karnataka journey?</h2>
          <p className="muted">It takes under a minute. No account, no API key needed - the demo planner runs entirely in your browser.</p>
          <button className="btn btn-primary" onClick={() => navigate('plan')}>Plan My Trip <ArrowRight size={18} aria-hidden="true" /></button>
        </div>
      </section>
    </>
  );
}
