import random from 'random';
import fs from 'fs'
import path from "path";

const DICT_LOCATION = path.join(path.dirname('..'), 'dictionary')

const DE = "de";
const NOUNS = await readFileIntoArray(path.join(DICT_LOCATION, 'nouns.txt'));
const ADJECTIVES = await readFileIntoArray(path.join(DICT_LOCATION, 'adjectives.txt'));

async function readFileIntoArray(filename: string) {
    return new Promise<string[]>(((resolve, reject) => {
        // Read file
        fs.readFile(filename, (err, data) => {
            if (err) reject(err);
            // Return array
            resolve(data.toString().split("\n"));
        });
    }))
}

export async function generateUrlsForFiles(cdnUrls: string[], expiresAt: number, db: typeof import("./database")) {
    const urls = []
    for (const i in cdnUrls) {
        if (!cdnUrls.hasOwnProperty(i)) continue;
        const cdnUrl = cdnUrls[i]

        let url: string
        let count = 0
        // Generate a random URL until it is unique
        do {
            url = generateUrl()
            if (count++ > 10) {
                // After 10 tries, add an integer to the end
                url += random.int()
            }
        } while (await db.getUrl(url) !== null)

        // Save in database
        await db.addFile(url, cdnUrl, expiresAt)
        urls.push(url)
    }

    return urls

}

function generateUrl() {
    // Insert some 'de'
    let result = de();

    // Insert one or two adjectives
    result += capitalise(randomItem(ADJECTIVES))
    if (random.int(0, 10) > 7) {
        result += capitalise(randomItem(ADJECTIVES))
    }

    // 50% chance to insert some 'de'
    if (random.boolean()) {
        result += de()
    }

    // Insert a random noun
    result += capitalise(randomItem(NOUNS))

    return result
}

function de() {
    // 20% chance to insert multiple 'de'
    let amount = random.int(1, 10) - 7;
    amount = Math.max(1, amount);
    return capitalise(DE).repeat(amount)
}

const capitalise = (s: string) => {return s.charAt(0).toUpperCase() + s.slice(1)}

const randomItem = (a: any[]) => {return a[random.int(0, a.length - 1)]}