import { useEffect, useRef } from 'react';
import { X, MapPin, ExternalLink, ShieldCheck, Accessibility } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback.jsx';

function mapLink(name) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, Karnataka, India`)}`;
}

export default function DestinationModal({ destination, onClose, onPlanHere }) {
  const closeRef = useRef(null);
  useEffect(() => {
    if (!destination) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [destination, onClose]);

  if (!destination) return null;
  const d = destination;
  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="dest-title" onClick={(e) => e.stopPropagation()}>
        <div className="modal-media">
          <ImageWithFallback src={d.image} alt={d.name} label={d.name} />
          <button ref={closeRef} className="modal-close" onClick={onClose} aria-label="Close details"><X size={20} /></button>
        </div>
        <div className="modal-body">
          <div className="eyebrow">{d.category} · {d.region}</div>
          <h2 id="dest-title">{d.name}</h2>
          <p className="muted" style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}><MapPin size={15} aria-hidden="true" /> {d.district}</p>
          <p>{d.description}</p>
          <div className="tags" style={{ marginBottom: '1.25rem' }}>{d.interests.map((i) => <span className="tag" key={i}>{i}</span>)}</div>

          <div className="grid grid-2" style={{ gap: '0.75rem' }}>
            <div className="info-block"><h4>Cultural & historical context</h4><p>{d.context}</p></div>
            <div className="info-block"><h4>Practical notes</h4><p>{d.practicalNotes}</p></div>
            <div className="info-block">
              <h4>Things to do</h4>
              <ul>{d.activities.map((a) => <li key={a.title}><strong>{a.title}.</strong> {a.detail}</li>)}</ul>
            </div>
            <div className="stack" style={{ gap: '0.75rem' }}>
              <div className="info-block">
                <h4><Accessibility size={13} aria-hidden="true" style={{ verticalAlign: '-2px' }} /> Accessibility</h4>
                <p>{d.accessibility?.status === 'verified' ? d.accessibility.note : 'Information not verified. Please confirm accessibility and facilities with local sources before travelling.'}</p>
              </div>
              <div className="info-block">
                <h4><ShieldCheck size={13} aria-hidden="true" style={{ verticalAlign: '-2px' }} /> Verification status</h4>
                <p>{d.verification}</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
            {onPlanHere ? <button className="btn btn-primary" onClick={() => onPlanHere(d)}>Plan a trip with these interests</button> : null}
            <a className="btn btn-outline" href={mapLink(d.name)} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} aria-hidden="true" /> Open map search</a>
          </div>
          <p className="small muted" style={{ marginTop: '0.75rem', marginBottom: 0 }}>The map button opens an external map search for the destination name. We do not show live route or traffic data.</p>
        </div>
      </div>
    </div>
  );
}
