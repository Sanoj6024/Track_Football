import React, { useState } from 'react';
import axios from 'axios';

function TeamSearch({ setSelectedTeam }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchTeams = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      const res = await axios.get(`/api/football/teamsearch?name=${query}`);
      setResults(res.data.teams || res.data.response || []);
      console.log('Search results:', res.data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search team"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button onClick={searchTeams}>Search</button>

      {loading && <p>Searching...</p>}

      {results.length > 0 ? (
        <ul>
          {results.map(team => (
            <li key={team.id}>
              <button onClick={() => setSelectedTeam(team)}>
                <img 
                  src={team.crest || team.logo} 
                  alt={team.name} 
                  width={20} 
                  style={{marginRight: '8px'}}
                />
                {team.name}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No teams found.</p>
      )}
    </div>
  );
}

export default TeamSearch;
