import type { Vendor } from "../types/Vendor";

const API_URL =
  import.meta.env.VITE_API_URL_NODE || "http://localhost:3000/api";
export const VendorService = {
  async getVendors(): Promise<Vendor[]> {
    try {
      const response = await fetch(`${API_URL}/vendors`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching vendors:", error);
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error("Error creating vendor:", error);
      throw error;
    }
  },

  async deleteVendor(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/vendors/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting vendor:", error);
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
