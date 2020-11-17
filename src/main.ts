import app from "./express.js";
import * as db from "./database.js";

import {sendToCdn} from "./cdn.js";
import {generateUrlsForFiles} from "./url.js";

const PORT = 8000
const FILE_EXPIRE = 7 * 24 * 3600

db.startTimer()

app.post('/upload', async (req, res) => {
    if(!req.files || !req.files.files) {
        res.status(400).send("No files provided");
    } else {
        let data;
        const files = req.files.files

        try {
            // Send files to CDN and get URLs
            data = await sendToCdn(files, FILE_EXPIRE)
        } catch (err) {
            const msg = err.error ? err.error : err
            const code = err.statusCode ? err.statusCode : 500

            console.error(msg)
            return res.status(code).send(msg)
        }

        // Get expire time
        const expiresAt = Date.now() / 1000 + FILE_EXPIRE
        // Generate URLS
        const urls = await generateUrlsForFiles(data, expiresAt, db)

        // send response
        res.send(urls);
    }
})

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`)
})
