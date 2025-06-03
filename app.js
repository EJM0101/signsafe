import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mainRoutes from './routes/main.js';

const app = express();

// Résolution du chemin absolu
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Moteur de template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', mainRoutes);

// Serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ SignSafe est en ligne sur http://localhost:${PORT}`);
});