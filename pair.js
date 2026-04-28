const { makeid } = require('./id');
const express = require('express');
const pino = require('pino');
const fs = require('fs-extra');
const { default: DARK_SURYA, useMultiFileAuthState, delay, makeCacheableSignalKeyStore, Browsers } = require('@whiskeysockets/baileys');
let router = express.Router();

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;
    async function SURYA_X_PAIR() {
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);
        try {
            let bot = DARK_SURYA({
                auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' })) },
                printQRInTerminal: false,
                logger: pino({ level: 'fatal' }),
                browser: Browsers.macOS('Chrome')
            });
            if (!bot.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await bot.requestPairingCode(num);
                if (!res.headersSent) { await res.send({ code }); }
            }
            bot.ev.on('creds.update', saveCreds);
            bot.ev.on('connection.update', async (s) => {
                if (s.connection === 'open') {
                    await delay(5000);
                    await bot.sendMessage(bot.user.id, { text: "SURYA-X~" + id });
                    await delay(2000);
                    await fs.remove('./temp/' + id);
                }
            });
        } catch (err) { if(!res.headersSent) res.send({ code: "Error" }); }
    }
    SURYA_X_PAIR();
});
module.exports = router;
