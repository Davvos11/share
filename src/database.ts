import sqlite3 from "sqlite3"
import {open} from 'sqlite'
import path from "path";

sqlite3.verbose();

// Database location
const DB_LOCATION = path.join(path.dirname('..'), 'database.db')
// Interval (in seconds) after which expired links get removed
const REMOVE_TIMER = 3600 * 1000

async function openDb () {
    return open({
        filename: DB_LOCATION,
        driver: sqlite3.Database
    })
}

// Open the database
const db = await openDb()

// Create tables if they do not exist
await db.run("CREATE TABLE IF NOT EXISTS links " +
    "(id TEXT, cdn_url TEXT, expires INTEGER, " +
    "PRIMARY KEY(id))")

// Remove expired links
await removeExpiredLinks()

export function addFile(id: string, cdnUrl: string, expires: number) {
    return db.run("INSERT INTO links(id, cdn_url, expires) VALUES (?,?,?)",
        [id, cdnUrl, expires])
}

export function getUrl(id: string) {
    return db.get("SELECT cdn_url FROM links WHERE id = ?", [id]).then(r => {
        return r.cdn_url
    })
}

/**
 * Remove all links from the database that have expired
 */
function removeExpiredLinks() {
    const timestamp = Date.now() / 1000;
    return db.run("DELETE FROM links WHERE links.expires < ?", [timestamp])
}

export function startTimer() {
    setTimeout(removeExpiredLinks, REMOVE_TIMER)
}