const pool = require('./db');

async function insertNanaNani() {
    console.log('Inserting Palani Client & Ananya Nana Nani Villa Listing...');
    try {
        // 1. Insert/Update Owner Client
        const ownerPhone = '+91 90478 99892';
        const clientRes = await pool.query(`
            INSERT INTO clients (id, name, phone, alternate_phone, email, address, notes, client_type, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
            ON CONFLICT (phone) DO UPDATE SET
                name = EXCLUDED.name,
                alternate_phone = EXCLUDED.alternate_phone,
                email = EXCLUDED.email,
                address = EXCLUDED.address,
                notes = EXCLUDED.notes,
                client_type = EXCLUDED.client_type,
                updated_at = NOW()
            RETURNING *
        `, [
            'client_palani',
            'Palani',
            ownerPhone,
            '+91 99765 72022',
            'palani.thondamuthur@settlo.in',
            'Ananya Nana Nani Senior Citizens Home, Dhaliyur, Thondamuthur, Coimbatore, Tamil Nadu - 641109',
            'Owner of 4BHK corner retirement villa in Ananya Nana Nani Homes.',
            'Property Owner'
        ]);
        console.log('Owner Client saved:', clientRes.rows[0].name);

        // 2. Insert/Update Property Listing
        const propId = 'prop_palani_nananani_villa';
        const media = JSON.stringify([
            {
                type: 'image',
                url: '/properties/nananani_villa_1.jpg',
                caption: 'Front View of Corner Villa with Covered Car Porch & Glass Balcony'
            },
            {
                type: 'image',
                url: '/properties/nananani_villa_2.jpg',
                caption: 'Gated Community Street View with Landscaped Palm Trees'
            },
            {
                type: 'image',
                url: '/properties/nananani_villa_3.jpg',
                caption: 'Modular Kitchen with Granite Platform, Cabinets & Double Window'
            }
        ]);

        const description = `A 3.5 / 4 BHK Senior Citizens Retirement Villa for Rent in the prestigious Ananya Nana Nani Senior Citizens Home gated community, Dhaliyur, Thondamuthur, Coimbatore.

Ideal For:
Designed specifically for senior citizens aged 50+ and families looking for safety, serene foothills living, and complete community care.

Community Amenities & In-House Facilities:
• In-house Hospital & 24/7 Medical Care Assistance
• Daily Housekeeping & Villa Maintenance Services
• Community Dining Mess with nutritious fresh meals
• Spiritual Temple & Meditation Center inside the gated society
• Recreation Club, Library, Walking Tracks & Landscaped Parks
• On-site Bank ATM & Dedicated Guest Houses for visiting family

Villa Key Specifications:
• Configuration: 4 Bedrooms, 3 Bathrooms, 2 Enclosed Glass Balconies with Dedicated Pooja Room & Study Room
• Corner Property: East Facing - North East Site with abundant cross-ventilation
• Carpet Area: 2,250 sq.ft | Plot Area: 4.59 Cents (185.81 sq.m)
• Property Age: 1 to 5 Years Old (Pristine Condition)
• Monthly Rent: ₹35,000 / month | Security Deposit: ₹1,75,000 (1.75 Lac)
• Maintenance: ₹3,000 / month (Will be confirmed)
• Parking: 1 Dedicated covered car parking porch + visitor parking

Furnishing Breakdown:
✅ Included / Provided:
  - 4 Full-height Built-in Wooden Wardrobes
  - Ceiling Fans & Lighting in all rooms
  - Bathroom Geysers Installed
  - L-shaped Modular Granite Kitchen with Base & Wall Storage Cabinets & Chimney
  - Enclosed weather-proof glass balcony lounge

❌ NOT Provided (Tenant to arrange own):
  - No AC, No Beds/Mattress, No Dining Table
  - No Microwave, No Refrigerator, No Sofa Set
  - No Gas Stove, No TV, No Washing Machine, No RO Water Purifier

Availability: Immediate Occupancy`;

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
                234, 71, NOW(), NOW()
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
            'villa',                                    // $2 category
            '4 BHK Senior Citizens Retirement Villa in Ananya Nana Nani', // $3 title
            'Thondamuthur, Coimbatore',                 // $4 location
            'Ananya Nana Nani Senior Citizens Home, Dhaliyur', // $5 landmark
            'Nana Nani Gated Enclave Main Avenue',      // $6 street
            '641109',                                   // $7 pincode
            'exact',                                    // $8 location_privacy
            10.9985,                                    // $9 lat (Ananya Nana Nani, Thondamuthur, Coimbatore)
            76.8850,                                    // $10 lng
            35000,                                      // $11 rent_amount
            175000,                                     // $12 deposit_amount (₹ 1.75 Lac as explicitly requested)
            3000,                                       // $13 maintenance_amount (Will be confirmed)
            'Semi-Furnished (4 Wardrobes, Kitchen Cabinets & Geyser)', // $14 furnishing
            'Immediate',                                // $15 available_from
            'Senior Citizens (Aged 50+) & Families',    // $16 preferred_tenants
            '11 Months (Standard)',                     // $17 lease_duration
            'Pure Veg Mess & In-House Dining Facilities', // $18 food_preference
            '1 Covered Car Parking Porch + Visitor Parking', // $19 parking
            '6 Months (Will be confirmed)',             // $20 lock_in_period
            '2 Months (Will be confirmed)',             // $21 notice_period
            0,                                          // $22 bogithu_amount
            0,                                          // $23 bogithu_years
            description,                                // $24 description
            'Palani',                                   // $25 contact_name
            ownerPhone,                                 // $26 contact_phone
            'client_palani',                            // $27 owner_uid
            ownerPhone,                                 // $28 owner_phone
            'palani.thondamuthur@settlo.in',            // $29 owner_email
            'available',                                // $30 status
            media,                                      // $31 media
            true,                                       // $32 is_free_upload
            0,                                          // $33 fee_paid
            35000,                                      // $34 price
            '2,250 sqft',                               // $35 sqft
            4,                                          // $36 beds
            3,                                          // $37 baths
            2,                                          // $38 floors (2 Floors)
            'for_rent',                                 // $39 transaction_type
            JSON.stringify([                            // $40 internal_documents
                { name: 'Nana Nani Society Membership Card.pdf', date: '2026-09-15' },
                { name: 'Senior Living Services Agreement.pdf', date: '2026-09-01' }
            ])
        ]);

        console.log('Successfully inserted Property Listing:', propId);
    } catch (e) {
        console.error('Error inserting listing:', e);
    } finally {
        await pool.end();
    }
}

insertNanaNani();
