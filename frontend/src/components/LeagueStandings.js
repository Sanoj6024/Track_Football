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
  if (loading) return <div>Loading standings...</div>;
  if (!standings.length) return <div>No standings available.</div>;

  return (
    <div className="standings-table">
      <h3>League Table</h3>
      <table>
        <thead>
          <tr>
            <th>Pos</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map(team => (
            <tr key={team.team.id}>
              <td>{team.position}</td>
              <td>
                <img src={team.team.crest} alt="" style={{width:20, marginRight:6}} />
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
  );
}

export default LeagueStandings;
