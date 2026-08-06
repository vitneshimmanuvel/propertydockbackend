const pool = require('./db');

async function check() {
    const res = await pool.query("SELECT id, title, category, price, contact_name, contact_phone, lat, lng, media FROM owner_listings WHERE contact_name ILIKE '%vithednex%'");
    console.log(`Found ${res.rows.length} properties for client vithednex:`);
    console.log(JSON.stringify(res.rows, null, 2));
    await pool.end();
}

check();
