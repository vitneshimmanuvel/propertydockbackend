const pool = require('./db');

async function seedAllClients() {
    console.log('Seeding full client directory into PostgreSQL...');
    try {
        const clientsToSeed = [
            {
                id: 'client_vithednex',
                name: 'vithednex',
                phone: '+91 98765 11111',
                alternatePhone: '+91 98765 22222',
                email: 'vithednex@propertydocks.com',
                address: 'Race Course Road, Coimbatore & Highway Road, Erode',
                notes: 'Master developer and portfolio client. Manages commercial towers and luxury residential properties.',
                clientType: 'Registered Client'
            },
            {
                id: 'client_jack',
                name: 'Jack',
                phone: '9999999999',
                alternatePhone: '+91 98765 33333',
                email: 'jack@propertydocks.com',
                address: 'Race Course Road, Coimbatore, Tamil Nadu',
                notes: 'Key developer and premium investor looking to list commercial office spaces and high-end residential villas.',
                clientType: 'Registered Client'
            },
            {
                id: 'client_bharath',
                name: 'Bharath Kumar',
                phone: '9361867673',
                alternatePhone: '+91 93618 67673',
                email: 'bharathkumar21cse@gmail.com',
                address: 'Coimbatore, Tamil Nadu',
                notes: 'Primary layout plot buyer and residential investor.',
                clientType: 'Registered Client'
            },
            {
                id: 'client_ramesh',
                name: 'Ramesh Kumar',
                phone: '+91 98765 43210',
                alternatePhone: '+91 98765 44444',
                email: 'ramesh@propertydocks.com',
                address: 'Commercial Plaza, Erode',
                notes: 'Commercial property developer.',
                clientType: 'Registered Client'
            }
        ];

        for (const c of clientsToSeed) {
            await pool.query(`
                INSERT INTO clients (id, name, phone, alternate_phone, email, address, notes, client_type, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
                ON CONFLICT (phone) DO UPDATE SET
                    name = EXCLUDED.name,
                    alternate_phone = EXCLUDED.alternate_phone,
                    email = EXCLUDED.email,
                    address = EXCLUDED.address,
                    notes = EXCLUDED.notes,
                    updated_at = NOW()
            `, [c.id, c.name, c.phone, c.alternatePhone, c.email, c.address, c.notes, c.clientType]);
        }

        console.log('✅ All clients successfully seeded into PostgreSQL table!');
    } catch (e) {
        console.error('Error seeding clients:', e.message);
    } finally {
        await pool.end();
    }
}

seedAllClients();
