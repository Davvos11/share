import rp from "request-promise";
import {UploadedFile} from "express-fileupload";
import util from 'util'
import fs from 'fs'
import path from 'path'

const CDN_NAME = 'share'
const SECRET_FILE = path.join(path.dirname('..'), 'secret.txt')

const cookieJar = rp.jar()

/**
 * Sends the provided files to the cdn
 * @param files the files
 * @param expires amount of seconds after which the file should expire
 */
export async function sendToCdn(files: UploadedFile | UploadedFile[], expires: number) {
    // Check if we are logged in (i.e. if the user_sid cookie exists)
    if (!cookieJar.getCookies('https://cdn.dovatvis.nl').map(c => c.key).includes("user_sid")) {
        // Log in
        await loginToCdn()
    }

    const options = {
        method: 'POST',
        uri: 'https://cdn.dovatvis.nl/upload',
        formData: {
            files: createFileObjects(files), // Add provided files
            time: expires // Set expiry time
        },
        jar: cookieJar,
        json: true // Automatically stringifies the body to JSON
    };

    // Make request
    return rp(options)
}

async function loginToCdn() {
    let secret: string
    try {
        secret = await getSecret()
    } catch (e) {
        console.error(e)
        throw Error(`Failed to read ${SECRET_FILE}`)
    }

    const options = {
        method: 'POST',
        uri: 'https://cdn.dovatvis.nl/login',
        formData: {
            name: CDN_NAME, // Set application name
            secret // Set secret
        },
        jar: cookieJar
    };

    // Make request
    return rp(options)
}

const readFile = util.promisify(fs.readFile);

async function getSecret() {
    return readFile(SECRET_FILE, 'utf8')
}

function createFileObjects(files: UploadedFile | UploadedFile[]) {
    // Turn single file into array
    if (!(files instanceof Array)) {
        files = [files]
    }

    const result = []
    for (const i in files) {
        if (!files.hasOwnProperty(i)) continue
        const file = files[i]

        // Add new file to result
        result.push({value: file.data, options: {filename: file.name, contentType: file.mimetype}})
    }

    return result
}