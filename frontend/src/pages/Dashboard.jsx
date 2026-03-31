import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const MOOD_ICONS = {
  Happy: 'sentiment_very_satisfied',
  Sad: 'sentiment_dissatisfied',
  Angry: 'mood_bad',
  Anxious: 'psychology_alt',
  Neutral: 'sentiment_neutral',
};

const GAME_META = {
  'bubble_pop': { icon: 'bubble_chart', label: 'Bubble Pop', color: '#6C63FF' },
  'sound_match': { icon: 'music_note', label: 'Sound Match', color: '#00C9A7' },
  'color_sorting': { icon: 'palette', label: 'Color Sorting', color: '#FF6B6B' },
  'feeling_journal': { icon: 'auto_stories', label: 'Feeling Journal', color: '#FFD93D' },
};

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

function getDayLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

// Simple canvas-based mini bar chart
function MiniChart({ data, labels, color, height = 120 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const max = Math.max(...data, 1);
    const barWidth = (W - 40) / data.length;
    const gap = 6;

    // Draw bars
    data.forEach((val, i) => {
      const barH = (val / max) * (H - 36);
      const x = 20 + i * barWidth + gap / 2;
      const y = H - 28 - barH;

      // Gradient bar
      const grad = ctx.createLinearGradient(x, y, x, y + barH);
      grad.addColorStop(0, color);
      grad.addColorStop(1, color + '44');
      ctx.fillStyle = grad;

      const radius = 4;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + barWidth - gap - radius, y);
      ctx.quadraticCurveTo(x + barWidth - gap, y, x + barWidth - gap, y + radius);
      ctx.lineTo(x + barWidth - gap, y + barH);
      ctx.lineTo(x, y + barH);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.fill();

      // Label
      ctx.fillStyle = '#888';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(labels[i], x + (barWidth - gap) / 2, H - 10);

      // Value on top
      if (val > 0) {
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillText(val, x + (barWidth - gap) / 2, y - 6);
      }
    });
  }, [data, labels, color]);

  return <canvas ref={canvasRef} width={320} height={height} className="mini-chart-canvas" />;
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [gameScores, setGameScores] = useState([]);
  const [moodHistory, setMoodHistory] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username') || '';
      try {
        // Fetch user
        const userRes = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (userRes.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
        const userData = await userRes.json();
        if (userData.status === 'success') setUser(userData.user);

        // Fetch game scores (filtered by username if available)
        try {
          const scoresUrl = username
            ? `${API_BASE}/game/scores?username=${encodeURIComponent(username)}`
            : `${API_BASE}/game/scores`;
          const scoresRes = await fetch(scoresUrl, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const scoresData = await scoresRes.json();
          if (scoresData.scores) setGameScores(scoresData.scores);
        } catch (e) { console.warn('Could not fetch game scores:', e); }

        // Fetch moods — backend endpoint is /mood/history, returns { history: [...] }
        try {
          const moodRes = await fetch(`${API_BASE}/mood/history`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const moodData = await moodRes.json();
          if (moodData.history) setMoodHistory(moodData.history);
        } catch (e) { console.warn('Could not fetch mood history:', e); }

        // Fetch activities
        try {
          const actRes = await fetch(`${API_BASE}/activity/activities`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const actData = await actRes.json();
          if (actData.activities) setActivities(actData.activities);
        } catch (e) { console.warn('Could not fetch activities:', e); }

      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ---- Derived Stats ----
  const last7 = getLast7Days();
  const dayLabels = last7.map(getDayLabel);

  // Games played per day (last 7 days)
  const gamesPerDay = last7.map(day =>
    gameScores.filter(s => s.timestamp?.startsWith(day)).length
  );

  // Total scores per game type
  const gameBreakdown = Object.entries(GAME_META).map(([key, meta]) => {
    const scores = gameScores.filter(s => s.game === key);
    const total = scores.reduce((sum, s) => sum + (s.score || 0), 0);
    const best = scores.length > 0 ? Math.max(...scores.map(s => s.score || 0)) : 0;
    return { ...meta, key, played: scores.length, total, best };
  });

  // Mood frequency last 7 days
  const recentMoods = moodHistory.filter(m => {
    const ts = m.timestamp || '';
    return last7.some(d => ts.startsWith(d));
  });
  const moodCounts = {};
  recentMoods.forEach(m => {
    const e = m.primary_emotion || m.emotion || 'Neutral';
    moodCounts[e] = (moodCounts[e] || 0) + 1;
  });
  const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Neutral';

  // Quick action cards – using Material Symbols instead of emojis
  const quickActions = [
    { icon: 'bubble_chart', label: 'Bubble Pop', to: '/games/bubble-pop', color: '#6C63FF' },
    { icon: 'music_note', label: 'Sound Match', to: '/games/sound-match', color: '#00C9A7' },
    { icon: 'palette', label: 'Color Sorting', to: '/games/color-sorting', color: '#FF6B6B' },
    { icon: 'auto_stories', label: 'Journal', to: '/games/feeling-journal', color: '#FFD93D' },
  ];

  if (loading) {
    return (
      <div className="dash-loading">
        <div className="dash-loading-spinner" />
        <p>Loading your journey...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* ===== HERO HEADER ===== */}
      <header className="dash-hero">
        <div className="dash-hero-text">
          <span className="dash-greeting">Good {getGreeting()}</span>
          <h1>
            Welcome back,{' '}
            <span className="dash-name">{user?.name || 'Explorer'}</span>
          </h1>
          <p className="dash-subtitle">
            Here's your progress summary for the last 7 days
          </p>
        </div>
        <div className="dash-hero-mood">
          <span className="material-symbols-outlined dash-mood-icon">{MOOD_ICONS[dominantMood] || 'sentiment_neutral'}</span>
          <span className="dash-mood-label">Feeling {dominantMood}</span>
        </div>
      </header>

      {/* ===== STATS ROW ===== */}
      <section className="dash-stats-row">
        <StatCard
          icon="stadia_controller"
          number={gameScores.length}
          label="Games Played"
          accent="#6C63FF"
        />
        <StatCard
          icon="emoji_events"
          number={gameBreakdown.reduce((s, g) => s + g.best, 0)}
          label="Best Score Sum"
          accent="#00C9A7"
        />
        <StatCard
          icon="monitoring"
          number={`${user?.progress?.focus_score || 0}%`}
          label="Focus Score"
          accent="#FF6B6B"
        />
        <StatCard
          icon="psychology"
          number={moodHistory.length}
          label="Mood Checks"
          accent="#FFD93D"
        />
      </section>

      {/* ===== MAIN GRID ===== */}
      <div className="dash-grid">
        {/* --- 7-Day Activity Chart --- */}
        <div className="dash-card dash-card-wide">
          <div className="dash-card-header">
            <h2><span className="material-symbols-outlined card-title-icon">trending_up</span> 7-Day Activity</h2>
            <span className="dash-card-badge">Last Week</span>
          </div>
          <MiniChart data={gamesPerDay} labels={dayLabels} color="#6C63FF" height={140} />
          {gameScores.length === 0 && (
            <p className="dash-empty-hint">
              No games played yet — <Link to="/activities">start an activity!</Link>
            </p>
          )}
        </div>

        {/* --- Game Score Breakdown --- */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h2><span className="material-symbols-outlined card-title-icon">military_tech</span> Game Scores</h2>
          </div>
          <div className="game-score-list">
            {gameBreakdown.map(g => (
              <div className="game-score-row" key={g.key}>
                <span className="game-score-icon" style={{ background: g.color + '22', color: g.color }}>
                  <span className="material-symbols-outlined">{g.icon}</span>
                </span>
                <div className="game-score-info">
                  <strong>{g.label}</strong>
                  <span className="game-score-sub">
                    Played {g.played}x · Best: {g.best}
                  </span>
                </div>
                <span className="game-score-total" style={{ color: g.color }}>
                  {g.total}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* --- Mood Summary --- */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h2><span className="material-symbols-outlined card-title-icon">psychology</span> Mood Summary</h2>
            <Link to="/mood" className="dash-card-link">Check In →</Link>
          </div>
          {Object.keys(moodCounts).length > 0 ? (
            <div className="mood-pills">
              {Object.entries(moodCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([mood, count]) => (
                  <div className="mood-pill" key={mood}>
                    <span className="material-symbols-outlined mood-pill-icon">{MOOD_ICONS[mood] || 'sentiment_neutral'}</span>
                    <span className="mood-pill-label">{mood}</span>
                    <span className="mood-pill-count">{count}x</span>
                  </div>
                ))
              }
            </div>
          ) : (
            <div className="dash-empty-state">
              <span className="material-symbols-outlined empty-state-icon">sentiment_neutral</span>
              <p>No mood data yet</p>
              <Link to="/mood" className="dash-empty-cta">Do a mood check →</Link>
            </div>
          )}
        </div>

        {/* --- Quick Actions --- */}
        <div className="dash-card dash-card-wide">
          <div className="dash-card-header">
            <h2><span className="material-symbols-outlined card-title-icon">bolt</span> Quick Actions</h2>
          </div>
          <div className="quick-actions-grid">
            {quickActions.map(a => (
              <Link to={a.to} className="quick-action-tile" key={a.label}
                style={{ '--qa-color': a.color }}>
                <span className="material-symbols-outlined qa-icon">{a.icon}</span>
                <span className="qa-label">{a.label}</span>
              </Link>
            ))}
            <Link to="/mood" className="quick-action-tile" style={{ '--qa-color': '#845EC2' }}>
              <span className="material-symbols-outlined qa-icon">photo_camera</span>
              <span className="qa-label">Mood Check</span>
            </Link>
            <Link to="/communicate" className="quick-action-tile" style={{ '--qa-color': '#FF9671' }}>
              <span className="material-symbols-outlined qa-icon">chat</span>
              <span className="qa-label">Communicate</span>
            </Link>
          </div>
        </div>

        {/* --- Recent Activity Feed --- */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h2><span className="material-symbols-outlined card-title-icon">history</span> Recent Activity</h2>
          </div>
          {gameScores.length > 0 ? (
            <div className="recent-feed">
              {gameScores.slice(-5).reverse().map((s, i) => {
                const meta = GAME_META[s.game] || { icon: 'stadia_controller', label: s.game, color: '#999' };
                return (
                  <div className="feed-item" key={i}>
                    <span className="feed-icon" style={{ background: meta.color + '22' }}>
                      <span className="material-symbols-outlined" style={{ color: meta.color }}>{meta.icon}</span>
                    </span>
                    <div className="feed-info">
                      <strong>{meta.label}</strong>
                      <span className="feed-time">{formatTimestamp(s.timestamp)}</span>
                    </div>
                    <span className="feed-score" style={{ color: meta.color }}>+{s.score}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="dash-empty-state">
              <span className="material-symbols-outlined empty-state-icon">stadia_controller</span>
              <p>Play games to see your activity feed</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, number, label, accent }) {
  return (
    <div className="dash-stat-card" style={{ '--stat-accent': accent }}>
      <span className="material-symbols-outlined dash-stat-icon">{icon}</span>
      <span className="dash-stat-number">{number}</span>
      <span className="dash-stat-label">{label}</span>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}

function formatTimestamp(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
