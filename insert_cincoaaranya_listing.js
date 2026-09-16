const pool = require('./db');

async function insertCincoAaranya() {
    console.log('Inserting Kalpana Karthikeyan Client & Cinco Aaranya Property Listing...');
    try {
        // 1. Insert/Update Owner Client
        const ownerPhone = '+91 80621 71121';
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
            'client_kalpana_karthikeyan',
            'Kalpana Karthikeyan',
            ownerPhone,
            '+91 98422 55678',
            'kalpana.karthikeyan@settlo.in',
            'Cinco Aaranya, Sathy Road, Saravanampatti, Coimbatore, Tamil Nadu - 641035',
            'Owner of 3BHK flat in RERA registered Cinco Aaranya community.',
            'Property Owner'
        ]);
        console.log('Owner Client saved:', clientRes.rows[0].name);

        // 2. Insert/Update Property Listing
        const propId = 'prop_kalpana_cincoaaranya_3bhk';
        const media = JSON.stringify([
            {
                type: 'image',
                url: '/properties/cincoaaranya_3bhk_1.jpg',
                caption: 'Granite Modular Kitchen Counter & Italian Marble Backsplash'
            },
            {
                type: 'image',
                url: '/properties/cincoaaranya_3bhk_2.jpg',
                caption: 'Modern Bathroom with Wall-Hung Commode & Overhead Shower'
            },
            {
                type: 'image',
                url: '/properties/cincoaaranya_3bhk_3.jpg',
                caption: 'Multi-tier Kitchen Utility & Prep Slab'
            }
        ]);

        const description = `3 BHK Premium Flat for Rent in Cinco Aaranya, Saravanampatti, Coimbatore.

Project & Legal Highlights:
• RERA Registered Project: TN/11/Building/0163/2025
• Facing: North Facing (Vastu Compliant)
• Configuration: 3 Bedrooms, 3 Bathrooms, 2 Private Balconies
• Super Built-up Area: 1,524 sq.ft (141.58 sq.m)
• Floor: 1st Floor of 5 Floors
• Monthly Rent: ₹36,000 / month | Security Deposit: ₹1,50,000 (Will be confirmed)
• Maintenance: ₹2,500 / month (Will be confirmed)
• Furnishing: Semi-Furnished (Granite modular kitchen counter, Italian tile backsplash, multi-tier utility slabs, wall-hung commodes, high-end shower & sanitary fittings)
• Parking: 1 Dedicated Covered Car Parking + 2-Wheeler Parking
• Water & Electricity: 24/7 Corporation & Borewell Water, Dedicated EB Meter
• Amenities: 24/7 Security, High-Speed Passenger Lifts, Power Backup, Children's Play Area
• Preferred Tenants: Suitable for All (Family, IT / Working Professionals, Bachelors)
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
                165, 44, NOW(), NOW()
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
            'apartment',                                // $2 category
            '3 BHK Luxury Flat in Cinco Aaranya',       // $3 title
            'Saravanampatti, Coimbatore',               // $4 location
            'Near Sathy Main Road, Cinco Aaranya Community', // $5 landmark
            'Cinco Aaranya Access Road, Saravanampatti', // $6 street
            '641035',                                   // $7 pincode
            'exact',                                    // $8 location_privacy
            11.0792,                                    // $9 lat (Cinco Aaranya, Saravanampatti, Coimbatore)
            76.9928,                                    // $10 lng
            36000,                                      // $11 rent_amount
            150000,                                     // $12 deposit_amount (Will be confirmed)
            2500,                                       // $13 maintenance_amount (Will be confirmed)
            'Semi-Furnished',                           // $14 furnishing
            'Immediate',                                // $15 available_from
            'All (Family, Working Professionals, Bachelors)', // $16 preferred_tenants
            '11 Months (Standard)',                     // $17 lease_duration
            'Any (Will be confirmed)',                  // $18 food_preference
            '1 Covered Parking + Visitor Parking',      // $19 parking
            '6 Months (Will be confirmed)',             // $20 lock_in_period
            '1 Month (Will be confirmed)',              // $21 notice_period
            0,                                          // $22 bogithu_amount
            0,                                          // $23 bogithu_years
            description,                                // $24 description
            'Kalpana Karthikeyan',                      // $25 contact_name
            ownerPhone,                                 // $26 contact_phone
            'client_kalpana_karthikeyan',               // $27 owner_uid
            ownerPhone,                                 // $28 owner_phone
            'kalpana.karthikeyan@settlo.in',            // $29 owner_email
            'available',                                // $30 status
            media,                                      // $31 media
            true,                                       // $32 is_free_upload
            0,                                          // $33 fee_paid
            36000,                                      // $34 price
            '1,524 sqft',                               // $35 sqft
            3,                                          // $36 beds
            3,                                          // $37 baths
            1,                                          // $38 floors (1st floor of 5)
            'for_rent',                                 // $39 transaction_type
            JSON.stringify([                            // $40 internal_documents
                { name: 'RERA Registration Certificate.pdf', date: '2025-05-02' },
                { name: 'Cinco Aaranya Handover Docket.pdf', date: '2026-09-15' }
            ])
        ]);

        console.log('Successfully inserted Property Listing:', propId);
    } catch (e) {
        console.error('Error inserting listing:', e);
    } finally {
        await pool.end();
    }
}

insertCincoAaranya();
