const pool = require('./db');

async function cleanupListings() {
    console.log('Cleaning up old test listings...');
    try {
        // Delete test dummy listings with 'uuuuuuuuuu', 'rrrr', 'rffff', 'tet', '3efrf', 'cxcc', 'ljiuur', etc.
        await pool.query(`
            DELETE FROM owner_listings 
            WHERE title LIKE 'uuuu%' OR title LIKE 'rrr%' OR title = 'tet' OR title LIKE '%efrf%' OR title = 'cxcc' OR title = 'ljiuur' OR title LIKE 'test%'
        `);

        // Ensure Bharath Kumar (+919361867673) has a clean, beautiful property
        await pool.query(`
            INSERT INTO owner_listings (
                id, category, title, location, landmark, street, pincode, 
                location_privacy, lat, lng, rent_amount, bogithu_amount, 
                bogithu_years, description, contact_name, contact_phone, 
                status, media, created_at, owner_uid, owner_phone, owner_email, 
                is_free_upload, fee_paid, expiry_date, price, sqft, beds, baths, 
                floors, transaction_type
            ) VALUES (
                'bharath_prop_1', 'residential', 'Bharath Royal Residency', 'Coimbatore',
                'Near Central Park', 'Avinashi Road', '641014', 'exact', 11.0168, 76.9558,
                0, 0, 0, 'Spacious 3 BHK luxury apartment with modern amenities and covered parking.',
                'Bharath Kumar', '9361867673', 'available',
                '[{"type":"image","url":"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80"}]',
                NOW(), 'admin', '9361867673', 'bharathkumar21cse@gmail.com',
                true, 0, NULL, 6500000, '1650', 3, 2, 2, 'for_sale'
            )
            ON CONFLICT (id) DO UPDATE SET
                title = EXCLUDED.title,
                price = EXCLUDED.price,
                contact_phone = EXCLUDED.contact_phone;
        `);

        console.log('✅ PostgreSQL listings cleaned up successfully!');
    } catch (e) {
        console.error('Error cleaning listings:', e.message);
    } finally {
        await pool.end();
    }
}

cleanupListings();
