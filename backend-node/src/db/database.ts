import sqlite3 from "sqlite3";
import { Database } from "sqlite3";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create data directory if it doesn't exist
const dataDir = path.resolve(__dirname, "../../data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, process.env.DB_PATH || "vendors.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error connecting to database:", err);
  } else {
    console.log(`Connected to SQLite database at: ${dbPath}`);
  }
});

// Initialize vendors table
db.serialize(() => {
  db.run(`
        CREATE TABLE IF NOT EXISTS vendors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            contact_person TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            partner_type TEXT NOT NULL
        )
    `);

  // Create index on email for faster lookups
  db.run(`CREATE INDEX IF NOT EXISTS idx_vendors_email ON vendors(email)`);

  // Check if data already exists to avoid duplicate inserts on restarts
  db.get(
    "SELECT COUNT(*) as count FROM vendors",
    (err, result: { count: number }) => {
      if (err) {
        console.error("Error checking vendors count:", err);
        return;
      }

      // Only insert sample data if the table is empty
      if (result.count === 0) {
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
  ('Tyrell Corporation', 'Eldon Tyrell', 'eldon.tyrell@tyrell.com', 'Supplier'),
  ('Cyberdyne Systems', 'Miles Dyson', 'miles.dyson@cyberdyne.com', 'Partner'),
  ('Oscorp', 'Norman Osborn', 'norman.osborn@oscorp.com', 'Supplier'),
  ('Aperture Science', 'Cave Johnson', 'cave.johnson@aperture.com', 'Partner'),
  ('Black Mesa', 'Eli Vance', 'eli.vance@blackmesa.com', 'Supplier'),
  ('Blue Sun Corp', 'Atherton Wing', 'atherton.wing@bluesun.com', 'Partner'),
  ('Gringotts Bank', 'Ragnok', 'ragnok@gringotts.com', 'Supplier'),
  ('Monarch Solutions', 'Laura Chen', 'laura.chen@monarch.com', 'Partner'),
  ('Nimbus Tech', 'Arjun Rao', 'arjun.rao@nimbus.com', 'Supplier'),
  ('Zenith Labs', 'Priya Kapoor', 'priya.kapoor@zenithlabs.com', 'Partner'),
    ('Atlas Logistics', 'Robert King', 'robert.king@atlaslogistics.com', 'Supplier'),
  ('Nova Retail', 'Emily Carter', 'emily.carter@novaretail.com', 'Partner'),
  ('Pulse Technologies', 'Daniel Nguyen', 'daniel.nguyen@pulsetech.com', 'Supplier'),
  ('Vertex Solutions', 'Anita Verma', 'anita.verma@vertexsolutions.com', 'Partner'),
  ('Skyline Systems', 'Mark Thompson', 'mark.thompson@skylinesystems.com', 'Supplier'),
  ('BrightPath Consulting', 'Olivia Brown', 'olivia.brown@brightpath.com', 'Partner'),
  ('Ironclad Manufacturing', 'Peter Wilson', 'peter.wilson@ironclad.com', 'Supplier'),
  ('CloudNine Software', 'Rahul Mehta', 'rahul.mehta@cloudnine.com', 'Partner'),
  ('Evergreen Supplies', 'Susan Miller', 'susan.miller@evergreensupplies.com', 'Supplier'),
  ('Quantum Dynamics', 'Alex Turner', 'alex.turner@quantumdynamics.com', 'Partner'),
  ('BlueWave Networks', 'Chris Anderson', 'chris.anderson@bluewave.com', 'Supplier'),
  ('NextGen Analytics', 'Neha Sharma', 'neha.sharma@nextgenanalytics.com', 'Partner'),
  ('RapidRoute Express', 'Jason Lee', 'jason.lee@rapidroute.com', 'Supplier'),
  ('Axiom Enterprises', 'Karthik Iyer', 'karthik.iyer@axiomenterprises.com', 'Partner'),
  ('FusionWorks', 'Megan Clark', 'megan.clark@fusionworks.com', 'Supplier'),
  ('GreenLeaf Organics', 'Daniel Perez', 'daniel.perez@greenleaf.com', 'Partner'),
  ('Orbit Systems', 'Nathan Scott', 'nathan.scott@orbitsystems.com', 'Supplier'),
  ('Silverline Solutions', 'Pooja Nair', 'pooja.nair@silverline.com', 'Partner'),
  ('CoreBridge Tech', 'Steven Hall', 'steven.hall@corebridge.com', 'Supplier'),
  ('Orion Systems', 'David Miller', 'david.miller@orionsystems.com', 'Supplier');
`);

        console.log("Sample vendor data inserted");
      }
    },
  );
});

export default db;
