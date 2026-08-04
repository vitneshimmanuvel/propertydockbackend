const pool = require('./db');

async function check() {
    try {
        const res = await pool.query('SELECT id, title, category, contact_name, contact_phone FROM owner_listings ORDER BY created_at DESC');
        console.log('--- Current Owner Listings ---');
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}

check();
