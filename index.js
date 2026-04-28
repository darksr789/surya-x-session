const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 8000;

const pair = require('./pair');
const qr = require('./qr');

app.use(express.static('public'));

app.use('/pair-logic', pair);
app.use('/qr-logic', qr);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/pair', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/pair.html'));
});

app.get('/qr', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/qr.html'));
});

app.listen(PORT, () => {
    console.log(`SURYA-X Server is running on port ${PORT}`);
});
