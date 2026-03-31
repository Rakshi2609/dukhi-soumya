import React from 'react';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-left">
            <div className="badge">
              ✨ Learning Made Fun
            </div>
            <h1 className="hero-title">
              Welcome to <span className="hero-title-italic">NeuroLearn</span>
            </h1>
            <p className="hero-subtitle">
              A sensory-friendly workspace designed to help every brain thrive. Discover activities tailored to your mood and unique learning style.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary">Start Exploring</button>
              <button className="btn btn-outline">View Activities</button>
            </div>
            <div className="feature-badges">
              <div className="feature-badge surface-high">
                <span className="material-symbols-outlined icon-primary">auto_awesome</span>
                <span>12 New Tasks</span>
              </div>
              <div className="feature-badge secondary-container">
                <span className="material-symbols-outlined icon-secondary">favorite</span>
                <span>Daily Mood Set</span>
              </div>
              <div className="feature-badge tertiary-container">
                <span className="material-symbols-outlined icon-tertiary">stars</span>
                <span>Pro Plan</span>
              </div>
            </div>
          </div>
          <div className="hero-right">
             <div className="visual-cluster">
                {/* Visual elements translated to CSS instead of Tailwind inline */}
                <div className="blob-1"></div>
                <div className="blob-2"></div>
                
                <div className="floating-card card-happy">
                  <span className="emoji">😊</span>
                  <div>
                    <p className="card-title">Happy Today!</p>
                    <p className="card-subtitle">Feeling great</p>
                  </div>
                </div>

                <div className="floating-card card-score">
                  <p className="score">90%</p>
                  <p className="score-label">Focus Score</p>
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                </div>

                <div className="center-image">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHFagU-b8CQF1QpUzP_ww2VPaG2gbktp4Jv0ufKqMntYKwoovMylqsjqjl-DcqB8bNc7UNCgFZB4QTdeQAkWoF30tZENirDHMpVa13ykhI_sW1RVfNTtbRdR8-Kuy3VxJhc7z4VkcBQYcZKzGTC7iXbffttFmxvxGv3BSISBXiuthrY6AO5_5z4TDXCceb6EkuBIemR8zZXTbnihmwZiCrbJM2Jt_je8cZMz0uFExQwOh5wFQw_Y3i21i2O3LTP3og0uydr9pLx7Y" alt="Happy diverse children smiling and learning" />
                </div>
             </div>
          </div>
        </div>
        
        {/* Wavy Divider */}
        <div className="wavy-divider">
          <svg preserveAspectRatio="none" viewBox="0 0 1200 120">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.43,181.69,113.85,321.39,56.44Z" fill="var(--color-surface-container-low)"></path>
          </svg>
        </div>
      </section>

      {/* Path Selection */}
      <section className="paths-section">
        <div className="paths-header">
           <h2>Choose Your Path</h2>
           <p>Select a module to begin your learning journey today. Each section is designed with sensory comfort in mind.</p>
        </div>
        <div className="paths-grid">
           {/* Cards would go here */}
           <div className="path-card">
              <div className="icon-wrapper secondary">
                 <span className="material-symbols-outlined">mood</span>
              </div>
              <h3>Mood Check</h3>
              <p>Tell us how you're feeling to get customized activity picks.</p>
              <a href="#" className="explore-link">Explore <span className="material-symbols-outlined">arrow_forward</span></a>
           </div>
           
           <div className="path-card">
              <div className="icon-wrapper primary">
                 <span className="material-symbols-outlined">dashboard</span>
              </div>
              <h3>Dashboard</h3>
              <p>Track your stars, levels, and upcoming activities all in one place.</p>
              <a href="#" className="explore-link">Explore <span className="material-symbols-outlined">arrow_forward</span></a>
           </div>

           <div className="path-card">
              <div className="icon-wrapper tertiary">
                 <span className="material-symbols-outlined">extension</span>
              </div>
              <h3>Activities</h3>
              <p>Play games and complete tasks built for fun and learning.</p>
              <a href="#" className="explore-link">Explore <span className="material-symbols-outlined">arrow_forward</span></a>
           </div>
           
           <div className="path-card">
              <div className="icon-wrapper orange">
                 <span className="material-symbols-outlined">forum</span>
              </div>
              <h3>Communicate</h3>
              <p>Connect with parents or educators through visual messages.</p>
              <a href="#" className="explore-link">Explore <span className="material-symbols-outlined">arrow_forward</span></a>
           </div>
        </div>
      </section>
      
      <footer className="footer">
         <div className="footer-content">
            <div className="footer-logo">NeuroLearn</div>
            <div className="footer-links">
               <a href="#">Privacy</a>
               <a href="#">Terms</a>
               <a href="#">Safety Guide</a>
            </div>
            <p className="footer-copyright">© 2026 NeuroLearn. All rights reserved.</p>
         </div>
      </footer>
    </>
  );
}
