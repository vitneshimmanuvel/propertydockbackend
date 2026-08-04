const pool = require('./db');

async function run() {
    console.log('Seeding client vithednex and assigning properties...');
    try {
        // 1. Insert Client vithednex
        await pool.query(`
            INSERT INTO clients (id, name, phone, alternate_phone, email, address, notes, client_type, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
            ON CONFLICT (phone) DO UPDATE SET
                name = EXCLUDED.name,
                alternate_phone = EXCLUDED.alternate_phone,
                email = EXCLUDED.email,
                address = EXCLUDED.address,
                notes = EXCLUDED.notes,
                updated_at = NOW()
        `, [
            'client_vithednex',
            'vithednex',
            '+91 98765 11111',
            '+91 98765 22222',
            'vithednex@propertydocks.com',
            'Race Course Road, Coimbatore & Highway Road, Erode',
            'Master developer and portfolio client. Manages commercial towers and luxury residential properties.',
            'Registered Client'
        ]);

        // 2. Commercial: vithednex Tech Towers
        const commId = 'vith_comm_towers';
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
                contact_name = EXCLUDED.contact_name,
                contact_phone = EXCLUDED.contact_phone,
                status = EXCLUDED.status,
                media = EXCLUDED.media,
                lat = EXCLUDED.lat,
                lng = EXCLUDED.lng
        `, [
            commId,
            'office',
            'vithednex Tech Towers',
            'Erode',
            'Near Central Junction',
            'Main Highway Road',
            '638056',
            'exact',
            11.3410,
            77.7172,
            0, 0, 0,
            'Premium 4-story commercial IT and office tower with modern glass facade, central AC, elevators, and 24/7 power backup.',
            'vithednex',
            '+91 98765 11111',
            'available',
            commMedia,
            'admin',
            '+91 98765 11111',
            'vithednex@propertydocks.com',
            true,
            0,
            18500000, // ₹1.85 Crores
            '6200',
            0, 0, 4,
            'for_sale'
        ]);

        // 3. Residential: vithednex Emerald Villa
        const resId1 = 'vith_res_villa';
        const resMedia1 = JSON.stringify([
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
                contact_name = EXCLUDED.contact_name,
                contact_phone = EXCLUDED.contact_phone,
                status = EXCLUDED.status,
                media = EXCLUDED.media,
                lat = EXCLUDED.lat,
                lng = EXCLUDED.lng
        `, [
            resId1,
            'villa',
            'vithednex Emerald Villa',
            'Coimbatore',
            'Near Golf Club',
            'Race Course Road',
            '641018',
            'exact',
            11.0120,
            76.9740,
            0, 0, 0,
            'Ultra luxury 4 BHK gated community villa with private garden, swimming pool, Italian marble flooring, and smart home automation.',
            'vithednex',
            '+91 98765 11111',
            'available',
            resMedia1,
            'admin',
            '+91 98765 11111',
            'vithednex@propertydocks.com',
            true,
            0,
            11000000, // ₹1.10 Crores
            '2800',
            4, 4, 2,
            'for_sale'
        ]);

        // 4. Residential: vithednex Sky Residency
        const resId2 = 'vith_res_sky';
        const resMedia2 = JSON.stringify([
            {
                type: 'image',
                url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
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
                contact_name = EXCLUDED.contact_name,
                contact_phone = EXCLUDED.contact_phone,
                status = EXCLUDED.status,
                media = EXCLUDED.media,
                lat = EXCLUDED.lat,
                lng = EXCLUDED.lng
        `, [
            resId2,
            'apartment',
            'vithednex Sky Residency',
            'Vijayamangalam',
            'Near Highway Toll Plaza',
            'Toll Gate Road',
            '638056',
            'exact',
            11.2370,
            77.5360,
            0, 0, 0,
            'Modern 3 BHK apartment with modular kitchen, gym access, children playground, and 24/7 security.',
            'vithednex',
            '+91 98765 11111',
            'available',
            resMedia2,
            'admin',
            '+91 98765 11111',
            'vithednex@propertydocks.com',
            true,
            0,
            7800000, // ₹78 Lakhs
            '1850',
            3, 3, 5,
            'for_sale'
        ]);

        // 5. Clean up unassigned / hanging test listings by assigning them to Bharath Kumar (+919361867673)
        await pool.query(`
            UPDATE owner_listings 
            SET contact_phone = '+919361867673', contact_name = 'Bharath Kumar'
            WHERE contact_phone IS NULL OR contact_phone = '' OR contact_phone = '368968968' OR contact_phone = '9393939393'
        `);

        console.log('✅ vithednex seeded & hanging properties cleaned up!');
    } catch (e) {
        console.error('Error seeding:', e.message);
    } finally {
        await pool.end();
    }
}

run();
