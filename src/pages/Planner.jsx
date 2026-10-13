import { useEffect, useState } from 'react';
import { Route, Bot, Database } from 'lucide-react';
import TripForm, { DEFAULT_FORM } from '../components/TripForm.jsx';
import ItineraryView from '../components/ItineraryView.jsx';
import Notice from '../components/Notice.jsx';
import { generateDemoItinerary } from '../utils/itineraryGenerator.js';
import { getAiStatus, generateAiItinerary } from '../services/aiService.js';

export default function Planner({ trip, setTrip, onSave, isSaved, onOpenDestination, prefillForm }) {
  const [status, setStatus] = useState('idle'); // idle | loading | error | success
  const [error, setError] = useState(null);
  const [lastInput, setLastInput] = useState(null); // validated values
  const [formValues, setFormValues] = useState(prefillForm || DEFAULT_FORM); // raw values to preserve
  const [formKey, setFormKey] = useState(0);
  const [ai, setAi] = useState({ checked: false, configured: false, model: null });
  const [useAi, setUseAi] = useState(true);
  const [showForm, setShowForm] = useState(!trip);

  useEffect(() => {
    let alive = true;
    getAiStatus().then((s) => { if (alive) setAi({ checked: true, configured: s.configured, model: s.model }); });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (prefillForm) {
      setFormValues(prefillForm);
      setFormKey((k) => k + 1);
      setShowForm(true);
    }
  }, [prefillForm]);

  const aiActive = ai.configured && useAi;

  const run = async (values, mode) => {
    setStatus('loading');
    setError(null);
    try {
      let result;
      if (mode === 'ai') {
        result = await generateAiItinerary(values);
      } else {
        // small delay so the loading state is visible and the UI feels deliberate
        await new Promise((r) => setTimeout(r, 500));
        result = generateDemoItinerary(values);
      }
      setTrip(result);
      setStatus('success');
      setShowForm(false);
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setStatus('error');
      setError({ message: err?.message || 'Something went wrong while generating your trip.', mode });
    }
  };

  const handleSubmit = (values, raw) => {
    setLastInput(values);
    setFormValues(raw);
    run(values, aiActive ? 'ai' : 'demo');
  };

  return (
    <section className="section" style={{ paddingTop: '2rem' }}>
      <div className="container">
        <div className="section-head" style={{ marginBottom: '1.25rem' }}>
          <div className="eyebrow">Plan My Trip</div>
          <h2>Tell us about your journey</h2>
          <p>We will build a day-by-day Karnataka itinerary with a budget estimate and useful Kannada phrases.</p>
        </div>

        <div className="planner-layout">
          <div className="planner-form">
            <div className="engine-row">
              {ai.configured ? (
                <>
                  <span className={`engine-pill ${aiActive ? 'ai' : ''}`}>{aiActive ? <Bot size={14} aria-hidden="true" /> : <Database size={14} aria-hidden="true" />} {aiActive ? `AI mode (${ai.model || 'configured'})` : 'Demo mode'}</span>
                  <label className="switch"><input type="checkbox" checked={useAi} onChange={(e) => setUseAi(e.target.checked)} /> Use AI generation</label>
                </>
              ) : (
                <span className="engine-pill" title="No AI API key is configured, so the deterministic demo generator is used."><Database size={14} aria-hidden="true" /> Demo mode · no AI key configured</span>
              )}
            </div>
            {!showForm && trip ? (
              <div className="card card-pad">
                <h3>Current plan</h3>
                <p className="small muted">Edit your inputs to generate a different itinerary.</p>
                <button className="btn btn-outline btn-block" onClick={() => setShowForm(true)}>Edit trip details</button>
              </div>
            ) : (
              <TripForm key={formKey} initial={formValues} onSubmit={handleSubmit} busy={status === 'loading'} />
            )}
          </div>

          <div>
            {status === 'loading' ? (
              <div className="card loading" aria-live="polite">
                <div className="spinner" aria-hidden="true" />
                <h3>Building your itinerary…</h3>
                <div className="loading-steps">
                  <span>• Matching destinations to your interests</span>
                  <span>• Grouping places into a sensible route</span>
                  <span>• Estimating your budget</span>
                  {aiActive ? <span>• Waiting for the AI service</span> : null}
                </div>
              </div>
            ) : null}

            {status === 'error' && error ? (
              <Notice
                kind="error"
                actions={
                  <>
                    <button className="btn btn-primary btn-sm" onClick={() => lastInput && run(lastInput, error.mode)}>Retry</button>
                    {error.mode === 'ai' ? <button className="btn btn-outline btn-sm" onClick={() => lastInput && run(lastInput, 'demo')}>Use demo mode instead</button> : null}
                  </>
                }
              >
                <strong>{error.mode === 'ai' ? 'AI generation failed.' : 'Generation failed.'}</strong> {error.message} Your form values have been kept.
              </Notice>
            ) : null}

            {status !== 'loading' && trip ? (
              <ItineraryView trip={trip} onSave={onSave} isSaved={isSaved(trip.id)} onPlanAnother={() => { setShowForm(true); if (typeof window !== 'undefined' && window.innerWidth < 1000) window.scrollTo({ top: 0, behavior: 'smooth' }); }} onOpenDestination={onOpenDestination} />
            ) : null}

            {status === 'idle' && !trip ? (
              <div className="empty-state">
                <div className="icon-tile"><Route size={22} aria-hidden="true" /></div>
                <h3>Your itinerary will appear here</h3>
                <p className="muted">Fill in the form and press <strong>Generate My Trip</strong>. Try: Bengaluru, 3 days, ₹8,000, 2 travellers, nature and heritage.</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
