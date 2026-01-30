import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { VendorService } from "../services/VendorService";
import type { Vendor } from "../types/Vendor";

export const useVendorStore = defineStore("vendor", () => {
  const vendors = ref<Vendor[]>([]);
  const loadingFetch = ref(false);
  const loadingAdd = ref(false);
  const loadingDelete = ref<number | null>(null); // Track ID of vendor being deleted
  const fetchError = ref<string | null>(null);
  const addError = ref<string | null>(null);
  const deleteError = ref<string | null>(null);
  const page = ref(1);
  const perPage = ref(10);
  const total = ref(0);
  const totalPages = ref(0);
  const searchType = ref<string>("name");
  const searchQuery = ref<string>("");
  const hasMore = computed(() => page.value < totalPages.value);
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  async function fetchVendors(
    pageNum: number = 1,
    append: boolean = false,
    search?: { type: string; query: string },
  ) {
    loadingFetch.value = true;
    fetchError.value = null;

    try {
      const response = await VendorService.getVendors(
        pageNum,
        perPage.value,
        search?.type,
        search?.query,
      );
      const newVendors = response.data.reverse();

      if (append) {
        vendors.value.push(...newVendors);
      } else {
        vendors.value = newVendors;
      }

      page.value = response.meta.page;
      total.value = response.meta.total;
      totalPages.value = response.meta.total_pages;
    } catch (err: any) {
      fetchError.value =
        err?.error || "Failed to load vendors. Please try again later.";
      console.error(err);
    } finally {
      loadingFetch.value = false;
    }
  }

  function performSearch(type: string, query: string) {
    searchType.value = type;
    searchQuery.value = query;
    page.value = 1;
    fetchVendors(1, false, { type, query });
  }

  function debounceSearch(type: string, query: string) {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
      performSearch(type, query);
    }, 500);
  }

  async function loadMore() {
    if (hasMore.value && !loadingFetch.value) {
      await fetchVendors(page.value + 1, true, {
        type: searchType.value,
        query: searchQuery.value,
      });
    }
  }

  async function addVendor(vendor: Vendor) {
    loadingAdd.value = true;
    addError.value = null;

    try {
      const res = await VendorService.createVendor(vendor);
      return res;
    } catch (err: any) {
      addError.value =
        err?.error || "Failed to add vendor. Please try again later.";
      console.error(err);
    } finally {
      loadingAdd.value = false;
    }
  }

  async function deleteVendor(id: number) {
    loadingDelete.value = id;
    deleteError.value = null;

    try {
      await VendorService.deleteVendor(id);
      vendors.value = vendors.value.filter((vendor) => vendor.id !== id);
      if (typeof total.value === 'number') {
        total.value--;
      }
    } catch (err: any) {
      deleteError.value =
        err?.error || "Failed to delete vendor. Please try again later.";
      console.error(err);
    } finally {
      loadingDelete.value = null;
    }
  }

  return {
    vendors,
    loadingFetch,
    loadingAdd,
    loadingDelete,
    fetchError,
    addError,
    deleteError,
    page,
    perPage,
    total,
    totalPages,
    searchType,
    searchQuery,
    hasMore,
    fetchVendors,
    loadMore,
    addVendor,
    deleteVendor,
    debounceSearch,
    performSearch,
  };
});
