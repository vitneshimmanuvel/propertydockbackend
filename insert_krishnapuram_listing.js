const pool = require('./db');

async function insertListing() {
    console.log('Inserting Client & Property Listing into Neon PostgreSQL...');
    try {
        // 1. Insert/Update Client
        const clientPhone = '+91 80621 71130';
        const clientRes = await pool.query(`
            INSERT INTO clients (id, name, phone, alternate_phone, email, address, notes, client_type, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
            ON CONFLICT (phone) DO UPDATE SET
                name = EXCLUDED.name,
                email = EXCLUDED.email,
                address = EXCLUDED.address,
                notes = EXCLUDED.notes,
                updated_at = NOW()
            RETURNING *
        `, [
            'client_vinod_kumar',
            'Vinod Kumar V',
            clientPhone,
            '+91 94433 12345',
            'vinodkumar.v@settlo.in',
            'Krishnapuram, Saravanampatti, Coimbatore, Tamil Nadu - 641035',
            'Owner of 3BHK Independent Builder Floor with roof rights in Saravanampatti.',
            'Property Owner'
        ]);
        console.log('Client saved:', clientRes.rows[0].name);

        // 2. Insert/Update Property Listing
        const propId = 'prop_vinod_3bhk_krishnapuram';
        const media = JSON.stringify([
            {
                type: 'image',
                url: '/properties/krishnapuram_3bhk_1.jpg',
                caption: 'Spacious Living Room with Balcony Access'
            },
            {
                type: 'image',
                url: '/properties/krishnapuram_3bhk_2.jpg',
                caption: 'Hall and Corridor Area with High Ceilings'
            },
            {
                type: 'image',
                url: '/properties/krishnapuram_3bhk_3.jpg',
                caption: 'Separate Dining Hall with Solid Wood Furniture'
            }
        ]);

        const description = `Spacious 3 BHK Independent Builder Floor for rent in Krishnapuram, Saravanampatti, Coimbatore.

Key Highlights:
• Configuration: 3 Bedrooms, 3 Bathrooms, 1 Balcony with Dedicated Pooja Room
• Built-up Area: 1,350 sq.ft | Plot Area: 33.06 Cents (1,337.8 sq.m)
• Floor: 1st Floor with Exclusive Roof Rights
• Monthly Rent: ₹27,000 / month | Security Deposit: ₹1,00,000 (1 Lac)
• Maintenance: Included in Rent (₹0 / Nil)
• Furnishing: Semi-Furnished (Wardrobes, Dressing Unit, Lights, Ceiling Fans, Curtain Rods)
• Parking: 1 Covered + 1 Open Parking Space
• Water & Power: 24/7 Borewell / Siruvani Water Supply, Separate EB Sub-meter
• Preferred Tenants: Family, Bachelors (Women Only)
• Lock-in / Notice Period: 1 Month Notice Period (Additional lease terms: Will be confirmed)
• Available From: Immediate Occupancy`;

        await pool.query(`
            INSERT INTO owner_listings (
                id, category, title, location, landmark, street, pincode, 
                location_privacy, lat, lng, rent_amount, deposit_amount, 
                maintenance_amount, furnishing, available_from, preferred_tenants, 
                lease_duration, food_preference, parking, lock_in_period, 
                notice_period, bogithu_amount, bogithu_years, description, 
                contact_name, contact_phone, owner_uid, owner_phone, owner_email, 
                status, media, is_free_upload, fee_paid, expiry_date, price, 
                sqft, beds, baths, floors, transaction_type, internal_documents, 
                views_count, clicks_count, created_at, updated_at
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, 
                $8, $9, $10, $11, $12, 
                $13, $14, $15, $16, 
                $17, $18, $19, $20, 
                $21, $22, $23, $24, 
                $25, $26, $27, $28, $29, 
                $30, $31, $32, $33, NULL, $34, 
                $35, $36, $37, $38, $39, $40, 
                142, 38, NOW(), NOW()
            )
            ON CONFLICT (id) DO UPDATE SET
                title = EXCLUDED.title,
                category = EXCLUDED.category,
                location = EXCLUDED.location,
                landmark = EXCLUDED.landmark,
                street = EXCLUDED.street,
                pincode = EXCLUDED.pincode,
                lat = EXCLUDED.lat,
                lng = EXCLUDED.lng,
                rent_amount = EXCLUDED.rent_amount,
                deposit_amount = EXCLUDED.deposit_amount,
                maintenance_amount = EXCLUDED.maintenance_amount,
                furnishing = EXCLUDED.furnishing,
                available_from = EXCLUDED.available_from,
                preferred_tenants = EXCLUDED.preferred_tenants,
                lease_duration = EXCLUDED.lease_duration,
                food_preference = EXCLUDED.food_preference,
                parking = EXCLUDED.parking,
                lock_in_period = EXCLUDED.lock_in_period,
                notice_period = EXCLUDED.notice_period,
                description = EXCLUDED.description,
                contact_name = EXCLUDED.contact_name,
                contact_phone = EXCLUDED.contact_phone,
                owner_uid = EXCLUDED.owner_uid,
                owner_phone = EXCLUDED.owner_phone,
                owner_email = EXCLUDED.owner_email,
                status = EXCLUDED.status,
                media = EXCLUDED.media,
                sqft = EXCLUDED.sqft,
                beds = EXCLUDED.beds,
                baths = EXCLUDED.baths,
                floors = EXCLUDED.floors,
                transaction_type = EXCLUDED.transaction_type,
                updated_at = NOW()
        `, [
            propId,                                     // $1 id
            'independent_floor',                        // $2 category
            '3 BHK Builder Floor for Rent in Saravanampatti', // $3 title
            'Saravanampatti, Coimbatore',               // $4 location
            'Near Krishnapuram & Sathy Main Road',      // $5 landmark
            'Krishnapuram Main Street',                 // $6 street
            '641035',                                   // $7 pincode
            'exact',                                    // $8 location_privacy
            11.0838,                                    // $9 lat (Saravanampatti / Krishnapuram, Coimbatore)
            76.9982,                                    // $10 lng
            27000,                                      // $11 rent_amount
            100000,                                     // $12 deposit_amount (₹ 1 Lac)
            0,                                          // $13 maintenance_amount
            'Semi-Furnished',                           // $14 furnishing
            'Immediate',                                // $15 available_from
            'Family, Bachelors (Women Only)',           // $16 preferred_tenants
            '11 Months (Standard)',                     // $17 lease_duration
            'Any (Will be confirmed)',                  // $18 food_preference
            '1 Covered, 1 Open Parking',                // $19 parking
            '6 Months (Will be confirmed)',             // $20 lock_in_period
            '1 Month',                                  // $21 notice_period
            0,                                          // $22 bogithu_amount
            0,                                          // $23 bogithu_years
            description,                                // $24 description
            'Vinod Kumar V',                            // $25 contact_name
            clientPhone,                                // $26 contact_phone
            'client_vinod_kumar',                       // $27 owner_uid
            clientPhone,                                // $28 owner_phone
            'vinodkumar.v@settlo.in',                    // $29 owner_email
            'available',                                // $30 status
            media,                                      // $31 media
            true,                                       // $32 is_free_upload
            0,                                          // $33 fee_paid
            27000,                                      // $34 price (for search indexing)
            '1,350 sqft',                               // $35 sqft
            3,                                          // $36 beds
            3,                                          // $37 baths
            1,                                          // $38 floors (1st floor)
            'for_rent',                                 // $39 transaction_type
            JSON.stringify([                            // $40 internal_documents
                { name: 'Rental Agreement Draft.pdf', date: '2026-09-16' },
                { name: 'Property Tax Receipt 2026.pdf', date: '2026-08-10' }
            ])
        ]);

        console.log('Successfully inserted Property Listing:', propId);
    } catch (e) {
        console.error('Error inserting listing:', e);
    } finally {
        await pool.end();
    }
}

insertListing();
