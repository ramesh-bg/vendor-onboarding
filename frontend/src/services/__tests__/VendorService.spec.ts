import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VendorService } from '../../services/VendorService';

describe('VendorService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw error on failed fetch', async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    vi.stubGlobal('fetch', mockFetch);

    await expect(async () => {
      await VendorService.getVendors(1, 10);
    }).rejects.toThrow();
  });
});
