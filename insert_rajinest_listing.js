const pool = require('./db');

async function insertRajiNest() {
    console.log('Inserting Sasikaladevi C Client & Raji Nest 1BHK Listing...');
    try {
        // 1. Insert/Update Owner Client
        const ownerPhone = '+91 97894 51611';
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
            'client_sasikaladevi',
            'Sasikaladevi C',
            ownerPhone,
            '+91 73391 21049',
            'csasikaladevi@gmail.com',
            'Raji Nest, ELGI Nagar, Coimbatore, Tamil Nadu - 641018',
            'Owner of 1BHK flat with modular kitchen in Raji Nest, ELGI Nagar.',
            'Property Owner'
        ]);
        console.log('Owner Client saved:', clientRes.rows[0].name);

        // 2. Insert/Update Property Listing
        const propId = 'prop_sasikala_rajinest_1bhk';
        const media = JSON.stringify([
            {
                type: 'image',
                url: '/properties/rajinest_1bhk_1.jpg',
                caption: 'Wide Tiled 2nd Floor Corridor Walkway with Wooden Doors'
            },
            {
                type: 'image',
                url: '/properties/rajinest_1bhk_2.jpg',
                caption: 'Spacious Living Room with Marble-Grain Tiles & Open Modular Kitchen'
            },
            {
                type: 'image',
                url: '/properties/rajinest_1bhk_3.jpg',
                caption: 'Modern 3-Storey Building Elevation with Wooden Stilt Entry Gate'
            }
        ]);

        const description = `Comfortable and Modern 1 BHK Apartment Flat for Rent in Raji Nest, ELGI Nagar, Coimbatore.

Property Highlights & Features:
• Configuration: 1 Bedroom, 1 Bathroom, Living Hall & Modular Open Kitchen
• Carpet Area: 650 sq.ft (60.39 sq.m)
• Property Age: 1 to 5 Years Old (Low-Rise Modern Building with Aesthetic Elevation)
• Floor Level: 2nd Floor (of 3 Floors)
• Monthly Rent: ₹10,000 / month | Security Deposit: ₹50,000 (Will be confirmed)
• Maintenance: ₹800 / month (Will be confirmed)
• Preferred Tenants: All (Family, Working Professionals, Bachelors)
• Parking: Dedicated covered stilt parking for car & two-wheelers behind stylish wooden gate

Furnishing Breakdown:
✅ Included / Provided:
  - Built-in Wooden Wardrobes
  - Modular Kitchen Setup with Storage Cabinets & Granite Countertop
  - Water Purifier System Installed
  - Ceiling Fan & Exhaust Fan
  - Bathroom Geyser Installed
  - Tube Lights & Electrical Fixtures
  - Wide Tiled Walkway Corridors & Quality Wood Entry Doors

❌ NOT Provided (Tenant to arrange own):
  - No AC, No Beds/Mattress, No Kitchen Chimney
  - No Dining Table, No Microwave, No Refrigerator
  - No Sofa Set, No Gas Stove, No TV, No Washing Machine

Locality & Connectivity:
• Situated in peaceful ELGI Nagar with quick access to Trichy Road, Ramanathapuram, and Singanallur junction
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
                151, 39, NOW(), NOW()
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
            '1 BHK Flat in Raji Nest, ELGI Nagar',      // $3 title
            'ELGI Nagar, Coimbatore',                   // $4 location
            'Near Trichy Road & Ramanathapuram',        // $5 landmark
            'Raji Nest Main Street, ELGI Nagar',        // $6 street
            '641018',                                   // $7 pincode
            'exact',                                    // $8 location_privacy
            11.0068,                                    // $9 lat (ELGI Nagar / Trichy Road, Coimbatore)
            77.0162,                                    // $10 lng
            10000,                                      // $11 rent_amount
            50000,                                      // $12 deposit_amount (Will be confirmed)
            800,                                        // $13 maintenance_amount (Will be confirmed)
            'Semi-Furnished (Modular Kitchen & Geyser)', // $14 furnishing
            'Immediate',                                // $15 available_from
            'All (Family, Working Professionals, Bachelors)', // $16 preferred_tenants
            '11 Months (Standard)',                     // $17 lease_duration
            'Any (Will be confirmed)',                  // $18 food_preference
            '1 Covered Parking + 2-Wheeler Parking (Stilt Wooden Gate)', // $19 parking
            '6 Months (Will be confirmed)',             // $20 lock_in_period
            '1 Month (Will be confirmed)',              // $21 notice_period
            0,                                          // $22 bogithu_amount
            0,                                          // $23 bogithu_years
            description,                                // $24 description
            'Sasikaladevi C',                           // $25 contact_name
            ownerPhone,                                 // $26 contact_phone
            'client_sasikaladevi',                      // $27 owner_uid
            ownerPhone,                                 // $28 owner_phone
            'csasikaladevi@gmail.com',                  // $29 owner_email
            'available',                                // $30 status
            media,                                      // $31 media
            true,                                       // $32 is_free_upload
            0,                                          // $33 fee_paid
            10000,                                      // $34 price
            '650 sqft',                                 // $35 sqft
            1,                                          // $36 beds
            1,                                          // $37 baths
            2,                                          // $38 floors (2nd floor of 3)
            'for_rent',                                 // $39 transaction_type
            JSON.stringify([                            // $40 internal_documents
                { name: 'Raji Nest Electricity Sub-meter Card.pdf', date: '2026-09-15' },
                { name: 'Apartment Maintenance Receipt.pdf', date: '2026-09-01' }
            ])
        ]);

        console.log('Successfully inserted Property Listing:', propId);
    } catch (e) {
        console.error('Error inserting listing:', e);
    } finally {
        await pool.end();
    }
}

insertRajiNest();
