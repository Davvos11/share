import random from 'random';
import fs from 'fs'
import path from "path";

const DICT_LOCATION = path.join(path.dirname('..'), 'dictionary')

const DE = "de";
const NICE = "nice"
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
    let result = de(0.01);

    // Insert one, two or three adjectives
    result += adjectives()

    // 50% chance to insert some 'de'
    if (random.boolean()) {
        result += de(0.05)
    }

    // Insert a random noun
    result += capitalise(randomItem(NOUNS))

    return result
}

function de(multiChance: number) {
    let result = capitalise(DE)
    // chance to insert multiple 'de'
    const multiply = random.float(0, 1) < multiChance;
    if (multiply) {
        result += de(multiChance*0.9)
    }
    return result
}

function adjectives() {
    let result = capitalise(getAdjective())
    if (random.float(0, 1) < 0.2) {
        if (random.float(0, 1) < 0.5) result += DE
        result += capitalise(getAdjective(0.5))
        if (random.float(0, 1) < 0.3) {
            result += capitalise(getAdjective(0.1))
        }
    }

    return result
}

function getAdjective(niceChance: number = 0.4) {
    return (random.float(0, 1) < niceChance) ? NICE : randomItem(ADJECTIVES)
}

const capitalise = (s: string) => {return s.charAt(0).toUpperCase() + s.slice(1)}

const randomItem = (a: any[]) => {return a[random.int(0, a.length - 1)]}