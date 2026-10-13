import { Wallet, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';
import { formatINR } from '../utils/budget.js';

export default function BudgetSummary({ budget }) {
  if (!budget) return null;
  const { categories, total, selectedBudget, remaining, overBy, withinBudget, perPerson, suggestions, styleLabel, days, travellers, distanceKm, distanceKnown } = budget;
  return (
    <section className="card card-pad" aria-labelledby="budget-heading">
      <div className="feature" style={{ marginBottom: '1rem' }}>
        <div className="icon-tile gold"><Wallet size={22} aria-hidden="true" /></div>
        <div>
          <h3 id="budget-heading" style={{ marginBottom: 0 }}>Estimated budget</h3>
          <p className="small muted" style={{ margin: 0 }}>{styleLabel} style · {days} day{days > 1 ? 's' : ''} · {travellers} traveller{travellers > 1 ? 's' : ''} · about {distanceKm} km {distanceKnown ? 'estimated route' : 'assumed travel'}</p>
        </div>
      </div>

      <div className="budget-total">
        <div className="stat"><small>Estimated total</small><strong>{formatINR(total)}</strong><div className="small muted">{formatINR(perPerson)} per person</div></div>
        <div className="stat"><small>Your budget</small><strong>{formatINR(selectedBudget)}</strong></div>
        <div className={`stat ${withinBudget ? 'ok' : 'over'}`}>
          <small>{withinBudget ? 'Remaining' : 'Over budget by'}</small>
          <strong>{formatINR(withinBudget ? remaining : overBy)}</strong>
        </div>
      </div>

      <div className={`notice ${withinBudget ? 'notice-success' : 'notice-warn'}`} style={{ marginBottom: '1rem' }}>
        {withinBudget ? <CheckCircle2 size={18} aria-hidden="true" /> : <AlertTriangle size={18} aria-hidden="true" />}
        <div>{withinBudget ? 'The estimate fits within your selected budget.' : 'The estimate exceeds your selected budget. See the suggestions below.'}</div>
      </div>

      <div>
        {categories.map((c) => (
          <div className="budget-row" key={c.key}>
            <span>{c.label} <span className="muted small">({c.share}%)</span></span>
            <strong>{formatINR(c.amount)}</strong>
            <div className="bar" aria-hidden="true"><i style={{ width: `${Math.max(c.share, 2)}%` }} /></div>
            <span className="note">{c.note}</span>
          </div>
        ))}
        <div className="budget-foot"><span>Estimated trip total</span><span>{formatINR(total)}</span></div>
      </div>

      {!withinBudget && suggestions.length > 0 ? (
        <div style={{ marginTop: '1.25rem' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-body)', fontSize: '0.95rem' }}><Lightbulb size={18} aria-hidden="true" /> Ways to bring it within budget</h4>
          <div className="stack">
            {suggestions.map((s) => (
              <div className="suggestion" key={s.key}>
                <div style={{ flex: 1 }}>
                  <strong>{s.title}</strong>
                  <span>{s.detail}</span>
                </div>
                <span className={s.fits ? 'pill-ok' : 'pill-no'}>{s.fits ? 'Fits budget' : 'Still over'}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <p className="small muted" style={{ marginTop: '1rem', marginBottom: 0 }}>
        Estimates use stated planning assumptions, not live prices. Actual costs vary by season, availability and your choices.
      </p>
    </section>
  );
}
