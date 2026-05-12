const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 4000;

// ══════════════════════════════════════════════════════
// CLOUD vs LOCAL MODE
// Set MONGODB_URI + CLOUDINARY env vars for Vercel
// Without them, runs locally with JSON file + disk uploads
// ══════════════════════════════════════════════════════
const CLOUD_MODE = !!process.env.MONGODB_URI;

// ── Cloudinary (cloud mode) ──
let cloudinary = null;
if (process.env.CLOUDINARY_CLOUD_NAME) {
    cloudinary = require('cloudinary').v2;
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
}

// ── MongoDB (cloud mode) ──
let cachedDb = null;
async function getDB() {
    if (cachedDb) return cachedDb;
    const { MongoClient } = require('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    cachedDb = client.db('alcas');
    return cachedDb;
}

// ── Local Paths ──
const DATA_FILE = path.join(__dirname, 'data', 'content.json');
const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

if (!CLOUD_MODE) {
    [path.join(__dirname, 'data'), UPLOADS_DIR,
     path.join(UPLOADS_DIR, 'projects'),
     path.join(UPLOADS_DIR, 'logos'),
     path.join(UPLOADS_DIR, 'testimonials')
    ].forEach(dir => {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });
}

// ── Default data structure ──
function getDefaultData() {
    return {
        projects: [
            { id: 'proj_1', image: 'images/NMG WEBSITE.jpeg', title: 'NMG Marine Service', role: 'WEBSITE', description: 'Complete digital platform for marine service operations.', link: 'https://nmgmarineservice.com/', tags: ['Full Stack', 'Production', 'Client Project'] },
            { id: 'proj_2', image: 'images/Lendirt.jpeg', title: 'Lend-It', role: 'Future Project', description: 'Modern lending platform interface.', link: 'https://lend-it-jade.vercel.app/', tags: ['Fintech', 'Web App', 'Frontend'] },
            { id: 'proj_3', image: 'images/Bethel.jpeg', title: 'Bethel Express Impex', role: 'WEBSITE', description: 'Corporate website for import/export.', link: 'https://www.bethelexpressimpex.com/', tags: ['Corporate', 'SEO', 'Branding'] },
            { id: 'proj_4', image: 'images/NMG CRM.jpeg', title: 'NMG Marine Dashboard', role: 'CRM', description: 'Admin dashboard for marine service operations.', link: 'https://www.nmgmarineservice.in/dashboard', tags: ['Dashboard', 'Admin', 'Enterprise'] },
            { id: 'proj_5', image: 'images/niyafit.png', title: 'NiyaFitness', role: 'WEBSITE', description: 'Vibrant fitness website with workout plans.', link: 'https://niyafit46.wixsite.com/niyafitness', tags: ['Fitness', 'Branding', 'Website'] }
        ],
        logos: [
            { id: 'logo_1', label: 'Healthifem', icon: 'fas fa-heartbeat', image: 'resources/logos/healthifem.png', desc: 'Empowering wellness through digital transformation.' },
            { id: 'logo_2', label: 'Gulf Parlor', icon: 'fas fa-utensils', image: 'resources/logos/gulf_parlor.png', desc: 'Premium dining experiences redefined.' },
            { id: 'logo_3', label: 'Freaks 2.0', icon: 'fas fa-wand-magic-sparkles', image: 'resources/logos/freaks.png', desc: 'Creative boundary-pushing design.' },
            { id: 'logo_4', label: 'BSC', icon: 'fas fa-briefcase', image: 'resources/logos/bsc.png', desc: 'Streamlined corporate identity systems.' },
            { id: 'logo_5', label: 'AL Sam', icon: 'fas fa-globe', image: 'resources/logos/al_sam.png', desc: 'Global logistics and trade connectivity.' },
            { id: 'logo_6', label: 'Sacola', icon: 'fas fa-shopping-bag', image: 'resources/logos/sacola.png', desc: 'Innovative retail solutions for the next gen.' },
            { id: 'logo_7', label: 'Quest', icon: 'fas fa-search', image: 'resources/logos/quest.png', desc: 'Data-driven research and analytics.' },
            { id: 'logo_8', label: 'PP', icon: 'fas fa-check-circle', image: 'resources/logos/pp.png', desc: 'Uncompromising quality and precision.' },
            { id: 'logo_9', label: 'Pixel', icon: 'fas fa-camera', image: 'resources/logos/pixel.png', desc: 'Perfecting detail in digital photography.' },
            { id: 'logo_10', label: 'Osia', icon: 'fas fa-crown', image: 'resources/logos/osia.png', desc: 'Luxury brand positioning and identities.' }
        ],
        testimonials: [
            { id: 'test_1', image: 'images/11 SBJ logo.png', name: 'SBJ Jewelry', location: 'Chennai, India', quote: 'Thanks to the stunning logo you created for our shop, we experienced a 45% increase in brand visibility and a 30% growth in new customer visits within the first quarter.' },
            { id: 'test_2', image: 'images/niyafit.png', name: 'Niya Fit', location: 'Chennai, India', quote: 'We needed a fresh, modern platform to represent our fitness brand. They delivered a stunning website, fully optimized with SEO best practices.' },
            { id: 'test_3', image: 'images/mithras-briyani.png', name: "Mithra's Biryani", location: 'Chennai, India', quote: "Your creative logo design helped Mithra's Biryani achieve a 35% growth in new customer reach after our rebranding." }
        ]
    };
}

// ── Initialize local data file ──
if (!CLOUD_MODE && !fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(getDefaultData(), null, 2));
}

