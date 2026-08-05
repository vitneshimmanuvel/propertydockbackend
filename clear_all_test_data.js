require('dotenv').config();
const pool = require('./db');

async function clearAllTestData() {
    console.log("🧹 Wiping all test property listings, test clients, and test layouts for a 100% fresh start...");
    try {
        await pool.query('TRUNCATE TABLE owner_listings RESTART IDENTITY CASCADE');
        await pool.query('TRUNCATE TABLE clients RESTART IDENTITY CASCADE');
        
        try {
            await pool.query('TRUNCATE TABLE layouts RESTART IDENTITY CASCADE');
        } catch (e) {
            console.log("Note: layouts table missing or empty, continuing...");
        }

        try {
            await pool.query('TRUNCATE TABLE bookings RESTART IDENTITY CASCADE');
        } catch (e) {
            console.log("Note: bookings table missing or empty, continuing...");
        }

        try {
            await pool.query('TRUNCATE TABLE inquiries RESTART IDENTITY CASCADE');
        } catch (e) {
            console.log("Note: inquiries table missing or empty, continuing...");
        }

        console.log("✅ All test data successfully wiped from PostgreSQL database!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error clearing test data:", err);
        process.exit(1);
    }
}

clearAllTestData();
