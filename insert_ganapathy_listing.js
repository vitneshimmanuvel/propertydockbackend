const pool = require('./db');

async function insertGanapathy() {
    console.log('Inserting Henry Client & Ganapathy Property Listing...');
    try {
        // 1. Insert/Update Owner Client
        const ownerPhone = '+91 93605 57023';
        const clientRes = await pool.query(`
            INSERT INTO clients (id, name, phone, alternate_phone, email, address, notes, client_type, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
            ON CONFLICT (phone) DO UPDATE SET
                name = EXCLUDED.name,
                email = EXCLUDED.email,
                address = EXCLUDED.address,
                notes = EXCLUDED.notes,
                client_type = EXCLUDED.client_type,
                updated_at = NOW()
            RETURNING *
        `, [
            'client_henry',
            'Henry',
            ownerPhone,
            '+91 73391 21049',
            'henry.coimbatore@settlo.in',
            'Ganapathy, Sathy Road, Coimbatore, Tamil Nadu - 641006',
            'Owner of 2BHK independent builder floor with covered parking in Ganapathy.',
            'Property Owner'
        ]);
        console.log('Owner Client saved:', clientRes.rows[0].name);

        // 2. Insert/Update Property Listing
        const propId = 'prop_henry_ganapathy_2bhk';
        const media = JSON.stringify([
            {
                type: 'image',
                url: '/properties/ganapathy_2bhk_1.jpg',
                caption: 'Shaded Balcony Sit-Out Area with Neighborhood View'
            },
            {
                type: 'image',
                url: '/properties/ganapathy_2bhk_2.jpg',
                caption: 'Hallway with Wash Basin & Safety Window Grills'
            },
            {
                type: 'image',
                url: '/properties/ganapathy_2bhk_3.jpg',
                caption: 'Polished Teak Wood Built-in Cupboards & Showcase'
            }
        ]);

        const description = `Spacious 2 BHK Independent Builder Floor for Rent in Ganapathy, Coimbatore.

Property Highlights & Features:
• Configuration: 2 Bedrooms, Hall, Kitchen (2 BHK), 2 Bathrooms/Toilets, 1 Balcony
• Independent Living: Individual, independent rooms with excellent privacy and natural air circulation
• Super Built-up Area: 1,080 sq.ft | Plot Area: 24.79 Cents (1,003.35 sq.m)
• Property Age: 5 to 10 Years Old (Well-maintained)
• Monthly Rent: ₹14,999 / month | Security Deposit: ₹75,000 (Will be confirmed)
• Maintenance: ₹800 / month (Will be confirmed)
• Furnishing: Semi-Furnished (Built-in full-height polished wood cupboards with glass top showcase, dining wash basin with decorative tile backsplash, window safety grills)
• Water Supply: 24/7 Water Supply (Municipal Corporation Siruvani Water + Borewell Water)
• Parking: Dedicated covered parking space for car and two-wheelers
• Preferred Tenants: Family Only

Nearby Proximities:
• Churches & Temples within walking distance
• Reputed Schools & Kindergartens
• Multi-speciality Hospitals & Clinics
• Supermarkets, grocery stores & daily markets
• Highly peaceful and established residential neighbourhood in Ganapathy
• Available From: Immediate Move-in`;

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
                149, 36, NOW(), NOW()
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
            '2 BHK Builder Floor in Ganapathy',         // $3 title
            'Ganapathy, Coimbatore',                    // $4 location
            'Near Sathy Road & Ganapathy Bus Stand',    // $5 landmark
            'Ganapathy Residential Main Street',        // $6 street
            '641006',                                   // $7 pincode
            'exact',                                    // $8 location_privacy
            11.0375,                                    // $9 lat (Ganapathy, Coimbatore)
            76.9790,                                    // $10 lng
            14999,                                      // $11 rent_amount
            75000,                                      // $12 deposit_amount (Will be confirmed)
            800,                                        // $13 maintenance_amount (Will be confirmed)
            'Semi-Furnished',                           // $14 furnishing
            'Immediate',                                // $15 available_from
            'Family Only',                              // $16 preferred_tenants
            '11 Months (Standard)',                     // $17 lease_duration
            'Any (Will be confirmed)',                  // $18 food_preference
            'Covered Parking Space + 2-Wheeler Parking', // $19 parking
            '6 Months (Will be confirmed)',             // $20 lock_in_period
            '1 Month (Will be confirmed)',              // $21 notice_period
            0,                                          // $22 bogithu_amount
            0,                                          // $23 bogithu_years
            description,                                // $24 description
            'Henry',                                    // $25 contact_name
            ownerPhone,                                 // $26 contact_phone
            'client_henry',                             // $27 owner_uid
            ownerPhone,                                 // $28 owner_phone
            'henry.coimbatore@settlo.in',               // $29 owner_email
            'available',                                // $30 status
            media,                                      // $31 media
            true,                                       // $32 is_free_upload
            0,                                          // $33 fee_paid
            14999,                                      // $34 price
            '1,080 sqft',                               // $35 sqft
            2,                                          // $36 beds
            2,                                          // $37 baths
            1,                                          // $38 floors (1st floor)
            'for_rent',                                 // $39 transaction_type
            JSON.stringify([                            // $40 internal_documents
                { name: 'Water Connection Municipal Card.pdf', date: '2026-09-15' },
                { name: 'Property Tax Receipt 2026.pdf', date: '2026-09-01' }
            ])
        ]);

        console.log('Successfully inserted Property Listing:', propId);
    } catch (e) {
        console.error('Error inserting listing:', e);
    } finally {
        await pool.end();
    }
}

insertGanapathy();
