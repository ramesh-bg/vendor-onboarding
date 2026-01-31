import { Router, Request, Response } from 'express';
import db from '../db/database';
import type { Vendor } from '../models/Vendor';

const router = Router();

const parseIntSafe = (v: any, def: number) => {
  const n = parseInt(v, 10);
  return Number.isNaN(n) || n < 1 ? def : n;
};

router.get('/', (req: Request, res: Response) => {
  const { page = 1, per_page = 10, name, email, sort = 'latest' } = req.query;

  const pageVal = parseIntSafe(page, 1);
  const perPageVal = Math.min(parseIntSafe(per_page, 10), 100);
  const offset = (pageVal - 1) * perPageVal;

  const filters: string[] = [];
  const params: (string | number)[] = [];

  if (name) {
    filters.push('name LIKE ?');
    params.push(`%${name}%`);
  }

  if (email) {
    filters.push('email LIKE ?');
    params.push(`%${email}%`);
  }

  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const orderBy = sort === 'oldest' ? 'ORDER BY created_at ASC' : 'ORDER BY created_at DESC';

  db.get(
    `SELECT COUNT(*) as count FROM vendors ${where}`,
    params,
    (err, countRow: { count: number }) => {
      if (err) return res.status(500).json({ error: err.message });

      db.all(
        `SELECT * FROM vendors ${where} ${orderBy} LIMIT ? OFFSET ?`,
        [...params, perPageVal, offset],
        (err2, rows) => {
          if (err2) return res.status(500).json({ error: err2.message });

          res.json({
            data: rows,
            meta: {
              total: countRow.count,
              page: pageVal,
              per_page: perPageVal,
              total_pages: Math.max(1, Math.ceil(countRow.count / perPageVal)),
            },
          });
        }
      );
    }
  );
});

router.post('/', (req: Request, res: Response) => {
  const { name, contact_person, email, partner_type } = req.body as Vendor;

  if (!name || !contact_person || !email || !partner_type) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!['Supplier', 'Partner'].includes(partner_type)) {
    return res.status(400).json({ error: 'partner_type must be "Supplier" or "Partner"' });
  }

  const sql = `
    INSERT INTO vendors (name, contact_person, email, partner_type)
    VALUES (?, ?, ?, ?)
  `;

  db.run(sql, [name, contact_person, email, partner_type], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint')) {
        return res.status(409).json({ error: 'Email already exists' });
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

/* ---------- DELETE /vendors/:id ---------- */
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  db.run('DELETE FROM vendors WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (!this.changes) return res.status(404).json({ error: 'Vendor not found' });

    res.json({ message: 'Vendor deleted successfully', id });
  });
});

export default router;
