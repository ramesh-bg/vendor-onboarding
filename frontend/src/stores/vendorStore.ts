import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { VendorService } from "../services/VendorService";
import type { Vendor } from "../types/Vendor";

function extractError(err: any, fallback: string): string {
  return err?.message || err?.body?.error || err?.body?.message || fallback;
}

export const useVendorStore = defineStore("vendor", () => {
  const vendors = ref<Vendor[]>([]);

  const page = ref(1);
  const perPage = ref(10);
  const total = ref(0);
  const totalPages = ref(0);

  const searchType = ref("name");
  const searchQuery = ref("");

  const loadingFetch = ref(false);
  const loadingAdd = ref(false);
  const loadingDelete = ref<number | null>(null);

  const fetchError = ref<string | null>(null);
  const addError = ref<string | null>(null);
  const deleteError = ref<string | null>(null);

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const hasMore = computed(() => page.value < totalPages.value);

  async function fetchVendors(
    pageNum = 1,
    append = false,
    search = { type: searchType.value, query: searchQuery.value },
  ) {
    loadingFetch.value = true;
    fetchError.value = null;

    try {
      const res = await VendorService.getVendors(
        pageNum,
        perPage.value,
        search.type,
        search.query,
      );

      const list = res.data.reverse();
      vendors.value = append ? [...vendors.value, ...list] : list;

      page.value = res.meta.page;
      total.value = res.meta.total;
      totalPages.value = res.meta.total_pages;
    } catch (err) {
      fetchError.value = extractError(
        err,
        "Failed to load vendors. Please try again.",
      );
      throw new Error(fetchError.value);
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
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => performSearch(type, query), 500);
  }

  async function loadMore() {
    if (!hasMore.value || loadingFetch.value) return;
    await fetchVendors(page.value + 1, true);
  }

  async function addVendor(vendor: Vendor) {
    loadingAdd.value = true;
    addError.value = null;

    try {
      return await VendorService.createVendor(vendor);
    } catch (err) {
      const message = extractError(
        err,
        "Failed to add vendor. Please try again.",
      );

      addError.value = message;
      throw new Error(message);
    } finally {
      loadingAdd.value = false;
    }
  }

  async function deleteVendor(id: number) {
    loadingDelete.value = id;
    deleteError.value = null;

    try {
      await VendorService.deleteVendor(id);
      vendors.value = vendors.value.filter((v) => v.id !== id);
      total.value = Math.max(0, total.value - 1);
    } catch (err) {
      const message = extractError(
        err,
        "Failed to delete vendor. Please try again.",
      );

      deleteError.value = message;
      throw new Error(message);
    } finally {
      loadingDelete.value = null;
    }
  }

  return {
    vendors,
    page,
    perPage,
    total,
    totalPages,
    searchType,
    searchQuery,
    hasMore,
    loadingFetch,
    loadingAdd,
    loadingDelete,
    fetchError,
    addError,
    deleteError,
    fetchVendors,
    loadMore,
    addVendor,
    deleteVendor,
    debounceSearch,
    performSearch,
  };
});
