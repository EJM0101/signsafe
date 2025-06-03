import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { nanoid } from 'nanoid';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const router = express.Router();

// Résoudre les chemins de fichiers
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration de Multer
const upload = multer({ dest: join(__dirname, '../uploads') });

// Init lowdb
const file = join(__dirname, '../data/signatures.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);
await db.read();
db.data ||= { signatures: [] };

const SECRET = 'SIGN_SAFE_SECRET';

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/sign', (req, res) => {
    res.render('sign');
});

router.post('/sign', upload.single('doc'), async (req, res) => {
    const { email } = req.body;
    const file = req.file;

    const filePath = file.path;
    const fileContent = fs.readFileSync(filePath);
    const hash = crypto.createHash('sha256').update(fileContent).digest('hex');
    const signature = crypto.createHmac('sha256', SECRET).update(hash + email).digest('hex');

    const newSignature = {
        id: nanoid(),
        email,
        filename: file.originalname,
        storedName: file.filename,
        hash,
        signature,
        timestamp: new Date().toISOString()
    };

    db.data.signatures.push(newSignature);
    await db.write();

    res.render('result', { message: "✅ Fichier signé avec succès.", signature });
});

router.get('/verify', (req, res) => {
    res.render('verify');
});

router.post('/verify', upload.single('doc'), async (req, res) => {
    const { email } = req.body;
    const file = req.file;

    const fileContent = fs.readFileSync(file.path);
    const hash = crypto.createHash('sha256').update(fileContent).digest('hex');
    const signature = crypto.createHmac('sha256', SECRET).update(hash + email).digest('hex');

    const record = db.data.signatures.find(sig => sig.hash === hash && sig.email === email);

    if (record && record.signature === signature) {
        res.render('result', {
            message: "✅ Le fichier est authentique et n’a pas été modifié.",
            signature
        });
    } else {
        res.render('result', {
            message: "❌ Le fichier est modifié ou non signé par cet utilisateur.",
            signature: "Invalide"
        });
    }
});

router.get('/history', async (req, res) => {
    const list = db.data.signatures;
    res.render('history', { list });
});

export default router;