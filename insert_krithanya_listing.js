const pool = require('./db');

async function insertKrithanya() {
    console.log('Inserting Jayanthi Client & Veda Krithanya Property Listing...');
    try {
        // 1. Insert/Update Owner Client
        const ownerPhone = '+91 94432 43889';
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
            'client_jayanthi',
            'Jayanthi',
            ownerPhone,
            '+91 98421 99887',
            'senjayinn05@gmail.com',
            'Veda\'s Krithanya Enclave, Vinayagapuram, Sathy Road, Coimbatore, Tamil Nadu - 641035',
            'Owner of 2BHK flat in Veda\'s Krithanya Enclave, Vinayagapuram.',
            'Property Owner'
        ]);
        console.log('Owner Client saved:', clientRes.rows[0].name);

        // 2. Insert/Update Property Listing
        const propId = 'prop_jayanthi_krithanya_2bhk';
        const media = JSON.stringify([
            {
                type: 'image',
                url: '/properties/krithanya_2bhk_1.jpg',
                caption: 'Wide Open 2nd Floor Corridor with Wooden Entrance Doors'
            },
            {
                type: 'image',
                url: '/properties/krithanya_2bhk_2.jpg',
                caption: 'Modern Exterior Building Elevation with Gated Compound'
            },
            {
                type: 'image',
                url: '/properties/krithanya_2bhk_3.jpg',
                caption: 'Dual Parallel Granite Kitchen Platform with Large Window'
            }
        ]);

        const description = `Comfortable 2 BHK Apartment for Rent in Veda's Krithanya Enclave, Vinayagapuram, Coimbatore.

Property Highlights & Specifications:
• Configuration: 2 Bedrooms, 2 Bathrooms, 1 Balcony
• Carpet Area: 1,000 sq.ft (92.9 sq.m)
• Floor Level: 2nd Floor (Top Floor of 2 Floors with Open Corridor & Natural Ventilation)
• Monthly Rent: ₹16,500 / month | Security Deposit: ₹80,000 (Will be confirmed)
• Maintenance: ₹1,200 / month (Will be confirmed)
• Furnishing: Semi-Furnished (Dual parallel black granite kitchen countertops, deep stainless steel sink, window grills, electrical points, solid wood entry doors)
• Preferred Tenants: Family Only
• Parking: 1 Covered Parking + 2-Wheeler Parking within secure gated compound
• Water & Power: 24/7 Borewell & Corporation Water with Separate EB Sub-meter
• Building Quality: Modern newly constructed building with wide walkways and fresh natural light
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
                138, 35, NOW(), NOW()
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
            '2 BHK Flat in Veda\'s Krithanya Enclave',   // $3 title
            'Vinayagapuram, Coimbatore',                // $4 location
            'Near Sathy Road, Vinayagapuram',           // $5 landmark
            'Veda\'s Krithanya Enclave Access Road',    // $6 street
            '641035',                                   // $7 pincode
            'exact',                                    // $8 location_privacy
            11.0725,                                    // $9 lat (Vinayagapuram / Sathy Road, Coimbatore)
            76.9885,                                    // $10 lng
            16500,                                      // $11 rent_amount
            80000,                                      // $12 deposit_amount (Will be confirmed)
            1200,                                       // $13 maintenance_amount (Will be confirmed)
            'Semi-Furnished',                           // $14 furnishing
            'Immediate',                                // $15 available_from
            'Family Only',                              // $16 preferred_tenants
            '11 Months (Standard)',                     // $17 lease_duration
            'Any (Will be confirmed)',                  // $18 food_preference
            '1 Covered Parking + 2-Wheeler Parking (Gated Compound)', // $19 parking
            '6 Months (Will be confirmed)',             // $20 lock_in_period
            '1 Month (Will be confirmed)',              // $21 notice_period
            0,                                          // $22 bogithu_amount
            0,                                          // $23 bogithu_years
            description,                                // $24 description
            'Jayanthi',                                 // $25 contact_name
            ownerPhone,                                 // $26 contact_phone
            'client_jayanthi',                          // $27 owner_uid
            ownerPhone,                                 // $28 owner_phone
            'senjayinn05@gmail.com',                    // $29 owner_email
            'available',                                // $30 status
            media,                                      // $31 media
            true,                                       // $32 is_free_upload
            0,                                          // $33 fee_paid
            16500,                                      // $34 price
            '1,000 sqft',                               // $35 sqft
            2,                                          // $36 beds
            2,                                          // $37 baths
            2,                                          // $38 floors (2nd floor of 2)
            'for_rent',                                 // $39 transaction_type
            JSON.stringify([                            // $40 internal_documents
                { name: 'Krithanya Enclave Key Handover.pdf', date: '2026-09-15' },
                { name: 'Water & EB Connection Bill.pdf', date: '2026-09-01' }
            ])
        ]);

        console.log('Successfully inserted Property Listing:', propId);
    } catch (e) {
        console.error('Error inserting listing:', e);
    } finally {
        await pool.end();
    }
}

insertKrithanya();
