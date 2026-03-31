import { Routes, Route, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <div>
      {/* Navigation */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem', height: '5rem', margin: '0 auto', maxWidth: '1280px' }}>
        <Link to="/" style={{ fontFamily: 'var(--font-headline)', fontStyle: 'italic', fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--color-on-background)', textDecoration: 'none' }}>
          NeuroLearn
        </Link>
        <div style={{ display: 'flex', gap: '2rem', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.875rem' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--color-primary)', borderBottom: '4px solid var(--color-primary)', paddingBottom: '0.25rem' }}>Home</Link>
          <Link to="/dashboard" style={{ textDecoration: 'none', color: 'var(--color-on-surface-variant)' }}>Dashboard</Link>
          <Link to="#" style={{ textDecoration: 'none', color: 'var(--color-on-surface-variant)' }}>Mood</Link>
          <Link to="#" style={{ textDecoration: 'none', color: 'var(--color-on-surface-variant)' }}>Activities</Link>
          <Link to="#" style={{ textDecoration: 'none', color: 'var(--color-on-surface-variant)' }}>Communicate</Link>
          <Link to="#" style={{ textDecoration: 'none', color: 'var(--color-on-surface-variant)' }}>Parent</Link>
        </div>
        <div>
          <button className="material-symbols-outlined" style={{ color: 'var(--color-on-surface-variant)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>account_circle</button>
        </div>
      </nav>

      <main style={{ paddingTop: '5rem' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  )
}
