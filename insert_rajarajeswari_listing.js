const pool = require('./db');

async function insertRajarajeswari() {
    console.log('Inserting Krishna Gopal V S Client & Sri Rajarajeswari Nagar Villa Listing...');
    try {
        // 1. Insert/Update Owner Client
        const ownerPhone = '+91 82708 57857';
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
            'client_krishna_gopal',
            'Krishna Gopal V S',
            ownerPhone,
            '+91 73391 21049',
            'krishnagopal.vs@settlo.in',
            'Muthu Nagar, Sri Rajarajeswari Nagar, Poochiyur Road, Off Mettupalayam Road, Coimbatore, Tamil Nadu - 641030',
            'Owner of grand 5BHK luxury corner villa in Sri Rajarajeswari Nagar.',
            'Property Owner'
        ]);
        console.log('Owner Client saved:', clientRes.rows[0].name);

        // 2. Insert/Update Property Listing
        const propId = 'prop_krishnagopal_rajarajeswari_5bhk';
        const media = JSON.stringify([
            {
                type: 'image',
                url: '/properties/rajarajeswari_5bhk_1.jpg',
                caption: 'Grand Foyer Archway with Pendant Lights & Black Marble Staircase'
            },
            {
                type: 'image',
                url: '/properties/rajarajeswari_5bhk_2.jpg',
                caption: 'Grand Living Hall with Twin Arched French Colonial Wood Windows'
            },
            {
                type: 'image',
                url: '/properties/rajarajeswari_5bhk_3.jpg',
                caption: 'Upper Floor Lounge with Extensive Overhead Wooden Lofts & Storage'
            }
        ]);

        const description = `Ultra-Modern 5 BHK Grand Luxury House / Villa for Rent in Sri Rajarajeswari Nagar, off Mettupalayam Road, Coimbatore.

Architectural & Site Highlights:
• East Facing - North East Corner Site on wide 30 Feet Roads
• Ultra-Modern Grand House spanned across 1st & 2nd Floors
• Configuration: 5 Spacious Bedrooms, 5 Bathrooms, 2 Large Balconies
• Built-up Area: 3,500 sq.ft | Carpet Area: 3,000 sq.ft | Plot Area: 4.02 Cents (162.58 sq.m)
• Monthly Rent: ₹68,000 / month | Security Deposit: ₹3,50,000 (Will be confirmed)
• Maintenance: ₹2,500 / month (Will be confirmed)
• Interior Elegance: Grand entrance foyer arch with designer globe pendant lights, twin arched French colonial style wooden grid windows, polished marble flooring with black granite borders, extensive overhead wooden lofts & showcase display units
• Water & Power: 24/7 Siruvani & Borewell Water, High-Capacity Power Connection
• Parking: 2 Dedicated Covered Car Parking + Ample Visitor Parking
• Preferred Tenants: Family Only
• Locality Highlights: Situated in Muthu Nagar, Poochiyur Road, near Maha Kaliamman Temple, Selva Ganapathy Temple, ration shop, and quick access to Mettupalayam Highway
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
                210, 68, NOW(), NOW()
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
            '5 BHK Ultra-Modern Grand Luxury Villa',     // $3 title
            'Sri Rajarajeswari Nagar, Coimbatore',      // $4 location
            'Off Mettupalayam Road, Near Maha Kaliamman Temple', // $5 landmark
            'Muthu Nagar Main Road, Poochiyur Road',    // $6 street
            '641030',                                   // $7 pincode
            'exact',                                    // $8 location_privacy
            11.0885,                                    // $9 lat (Sri Rajarajeswari Nagar, Mettupalayam Road, Coimbatore)
            76.9420,                                    // $10 lng
            68000,                                      // $11 rent_amount
            350000,                                     // $12 deposit_amount (Will be confirmed)
            2500,                                       // $13 maintenance_amount (Will be confirmed)
            'Semi-Furnished (Ultra-Modern Architecture)', // $14 furnishing
            'Immediate',                                // $15 available_from
            'Family Only',                              // $16 preferred_tenants
            '11 Months (Standard)',                     // $17 lease_duration
            'Any (Will be confirmed)',                  // $18 food_preference
            '2 Covered Car Parking + Visitor Parking (Corner Site)', // $19 parking
            '11 Months (Will be confirmed)',            // $20 lock_in_period
            '2 Months (Will be confirmed)',             // $21 notice_period
            0,                                          // $22 bogithu_amount
            0,                                          // $23 bogithu_years
            description,                                // $24 description
            'Krishna Gopal V S',                        // $25 contact_name
            ownerPhone,                                 // $26 contact_phone
            'client_krishna_gopal',                     // $27 owner_uid
            ownerPhone,                                 // $28 owner_phone
            'krishnagopal.vs@settlo.in',                // $29 owner_email
            'available',                                // $30 status
            media,                                      // $31 media
            true,                                       // $32 is_free_upload
            0,                                          // $33 fee_paid
            68000,                                      // $34 price
            '3,500 sqft',                               // $35 sqft
            5,                                          // $36 beds
            5,                                          // $37 baths
            2,                                          // $38 floors (1st & 2nd floor villa)
            'for_rent',                                 // $39 transaction_type
            JSON.stringify([                            // $40 internal_documents
                { name: 'Villa Approved Plan Blueprints.pdf', date: '2026-09-15' },
                { name: 'Property Tax & Water Card.pdf', date: '2026-09-01' }
            ])
        ]);

        console.log('Successfully inserted Property Listing:', propId);
    } catch (e) {
        console.error('Error inserting listing:', e);
    } finally {
        await pool.end();
    }
}

insertRajarajeswari();
