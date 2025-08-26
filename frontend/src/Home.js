import React from 'react';
import './Home.css';

function Home({ user }) {
  return (
    <div className="home-container">
      <header className="home-header">
        <div className="logo-section">
          <span className="logo-icon">⚽</span>
          <h1>Football Scores</h1>
        </div>
        <div className="user-section">
          <span className="user-icon">👤</span>
          <span className="username">{user.username}</span>
        </div>
      </header>
      <main className="main-content">
        <div className="welcome-section">
          <h2>Welcome back, <span className="highlight">{user.username}</span>!</h2>
          <p>Stay updated with live scores and matches</p>
        </div>
        {/* Content sections will go here */}
      </main>
    </div>
  );
}

export default Home;
