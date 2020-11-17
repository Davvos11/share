import app from "./express.js";
import * as db from "./database.js";

import rp from "request-promise";

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

        // send response (as full urls)
        res.send(urls.map(url => {return `${req.protocol}://${req.get('host')}/${url}`}));
    }
})

app.get('/:id', (async (req, res) => {
    // Get CDN URL
    const url = await db.getUrl(req.params.id)
    // Check if it is not null
    if (url === null) {
        return res.status(404).send(`${req.params.id} not found, it might have expired`)
    }
    const options = {
        method: 'GET',
        uri: String(url)
    }
    rp(options).pipe(res)
}))

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`)
})
