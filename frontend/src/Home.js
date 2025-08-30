import React, { useState } from 'react';
import LeagueStandings from './components/LeagueStandings';
import LeagueFixtures from './components/LeagueFixtures';
import LiveScores from './components/LiveScores';
import TeamSearch from './components/TeamSearch';

import './Home.css';

const LEAGUE_OPTIONS = [
  { code: 'PL', name: 'Premier League' },
  { code: 'BL1', name: 'Bundesliga' },
  { code: 'PD', name: 'La Liga' },
  { code: 'SA', name: 'Serie A' },
  { code: 'FL1', name: 'Ligue 1' },
  { code: 'UCL', name: 'Champions League' }
];

function Home({ user }) {
  const [competitionCode, setCompetitionCode] = useState('PL');
  
  const [selectedTeam, setSelectedTeam] = useState(null);

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

        <section className="competition-selector">
          <label>
            Choose League:&nbsp;
            <select value={competitionCode} onChange={e => setCompetitionCode(e.target.value)}>
              {LEAGUE_OPTIONS.map(l => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
          </label>
        </section>

        

        <section className="standings-section">
          <LeagueStandings competitionCode={competitionCode} />
        </section>

        <section className="fixtures-section">
          <LeagueFixtures competitionCode={competitionCode} />
        </section>

        <section className="livescores-section">
          <LiveScores competitionCode={competitionCode} />
        </section>

        <section className="team-search-section">
          <TeamSearch setSelectedTeam={setSelectedTeam} />
          {selectedTeam && (
            <LeagueFixtures competitionCode={competitionCode} teamId={selectedTeam.id} />
          )}
        </section>
      </main>
    </div>
  );
}

export default Home;
