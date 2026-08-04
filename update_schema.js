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
        
        // Add new property attributes
        await pool.query(`ALTER TABLE owner_listings ADD COLUMN IF NOT EXISTS price DOUBLE PRECISION DEFAULT 0;`);
        await pool.query(`ALTER TABLE owner_listings ADD COLUMN IF NOT EXISTS sqft TEXT DEFAULT '';`);
        await pool.query(`ALTER TABLE owner_listings ADD COLUMN IF NOT EXISTS beds INTEGER DEFAULT 0;`);
        await pool.query(`ALTER TABLE owner_listings ADD COLUMN IF NOT EXISTS baths INTEGER DEFAULT 0;`);
        await pool.query(`ALTER TABLE owner_listings ADD COLUMN IF NOT EXISTS floors INTEGER DEFAULT 0;`);
        await pool.query(`ALTER TABLE owner_listings ADD COLUMN IF NOT EXISTS transaction_type TEXT DEFAULT 'all';`);
        await pool.query(`ALTER TABLE owner_listings ADD COLUMN IF NOT EXISTS internal_documents JSONB DEFAULT '[]'::jsonb;`);

        // Update inquiries table schema
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
        await pool.query(`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS listing_title TEXT DEFAULT '';`);
        await pool.query(`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS listing_address TEXT DEFAULT '';`);
        await pool.query(`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS listing_price TEXT DEFAULT '';`);
        await pool.query(`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS user_email TEXT DEFAULT '';`);
        await pool.query(`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS contact_method TEXT DEFAULT '';`);
        await pool.query(`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS message TEXT DEFAULT '';`);
        await pool.query(`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS plan_to TEXT DEFAULT '';`);
        await pool.query(`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'unread';`);
        
        // Create clients table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS clients (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                phone TEXT NOT NULL UNIQUE,
                email TEXT DEFAULT '',
                address TEXT DEFAULT '',
                notes TEXT DEFAULT '',
                client_type TEXT DEFAULT 'Buyer',
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );
        `);
        await pool.query(`ALTER TABLE clients ADD COLUMN IF NOT EXISTS alternate_phone TEXT DEFAULT '';`);
        console.log('Successfully added missing columns and tables');
    } catch (e) {
        console.error('Error:', e.message);
    } finally {
        await pool.end();
    }
}

main();
