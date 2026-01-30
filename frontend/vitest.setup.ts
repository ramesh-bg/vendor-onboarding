import { vi } from "vitest";

const defaultMockFetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: async () => ({
      data: [],
      meta: { total: 0, page: 1, per_page: 10, total_pages: 0 },
    }),
  }),
);

// vitest setup disabled per user request. Tests should stub `globalThis.fetch` individually.

export {};
