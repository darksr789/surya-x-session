const { makeid } = require('./id');
const QRCode = require('qrcode');
const express = require('express');
const pino = require('pino');
const fs = require('fs-extra');
const { default: DARK_SURYA, useMultiFileAuthState, delay, Browsers } = require('@whiskeysockets/baileys');
let router = express.Router();

router.get('/', async (req, res) => {
    const id = makeid();
    async function SURYA_X_QR() {
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);
        try {
            let bot = DARK_SURYA({
                auth: state,
                printQRInTerminal: false,
                logger: pino({ level: 'fatal' }),
                browser: Browsers.macOS('Chrome')
            });
            bot.ev.on('creds.update', saveCreds);
            bot.ev.on('connection.update', async (s) => {
                const { connection, qr } = s;
                if (qr) {
                    let res_qr = await QRCode.toDataURL(qr);
                    if (!res.headersSent) { res.send({ qr: res_qr }); }
                }
                if (connection === 'open') {
                    await delay(5000);
                    await bot.sendMessage(bot.user.id, { text: "SURYA-X~" + id });
                    await delay(2000);
                    await fs.remove('./temp/' + id);
                }
            });
        } catch (err) { if (!res.headersSent) res.send({ error: "QR Error" }); }
    }
    SURYA_X_QR();
});
module.exports = router;
