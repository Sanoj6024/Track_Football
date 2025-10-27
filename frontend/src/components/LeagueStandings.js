import React, { useEffect, useState } from 'react';
import axios from 'axios';

function LeagueStandings({ competitionCode }) {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!competitionCode) return;
    setLoading(true);
    axios.get(`/api/football/standings/${competitionCode}`)
      .then(res => setStandings(res.data.standings?.[0]?.table || []))
      .catch(() => setStandings([]))
      .finally(() => setLoading(false));
  }, [competitionCode]);

  if (!competitionCode) return null;
  if (loading) return <div className="card standings-card card--green"><div className="card-body">Loading standings...</div></div>;
  if (!standings.length) return <div className="card standings-card card--green"><div className="card-body">No standings available.</div></div>;

  return (
    <div className="card">
      <h2>League Table</h2>
      <div className="standings-table">
        <table>
          <thead>
            <tr>
              <th>Position</th>
              <th>Team</th>
              <th>MP</th>
              <th>W</th>
              <th>D</th>
              <th>L</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {standings.map(team => (
              <tr key={team.team.id}>
                <td>{team.position}</td>
                <td>
                  <img src={team.team.crest} alt="" style={{width: '24px', marginRight: '8px'}} onError={(e)=>{e.target.style.display='none'}} />
                  {team.team.name}
                </td>
                <td>{team.playedGames}</td>
                <td>{team.won}</td>
                <td>{team.draw}</td>
                <td>{team.lost}</td>
                <td>{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeagueStandings;
