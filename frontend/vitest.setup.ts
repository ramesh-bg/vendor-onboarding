import { vi } from 'vitest';

// vitest setup disabled per user request. Tests should stub `globalThis.fetch` individually.
// Reference mock fetch for future use:
void vi.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: async () => ({
      data: [],
      meta: { total: 0, page: 1, per_page: 10, total_pages: 0 },
    }),
  })
);

export {};
