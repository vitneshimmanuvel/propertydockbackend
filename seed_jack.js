const pool = require('./db');

async function run() {
    console.log('Seeding client Jack and his properties...');
    try {
        // 1. Insert Client Jack
        await pool.query(`
            INSERT INTO clients (id, name, phone, email, address, notes, client_type, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
            ON CONFLICT (phone) DO UPDATE SET
                name = EXCLUDED.name,
                email = EXCLUDED.email,
                address = EXCLUDED.address,
                notes = EXCLUDED.notes,
                client_type = EXCLUDED.client_type,
                updated_at = NOW()
        `, [
            'client_jack',
            'Jack',
            '9999999999',
            'jack@propertydocks.com',
            'Race Course Road, Coimbatore, Tamil Nadu',
            'Key developer and premium investor looking to list commercial office spaces and high-end residential villas.',
            'Seller / Owner'
        ]);

        // 2. Insert Residential Property: Jack's Sky Villa
        const resId = 'jack_res_villa';
        const resMedia = JSON.stringify([
            {
                type: 'image',
                url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80'
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
            ON CONFLICT (id) DO UPDATE SET
                title = EXCLUDED.title,
                price = EXCLUDED.price,
                sqft = EXCLUDED.sqft,
                beds = EXCLUDED.beds,
                baths = EXCLUDED.baths,
                status = EXCLUDED.status,
                media = EXCLUDED.media,
                lat = EXCLUDED.lat,
                lng = EXCLUDED.lng
        `, [
            resId,
            'villa',
            "Jack's Sky Villa",
            'Coimbatore',
            'Near Golf Course',
            'Race Course Road',
            '641018',
            'exact',
            11.0120,
            76.9740,
            0, 0, 0,
            'Super luxury 4 BHK independent villa designed with modern architecture, private swimming pool, landscaped garden, smart home automation, and 24/7 security.',
            'Jack',
            '9999999999',
            'available',
            resMedia,
            'admin',
            '9999999999',
            'jack@propertydocks.com',
            true,
            0,
            12500000, // ₹1.25 Crores
            '3200',
            4, 4, 2,
            'for_sale'
        ]);

        // 3. Insert Commercial Property: Jack's Business Hub
        const commId = 'jack_comm_hub';
        const commMedia = JSON.stringify([
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
            ON CONFLICT (id) DO UPDATE SET
                title = EXCLUDED.title,
                price = EXCLUDED.price,
                sqft = EXCLUDED.sqft,
                floors = EXCLUDED.floors,
                status = EXCLUDED.status,
                media = EXCLUDED.media,
                lat = EXCLUDED.lat,
                lng = EXCLUDED.lng
        `, [
            commId,
            'office',
            "Jack's Business Hub",
            'Coimbatore',
            'Next to Tech Park',
            'Avinashi Road',
            '641014',
            'exact',
            11.0250,
            76.9950,
            0, 0, 0,
            'Premium A-grade corporate office space spread across 4 floors. Suitable for IT companies, corporate headquarters, or large consulting agencies. Features central AC, high-speed elevators, and ample car parking.',
            'Jack',
            '9999999999',
            'available',
            commMedia,
            'admin',
            '9999999999',
            'jack@propertydocks.com',
            true,
            0,
            21000000, // ₹2.1 Crores
            '8500',
            0, 0, 4,
            'for_sale'
        ]);

        console.log('✅ Seeding completed successfully!');
    } catch (e) {
        console.error('Error seeding:', e.message);
    } finally {
        await pool.end();
    }
}

run();
