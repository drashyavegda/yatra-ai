import { useCallback, useEffect, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import DestinationModal from './components/DestinationModal.jsx';
import Home from './pages/Home.jsx';
import Planner from './pages/Planner.jsx';
import Explore from './pages/Explore.jsx';
import KannadaGuide from './pages/KannadaGuide.jsx';
import SavedTrips from './pages/SavedTrips.jsx';
import { getDestinationById } from './data/destinations.js';
import { loadTrips, saveTrip, deleteTrip, clearTrips, isStorageAvailable } from './utils/storage.js';
import { DEFAULT_FORM } from './components/TripForm.jsx';

const ROUTES = ['home', 'plan', 'explore', 'guide', 'saved'];

function routeFromHash() {
  if (typeof window === 'undefined') return 'home';
  const h = window.location.hash.replace(/^#\/?/, '');
  return ROUTES.includes(h) ? h : 'home';
}

export default function App() {
  const [route, setRoute] = useState(routeFromHash);
  const [trip, setTrip] = useState(null);
  const [savedTrips, setSavedTrips] = useState(() => loadTrips());
  const [storageOk] = useState(() => isStorageAvailable());
  const [modalDest, setModalDest] = useState(null);
  const [prefillForm, setPrefillForm] = useState(null);

  useEffect(() => {
    const onHash = () => setRoute(routeFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = useCallback((id) => {
    const target = ROUTES.includes(id) ? id : 'home';
    if (window.location.hash !== `#/${target}`) window.location.hash = `#/${target}`;
    setRoute(target);
    window.scrollTo({ top: 0 });
  }, []);

  const openDestination = useCallback((id) => setModalDest(getDestinationById(id)), []);
  const closeModal = useCallback(() => setModalDest(null), []);

  const handleSave = (t) => {
    const res = saveTrip(t);
    setSavedTrips(res.trips);
    return res;
  };
  const handleDelete = (id) => {
    const res = deleteTrip(id);
    setSavedTrips(res.trips);
  };
  const handleClearAll = () => {
    if (window.confirm('Delete all saved trips from this browser? This cannot be undone.')) {
      const res = clearTrips();
      setSavedTrips(res.trips);
    }
  };
  const openSaved = (t) => {
    setTrip(t);
    navigate('plan');
  };
  const planFromDestination = (dest) => {
    setPrefillForm({ ...DEFAULT_FORM, interests: dest.interests.slice(0, 3), startingCity: 'Bengaluru' });
    setTrip(null);
    setModalDest(null);
    navigate('plan');
  };

  const isSaved = (id) => savedTrips.some((t) => t.id === id);

  return (
    <>
      <a href="#main" className="visually-hidden">Skip to content</a>
      <Navbar route={route} navigate={navigate} savedCount={savedTrips.length} />
      <main id="main">
        {route === 'home' && <Home navigate={navigate} onOpenDestination={openDestination} />}
        {route === 'plan' && <Planner trip={trip} setTrip={setTrip} onSave={handleSave} isSaved={isSaved} onOpenDestination={openDestination} prefillForm={prefillForm} />}
        {route === 'explore' && <Explore onOpenDestination={openDestination} />}
        {route === 'guide' && <KannadaGuide />}
        {route === 'saved' && <SavedTrips trips={savedTrips} storageOk={storageOk} onOpen={openSaved} onDelete={handleDelete} onClearAll={handleClearAll} navigate={navigate} />}
      </main>
      <Footer navigate={navigate} />
      <DestinationModal destination={modalDest} onClose={closeModal} onPlanHere={planFromDestination} />
    </>
  );
}