// ── Data Read/Write (works both locally and in cloud) ──
async function readData() {
    if (CLOUD_MODE) {
        const db = await getDB();
        const doc = await db.collection('content').findOne({ _id: 'main' });
        if (!doc) {
            const data = getDefaultData();
            await db.collection('content').insertOne({ _id: 'main', ...data });
            return data;
        }
        const { _id, ...data } = doc;
        return data;
    }
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    } catch {
        const data = getDefaultData();
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return data;
    }
}

async function writeData(data) {
    if (CLOUD_MODE) {
        const db = await getDB();
        await db.collection('content').replaceOne({ _id: 'main' }, { _id: 'main', ...data }, { upsert: true });
    } else {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    }
}

// ── Middleware ──
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

app.use('/admin', express.static(__dirname));
app.use('/public', express.static(PUBLIC_DIR));
app.use(express.static(PUBLIC_DIR));

// ── Multer (memory for cloud, disk for local) ──
const storage = cloudinary
    ? multer.memoryStorage()
    : multer.diskStorage({
        destination: (req, file, cb) => {
            const type = req.params.type || 'projects';
            const dir = path.join(UPLOADS_DIR, type);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            cb(null, dir);
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const name = file.originalname.replace(ext, '').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
            const unique = crypto.randomBytes(4).toString('hex');
            cb(null, `${name}_${unique}${ext}`);
        }
    });

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp|svg/;
        if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)) return cb(null, true);
        cb(new Error('Only image files allowed'));
    }
});

// ── Upload API ──
app.post('/api/upload/:type', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        if (cloudinary) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: `alcas/${req.params.type}` },
                    (err, result) => err ? reject(err) : resolve(result)
                );
                stream.end(req.file.buffer);
            });
            return res.json({ success: true, path: result.secure_url, filename: result.public_id });
        }

        const relativePath = `uploads/${req.params.type}/${req.file.filename}`;
        res.json({ success: true, path: relativePath, filename: req.file.filename });
    } catch (err) {
        res.status(500).json({ error: 'Upload failed: ' + err.message });
    }
});

// ═══════════════════════════════════════════════════
// ── PROJECTS API ──
// ═══════════════════════════════════════════════════
app.get('/api/projects', async (req, res) => {
    const data = await readData();
    res.json(data.projects);
});

