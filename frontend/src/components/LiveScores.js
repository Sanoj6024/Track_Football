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
  if (loading) return <div>Loading live scores...</div>;
  if (!scores.length) return <div>No live matches.</div>;

  return (
    <div className="live-scores">
      <h3>Live Scores</h3>
      <ul>
        {scores.map(match => (
          <li key={match.id}>
            {match.homeTeam.name} {match.score.fullTime.home ?? '-'} - {match.score.fullTime.away ?? '-'} {match.awayTeam.name}
            <span style={{marginLeft:`8px`, color: '#ff5555'}}>{match.status === 'LIVE' ? 'LIVE' : 'Finished'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LiveScores;
