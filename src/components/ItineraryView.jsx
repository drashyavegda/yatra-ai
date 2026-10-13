import { useState } from 'react';
import { MapPin, Bookmark, BookmarkCheck, RefreshCw, Printer, Navigation, Languages, Compass, Bot, Database } from 'lucide-react';
import Notice from './Notice.jsx';
import BudgetSummary from './BudgetSummary.jsx';
import ImageWithFallback from './ImageWithFallback.jsx';
import { getDestinationById } from '../data/destinations.js';
import { formatINR } from '../utils/budget.js';

function mapLink(name) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, Karnataka, India`)}`;
}

export default function ItineraryView({ trip, onSave, isSaved, onPlanAnother, onOpenDestination }) {
  const [saveMsg, setSaveMsg] = useState(null);
  const ModeIcon = trip.mode === 'ai' ? Bot : Database;

  const handleSave = () => {
    const res = onSave(trip);
    setSaveMsg(res.ok ? { kind: 'success', text: 'Trip saved. Find it under Saved Trips.' } : { kind: 'error', text: res.error || 'Could not save this trip.' });
    setTimeout(() => setSaveMsg(null), 4000);
  };

  return (
    <div className="stack fade-in" style={{ gap: '1.25rem' }}>
      <div className="card card-pad">
        <div className="itin-head">
          <div>
            <div className="eyebrow">Your itinerary</div>
            <h2>{trip.title}</h2>
            <p className="muted" style={{ marginBottom: 0 }}>{trip.summary}</p>
          </div>
          <div className="itin-actions">
            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={isSaved}>
              {isSaved ? <BookmarkCheck size={16} aria-hidden="true" /> : <Bookmark size={16} aria-hidden="true" />} {isSaved ? 'Saved' : 'Save trip'}
            </button>
            <button className="btn btn-outline btn-sm" onClick={onPlanAnother}><RefreshCw size={16} aria-hidden="true" /> Edit & regenerate</button>
            <button className="btn btn-ghost btn-sm" onClick={() => window.print()}><Printer size={16} aria-hidden="true" /> Print</button>
          </div>
        </div>
        <div className="meta-row">
          <span className={`engine-pill ${trip.mode === 'ai' ? 'ai' : ''}`}><ModeIcon size={14} aria-hidden="true" /> {trip.modeLabel}</span>
          <span className="meta"><MapPin size={14} aria-hidden="true" /> From {trip.startCity}</span>
          <span className="meta">{trip.input.days} day{trip.input.days > 1 ? 's' : ''}</span>
          <span className="meta">{trip.input.travellers} traveller{trip.input.travellers > 1 ? 's' : ''}</span>
          <span className="meta">Budget {formatINR(trip.input.budget)}</span>
          {trip.distanceKm !== null && trip.distanceKm !== undefined ? <span className="meta"><Navigation size={14} aria-hidden="true" /> ~{trip.distanceKm} km round trip</span> : null}
        </div>
        {saveMsg ? <div style={{ marginBottom: '0.75rem' }}><Notice kind={saveMsg.kind}>{saveMsg.text}</Notice></div> : null}
        <div className="stack" style={{ gap: '0.5rem' }}>
          {trip.notices.map((n, i) => (
            <Notice key={i} kind={i === 0 ? 'warn' : 'info'}>{n}</Notice>
          ))}
        </div>
        {trip.input.preferences ? <p className="small muted" style={{ marginTop: '0.75rem', marginBottom: 0 }}><strong>Your preferences:</strong> {trip.input.preferences}</p> : null}
      </div>

      <section aria-labelledby="days-heading">
        <h3 id="days-heading" style={{ marginBottom: '0.75rem' }}>Day-by-day plan</h3>
        <div className="stack">
          {trip.days.map((d) => (
            <article className="card card-body day-card" key={d.day}>
              <div className="day-badge"><small>Day</small><strong>{d.day}</strong></div>
              <div>
                <h3>{d.title}</h3>
                <div className="where"><MapPin size={13} aria-hidden="true" style={{ verticalAlign: '-2px' }} /> {d.destinationName}{d.district ? ` · ${d.district}` : ''}</div>
                {d.travel.map((t, i) => (
                  <div className="travel-line" key={i}><Navigation size={15} aria-hidden="true" /> <span>{t}</span></div>
                ))}
                <div>
                  {d.activities.map((a, i) => (
                    <div className="activity" key={i}>
                      <span className="dot" aria-hidden="true" />
                      <div><strong>{a.title}</strong>{a.detail ? <span>{a.detail}</span> : null}</div>
                    </div>
                  ))}
                </div>
                {d.reason ? <div className="reason"><strong>Why:</strong> {d.reason}</div> : null}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                  {d.destinationId ? <button className="btn btn-ghost btn-sm" onClick={() => onOpenDestination(d.destinationId)}><Compass size={15} aria-hidden="true" /> Destination details</button> : null}
                  <a className="btn btn-ghost btn-sm" href={mapLink(d.destinationName)} target="_blank" rel="noopener noreferrer"><MapPin size={15} aria-hidden="true" /> Search on map</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <BudgetSummary budget={trip.budget} />

      {trip.bases.length ? (
        <section aria-labelledby="dest-heading">
          <h3 id="dest-heading" style={{ marginBottom: '0.75rem' }}>Destinations in this trip</h3>
          <div className="grid grid-3">
            {trip.bases.map((b) => {
              const dest = getDestinationById(b.id);
              if (!dest) return null;
              return (
                <button className="dest-card" key={b.id} onClick={() => onOpenDestination(b.id)}>
                  <div className="dest-media"><ImageWithFallback src={dest.image} alt={dest.name} label={dest.name} /><span className="dest-tag">{dest.category}</span></div>
                  <div className="dest-body">
                    <h3>{dest.name}</h3>
                    <div className="district">{dest.district}{b.distanceFromStartKm !== null && b.distanceFromStartKm !== undefined ? ` · ~${b.distanceFromStartKm} km from ${trip.startCity}` : ''}</div>
                    <p>{dest.tagline}</p>
                    <div className="tags">{(b.matches.length ? b.matches : dest.interests.slice(0, 3)).map((m) => <span className="tag" key={m}>{m}</span>)}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      {trip.tips && trip.tips.length ? (
        <section className="card card-pad">
          <h3>Tips from the AI</h3>
          <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>{trip.tips.map((t, i) => <li key={i}>{t}</li>)}</ul>
          <p className="small muted" style={{ margin: '0.75rem 0 0' }}>AI tips are unverified. Treat them as prompts to check, not facts.</p>
        </section>
      ) : null}

      <section className="card card-pad" aria-labelledby="phr-heading">
        <div className="feature" style={{ marginBottom: '1rem' }}>
          <div className="icon-tile"><Languages size={22} aria-hidden="true" /></div>
          <div><h3 id="phr-heading" style={{ marginBottom: 0 }}>Kannada phrases for this trip</h3><p className="small muted" style={{ margin: 0 }}>A few expressions that help on the road.</p></div>
        </div>
        <div className="grid grid-2">
          {trip.phrases.map((p) => (
            <div className="phrase-card" key={p.id}>
              <div className="kannada" lang="kn">{p.kannada}</div>
              <div className="pron">{p.pronunciation}</div>
              <div className="eng">{p.english}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
