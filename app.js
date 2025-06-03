const express = require('express');
const app = express();
const path = require('path');
const mainRoutes = require('./routes/main');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', mainRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`SignSafe is running on http://localhost:${PORT}`);
});