app.post('/api/projects', async (req, res) => {
    const data = await readData();
    const project = {
        id: 'proj_' + crypto.randomBytes(6).toString('hex'),
        image: req.body.image || '', title: req.body.title || '',
        role: req.body.role || '', description: req.body.description || '',
        link: req.body.link || '', tags: req.body.tags || []
    };
    data.projects.push(project);
    await writeData(data);
    res.json({ success: true, project });
});

app.put('/api/projects/:id', async (req, res) => {
    const data = await readData();
    const idx = data.projects.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    data.projects[idx] = { ...data.projects[idx], ...req.body };
    await writeData(data);
    res.json({ success: true, project: data.projects[idx] });
});

app.delete('/api/projects/:id', async (req, res) => {
    const data = await readData();
    data.projects = data.projects.filter(p => p.id !== req.params.id);
    await writeData(data);
    res.json({ success: true });
});

app.post('/api/projects/reorder', async (req, res) => {
    const data = await readData();
    const { orderedIds } = req.body;
    if (!orderedIds) return res.status(400).json({ error: 'orderedIds required' });
    data.projects = orderedIds.map(id => data.projects.find(p => p.id === id)).filter(Boolean);
    await writeData(data);
    res.json({ success: true });
});

// ═══════════════════════════════════════════════════
// ── LOGOS API ──
// ═══════════════════════════════════════════════════
app.get('/api/logos', async (req, res) => {
    const data = await readData();
    res.json(data.logos);
});

app.post('/api/logos', async (req, res) => {
    const data = await readData();
    const logo = {
        id: 'logo_' + crypto.randomBytes(6).toString('hex'),
        label: req.body.label || '', icon: req.body.icon || 'fas fa-star',
        image: req.body.image || '', desc: req.body.desc || ''
    };
    data.logos.push(logo);
    await writeData(data);
    res.json({ success: true, logo });
});

app.put('/api/logos/:id', async (req, res) => {
    const data = await readData();
    const idx = data.logos.findIndex(l => l.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    data.logos[idx] = { ...data.logos[idx], ...req.body };
    await writeData(data);
    res.json({ success: true, logo: data.logos[idx] });
});

app.delete('/api/logos/:id', async (req, res) => {
    const data = await readData();
    data.logos = data.logos.filter(l => l.id !== req.params.id);
    await writeData(data);
    res.json({ success: true });
});

// ═══════════════════════════════════════════════════
// ── TESTIMONIALS API ──
// ═══════════════════════════════════════════════════
app.get('/api/testimonials', async (req, res) => {
    const data = await readData();
    res.json(data.testimonials);
});

app.post('/api/testimonials', async (req, res) => {
    const data = await readData();
    const testimonial = {
        id: 'test_' + crypto.randomBytes(6).toString('hex'),
        image: req.body.image || '', name: req.body.name || '',
        location: req.body.location || '', quote: req.body.quote || ''
    };
    data.testimonials.push(testimonial);
    await writeData(data);
    res.json({ success: true, testimonial });
});

app.put('/api/testimonials/:id', async (req, res) => {
    const data = await readData();
    const idx = data.testimonials.findIndex(t => t.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    data.testimonials[idx] = { ...data.testimonials[idx], ...req.body };
    await writeData(data);
    res.json({ success: true, testimonial: data.testimonials[idx] });
});

app.delete('/api/testimonials/:id', async (req, res) => {
    const data = await readData();
    data.testimonials = data.testimonials.filter(t => t.id !== req.params.id);
    await writeData(data);
    res.json({ success: true });
});

// ── Combined API ──
app.get('/api/content', async (req, res) => {
    const data = await readData();
    res.json(data);
});

// ── Start server (local only) ──
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`\n  ╔═══════════════════════════════════════════════╗`);
        console.log(`  ║   ALCAS Admin Panel is running!                ║`);
        console.log(`  ║                                               ║`);
        console.log(`  ║   Live Site:   http://localhost:${PORT}            ║`);
        console.log(`  ║   Admin Panel: http://localhost:${PORT}/admin      ║`);
        console.log(`  ║   API:         http://localhost:${PORT}/api        ║`);
        console.log(`  ╚═══════════════════════════════════════════════╝\n`);
    });
}

module.exports = app;
