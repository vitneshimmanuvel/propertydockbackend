require('dotenv').config();
const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function main() {
    try {
        await pool.query(`ALTER TABLE owner_listings ADD COLUMN IF NOT EXISTS landmark TEXT DEFAULT '';`);
        await pool.query(`ALTER TABLE owner_listings ADD COLUMN IF NOT EXISTS street TEXT DEFAULT '';`);
        await pool.query(`ALTER TABLE owner_listings ADD COLUMN IF NOT EXISTS pincode TEXT DEFAULT '';`);
        await pool.query(`ALTER TABLE owner_listings ADD COLUMN IF NOT EXISTS location_privacy TEXT DEFAULT 'exact';`);
        await pool.query(`ALTER TABLE owner_listings ADD COLUMN IF NOT EXISTS owner_uid TEXT DEFAULT '';`);
        await pool.query(`ALTER TABLE owner_listings ADD COLUMN IF NOT EXISTS owner_email TEXT DEFAULT '';`);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS inquiries (
                id TEXT PRIMARY KEY,
                listing_id TEXT NOT NULL REFERENCES owner_listings(id) ON DELETE CASCADE,
                user_name TEXT NOT NULL,
                user_phone TEXT NOT NULL,
                user_address TEXT DEFAULT '',
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `);
        console.log('Successfully added missing columns and tables');
    } catch (e) {
        console.error('Error:', e.message);
    } finally {
        await pool.end();
    }
}

main();
