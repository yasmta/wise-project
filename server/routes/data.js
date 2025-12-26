import express from 'express';
import { getDb } from '../database.js';

const router = express.Router();

// Endpoint 1: Ozone Concentration
router.get('/ozone-concentration', async (req, res) => {
    try {
        const db = await getDb();
        const data = await db.all('SELECT year, mean_concentration, min_concentration FROM ozone_concentration ORDER BY year ASC');
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint 2: Hole Surface
router.get('/hole-surface', async (req, res) => {
    try {
        const db = await getDb();
        const data = await db.all('SELECT year, max_area, mean_area FROM hole_surface ORDER BY year ASC');
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint 3: Emissions
router.get('/emissions', async (req, res) => {
    try {
        const db = await getDb();
        const data = await db.all('SELECT year, natural_emissions, total_emissions FROM emissions ORDER BY year ASC');
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
