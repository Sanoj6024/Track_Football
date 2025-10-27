import React, { useEffect, useState } from 'react';
import axios from 'axios';

function LiveScores({ competitionCode }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!competitionCode) return;
    setLoading(true);
    axios.get(`/api/football/livescores/${competitionCode}`)
      .then(res => setScores(res.data.matches || []))
      .catch(() => setScores([]))
      .finally(() => setLoading(false));
  }, [competitionCode]);

  if (!competitionCode) return null;

  return (
    <div className="card livecard card--red">
      <div className="card-header">Live Scores</div>
      <div className="card-body">
        {loading && <div className="muted">Loading live scores…</div>}
        {!loading && scores.length === 0 && <div className="muted">No live matches.</div>}

        <div className="live-scores-list">
          {scores.map(match => (
            <div key={match.id} className="match-card">
              <div className="match-left">
                <div className="team">{match.homeTeam.name}</div>
                <div className="score">{match.score?.fullTime?.home ?? '-' } - {match.score?.fullTime?.away ?? '-'}</div>
                <div className="team">{match.awayTeam.name}</div>
              </div>
              <div className="match-right">
                {match.status === 'LIVE' ? <span className="badge-live">LIVE</span> : <span className="muted">Finished</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LiveScores;
