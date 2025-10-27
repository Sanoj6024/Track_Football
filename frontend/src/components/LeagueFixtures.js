import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TodaysFixtures.css";

function formatTime(dateString) {
  const d = new Date(dateString);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getMatchStatus(status) {
  switch (status) {
    case "FT": return "Full Time";
    case "LIVE": return "Live";
    case "HT": return "Half Time";
    case "NS": return "Upcoming";
    case "PST": return "Postponed";
    default: return status;
  }
}

export default function TodaysFixtures() {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFixtures() {
      try {
        const res = await axios.get("/api/football/fixtures/live");
        setFixtures(res.data.response || []);
      } catch (err) {
        setFixtures([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFixtures();
  }, []);

  if (loading) return <div className="tf-loading">Loading fixtures...</div>;

  if (!fixtures.length)
    return <div className="tf-no-fixtures">No live fixtures or scheduled games today.</div>;

  return (
    <div className="tf-container">
      <h2 className="tf-title">Today's Fixtures</h2>
        <div className="tf-list">
          <div className="card fixtures-card card--blue">
            <div className="card-header fixtures-header">
              <div className="card-title">Today's Fixtures</div>
              <div className="card-meta">
                <span className="date-badge">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
        {fixtures.map((fix) => (
          <div className="tf-card" key={fix.fixture.id}>
            <div className={`tf-status tf-status-${fix.fixture.status.short.toLowerCase()}`}>
              {getMatchStatus(fix.fixture.status.short)}
            </div>
            <div className="tf-time">
              {formatTime(fix.fixture.date)}
            </div>
            <div className="tf-teams">
              <div className="tf-team tf-home">
                <img src={fix.teams.home.logo} alt="home logo" className="tf-team-logo" />
                <span>{fix.teams.home.name}</span>
              </div>
              <span className="tf-score">
                {fix.goals.home} : {fix.goals.away}
              </span>
              <div className="tf-team tf-away">
                <span>{fix.teams.away.name}</span>
                <img src={fix.teams.away.logo} alt="away logo" className="tf-team-logo" />
              </div>
            </div>
            <div className="tf-league">
              <img src={fix.league.logo} alt="league" className="tf-league-logo" />
              <span>{fix.league.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}