/**
 * Property Docs Real Estate — Express API Server
 * Connects to Neon PostgreSQL + Cloudinary
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/', (req, res) => {
    res.json({ message: 'Property Docs API Server Online', health: '/api/health' });
});

// Multer for file uploads (memory storage for Cloudinary streaming)
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 100 * 1024 * 1024 } });

// --- Cloudinary Config ---
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// ============================================================
//  HELPER: Assemble full database object from all tables
// ============================================================
async function getFullDatabase(client) {
    const db = client || pool;

    // Layouts
    const layoutRows = await db.query('SELECT * FROM layouts ORDER BY created_at');
    const layouts = [];

    for (const l of layoutRows.rows) {
        const plots = await db.query('SELECT * FROM plots WHERE layout_id = $1', [l.id]);
        const roads = await db.query('SELECT * FROM roads WHERE layout_id = $1', [l.id]);
        const hatches = await db.query('SELECT * FROM hatches WHERE layout_id = $1', [l.id]);

        layouts.push({
            id: l.id,
            name: l.name,
            state: l.state,
            district: l.district,
            area: l.area,
            canvas: l.canvas_json,
            backgroundImage: l.background_image_json,
            plots: plots.rows.map(p => ({
                id: p.id,
                status: p.status,
                area: p.area,
                price: p.price,
                owner: p.owner,
                notes: p.notes,
                points: p.points_json,
                labelOffset: p.label_offset_json,
                classification: p.classification,
                category: p.category,
                isBuilding: p.is_building,
                isCommon: p.is_common
            })),
            roads: roads.rows.map(r => ({
                id: r.id,
                name: r.name,
                points: r.points_json,
                textPath: r.text_path,
                style: r.style_json
            })),
            hatches: hatches.rows.map(h => ({
                id: h.id,
                points: h.points_json,
                style: h.style_json
            }))
        });
    }

    // Bookings
    const bookingRows = await db.query('SELECT * FROM bookings ORDER BY created_at DESC');
    const bookings = bookingRows.rows.map(b => ({
        id: b.id,
        layoutId: b.layout_id,
        layoutName: b.layout_name,
        plotId: b.plot_id,
        customerName: b.customer_name,
        customerPhone: b.customer_phone,
        customerEmail: b.customer_email,
        amountPaid: b.amount_paid,
        date: b.booking_date,
        status: b.status
    }));

    // Videos
    const videoRows = await db.query('SELECT * FROM videos ORDER BY sort_order, created_at');
    const videos = videoRows.rows.map(v => ({
        id: v.id,
        title: v.title,
        description: v.description,
        url: v.url,
        duration: v.duration,
        tag: v.tag
    }));

    // Settings
    const settingsRow = await db.query('SELECT * FROM settings WHERE id = 1');
    const s = settingsRow.rows[0] || {};
    const settings = {
        bookingAdvance: s.booking_advance ?? 50000,
        supportPhone: s.support_phone ?? '+91 98765 43210',
        supportEmail: s.support_email ?? 'support@propertydocsdevelopers.in',
        officeAddress: s.office_address ?? 'Property Docs Plaza, Highway Road, Vijayamangalam, Erode, Tamil Nadu - 638056'
    };

    // Owner Listings
    const ownerRows = await db.query('SELECT * FROM owner_listings ORDER BY created_at DESC');
    const ownerListings = ownerRows.rows.map(o => ({
        id: o.id,
        category: o.category,
        title: o.title,
        location: o.location,
        landmark: o.landmark,
        street: o.street,
        pincode: o.pincode,
        locationPrivacy: o.location_privacy,
        lat: o.lat,
        lng: o.lng,
        rentAmount: o.rent_amount,
        bogithuAmount: o.bogithu_amount,
        bogithuYears: o.bogithu_years,
        description: o.description,
        contactName: o.contact_name,
        contactPhone: o.contact_phone,
        status: o.status,
        ownerUid: o.owner_uid,
        ownerPhone: o.owner_phone,
        ownerEmail: o.owner_email,
        isFreeUpload: o.is_free_upload,
        feePaid: o.fee_paid,
        expiryDate: o.expiry_date,
        media: o.media || [],
        createdAt: o.created_at,
        price: o.price,
        sqft: o.sqft,
        beds: o.beds,
        baths: o.baths,
        floors: o.floors,
        transactionType: o.transaction_type
    }));

    // Inquiries
    const inquiryRows = await db.query('SELECT * FROM inquiries ORDER BY created_at DESC');
    const inquiries = inquiryRows.rows.map(i => ({
        id: i.id,
        listingId: i.listing_id,
        userName: i.user_name,
        userPhone: i.user_phone,
        userAddress: i.user_address,
        createdAt: i.created_at,
        listingTitle: i.listing_title,
        listingAddress: i.listing_address,
        listingPrice: i.listing_price,
        userEmail: i.user_email,
        contactMethod: i.contact_method,
        message: i.message,
        planTo: i.plan_to,
        status: i.status
    }));

    // Users
    const userRows = await db.query('SELECT * FROM users ORDER BY created_at DESC');
    const users = userRows.rows.map(u => ({
        uid: u.uid,
        email: u.email,
        displayName: u.displayName,
        photoURL: u.photoURL,
        phone: u.phone,
        createdAt: u.created_at,
        updatedAt: u.updated_at
    }));

    // User Favorites
    const favRows = await db.query('SELECT * FROM user_favorites ORDER BY created_at DESC');
    const userFavorites = favRows.rows.map(f => ({
        userUid: f.user_uid,
        listingId: f.listing_id,
        createdAt: f.created_at
    }));

    // Active layout ID (default to first)
    const activeLayoutId = layouts.length > 0 ? layouts[0].id : 'default';

    return { activeLayoutId, layouts, bookings, videos, settings, ownerListings, inquiries, users, userFavorites };
}

// ============================================================
//  HELPER: Save full database object to all tables (transactional)
// ============================================================
async function saveFullDatabase(data) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // Lock tables to prevent concurrent save operations from deadlocking
        await client.query('LOCK TABLE settings, inquiries, user_favorites, hatches, roads, plots, layouts, owner_listings, videos, bookings, users IN EXCLUSIVE MODE');

        // --- Clear existing data (Only layout structures & owners) ---
        await client.query('DELETE FROM inquiries');
        await client.query('DELETE FROM user_favorites');
        await client.query('DELETE FROM hatches');
        await client.query('DELETE FROM roads');
        await client.query('DELETE FROM plots');
        await client.query('DELETE FROM layouts');
        await client.query('DELETE FROM owner_listings');
        await client.query('DELETE FROM users');

        // --- Insert layouts + children ---
        for (const layout of (data.layouts || [])) {
            await client.query(
                `INSERT INTO layouts (id, name, state, district, area, canvas_json, background_image_json)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 ON CONFLICT (id) DO UPDATE SET name=$2, state=$3, district=$4, area=$5, canvas_json=$6, background_image_json=$7, updated_at=NOW()`,
                [layout.id, layout.name, layout.state || '', layout.district || '', layout.area || '',
                 JSON.stringify(layout.canvas || {}), JSON.stringify(layout.backgroundImage || {})]
            );

            // Plots
            for (const plot of (layout.plots || [])) {
                await client.query(
                    `INSERT INTO plots (layout_id, id, status, area, price, owner, notes, points_json, label_offset_json, classification, category, is_building, is_common)
                     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
                    [layout.id, plot.id, plot.status || 'available', plot.area || 0, plot.price || 0,
                     plot.owner || null, plot.notes || '', JSON.stringify(plot.points || []),
                     JSON.stringify(plot.labelOffset || { x: 0, y: 0 }),
                     plot.classification || 'plot', plot.category || 'general',
                     plot.isBuilding || false, plot.isCommon || false]
                );
            }

            // Roads
            for (const road of (layout.roads || [])) {
                await client.query(
                    `INSERT INTO roads (layout_id, id, name, points_json, text_path, style_json)
                     VALUES ($1,$2,$3,$4,$5,$6)`,
                    [layout.id, road.id, road.name || '', JSON.stringify(road.points || []),
                     road.textPath || null, JSON.stringify(road.style || {})]
                );
            }

            // Hatches
            for (const hatch of (layout.hatches || [])) {
                await client.query(
                    `INSERT INTO hatches (layout_id, id, points_json, style_json)
                     VALUES ($1,$2,$3,$4)`,
                    [layout.id, hatch.id, JSON.stringify(hatch.points || []),
                     JSON.stringify(hatch.style || {})]
                );
            }
        }

        // --- Insert/Update bookings (Upsert style to prevent overwriting concurrent bookings) ---
        for (const b of (data.bookings || [])) {
            await client.query(
                `INSERT INTO bookings (id, layout_id, layout_name, plot_id, customer_name, customer_phone, customer_email, amount_paid, booking_date, status)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
                 ON CONFLICT (id) DO UPDATE SET
                    layout_id = EXCLUDED.layout_id,
                    layout_name = EXCLUDED.layout_name,
                    plot_id = EXCLUDED.plot_id,
                    customer_name = EXCLUDED.customer_name,
                    customer_phone = EXCLUDED.customer_phone,
                    customer_email = EXCLUDED.customer_email,
                    amount_paid = EXCLUDED.amount_paid,
                    booking_date = EXCLUDED.booking_date,
                    status = EXCLUDED.status`,
                [b.id, b.layoutId, b.layoutName || '', b.plotId, b.customerName,
                 b.customerPhone, b.customerEmail || '', b.amountPaid || 0,
                 b.date || new Date().toISOString(), b.status || 'pending']
            );
        }

        // --- Insert/Update videos (Upsert style to prevent deletion of other videos) ---
        for (let i = 0; i < (data.videos || []).length; i++) {
            const v = data.videos[i];
            await client.query(
                `INSERT INTO videos (id, title, description, url, duration, tag, sort_order)
                 VALUES ($1,$2,$3,$4,$5,$6,$7)
                 ON CONFLICT (id) DO UPDATE SET
                    title = EXCLUDED.title,
                    description = EXCLUDED.description,
                    url = EXCLUDED.url,
                    duration = EXCLUDED.duration,
                    tag = EXCLUDED.tag,
                    sort_order = EXCLUDED.sort_order`,
                [v.id, v.title, v.description || '', v.url, v.duration || '0:00', v.tag || '', i]
            );
        }

        // --- Upsert settings ---
        const s = data.settings || {};
        await client.query(
            `INSERT INTO settings (id, booking_advance, support_phone, support_email, office_address)
             VALUES (1, $1, $2, $3, $4)
             ON CONFLICT (id) DO UPDATE SET
                booking_advance=$1, support_phone=$2, support_email=$3, office_address=$4, updated_at=NOW()`,
            [s.bookingAdvance ?? 50000, s.supportPhone ?? '', s.supportEmail ?? '', s.officeAddress ?? '']
        );

        // --- Insert owner listings ---
        for (const o of (data.ownerListings || [])) {
            await client.query(
                `INSERT INTO owner_listings (id, category, title, location, landmark, street, pincode, location_privacy, lat, lng, rent_amount, bogithu_amount, bogithu_years, description, contact_name, contact_phone, status, media, created_at, owner_uid, owner_phone, owner_email, is_free_upload, fee_paid, expiry_date, price, sqft, beds, baths, floors, transaction_type)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31)
                 ON CONFLICT (id) DO UPDATE SET
                    category = EXCLUDED.category,
                    title = EXCLUDED.title,
                    location = EXCLUDED.location,
                    landmark = EXCLUDED.landmark,
                    street = EXCLUDED.street,
                    pincode = EXCLUDED.pincode,
                    location_privacy = EXCLUDED.location_privacy,
                    lat = EXCLUDED.lat,
                    lng = EXCLUDED.lng,
                    rent_amount = EXCLUDED.rent_amount,
                    bogithu_amount = EXCLUDED.bogithu_amount,
                    bogithu_years = EXCLUDED.bogithu_years,
                    description = EXCLUDED.description,
                    contact_name = EXCLUDED.contact_name,
                    contact_phone = EXCLUDED.contact_phone,
                    status = EXCLUDED.status,
                    media = EXCLUDED.media,
                    owner_uid = EXCLUDED.owner_uid,
                    owner_phone = EXCLUDED.owner_phone,
                    owner_email = EXCLUDED.owner_email,
                    is_free_upload = EXCLUDED.is_free_upload,
                    fee_paid = EXCLUDED.fee_paid,
                    expiry_date = EXCLUDED.expiry_date,
                    price = EXCLUDED.price,
                    sqft = EXCLUDED.sqft,
                    beds = EXCLUDED.beds,
                    baths = EXCLUDED.baths,
                    floors = EXCLUDED.floors,
                    transaction_type = EXCLUDED.transaction_type`,
                [
                    o.id, 
                    o.category || 'rental_house', 
                    o.title || '', 
                    o.location || '', 
                    o.landmark || '',
                    o.street || '',
                    o.pincode || '',
                    o.locationPrivacy || 'exact',
                    o.lat || null, 
                    o.lng || null, 
                    parseFloat(String(o.rentAmount || 0).replace(/,/g, '')) || 0, 
                    parseFloat(String(o.bogithuAmount || 0).replace(/,/g, '')) || 0, 
                    parseInt(String(o.bogithuYears || 0).replace(/,/g, ''), 10) || 0, 
                    o.description || '', 
                    o.contactName || '', 
                    o.contactPhone || '', 
                    o.status || 'available', 
                    JSON.stringify(o.media || []),
                    o.createdAt || new Date(),
                    o.ownerUid || '',
                    o.ownerPhone || '',
                    o.ownerEmail || '',
                    o.isFreeUpload ?? true,
                    o.feePaid || 0,
                    o.expiryDate || null,
                    parseFloat(String(o.price || 0).replace(/,/g, '')) || 0,
                    o.sqft || '',
                    parseInt(String(o.beds || 0).replace(/,/g, ''), 10) || 0,
                    parseInt(String(o.baths || 0).replace(/,/g, ''), 10) || 0,
                    parseInt(String(o.floors || 0).replace(/,/g, ''), 10) || 0,
                    o.transactionType || 'all'
                ]
            );
        }

        // --- Insert Users ---
        for (const u of (data.users || [])) {
            await client.query(
                `INSERT INTO users (uid, email, displayName, photoURL, phone, created_at, updated_at)
                 VALUES ($1,$2,$3,$4,$5,$6,$7)
                 ON CONFLICT (uid) DO UPDATE SET
                    email = EXCLUDED.email,
                    displayName = EXCLUDED.displayName,
                    photoURL = EXCLUDED.photoURL,
                    phone = EXCLUDED.phone,
                    updated_at = NOW()`,
                [u.uid, u.email || '', u.displayName || '', u.photoURL || '', u.phone || '', u.createdAt || new Date(), new Date()]
            );
        }

        // --- Insert User Favorites ---
        for (const f of (data.userFavorites || [])) {
            await client.query(
                `INSERT INTO user_favorites (user_uid, listing_id, created_at)
                 VALUES ($1,$2,$3)
                 ON CONFLICT (user_uid, listing_id) DO NOTHING`,
                [f.userUid, f.listingId, f.createdAt || new Date()]
            );
        }

        // --- Insert/Update inquiries ---
        for (const i of (data.inquiries || [])) {
            await client.query(
                `INSERT INTO inquiries (id, listing_id, user_name, user_phone, user_address, created_at, listing_title, listing_address, listing_price, user_email, contact_method, message, plan_to, status)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
                 ON CONFLICT (id) DO UPDATE SET
                    user_name = EXCLUDED.user_name,
                    user_phone = EXCLUDED.user_phone,
                    user_address = EXCLUDED.user_address,
                    listing_title = EXCLUDED.listing_title,
                    listing_address = EXCLUDED.listing_address,
                    listing_price = EXCLUDED.listing_price,
                    user_email = EXCLUDED.user_email,
                    contact_method = EXCLUDED.contact_method,
                    message = EXCLUDED.message,
                    plan_to = EXCLUDED.plan_to,
                    status = EXCLUDED.status`,
                [
                    i.id, 
                    i.listingId, 
                    i.userName, 
                    i.userPhone, 
                    i.userAddress || '', 
                    i.createdAt || new Date(),
                    i.listingTitle || '',
                    i.listingAddress || '',
                    i.listingPrice || '',
                    i.userEmail || '',
                    i.contactMethod || 'email',
                    i.message || '',
                    i.planTo || '',
                    i.status || 'unread'
                ]
            );
        }

        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

// ============================================================
//  API ROUTES
// ============================================================

// --- Full Database ---
app.get('/api/database', async (req, res) => {
    try {
        const data = await getFullDatabase();
        res.json(data);
    } catch (err) {
        console.error('GET /api/database error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/database', async (req, res) => {
    try {
        await saveFullDatabase(req.body);
        res.json({ success: true });
    } catch (err) {
        console.error('PUT /api/database error:', err);
        res.status(500).json({ error: err.message });
    }
});

// --- Layouts ---
app.get('/api/layouts', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, state, district, area FROM layouts ORDER BY created_at');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/layouts/:id', async (req, res) => {
    try {
        const layout = await pool.query('SELECT * FROM layouts WHERE id = $1', [req.params.id]);
        if (layout.rows.length === 0) return res.status(404).json({ error: 'Layout not found' });
        
        const plots = await pool.query('SELECT * FROM plots WHERE layout_id = $1', [req.params.id]);
        const roads = await pool.query('SELECT * FROM roads WHERE layout_id = $1', [req.params.id]);
        const hatches = await pool.query('SELECT * FROM hatches WHERE layout_id = $1', [req.params.id]);
        
        const l = layout.rows[0];
        res.json({
            id: l.id, name: l.name, state: l.state, district: l.district, area: l.area,
            canvas: l.canvas_json, backgroundImage: l.background_image_json,
            plots: plots.rows.map(p => ({
                id: p.id, status: p.status, area: p.area, price: p.price, owner: p.owner,
                notes: p.notes, points: p.points_json, labelOffset: p.label_offset_json,
                classification: p.classification, category: p.category,
                isBuilding: p.is_building, isCommon: p.is_common
            })),
            roads: roads.rows.map(r => ({
                id: r.id, name: r.name, points: r.points_json, textPath: r.text_path, style: r.style_json
            })),
            hatches: hatches.rows.map(h => ({
                id: h.id, points: h.points_json, style: h.style_json
            }))
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/layouts', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const layout = req.body;
        await client.query(
            `INSERT INTO layouts (id, name, state, district, area, canvas_json, background_image_json)
             VALUES ($1,$2,$3,$4,$5,$6,$7)`,
            [layout.id, layout.name, layout.state || '', layout.district || '', layout.area || '',
             JSON.stringify(layout.canvas || {}), JSON.stringify(layout.backgroundImage || {})]
        );
        for (const plot of (layout.plots || [])) {
            await client.query(
                `INSERT INTO plots (layout_id, id, status, area, price, owner, notes, points_json, label_offset_json, classification, category, is_building, is_common)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
                [layout.id, plot.id, plot.status || 'available', plot.area || 0, plot.price || 0,
                 plot.owner || null, plot.notes || '', JSON.stringify(plot.points || []),
                 JSON.stringify(plot.labelOffset || {}), plot.classification || 'plot',
                 plot.category || 'general', plot.isBuilding || false, plot.isCommon || false]
            );
        }
        for (const road of (layout.roads || [])) {
            await client.query(
                `INSERT INTO roads (layout_id, id, name, points_json, text_path, style_json) VALUES ($1,$2,$3,$4,$5,$6)`,
                [layout.id, road.id, road.name || '', JSON.stringify(road.points || []),
                 road.textPath || null, JSON.stringify(road.style || {})]
            );
        }
        for (const hatch of (layout.hatches || [])) {
            await client.query(
                `INSERT INTO hatches (layout_id, id, points_json, style_json) VALUES ($1,$2,$3,$4)`,
                [layout.id, hatch.id, JSON.stringify(hatch.points || []), JSON.stringify(hatch.style || {})]
            );
        }
        await client.query('COMMIT');
        res.json({ success: true, id: layout.id });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

app.put('/api/layouts/:id', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const layout = req.body;
        const lid = req.params.id;

        await client.query(
            `UPDATE layouts SET name=$1, state=$2, district=$3, area=$4, canvas_json=$5, background_image_json=$6, updated_at=NOW() WHERE id=$7`,
            [layout.name, layout.state || '', layout.district || '', layout.area || '',
             JSON.stringify(layout.canvas || {}), JSON.stringify(layout.backgroundImage || {}), lid]
        );

        // Replace children
        await client.query('DELETE FROM plots WHERE layout_id=$1', [lid]);
        await client.query('DELETE FROM roads WHERE layout_id=$1', [lid]);
        await client.query('DELETE FROM hatches WHERE layout_id=$1', [lid]);

        for (const plot of (layout.plots || [])) {
            await client.query(
                `INSERT INTO plots (layout_id,id,status,area,price,owner,notes,points_json,label_offset_json,classification,category,is_building,is_common)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
                [lid, plot.id, plot.status || 'available', plot.area || 0, plot.price || 0,
                 plot.owner || null, plot.notes || '', JSON.stringify(plot.points || []),
                 JSON.stringify(plot.labelOffset || {}), plot.classification || 'plot',
                 plot.category || 'general', plot.isBuilding || false, plot.isCommon || false]
            );
        }
        for (const road of (layout.roads || [])) {
            await client.query(
                `INSERT INTO roads (layout_id,id,name,points_json,text_path,style_json) VALUES ($1,$2,$3,$4,$5,$6)`,
                [lid, road.id, road.name || '', JSON.stringify(road.points || []),
                 road.textPath || null, JSON.stringify(road.style || {})]
            );
        }
        for (const hatch of (layout.hatches || [])) {
            await client.query(
                `INSERT INTO hatches (layout_id,id,points_json,style_json) VALUES ($1,$2,$3,$4)`,
                [lid, hatch.id, JSON.stringify(hatch.points || []), JSON.stringify(hatch.style || {})]
            );
        }
        await client.query('COMMIT');
        res.json({ success: true });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

app.delete('/api/layouts/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM layouts WHERE id=$1', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Bookings ---
app.get('/api/bookings', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM bookings ORDER BY created_at DESC');
        res.json(result.rows.map(b => ({
            id: b.id, layoutId: b.layout_id, layoutName: b.layout_name, plotId: b.plot_id,
            customerName: b.customer_name, customerPhone: b.customer_phone,
            customerEmail: b.customer_email, amountPaid: b.amount_paid,
            date: b.booking_date, status: b.status
        })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/bookings', async (req, res) => {
    try {
        const b = req.body;
        await pool.query(
            `INSERT INTO bookings (id,layout_id,layout_name,plot_id,customer_name,customer_phone,customer_email,amount_paid,booking_date,status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
            [b.id, b.layoutId, b.layoutName || '', b.plotId, b.customerName,
             b.customerPhone, b.customerEmail || '', b.amountPaid || 0,
             b.date || new Date().toISOString(), b.status || 'pending']
        );
        res.json({ success: true, id: b.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/bookings/:id', async (req, res) => {
    try {
        const { status } = req.body;
        await pool.query('UPDATE bookings SET status=$1 WHERE id=$2', [status, req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Videos ---
app.get('/api/videos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM videos ORDER BY sort_order, created_at');
        res.json(result.rows.map(v => ({
            id: v.id, title: v.title, description: v.description,
            url: v.url, duration: v.duration, tag: v.tag
        })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/videos', async (req, res) => {
    try {
        const v = req.body;
        const countResult = await pool.query('SELECT COUNT(*) FROM videos');
        const sortOrder = parseInt(countResult.rows[0].count);
        await pool.query(
            `INSERT INTO videos (id,title,description,url,duration,tag,sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
            [v.id, v.title, v.description || '', v.url, v.duration || '0:00', v.tag || '', sortOrder]
        );
        res.json({ success: true, id: v.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/videos/:id', async (req, res) => {
    try {
        const v = req.body;
        await pool.query(
            `UPDATE videos SET title=$1, description=$2, url=$3, duration=$4, tag=$5 WHERE id=$6`,
            [v.title, v.description || '', v.url, v.duration || '0:00', v.tag || '', req.params.id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/videos/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM videos WHERE id=$1', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Settings ---
app.get('/api/settings', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM settings WHERE id=1');
        const s = result.rows[0] || {};
        res.json({
            bookingAdvance: s.booking_advance ?? 50000,
            supportPhone: s.support_phone ?? '',
            supportEmail: s.support_email ?? '',
            officeAddress: s.office_address ?? ''
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/settings', async (req, res) => {
    try {
        const s = req.body;
        await pool.query(
            `INSERT INTO settings (id, booking_advance, support_phone, support_email, office_address)
             VALUES (1,$1,$2,$3,$4)
             ON CONFLICT (id) DO UPDATE SET booking_advance=$1, support_phone=$2, support_email=$3, office_address=$4, updated_at=NOW()`,
            [s.bookingAdvance ?? 50000, s.supportPhone ?? '', s.supportEmail ?? '', s.officeAddress ?? '']
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Cloudinary Upload ---
app.post('/api/upload/image', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        
        const b64 = req.file.buffer.toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'property_docs/layouts',
            resource_type: 'image',
            transformation: [{ quality: 'auto', fetch_format: 'auto' }]
        });
        
        res.json({ url: result.secure_url, publicId: result.public_id });
    } catch (err) {
        console.error('Image upload error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/upload/video', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        
        const b64 = req.file.buffer.toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'property_docs/videos',
            resource_type: 'video'
        });
        
        res.json({ url: result.secure_url, publicId: result.public_id, duration: result.duration });
    } catch (err) {
        console.error('Video upload error:', err);
        res.status(500).json({ error: err.message });
    }
});

// --- Health check ---
app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'ok', database: 'connected' });
    } catch (err) {
        res.status(500).json({ status: 'error', database: 'disconnected', error: err.message });
    }
});

// --- Start Server ---
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Property Docs API Server running on http://localhost:${PORT}`);
        console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    });
}

module.exports = app;
