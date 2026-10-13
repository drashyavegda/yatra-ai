import { useState } from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { INTERESTS } from '../data/destinations.js';
import { validateTripForm, MAX_DAYS, MAX_TRAVELLERS, MAX_PREFERENCES_LENGTH } from '../utils/validation.js';

export const DEFAULT_FORM = {
  startingCity: '',
  days: '3',
  budget: '',
  travellers: '2',
  interests: ['Nature', 'Heritage'],
  travelStyle: 'balanced',
  preferences: '',
};

const STYLES = [
  { id: 'budget', label: 'Budget', hint: 'Buses, trains, basic stays' },
  { id: 'balanced', label: 'Balanced', hint: 'Mix of comfort and value' },
  { id: 'comfort', label: 'Comfort', hint: 'Cabs and better hotels' },
];

export default function TripForm({ initial, onSubmit, busy }) {
  const [values, setValues] = useState(initial || DEFAULT_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);

  const set = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  const toggleInterest = (interest) =>
    setValues((v) => ({
      ...v,
      interests: v.interests.includes(interest) ? v.interests.filter((i) => i !== interest) : [...v.interests, interest],
    }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (busy) return;
    const result = validateTripForm(values);
    setErrors(result.errors);
    setTouched(true);
    if (!result.isValid) {
      const firstKey = Object.keys(result.errors)[0];
      const el = document.getElementById(`field-${firstKey}`);
      if (el && typeof el.focus === 'function') el.focus();
      return;
    }
    onSubmit(result.values, values);
  };

  const reset = () => {
    setValues(DEFAULT_FORM);
    setErrors({});
    setTouched(false);
  };

  const err = (k) => (touched && errors[k] ? <span className="error-text" id={`err-${k}`} role="alert">{errors[k]}</span> : null);

  return (
    <form className="card card-pad" onSubmit={handleSubmit} noValidate aria-busy={busy}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="field-startingCity">Starting city</label>
          <input id="field-startingCity" className="input" type="text" placeholder="Bengaluru" value={values.startingCity} onChange={(e) => set('startingCity', e.target.value)} aria-invalid={Boolean(touched && errors.startingCity)} aria-describedby={errors.startingCity ? 'err-startingCity' : undefined} autoComplete="address-level2" maxLength={60} />
          {err('startingCity')}
        </div>

        <div className="field">
          <label htmlFor="field-travellers">Number of travellers</label>
          <select id="field-travellers" className="select" value={values.travellers} onChange={(e) => set('travellers', e.target.value)} aria-invalid={Boolean(touched && errors.travellers)}>
            {Array.from({ length: MAX_TRAVELLERS }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          {err('travellers')}
        </div>

        <div className="field">
          <label htmlFor="field-days">Trip duration (days)</label>
          <input id="field-days" className="input" type="number" inputMode="numeric" min={1} max={MAX_DAYS} step={1} value={values.days} onChange={(e) => set('days', e.target.value)} aria-invalid={Boolean(touched && errors.days)} />
          <span className="hint">1 to {MAX_DAYS} days</span>
          {err('days')}
        </div>

        <div className="field">
          <label htmlFor="field-budget">Total budget (INR)</label>
          <div className="input-prefix">
            <span aria-hidden="true">₹</span>
            <input id="field-budget" className="input" type="number" inputMode="numeric" min={1} step={100} placeholder="8000" value={values.budget} onChange={(e) => set('budget', e.target.value)} aria-invalid={Boolean(touched && errors.budget)} />
          </div>
          <span className="hint">For the whole group, whole trip</span>
          {err('budget')}
        </div>

        <div className="field full">
          <span className="label" id="style-label">Travel style</span>
          <div className="style-grid" role="radiogroup" aria-labelledby="style-label">
            {STYLES.map((s) => (
              <label key={s.id} className="style-option">
                <input type="radio" name="travelStyle" value={s.id} checked={values.travelStyle === s.id} onChange={() => set('travelStyle', s.id)} />
                <span className="box"><strong>{s.label}</strong><small>{s.hint}</small></span>
              </label>
            ))}
          </div>
          {err('travelStyle')}
        </div>

        <fieldset className="field full" style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className="label" style={{ marginBottom: '0.4rem' }}>Interests <span className="hint">(choose one or more)</span></legend>
          <div className="choice-grid" id="field-interests" tabIndex={-1}>
            {INTERESTS.map((i) => (
              <label key={i} className="choice">
                <input type="checkbox" checked={values.interests.includes(i)} onChange={() => toggleInterest(i)} />
                <span>{i}</span>
              </label>
            ))}
          </div>
          {err('interests')}
        </fieldset>

        <div className="field full">
          <label htmlFor="field-preferences">Additional preferences <span className="hint">(optional)</span></label>
          <textarea id="field-preferences" className="textarea" placeholder="e.g. vegetarian food, prefer trains, travelling with elderly parents" value={values.preferences} maxLength={MAX_PREFERENCES_LENGTH} onChange={(e) => set('preferences', e.target.value)} />
          <span className="char-count">{values.preferences.length}/{MAX_PREFERENCES_LENGTH}</span>
          {err('preferences')}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
        <button type="submit" className="btn btn-primary" disabled={busy} style={{ flex: 1 }}>
          <Sparkles size={18} aria-hidden="true" /> {busy ? 'Generating...' : 'Generate My Trip'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={reset} disabled={busy}>
          <RotateCcw size={16} aria-hidden="true" /> Reset
        </button>
      </div>
    </form>
  );
}
