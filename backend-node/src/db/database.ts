import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

/* ---------- paths ---------- */
const dataDir = path.resolve(__dirname, "../../data");
fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, process.env.DB_PATH || "vendors.db");

/* ---------- db ---------- */
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("DB connection error:", err.message);
  } else {
    console.log(`SQLite connected → ${dbPath}`);
  }
});

/* ---------- schema ---------- */
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS vendors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      contact_person TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      partner_type TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`CREATE INDEX IF NOT EXISTS idx_vendors_email ON vendors(email)`);
  db.run(
    `CREATE INDEX IF NOT EXISTS idx_vendors_created_at ON vendors(created_at)`,
  );

  /* ---------- seed data ---------- */
  db.get(
    "SELECT COUNT(*) as count FROM vendors",
    (err, result: { count: number }) => {
      if (err) {
        console.error("Error checking vendors count:", err.message);
        return;
      }

      if (result.count > 0) return;

      db.run(`
        INSERT INTO vendors (name, contact_person, email, partner_type) VALUES
        ('Acme Corp', 'John Doe', 'john.doe@acme.com', 'Supplier'),
        ('Globex Inc', 'Jane Smith', 'jane.smith@globex.com', 'Supplier'),
        ('Initech LLC', 'Michael Johnson', 'michael.johnson@initech.com', 'Partner'),
        ('Umbrella Corp', 'Sarah Williams', 'sarah.williams@umbrella.com', 'Partner'),
        ('Stark Industries', 'Tony Stark', 'tony.stark@starkindustries.com', 'Supplier'),
        ('Wayne Enterprises', 'Bruce Wayne', 'bruce.wayne@wayneenterprises.com', 'Partner'),
        ('Wonka Industries', 'Willy Wonka', 'willy.wonka@wonka.com', 'Supplier'),
        ('Hooli', 'Gavin Belson', 'gavin.belson@hooli.com', 'Supplier'),
        ('Soylent Corp', 'Frank Thorn', 'frank.thorn@soylent.com', 'Partner'),
        ('Tyrell Corporation', 'Eldon Tyrell', 'eldon.tyrell@tyrell.com', 'Supplier')
      `);

      console.log("Sample vendor data inserted");
    },
  );
});

export default db;
