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
                    if (!res.headersSent) {
                        res.send({ qr: res_qr });
                    }
                }
                if (connection === 'open') {
                    await delay(5000);
                    let session_id = "SURYA-X~" + id;

                    let message = `
╔════════════════════◇
║『 SESSION CONNECTED』
║ ✨ SURYA-X 🔷
║ ✨ SURYAX OFFICIAL🔷
╚════════════════════╝

---

╔════════════════════◇
║『 YOU'VE CHOSEN SURYA-X 』
║ -Set the session ID in Heroku:
║ - SESSION_ID: ${session_id}
╚════════════════════╝
╔════════════════════◇
║ 『••• _V𝗶𝘀𝗶𝘁 𝗙𝗼𝗿_H𝗲𝗹𝗽 •••』
║❍ 𝐎𝐰𝐧𝐞𝐫: +917797099719
║❍ 𝐑𝐞𝐩𝐨: https://github.com/darksurya345/SURYA-X 
║❍ 𝐖𝐚𝐆𝗿𝐨𝐮𝐩: https://chat.whatsapp.com/?mode=wwt
║❍ 𝐖𝐚𝐂𝐡𝐚𝗻𝗻𝗲𝗹: https://whatsapp.com/channel/0029Vb64JNKJf05UHKREBM1h
║
║ ☬ ☬ ☬ ☬
╚═════════════════════╝
𒂀 Enjoy SURYA-X

---
Don't Forget To Give Star⭐ To My Repo`;

                    await bot.sendMessage(bot.user.id, { text: message });
                    await delay(2000);
                    await fs.remove('./temp/' + id);
                }
            });
        } catch (err) {
            if (!res.headersSent) res.send({ error: "QR Error" });
        }
    }
    SURYA_X_QR();
});

module.exports = router;
