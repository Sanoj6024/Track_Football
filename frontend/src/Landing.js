import React from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  return (
    <div style={styles.bg}>
      <div style={styles.topLeft}>
        <span style={styles.trophyIcon}>⚽</span>
        <span style={styles.logoText}>Football Scores</span>
      </div>
      <main style={styles.main}>
        <h1 style={styles.headline}>
          <span style={styles.greenText}>Live</span> Football Scores
        </h1>
        <p style={styles.subText}>
          Stay updated with real-time scores, standings, and match highlights from leagues around the world.
        </p>
        <div style={styles.buttonGroup}>
          <button
            style={styles.button}
            className="hover-effect"
            onClick={() => navigate('/signup')}
          >
            <span style={styles.buttonIcon}>➕</span> Get Started
          </button>
          <button
            style={styles.button}
            className="hover-effect"
            onClick={() => navigate('/login')}
          >
            <span style={styles.buttonIcon}>➡️</span> Login
          </button>
        </div>
      </main>
    </div>
  );
}

const styles = {
  bg: {
    width: '100vw',
    minHeight: '100vh',
    margin: 0,
    padding: 0,
    background: '#000000',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: 'Inter, Segoe UI, sans-serif',
    color: '#ffffff'
  },
  topLeft: {
    position: 'absolute',
    top: '1.5rem',
    left: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.7rem',
    zIndex: 2
  },
  trophyIcon: {
    color: '#00ff88',
    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
    filter: 'drop-shadow(0 0 8px #00ff88cc)',
    animation: 'pulse 2.5s infinite cubic-bezier(.4,0,.2,1)'
  },
  logoText: {
    color: '#00ff88',
    fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
    fontWeight: 'bold',
    letterSpacing: '1px'
  },
  main: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'clamp(1rem, 5vw, 2rem)',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  headline: {
    fontSize: 'clamp(2rem, 7vw, 3.5rem)',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 'clamp(0.5rem, 2vw, 1rem)',
    letterSpacing: '0.5px',
    lineHeight: '1.2'
  },
  greenText: {
    color: '#00ff88',
    textShadow: '0 0 8px #00ff8855'
  },
  subText: {
    color: '#b1b3b9',
    textAlign: 'center',
    fontSize: 'clamp(1rem, 3vw, 1.2rem)',
    margin: 'clamp(0.5rem, 3vw, 1rem) 0 clamp(2rem, 5vw, 3rem) 0',
    maxWidth: '600px',
    padding: '0 1rem'
  },
  buttonGroup: {
    display: 'flex',
    gap: 'clamp(1rem, 3vw, 2rem)',
    marginTop: 'clamp(0.5rem, 2vw, 1rem)',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  button: {
    padding: 'clamp(0.6em, 2vw, 0.85em) clamp(1.5em, 3vw, 2.2em)',
    fontSize: 'clamp(1rem, 2.5vw, 1.14rem)',
    fontWeight: 'bold',
    borderRadius: '8px',
    border: '2px solid #00ff88',
    background: 'transparent',
    color: '#fff',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    minWidth: 'clamp(140px, 30vw, 200px)',
    justifyContent: 'center'
  }
};

const additionalStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    background: #000000;
  }

  .hover-effect {
    position: relative;
    overflow: hidden;
  }

  .hover-effect:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      120deg,
      transparent,
      rgba(0, 255, 136, 0.2),
      transparent
    );
    transition: all 0.6s;
  }

  .hover-effect:hover:before {
    left: 100%;
  }

  .hover-effect:hover {
    background: #00ff88;
    color: #000000;
    box-shadow: 0 0 20px rgba(0, 255, 136, 0.4);
    transform: translateY(-2px);
  }

  @media (max-width: 480px) {
    .hover-effect {
      width: 100%;
      max-width: 300px;
    }
    
    .hover-effect:active {
      background: #00ff88;
      color: #000000;
      transform: scale(0.98);
    }
  }

  @media (max-height: 600px) {
    .main {
      padding-top: 4rem;
    }
  }

  @media (max-width: 360px) {
    .topLeft {
      position: relative;
      top: 1rem;
      left: 0;
      justify-content: center;
      width: 100%;
    }
  }
`;

// Inject styles into document head
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = additionalStyles;
  document.head.appendChild(style);
}

export default Landing;
