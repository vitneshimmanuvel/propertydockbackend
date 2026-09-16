const pool = require('./db');

async function insertVilankurichi() {
    console.log('Inserting Vijayalakshmie K E Client & Vilankurichi Property Listing...');
    try {
        // 1. Insert/Update Owner Client
        const ownerPhone = '+91 99944 51330';
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
            'client_vijayalakshmie',
            'Vijayalakshmie K E',
            ownerPhone,
            '+91 73391 21049',
            'vijayalakshmie.ke@settlo.in',
            'Plot No 5, VRG Nivas, Vilankurichi, Coimbatore, Tamil Nadu - 641035',
            'Owner of 2BHK flat with pooja room in VRG Nivas near TIDEL Park, Vilankurichi.',
            'Property Owner'
        ]);
        console.log('Owner Client saved:', clientRes.rows[0].name);

        // 2. Insert/Update Property Listing
        const propId = 'prop_vijayalakshmie_vilankurichi_2bhk';
        const media = JSON.stringify([
            {
                type: 'image',
                url: '/properties/vilankurichi_2bhk_1.jpg',
                caption: 'Bedroom with Vitrified Tiles, Ceiling Fan & Safety Window'
            },
            {
                type: 'image',
                url: '/properties/vilankurichi_2bhk_2.jpg',
                caption: 'Room Entrance with Marble-Grain Vitrified Flooring'
            },
            {
                type: 'image',
                url: '/properties/vilankurichi_2bhk_3.jpg',
                caption: 'Exterior Covered Parking with Multi-Panel Security Gate'
            }
        ]);

        const description = `Well-Maintained 2 BHK Apartment Flat with Dedicated Pooja Room for Rent in VRG Nivas, Vilankurichi, Coimbatore.

Property Highlights & Key Specifications:
• Configuration: 2 Bedrooms, 2 Bathrooms, 2 Balconies with Dedicated Pooja Room
• Carpet Area: 1,100 sq.ft (102.19 sq.m)
• Property Age: 1 to 5 Years Old (Newly built condition)
• Floor Level: 1st Floor (of 1 Floor) - Independent Living
• Monthly Rent: ₹20,000 / month | Security Deposit: ₹75,000
• Maintenance: ₹1,200 / month (Will be confirmed)
• Flooring: High-grade white marble-grain vitrified tiles across all rooms
• Power Backup: 100% Full Power Backup facility
• Furnishing: Semi-Furnished (Pooja room storage, kitchen cabinets, ceiling fans, curtain rods, safety window grills, designer panel doors)
• Preferred Tenants: Family Only
• Parking: 1 Dedicated covered parking + 2-wheeler parking with modern multi-panel black sliding security gate
• Water Supply: 24/7 Municipal Corporation Siruvani & Borewell Water

Strategic Locality Advantages:
• TIDEL Park IT SEZ within 2 km
• PSG Tech & Medical College within 3 km
• Prozone Mall within 4 km
• Quick access to reputed international schools, engineering/medical colleges, multi-speciality hospitals, and supermarkets
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
                162, 45, NOW(), NOW()
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
            '2 BHK Flat with Pooja Room in VRG Nivas',   // $3 title
            'Vilankurichi, Coimbatore',                 // $4 location
            'Near TIDEL Park, Peelamedu & Prozone Mall', // $5 landmark
            'Plot No 5, VRG Nivas Road, Vilankurichi',  // $6 street
            '641035',                                   // $7 pincode
            'exact',                                    // $8 location_privacy
            11.0425,                                    // $9 lat (Vilankurichi / TIDEL Park corridor, Coimbatore)
            77.0195,                                    // $10 lng
            20000,                                      // $11 rent_amount
            75000,                                      // $12 deposit_amount (₹ 75,000 explicitly provided)
            1200,                                       // $13 maintenance_amount (Will be confirmed)
            'Semi-Furnished (Vitrified Tiles & Pooja Room)', // $14 furnishing
            'Immediate',                                // $15 available_from
            'Family Only',                              // $16 preferred_tenants
            '11 Months (Standard)',                     // $17 lease_duration
            'Any (Will be confirmed)',                  // $18 food_preference
            '1 Covered Parking + 2-Wheeler Parking (Secure Gated Compound)', // $19 parking
            '6 Months (Will be confirmed)',             // $20 lock_in_period
            '1 Month (Will be confirmed)',              // $21 notice_period
            0,                                          // $22 bogithu_amount
            0,                                          // $23 bogithu_years
            description,                                // $24 description
            'Vijayalakshmie K E',                       // $25 contact_name
            ownerPhone,                                 // $26 contact_phone
            'client_vijayalakshmie',                    // $27 owner_uid
            ownerPhone,                                 // $28 owner_phone
            'vijayalakshmie.ke@settlo.in',              // $29 owner_email
            'available',                                // $30 status
            media,                                      // $31 media
            true,                                       // $32 is_free_upload
            0,                                          // $33 fee_paid
            20000,                                      // $34 price
            '1,100 sqft',                               // $35 sqft
            2,                                          // $36 beds
            2,                                          // $37 baths
            1,                                          // $38 floors (1st floor)
            'for_rent',                                 // $39 transaction_type
            JSON.stringify([                            // $40 internal_documents
                { name: 'Electricity Sub-meter Card.pdf', date: '2026-09-15' },
                { name: 'VRG Nivas Property Document.pdf', date: '2026-09-01' }
            ])
        ]);

        console.log('Successfully inserted Property Listing:', propId);
    } catch (e) {
        console.error('Error inserting listing:', e);
    } finally {
        await pool.end();
    }
}

insertVilankurichi();
