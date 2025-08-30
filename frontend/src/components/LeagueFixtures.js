import React, { useEffect, useState } from 'react';
import axios from 'axios';

function LeagueFixtures({ competitionCode, teamId }) {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!competitionCode) return;
    setLoading(true);

    const today = new Date().toISOString().slice(0, 10);
    let url = `/api/football/matches/${competitionCode}?dateFrom=${today}&dateTo=${today}`;
    if (teamId) url += `&team=${teamId}`;

    axios.get(url)
      .then(res => setFixtures(res.data.matches || []))
      .catch(() => setFixtures([]))
      .finally(() => setLoading(false));
  }, [competitionCode, teamId]);

  if (loading) return <div>Loading fixtures...</div>;
  if (!fixtures.length) return <div>No matches for today.</div>;

  return (
    <div className="fixtures-list">
      <h3>Today's Fixtures</h3>
      <ul>
        {fixtures.map(match => {
          // Convert UTC to UK time zone
          const ukTime = new Date(match.utcDate).toLocaleString('en-GB', {
            timeZone: 'Europe/London',
            hour: '2-digit', minute: '2-digit'
          });
          return (
            <li key={match.id}>
              {match.homeTeam.name} vs {match.awayTeam.name}<br />
              <span style={{color: '#8fd953'}}>{ukTime} UK time</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default LeagueFixtures;
