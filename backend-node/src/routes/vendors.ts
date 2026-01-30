import { Router, Request, Response } from "express";
import db from "../db/database";
import { Vendor } from "../models/Vendor";

const router = Router();

// GET /vendors - List all vendors
router.get("/", (req: Request, res: Response) => {
  const { page, per_page, name, email } = req.query;

  const pageNum = page ? parseInt(String(page), 10) : NaN;
  const perPageNum = per_page ? parseInt(String(per_page), 10) : NaN;

  const pageVal = Number.isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;
  const perPageVal =
    Number.isNaN(perPageNum) || perPageNum < 1 ? 10 : Math.min(perPageNum, 100);

  // Build WHERE clause for filters
  const filters: string[] = [];
  const params: (string | number)[] = [];

  if (name) {
    filters.push("name LIKE ?");
    params.push(`%${String(name)}%`);
  }

  if (email) {
    filters.push("email LIKE ?");
    params.push(`%${String(email)}%`);
  }

  const whereClause =
    filters.length > 0 ? "WHERE " + filters.join(" AND ") : "";

  db.get(
    `SELECT COUNT(*) as count FROM vendors ${whereClause}`,
    params,
    (err, result: { count: number }) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const total = result.count;
      const totalPages = Math.max(1, Math.ceil(total / perPageVal));
      const offset = (pageVal - 1) * perPageVal;

      db.all(
        `SELECT * FROM vendors ${whereClause} LIMIT ? OFFSET ?`,
        [...params, perPageVal, offset],
        (err2, rows) => {
          if (err2) {
            return res.status(500).json({ error: err2.message });
          }

          return res.json({
            data: rows,
            meta: {
              total,
              page: pageVal,
              per_page: perPageVal,
              total_pages: totalPages,
            },
          });
        },
      );
    },
  );
});

// POST /vendors - Register a new vendor
router.post("/", (req: Request, res: Response) => {
  const { name, contact_person, email, partner_type } = req.body as Vendor;

  if (!name || !contact_person || !email || !partner_type) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (partner_type !== "Supplier" && partner_type !== "Partner") {
    return res
      .status(400)
      .json({ error: 'partner_type must be either "Supplier" or "Partner"' });
  }

  const sql = `INSERT INTO vendors (name, contact_person, email, partner_type) 
                   VALUES (?, ?, ?, ?)`;

  db.run(sql, [name, contact_person, email, partner_type], function (err) {
    if (err) {
      // Handle UNIQUE constraint violation on email
      if (err.message.includes("UNIQUE constraint failed")) {
        return res.status(409).json({ error: "Email already exists" });
      }
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({
      id: this.lastID,
      name,
      contact_person,
      email,
      partner_type,
    });
  });
});

// DELETE /vendors/:id - Delete a vendor by ID
router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Vendor ID is required" });
  }

  const sql = "DELETE FROM vendors WHERE id = ?";

  db.run(sql, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    res.json({ message: "Vendor deleted successfully", id });
  });
});

export default router;
