import { Bookmark, Trash2, FolderOpen, MapPin, Calendar } from 'lucide-react';
import Notice from '../components/Notice.jsx';
import { formatINR } from '../utils/budget.js';

function fmtDate(iso) {
  try { return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }); } catch { return ''; }
}

export default function SavedTrips({ trips, storageOk, onOpen, onDelete, onClearAll, navigate }) {
  return (
    <section className="section" style={{ paddingTop: '2rem' }}>
      <div className="container">
        <div className="itin-head" style={{ marginBottom: '1.25rem' }}>
          <div className="section-head" style={{ marginBottom: 0 }}>
            <div className="eyebrow">Saved Trips</div>
            <h2>Your saved itineraries</h2>
            <p>Stored only in this browser (no account needed).</p>
          </div>
          {trips.length ? <button className="btn btn-danger btn-sm" onClick={onClearAll}><Trash2 size={15} aria-hidden="true" /> Clear all</button> : null}
        </div>

        {!storageOk ? <div style={{ marginBottom: '1rem' }}><Notice kind="warn">Browser storage is unavailable (private mode or blocked). You can still generate trips, but they cannot be saved.</Notice></div> : null}

        {trips.length === 0 ? (
          <div className="empty-state">
            <div className="icon-tile"><Bookmark size={22} aria-hidden="true" /></div>
            <h3>No saved trips yet</h3>
            <p className="muted">Generate an itinerary and press <strong>Save trip</strong> to keep it here.</p>
            <button className="btn btn-primary" onClick={() => navigate('plan')}>Plan My Trip</button>
          </div>
        ) : (
          <div className="stack">
            {trips.map((t) => (
              <div className="card card-body saved-card" key={t.id}>
                <div>
                  <h3 style={{ marginBottom: '0.2rem' }}>{t.title}</h3>
                  <div className="meta-row" style={{ margin: '0.4rem 0 0' }}>
                    <span className="meta"><MapPin size={13} aria-hidden="true" /> {t.startCity}</span>
                    <span className="meta">{t.input?.days} day{t.input?.days > 1 ? 's' : ''}</span>
                    <span className="meta">{t.input?.travellers} traveller{t.input?.travellers > 1 ? 's' : ''}</span>
                    <span className="meta">Est. {formatINR(t.budget?.total)}</span>
                    <span className="meta">{t.modeLabel || t.mode}</span>
                    <span className="meta"><Calendar size={13} aria-hidden="true" /> {fmtDate(t.savedAt || t.createdAt)}</span>
                  </div>
                </div>
                <div className="actions">
                  <button className="btn btn-primary btn-sm" onClick={() => onOpen(t)}><FolderOpen size={15} aria-hidden="true" /> Open</button>
                  <button className="btn btn-danger btn-sm" onClick={() => onDelete(t.id)}><Trash2 size={15} aria-hidden="true" /> Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
