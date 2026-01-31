import type { Vendor } from '../types/Vendor';

export interface PaginatedResponse {
  data: Vendor[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

const API_URL = import.meta.env.VITE_API_URL_NODE || 'http://localhost:3000/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = data?.error || data?.message || res.statusText;
    const err = new Error(message);
    (err as any).status = res.status;
    (err as any).body = data;
    throw err;
  }

  return data as T;
}

export const VendorService = {
  getVendors(page = 1, per_page = 10, searchType?: string, searchQuery?: string) {
    const params = new URLSearchParams({
      page: String(page),
      per_page: String(per_page),
    });

    if (searchType && searchQuery) {
      params.append(searchType, searchQuery);
    }

    return request<PaginatedResponse>(`${API_URL}/vendors?${params.toString()}`);
  },

  deleteVendor(id: number) {
    return request<void>(`${API_URL}/vendors/${id}`, {
      method: 'DELETE',
    });
  },

  createVendor(vendor: Vendor) {
    return request<Vendor>(`${API_URL}/vendors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vendor),
    });
  },
};
