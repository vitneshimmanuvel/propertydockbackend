const pool = require('./db');

async function checkClients() {
    try {
        const res = await pool.query('SELECT * FROM clients');
        console.log('--- Clients Table Rows ---');
        console.log(res.rows);
    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}

checkClients();
