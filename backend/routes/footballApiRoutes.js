const axios = require('axios');
const express = require('express');
const router = express.Router();

// Use either FOOTBALL_DATA_KEY or FOOTBALL_API_KEY (backwards compatibility)
const FOOTBALL_DATA_KEY = process.env.FOOTBALL_DATA_KEY || process.env.FOOTBALL_API_KEY || '';

// Use either API_FOOTBALL_KEY or API_FOOTBALL (backwards compatibility)
const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY || process.env.API_FOOTBALL || '';

// axios instances
const footballData = axios.create({
  baseURL: 'https://api.football-data.org/v4',
  headers: FOOTBALL_DATA_KEY ? { 'X-Auth-Token': FOOTBALL_DATA_KEY } : {}
});

const apiFootball = axios.create({
  baseURL: 'https://v3.football.api-sports.io',
  headers: API_FOOTBALL_KEY ? { 'x-apisports-key': API_FOOTBALL_KEY } : {}
});

// Helper: log axios error details for easier debugging
function logAxiosError(err, context) {
  if (err && err.response) {
    console.error(`[${context}] axios error status=${err.response.status} data=`, JSON.stringify(err.response.data));
  } else if (err && err.request) {
    console.error(`[${context}] no response received, request=`, err.request);
  } else {
    console.error(`[${context}] error:`, err && err.message ? err.message : err);
  }
}

// Simple in-memory cache object
const cache = {};
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function getCached(key) {
  const cached = cache[key];
  if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

function setCached(key, data) {
  cache[key] = { data, timestamp: Date.now() };
}

// 1. Get competitions (use Football-Data.org)
router.get('/competitions', async (req, res) => {
  const cacheKey = 'competitions';
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  try {
    const response = await footballData.get('/competitions');
    setCached(cacheKey, response.data);
    return res.json(response.data);
  } catch (err) {
    logAxiosError(err, 'GET /competitions');
    const errorPayload = err.response?.data || { message: err.message || 'Unexpected error' };
    return res.status(err.response?.status || 500).json({ error: errorPayload });
  }
});

// 2. League standings (from Football-Data.org)
router.get('/standings/:leagueCode', async (req, res) => {
  const { leagueCode } = req.params;
  const cacheKey = `standings_${leagueCode}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  try {
    const response = await footballData.get(`/competitions/${leagueCode}/standings`);
    setCached(cacheKey, response.data);
    res.json(response.data);
  } catch (err) {
    logAxiosError(err, `GET /standings/${leagueCode}`);
    const errorPayload = err.response?.data || { message: err.message || 'Unexpected error' };
    return res.status(err.response?.status || 500).json({ error: errorPayload });
  }
});

// 3. League matches / fixtures (today or date range) - use Football-Data.org
router.get('/matches/:leagueCode', async (req, res) => {
  const { leagueCode } = req.params;
  const { dateFrom, dateTo, team } = req.query;

  let cacheKey = `matches_${leagueCode}_${dateFrom}_${dateTo}`;
  if (team) cacheKey += `_team_${team}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  try {
    const params = {};
    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo) params.dateTo = dateTo;
    const response = await footballData.get(`/competitions/${leagueCode}/matches`, { params });

    // Filter if team specified
    let matches = response.data.matches || [];
    if (team) {
      matches = matches.filter(
        m => m.homeTeam.id === parseInt(team) || m.awayTeam.id === parseInt(team)
      );
    }

    const result = { ...response.data, matches };
    setCached(cacheKey, result);
    res.json(result);
  } catch (err) {
    logAxiosError(err, `GET /matches/${leagueCode}`);
    const errorPayload = err.response?.data || { message: err.message || 'Unexpected error' };
    return res.status(err.response?.status || 500).json({ error: errorPayload });
  }
});

// 4. Live scores (prefer API-Football; fallback logic can be added)
router.get('/livescores/:leagueCode', async (req, res) => {
  const { leagueCode } = req.params;
  const cacheKey = `livescores_${leagueCode}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  try {
    // API-Football expects league id and current season (example fixed season 2025)
    // You may need mapping from code to id
    const leagueId = mapLeagueCodeToId(leagueCode); // implement mapping separately
    if (!leagueId) return res.status(400).json({ error: 'Invalid league code' });

    const response = await apiFootball.get('/fixtures', {
      params: { league: leagueId, season: 2025, live: 'all' }
    });
    setCached(cacheKey, response.data);
    res.json(response.data);
  } catch (err) {
    logAxiosError(err, `GET /livescores/${leagueCode}`);
    const errorPayload = err.response?.data || { message: err.message || 'Unexpected error' };
    return res.status(err.response?.status || 500).json({ error: errorPayload });
  }
});

// 5. Team search by name (API-Football)
router.get('/teamsearch', async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: 'Name query param is required' });

  try {
    const response = await apiFootball.get('/teams', { params: { search: name } });
    res.json(response.data);
  } catch (err) {
    logAxiosError(err, 'GET /teamsearch');
    const errorPayload = err.response?.data || { message: err.message || 'Unexpected error' };
    return res.status(err.response?.status || 500).json({ error: errorPayload });
  }
});

// 6. Team fixtures by team ID and date (API-Football)
router.get('/fixtures/team/:teamId', async (req, res) => {
  const { teamId } = req.params;
  const { date } = req.query; // 'YYYY-MM-DD'

  try {
    const params = { season: 2025 };
    if (date) {
      params.from = date;
      params.to = date;
    }
    const response = await apiFootball.get('/fixtures', { params: { team: teamId, ...params } });
    res.json(response.data);
  } catch (err) {
    logAxiosError(err, `GET /fixtures/team/${teamId}`);
    const errorPayload = err.response?.data || { message: err.message || 'Unexpected error' };
    return res.status(err.response?.status || 500).json({ error: errorPayload });
  }
});

// Helper function: map your league code like PL to API-Football league id
function mapLeagueCodeToId(code) {
  const mapping = {
    PL: 39,
    BL1: 78,
    PD: 140,
    SA: 135,
    FL1: 61,
    UCL: 2
  };
  return mapping[code] || null;
}

module.exports = router;
