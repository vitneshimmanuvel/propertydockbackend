const pool = require('./db');

async function insertPkdNagar() {
    console.log('Inserting Bhuvana Client & PKD Nagar Property Listing...');
    try {
        // 1. Insert/Update Owner Client
        const ownerPhone = '+91 96553 35454';
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
            'client_bhuvana',
            'Bhuvana',
            ownerPhone,
            '+91 94422 77889',
            'bhuvi.1905@gmail.com',
            'PKD Nagar, Avinashi Road, Peelamedu, Coimbatore, Tamil Nadu - 641004',
            'Verified Owner of 2BHK builder floor in prime PKD Nagar, Peelamedu.',
            'Verified Owner'
        ]);
        console.log('Owner Client saved:', clientRes.rows[0].name);

        // 2. Insert/Update Property Listing
        const propId = 'prop_bhuvana_pkdnagar_2bhk';
        const media = JSON.stringify([
            {
                type: 'image',
                url: '/properties/pkdnagar_2bhk_1.jpg',
                caption: 'Kitchen Pantry Multi-Tier Shelving Unit & Pattern Tiles'
            },
            {
                type: 'image',
                url: '/properties/pkdnagar_2bhk_2.jpg',
                caption: 'Modern Laminated Bedroom & Bathroom Interior Doors'
            },
            {
                type: 'image',
                url: '/properties/pkdnagar_2bhk_3.jpg',
                caption: 'Carved Solid Wood Main Entrance Door with CCTV Security'
            }
        ]);

        const description = `Well-Maintained 2 BHK Independent Builder Floor for Rent in PKD Nagar, off Avinashi Road, Peelamedu, Coimbatore.

Property Highlights & Specifications:
• Configuration: 2 Bedrooms, 2 Bathrooms, 2 Balconies
• Carpet Area: 900 sq.ft (83.61 sq.m) | Plot Area: 2.18 Cents (88.26 sq.m)
• Floor Level: 1st Floor (Independent Builder Floor)
• Monthly Rent: ₹23,000 / month | Security Deposit: ₹1,00,000 (Will be confirmed)
• Maintenance: ₹1,000 / month (Will be confirmed)
• Furnishing: Semi-Furnished (Built-in kitchen multi-tier pantry shelves, black granite countertop with designer tile backsplash, solid wood carved entrance door with outdoor CCTV camera, premium laminated interior doors)
• Security & Safety: Outdoor CCTV surveillance camera installed at entrance
• Preferred Tenants: Family Only
• Parking: 1 Covered Parking + 2-Wheeler Parking Space
• Water & Power: 24/7 Siruvani & Borewell Water, Separate EB Sub-meter
• Locality Advantage: Prime location right off Avinashi Road near Hope College, PSG Tech, and Peelamedu hospitals
• Availability: Immediate Move-in`;

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
                174, 49, NOW(), NOW()
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
            '2 BHK Builder Floor in PKD Nagar, Avinashi Road', // $3 title
            'PKD Nagar, Coimbatore',                    // $4 location
            'Near Avinashi Road & Hope College, Peelamedu', // $5 landmark
            'PKD Nagar 1st Cross Street',               // $6 street
            '641004',                                   // $7 pincode
            'exact',                                    // $8 location_privacy
            11.0265,                                    // $9 lat (PKD Nagar, Peelamedu, Coimbatore)
            77.0125,                                    // $10 lng
            23000,                                      // $11 rent_amount
            100000,                                     // $12 deposit_amount (Will be confirmed)
            1000,                                       // $13 maintenance_amount (Will be confirmed)
            'Semi-Furnished',                           // $14 furnishing
            'Immediate',                                // $15 available_from
            'Family Only',                              // $16 preferred_tenants
            '11 Months (Standard)',                     // $17 lease_duration
            'Any (Will be confirmed)',                  // $18 food_preference
            '1 Covered Parking + 2-Wheeler Parking',    // $19 parking
            '6 Months (Will be confirmed)',             // $20 lock_in_period
            '1 Month (Will be confirmed)',              // $21 notice_period
            0,                                          // $22 bogithu_amount
            0,                                          // $23 bogithu_years
            description,                                // $24 description
            'Bhuvana',                                  // $25 contact_name
            ownerPhone,                                 // $26 contact_phone
            'client_bhuvana',                           // $27 owner_uid
            ownerPhone,                                 // $28 owner_phone
            'bhuvi.1905@gmail.com',                     // $29 owner_email
            'available',                                // $30 status
            media,                                      // $31 media
            true,                                       // $32 is_free_upload
            0,                                          // $33 fee_paid
            23000,                                      // $34 price
            '900 sqft',                                 // $35 sqft
            2,                                          // $36 beds
            2,                                          // $37 baths
            1,                                          // $38 floors (1st floor)
            'for_rent',                                 // $39 transaction_type
            JSON.stringify([                            // $40 internal_documents
                { name: 'Property Tax Receipt 2026 PKD Nagar.pdf', date: '2026-09-10' },
                { name: 'Electricity Sub-meter Card.pdf', date: '2026-09-10' }
            ])
        ]);

        console.log('Successfully inserted Property Listing:', propId);
    } catch (e) {
        console.error('Error inserting listing:', e);
    } finally {
        await pool.end();
    }
}

insertPkdNagar();
