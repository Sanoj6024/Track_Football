import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Read API key from build-time env or localStorage (optional)
const FRONTEND_API_KEY = process.env.REACT_APP_FOOTBALL_API_KEY || (typeof window !== 'undefined' && localStorage.getItem('FOOTBALL_API_KEY')) || '';

function TeamSearch({ setSelectedTeam }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const searchTeams = async () => {
    const clean = query.trim();
    setSearched(true);
    if (!clean) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Build headers for API-Sports v3
      const headers = {
        'Accept': 'application/json',
        'x-rapidapi-host': 'v3.football.api-sports.io'
      };
      if (FRONTEND_API_KEY) {
        headers['x-rapidapi-key'] = FRONTEND_API_KEY;
      }

      const res = await axios.get(`/api/football/teamsearch?name=${encodeURIComponent(clean)}`, { headers });

      // Normalize different API shapes into a common list: { id, name, logo, venue, raw }
      const raw = res.data || {};
      let list = [];

      // API-SPORTS (v3) returns { response: [ { team: {...}, venue: {...} } ] }
      if (Array.isArray(raw.response)) {
        list = raw.response.map(item => ({
          id: item.team?.id ?? item.team?.team?.id ?? null,
          name: item.team?.name ?? item.team?.team?.name ?? '',
          logo: item.team?.logo ?? item.team?.crest ?? item.team?.team?.logo ?? item.team?.team?.crest ?? '',
          venue: item.venue || null,
          raw: item
        }));
      // football-data.org shape may return { teams: [...] }
      } else if (Array.isArray(raw.teams)) {
        list = raw.teams.map(t => ({
          id: t.id ?? (t.team && t.team.id) ?? null,
          name: t.name ?? (t.team && t.team.name) ?? '',
          logo: t.logo ?? t.crest ?? (t.team && (t.team.logo || t.team.crest)) ?? '',
          venue: null,
          raw: t
        }));
      // Some proxies return the response array directly
      } else if (Array.isArray(raw)) {
        list = raw.map(t => ({
          id: t.id ?? (t.team && t.team.id) ?? null,
          name: t.name ?? (t.team && t.team.name) ?? '',
          logo: t.logo ?? t.crest ?? (t.team && (t.team.logo || t.team.crest)) ?? '',
          venue: t.venue || null,
          raw: t
        }));
      } else {
        // fallback: try to find nested values
        const maybeTeam = raw.team || raw;
        if (maybeTeam && (maybeTeam.id || maybeTeam.name)) {
          list = [{
            id: maybeTeam.id ?? null,
            name: maybeTeam.name ?? '',
            logo: maybeTeam.logo ?? maybeTeam.crest ?? '',
            venue: raw.venue || null,
            raw
          }];
        }
      }

      setResults(list);
    } catch (err) {
      console.error('Team search error', err?.response || err);
      setResults([]);
      setError('Unable to search teams');
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => { if (e.key === 'Enter') searchTeams(); };

  return (
    <div className="card team-search-card card--purple">
      <div className="card-header">
        <h3>Team Search</h3>
      </div>
      <div className="card-body">
        <div className="input-row">
          <input
            className="input"
            type="text"
            placeholder="Search team"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <button className="btn" onClick={searchTeams} disabled={loading}>Search</button>
        </div>

        {loading && <div className="muted">Searching…</div>}
        {error && <div className="error">{error}</div>}

        {searched && !loading && results.length === 0 && (
          <div className="muted">No teams found.</div>
        )}

        {results.length > 0 && (
          <div className="grid team-results">
            {results.map(team => (
              <div key={team.id || team.name} className="team-card">
                <button 
                  className="team-btn" 
                  onClick={() => {
                    if (setSelectedTeam) setSelectedTeam(team);
                    setSelected(team);
                  }}
                >
                  {team.logo ? (
                    <img
                      className="team-logo"
                      src={team.logo}
                      alt={team.name}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : null}
                  <div className="team-label">
                    <div className="team-name">{team.name}</div>
                    {team.venue?.name && (
                      <div className="team-venue muted">{team.venue.name}</div>
                    )}
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}

        {selected && (
          <div style={{ maxWidth: 600, margin: '20px auto', background: 'var(--card-bg, #0f1724)', padding: 18, borderRadius: 10, color: 'var(--text, #fff)', fontFamily: 'sans-serif' }}>
            <h2 style={{ textAlign: 'center', color: '#d71920', marginBottom: 24, marginTop: 0 }}>
              {selected.name} - Team & Venue Overview
            </h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
              <div>
                <img 
                  src={selected.logo} 
                  alt="Team Logo" 
                  style={{ width: 80, height: 80, objectFit: 'contain', borderRadius: 8, border: '1px solid #eee', background: '#fff' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <div style={{ fontSize: 16 }}>
                <strong>Team:</strong> {selected.name}<br/>
                <strong>Country:</strong> {getTeamField(selected, 'country') || '—'}<br/>
                <strong>Founded:</strong> {getTeamField(selected, 'founded') || '—'}<br/>
                <strong>Code:</strong> {getTeamField(selected, 'code') || '—'}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
              <div>
                <img 
                  src={getVenueField(selected, 'image')} 
                  alt="Venue Image" 
                  style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee', background: '#fff' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <div style={{ fontSize: 16 }}>
                <strong>Venue:</strong> {getVenueField(selected, 'name') || '—'}<br/>
                <strong>City:</strong> {getVenueField(selected, 'city') || '—'}<br/>
                <strong>Capacity:</strong> {getVenueField(selected, 'capacity') || '—'}<br/>
                <strong>Surface:</strong> {getVenueField(selected, 'surface') || '—'}
              </div>
            </div>

            <hr style={{ margin: '24px 0' }}/>
            <h3 style={{ marginBottom: 12 }}>Key Stats</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: 8, border: '1px solid #ddd' }}>Founded</th>
                  <th style={{ padding: 8, border: '1px solid #ddd' }}>Stadium Capacity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{getTeamField(selected, 'founded') || '—'}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{getVenueField(selected, 'capacity') || '—'}</td>
                </tr>
              </tbody>
            </table>
            <ChartConnector selected={selected} chartRef={chartRef} chartInstanceRef={chartInstanceRef} />
          </div>
        )}
      </div>
    </div>
  );
}

// Helper functions to safely read nested fields from normalized API response
function getTeamField(item, field) {
  if (!item) return null;
  const raw = item.raw || {};
  const team = raw.team || raw;
  return item[field] || team[field] || team?.team?.[field] || null;
}

function getVenueField(item, field) {
  if (!item) return null;
  const raw = item.raw || {};
  const venue = item.venue || raw.venue || raw?.team?.venue || {};
  return venue[field] || null;
}

// Chart.js integration component - loads Chart.js from CDN and renders the bar chart
function ChartConnector({ selected, chartRef, chartInstanceRef }) {
  useEffect(() => {
    let mounted = true;

    const loadChart = async () => {
      if (typeof window === 'undefined' || !chartRef.current) return;
      
      // Load Chart.js from CDN if needed
      if (!window.Chart) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.min.js';
        script.async = true;
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      if (!mounted) return;

      // Clean up previous chart instance
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const founded = parseInt(getTeamField(selected, 'founded'), 10) || 0;
      const capacity = parseInt(getVenueField(selected, 'capacity'), 10) || 0;

      // Create new chart instance
      chartInstanceRef.current = new window.Chart(chartRef.current, {
        type: 'bar',
        data: {
          labels: ['Founded Year', 'Stadium Capacity'],
          datasets: [{
            label: selected.name,
            data: [founded, capacity],
            backgroundColor: ['#d32f2f', '#1976d2']
          }]
        },
        options: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Founded Year vs Stadium Capacity',
            fontColor: '#fff'
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                fontColor: '#fff'
              },
              gridLines: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            }],
            xAxes: [{
              ticks: {
                fontColor: '#fff'
              },
              gridLines: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            }]
          }
        }
      });
    };

    loadChart().catch(console.error);

    return () => {
      mounted = false;
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [selected, chartRef]);

  return null;
}

export default TeamSearch;
