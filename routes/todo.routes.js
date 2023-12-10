const express = require('express');
const db = require('../db.js');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const data = await db.query('SELECT * FROM todo;');
        console.log('Fetched data from database:', data.rows);
        res.status(200).json({ todo: data.rows });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/', async (req, res) => {
    console.log(req.body);
    const { task } = req.body;

    try {
        const data = await db.query('INSERT INTO todo (task) VALUES ($1);', [task]);
        console.log(data);
        res.status(200).json({ message: `${data.rowCount} row inserted.` });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const data = await db.query('SELECT * FROM todo WHERE id = $1;', [id]);

    if (data.rows.length === 0) {
        res.json({ message: 'No task found with the specified ID.' });
    } else {
        try {
            const result = await db.query('DELETE FROM todo WHERE id = $1;', [id]);
            res.status(200).json({ message: `${result.rowCount} row was deleted.` });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

module.exports = router;