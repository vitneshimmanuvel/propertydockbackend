const pool = require('./db');

async function run() {
    console.log('Seeding commercial listing...');
    try {
        const id = 'comm_seed_1';
        const media = JSON.stringify([
            {
                type: 'image',
                url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
            }
        ]);
        
        await pool.query(`
            INSERT INTO owner_listings (
                id, category, title, location, landmark, street, pincode, 
                location_privacy, lat, lng, rent_amount, bogithu_amount, 
                bogithu_years, description, contact_name, contact_phone, 
                status, media, created_at, owner_uid, owner_phone, owner_email, 
                is_free_upload, fee_paid, expiry_date, price, sqft, beds, baths, 
                floors, transaction_type
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,NOW(),$19,$20,$21,$22,$23,NULL,$24,$25,$26,$27,$28,$29)
            ON CONFLICT (id) DO NOTHING
        `, [
            id,
            'commercial',
            'Property Docks Commercial Plaza',
            'Vijayamangalam',
            'Near Highway Toll Plaza',
            'Highway Main Road',
            '638056',
            'exact',
            11.2350, // Erode Vijayamangalam area
            77.5340,
            0, 0, 0,
            'Premium commercial space ideal for banks, retail showrooms, or IT offices. High footprint roadside visibility with 24/7 power backup and legal docs verified.',
            'Ramesh Kumar',
            '+91 98765 43210',
            'available',
            media,
            'admin',
            '+91 98765 43210',
            'ramesh@gmail.com',
            true,
            0,
            8500000, // Price: 85 Lakhs
            '4500', // 4,500 sqft
            0, 0, 3, // 3 floors
            'for_sale'
        ]);

        console.log('✅ Commercial listing seeded successfully!');
    } catch (e) {
        console.error('Error seeding:', e.message);
    } finally {
        await pool.end();
    }
}

run();
