const express = require('express');
const axios = require('axios');
const router = express.Router();

const API_BASE_URL = 'https://api.football-data.org/v4';
const API_TOKEN = process.env.FOOTBALL_API_KEY;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'X-Auth-Token': API_TOKEN },
});

// Proxy route for league standings
router.get('/standings/:leagueCode', async (req, res) => {
  try {
    const { leagueCode } = req.params;
    const response = await axiosInstance.get(`/competitions/${leagueCode}/standings`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Proxy route for today's matches
router.get('/matches/:leagueCode', async (req, res) => {
  try {
    const { leagueCode } = req.params;
    const { dateFrom, dateTo } = req.query;
    const response = await axiosInstance.get(`/competitions/${leagueCode}/matches`, {
      params: { dateFrom, dateTo },
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Proxy for teams in a competition
router.get('/teams/:leagueCode', async (req, res) => {
  try {
    const { leagueCode } = req.params;
    const response = await axiosInstance.get(`/competitions/${leagueCode}/teams`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Proxy for player by ID
router.get('/player/:playerId', async (req, res) => {
  try {
    const { playerId } = req.params;
    const response = await axiosInstance.get(`/persons/${playerId}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

module.exports = router;
