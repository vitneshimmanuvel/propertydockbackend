const pool = require('./db');

async function insertTheRetreat() {
    console.log('Inserting Rufi Real Estates Client & The Retreat Property Listing...');
    try {
        // 1. Insert/Update Dealer / Client
        const dealerPhone = '+91 70103 59868';
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
            'client_rufi_real_estates',
            'Rufi Real Estates and Investments Private Limited',
            dealerPhone,
            '+91 93637 40700',
            'rm@theretreatcbe.com',
            'Second Floor, M-203, The Retreat by MintHomes, Senthil Nagar, Kendriya Vidyalaya, Sowripalayam, Udayampalayam, Coimbatore - 641028',
            'Authorized property dealer managing luxury rental apartments at The Retreat by MintHomes.',
            'Property Dealer'
        ]);
        console.log('Dealer Client saved:', clientRes.rows[0].name);

        // 2. Insert/Update Property Listing
        const propId = 'prop_rufi_theretreat_3bhk';
        const media = JSON.stringify([
            {
                type: 'image',
                url: '/properties/theretreat_3bhk_1.jpg',
                caption: 'Master Bedroom with Teak Wardrobes & Study Nook'
            },
            {
                type: 'image',
                url: '/properties/theretreat_3bhk_2.jpg',
                caption: 'Bedroom with Air Conditioner & Window Blinds'
            },
            {
                type: 'image',
                url: '/properties/theretreat_3bhk_3.jpg',
                caption: 'Spacious Room with Sliding Balcony Door & Wardrobes'
            }
        ]);

        const description = `3 BHK Premium Luxury Apartment Flat for rent in The Retreat by MintHomes, Udayampalayam, Sowripalayam, Coimbatore.

About the Property:
A well-maintained unique apartment with top priority given to safety, 24/7 security, serenity, and tranquility in a prime residential gated community.

Key Highlights & Specifications:
• Configuration: 3 Bedrooms, 2 Bathrooms, 3 Private Balconies
• Built-up Area: 2,514 sq.ft | Carpet Area: 1,300 sq.ft
• Floor: 1st Floor (of 4 Floors) - Flat M-203
• Monthly Rent: ₹54,000 / month | Security Deposit: ₹2,50,000 (Will be confirmed)
• Maintenance: ₹3,500 / month (Will be confirmed)
• Furnishing: Semi-Furnished (Built-in Teak Wardrobes, Split Air Conditioner installed, Study Unit, Large UPVC Glass Sliding Balcony Doors, Roller Blinds)
• Parking: 1 Covered Reserved Parking + Visitor Parking
• Water & Power: 24/7 Siruvani & Borewell Water, 100% Power Backup for Lifts & Common Areas
• Preferred Tenants: Family Only
• Community Amenities: Security Guard, CCTV Surveillance, Passenger Lift, Intercom, Landscaped Gardens
• Availability: Immediate Occupancy`;

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
                189, 52, NOW(), NOW()
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
            '3 BHK Luxury Apartment in The Retreat by MintHomes', // $3 title
            'Udayampalayam, Coimbatore',                // $4 location
            'Near Kendriya Vidyalaya & Senthil Nagar',   // $5 landmark
            'Sowripalayam to Udayampalayam Main Road',   // $6 street
            '641028',                                   // $7 pincode
            'exact',                                    // $8 location_privacy
            11.0035,                                    // $9 lat (Udayampalayam / Sowripalayam, Coimbatore)
            77.0028,                                    // $10 lng
            54000,                                      // $11 rent_amount
            250000,                                     // $12 deposit_amount (Will be confirmed)
            3500,                                       // $13 maintenance_amount (Will be confirmed)
            'Semi-Furnished',                           // $14 furnishing
            'Immediate',                                // $15 available_from
            'Family Only',                              // $16 preferred_tenants
            '11 Months (Standard)',                     // $17 lease_duration
            'Any (Will be confirmed)',                  // $18 food_preference
            '1 Covered Reserved Parking + Visitor Parking', // $19 parking
            '6 Months (Will be confirmed)',             // $20 lock_in_period
            '2 Months (Will be confirmed)',             // $21 notice_period
            0,                                          // $22 bogithu_amount
            0,                                          // $23 bogithu_years
            description,                                // $24 description
            'Rufi Real Estates and Investments Private Limited', // $25 contact_name
            dealerPhone,                                // $26 contact_phone
            'client_rufi_real_estates',                 // $27 owner_uid
            dealerPhone,                                // $28 owner_phone
            'rm@theretreatcbe.com',                     // $29 owner_email
            'available',                                // $30 status
            media,                                      // $31 media
            true,                                       // $32 is_free_upload
            0,                                          // $33 fee_paid
            54000,                                      // $34 price
            '2,514 sqft',                               // $35 sqft
            3,                                          // $36 beds
            2,                                          // $37 baths
            1,                                          // $38 floors (1st floor of 4)
            'for_rent',                                 // $39 transaction_type
            JSON.stringify([                            // $40 internal_documents
                { name: 'Standard Rental Agreement The Retreat.pdf', date: '2026-08-01' },
                { name: 'MintHomes Association By-laws.pdf', date: '2026-08-01' }
            ])
        ]);

        console.log('Successfully inserted Property Listing:', propId);
    } catch (e) {
        console.error('Error inserting listing:', e);
    } finally {
        await pool.end();
    }
}

insertTheRetreat();
