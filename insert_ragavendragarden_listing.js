const pool = require('./db');

async function insertRagavendraGarden() {
    console.log('Inserting Suresh Ganesan Client & Sri Ragavendra Garden Property Listing...');
    try {
        // 1. Insert/Update Owner Client
        const ownerPhone = '+91 98427 34266';
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
            'client_suresh_ganesan',
            'Suresh Ganesan',
            ownerPhone,
            '+91 81227 14266',
            'suresh86srmec@gmail.com',
            'Sri Ragavendra Garden, Behind JSR Super Mart, Near Nehru Nagar West, Karuparayanpalayam, Coimbatore, Tamil Nadu - 641014',
            'Owner of 2BHK apartment in Sri Ragavendra Garden, Karuparayanpalayam.',
            'Property Owner'
        ]);
        console.log('Owner Client saved:', clientRes.rows[0].name);

        // 2. Insert/Update Property Listing
        const propId = 'prop_suresh_ragavendra_2bhk';
        const media = JSON.stringify([
            {
                type: 'image',
                url: '/properties/ragavendra_2bhk_1.jpg',
                caption: 'Spacious Bedroom with Wall Niche Shelving & Ceiling Fans'
            },
            {
                type: 'image',
                url: '/properties/ragavendra_2bhk_2.jpg',
                caption: 'L-shaped Granite Kitchen Platform with Sink & Tiled Splashback'
            },
            {
                type: 'image',
                url: '/properties/ragavendra_2bhk_3.jpg',
                caption: 'Building Floor Corridor with Lift Access & Main Entrance Doors'
            }
        ]);

        const description = `Premium 2 BHK Apartment available for rent at Sri Ragavendra Garden, Karuparayanpalayam, Coimbatore.

Discover the perfect blend of modern comfort and serene living in this semi-furnished 2 BHK apartment situated in the highly sought-after locality behind JSR Super Mart, near Nehru Nagar West.

Key Specifications:
• Configuration: 2 Bedrooms, 2 Bathrooms, 1 Balcony
• Super Built-up Area: 900 sq.ft (83.61 sq.m)
• Floor Level: 2nd Floor (of 3 Floors)
• Monthly Rent: ₹22,000 / month | Security Deposit: ₹1,00,000 (Will be confirmed)
• Maintenance: ₹1,500 / month (Will be confirmed)
• Available From: 21 September 2026
• Preferred Tenants: All (Family, Working Professionals, Bachelors)
• Food Restrictions: No Restrictions (Open for Vegetarian & Non-Vegetarian)
• Parking: 1 Covered Parking + 2-Wheeler Parking

Furnishing Breakdown:
✅ Included / Provided:
  - Built-in Wooden Wardrobes
  - Ceiling Fans in all rooms
  - L-shaped Granite Kitchen Platform with Stainless Steel Sink

❌ NOT Provided (Tenant to arrange own):
  - No AC, No Beds/Mattress, No Kitchen Chimney
  - No Dining Table, No Geyser, No Modular Cabinets
  - No Microwave, No Refrigerator, No Sofa Set
  - No Stove/Cylinder, No TV, No Washing Machine, No RO Water Purifier

Building & Locality Highlights:
• 24/7 Borewell & Corporation Water Supply
• Passenger Lift & Clean Tiled Corridors
• Peaceful Family Residential Area near Nehru Nagar West & Airport Road`;

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
                156, 41, NOW(), NOW()
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
            '2 BHK Flat in Sri Ragavendra Garden',      // $3 title
            'Karuparayanpalayam, Coimbatore',           // $4 location
            'Behind JSR Super Mart, Near Nehru Nagar West', // $5 landmark
            'Sri Ragavendra Garden Main Road',          // $6 street
            '641014',                                   // $7 pincode
            'exact',                                    // $8 location_privacy
            11.0535,                                    // $9 lat (Karuparayanpalayam / Nehru Nagar West, Coimbatore)
            77.0672,                                    // $10 lng
            22000,                                      // $11 rent_amount
            100000,                                     // $12 deposit_amount (Will be confirmed)
            1500,                                       // $13 maintenance_amount (Will be confirmed)
            'Semi-Furnished (Wardrobes & Fans)',         // $14 furnishing
            '21 September 2026',                        // $15 available_from
            'All (Family, Working Professionals, Bachelors)', // $16 preferred_tenants
            '11 Months (Standard)',                     // $17 lease_duration
            'No Restrictions (Veg / Non-Veg Allowed)',  // $18 food_preference
            '1 Covered Parking + 2-Wheeler Parking',    // $19 parking
            '6 Months (Will be confirmed)',             // $20 lock_in_period
            '1 Month (Will be confirmed)',              // $21 notice_period
            0,                                          // $22 bogithu_amount
            0,                                          // $23 bogithu_years
            description,                                // $24 description
            'Suresh Ganesan',                           // $25 contact_name
            ownerPhone,                                 // $26 contact_phone
            'client_suresh_ganesan',                    // $27 owner_uid
            ownerPhone,                                 // $28 owner_phone
            'suresh86srmec@gmail.com',                  // $29 owner_email
            'available',                                // $30 status
            media,                                      // $31 media
            true,                                       // $32 is_free_upload
            0,                                          // $33 fee_paid
            22000,                                      // $34 price
            '900 sqft',                                 // $35 sqft
            2,                                          // $36 beds
            2,                                          // $37 baths
            2,                                          // $38 floors (2nd floor of 3)
            'for_rent',                                 // $39 transaction_type
            JSON.stringify([                            // $40 internal_documents
                { name: 'Ragavendra Garden Society NOC.pdf', date: '2026-09-07' },
                { name: 'Electricity Sub-meter Card.pdf', date: '2026-09-07' }
            ])
        ]);

        console.log('Successfully inserted Property Listing:', propId);
    } catch (e) {
        console.error('Error inserting listing:', e);
    } finally {
        await pool.end();
    }
}

insertRagavendraGarden();
