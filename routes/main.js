const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { nanoid } = require('nanoid');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync(path.join(__dirname, '../data/signatures.json'));
const db = low(adapter);
db.defaults({ signatures: [] }).write();

const upload = multer({ dest: path.join(__dirname, '../uploads') });
const SECRET = 'SIGN_SAFE_SECRET';

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/sign', (req, res) => {
    res.render('sign');
});

router.post('/sign', upload.single('doc'), (req, res) => {
    const { email } = req.body;
    const file = req.file;
    const hash = crypto.createHash('sha256').update(fs.readFileSync(file.path)).digest('hex');
    const signature = crypto.createHmac('sha256', SECRET).update(hash + email).digest('hex');
    db.get('signatures').push({
        id: nanoid(),
        email,
        filename: file.originalname,
        storedName: file.filename,
        hash,
        signature,
        timestamp: new Date().toISOString()
    }).write();
    res.render('result', { message: "Fichier signé avec succès.", signature });
});

router.get('/verify', (req, res) => {
    res.render('verify');
});

router.post('/verify', upload.single('doc'), (req, res) => {
    const { email } = req.body;
    const file = req.file;
    const hash = crypto.createHash('sha256').update(fs.readFileSync(file.path)).digest('hex');
    const signature = crypto.createHmac('sha256', SECRET).update(hash + email).digest('hex');
    const record = db.get('signatures').find({ hash, email }).value();
    if (record && record.signature === signature) {
        res.render('result', { message: "Le fichier est authentique et n’a pas été modifié.", signature });
    } else {
        res.render('result', { message: "Le fichier est modifié ou non signé par cet utilisateur.", signature: "Invalide" });
    }
});

router.get('/history', (req, res) => {
    const list = db.get('signatures').value();
    res.render('history', { list });
});

module.exports = router;