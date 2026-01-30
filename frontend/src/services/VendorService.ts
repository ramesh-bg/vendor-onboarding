import type { Vendor } from "../types/Vendor";

export interface PaginatedResponse {
  data: Vendor[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

const API_URL =
  import.meta.env.VITE_API_URL_NODE || "http://localhost:3000/api";

export const VendorService = {
  async getVendors(
    page: number = 1,
    per_page: number = 10,
    searchType?: string,
    searchQuery?: string,
  ): Promise<PaginatedResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: per_page.toString(),
      });

      if (searchQuery && searchType) {
        params.append(searchType, searchQuery);
      }

      const response = await fetch(`${API_URL}/vendors?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching vendors:", error);
      throw error;
    }
  },

  async deleteVendor(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/vendors/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting vendor with ID ${id}:`, error);
      throw error;
    }
  },

  async createVendor(vendor: Vendor): Promise<Vendor> {
    try {
      const response = await fetch(`${API_URL}/vendors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vendor),
      });

      // Read response as text first to robustly handle missing/incorrect content-type
      const text = await response.text();
      let data: any = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (parseErr) {
        data = null;
      }

      if (!response.ok) {
        const serverMessage =
          data && (data.error || data.message)
            ? data.error || data.message
            : text ||
              response.statusText ||
              `HTTP error! status: ${response.status}`;
        const err = new Error(String(serverMessage));
        // attach body for callers that want structured data
        (err as any).body = data ?? text;
        (err as any).status = response.status;
        throw err;
      }

      return (data ?? {}) as Vendor;
    } catch (error: any) {
      console.error("Error creating vendor:", error);
      throw error;
    }
  },

  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${API_URL}/vendors/check-email?email=${encodeURIComponent(email)}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  },
};
