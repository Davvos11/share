import sqlite3 from "sqlite3"
import {open} from 'sqlite'

sqlite3.verbose();

async function openDb () {
    return open({
        filename: '../database.db',
        driver: sqlite3.Database
    })
}

// Open the database
const db = await openDb()

// Create tables if they do not exist
await db.run("CREATE TABLE IF NOT EXISTS links " +
    "(id TEXT, cdn_url TEXT, expires INTEGER, " +
    "PRIMARY KEY(id))")

export function addFile(id: string, cdnUrl: string, expires: number) {
    return db.run("INSERT INTO links(id, cdn_url, expires) VALUES (?,?,?)",
        [id, cdnUrl, expires])
}

export function getUrl(id: string) {
    return db.get("SELECT cdn_url FROM links WHERE id = ?", [id]).then(r => {
        return r.cdn_url
    })
}

