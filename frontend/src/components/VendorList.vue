<template>
  <div :class="[styles.tableContainer, 'vendor-list-card', 'z-10']">
    <div class="vendor-list-header">
      <div class="header-top">
        <div class="header-title-wrap">
          <div class="header-icon-wrap">
            <CompanyIcon class="header-icon" aria-hidden="true" />
          </div>
          <div class="header-text">
            <h2 class="header-title">Vendor Directory</h2>
            <p class="header-subtitle">Search and manage your vendors</p>
          </div>
        </div>
        <div
          v-if="vendorStore.vendors.length > 0"
          class="header-count"
          role="status"
        >
          <span class="count-value">{{ vendorStore.vendors.length }}</span>
          <span class="count-sep">/</span>
          <span class="count-total">{{ vendorStore.total }}</span>
          <span class="count-label"
            >vendor{{ vendorStore.total !== 1 ? "s" : "" }}</span
          >
        </div>
      </div>

      <div class="header-search">
        <div class="search-field">
          <div class="search-dropdown-wrap">
            <select
              v-model="searchType"
              class="search-dropdown"
              aria-label="Search filter type"
              @change="handleSearch"
            >
              <option value="name">Company</option>
              <option value="email">Email</option>
            </select>
          </div>

          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            :placeholder="`Search by ${
              searchType === 'email' ? 'email' : 'company name'
            }...`"
            aria-label="Search vendors"
            @input="handleSearch"
          />
          <div
            v-if="vendorStore.loadingFetch && searchQuery"
            class="search-spinner"
          >
            <div class="spinner-small"></div>
          </div>
          <button
            v-if="searchQuery && !vendorStore.loadingFetch"
            type="button"
            @click="clearSearch"
            class="clear-button"
            aria-label="Clear search"
          >
            ✕
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="vendorStore.loadingFetch && vendorStore.vendors.length === 0"
      :class="styles.loadingState"
      role="status"
    >
      <div :class="styles.spinner"></div>
      <p class="text-primary font-medium">Loading vendors...</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="vendorStore.fetchError"
      :class="styles.errorState"
      role="alert"
      aria-live="assertive"
    >
      <ErrorIcon :class="styles.errorIcon" />
      <p>{{ vendorStore.fetchError }}</p>
    </div>

    <!-- Vendor Table -->
    <div
      v-if="!vendorStore.loadingFetch || vendorStore.vendors.length > 0"
      :class="styles.tableWrapper"
      class="vendor-list-scroll max-h-[600px] overflow-y-auto px-0"
    >
      <table :class="styles.table" role="table">
        <thead>
          <tr>
            <th :class="styles.tableHeadCell">Company</th>
            <th :class="styles.tableHeadCell">Name</th>
            <th :class="styles.tableHeadCell">Email</th>
            <th :class="styles.tableHeadCell">Type</th>
            <th :class="styles.tableHeadCell">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="vendorStore.vendors.length === 0" role="row">
            <td :colspan="5" class="no-results-message">
              <p>
                {{
                  searchQuery
                    ? "No vendors found with these search filters"
                    : "No vendors"
                }}
              </p>
            </td>
          </tr>
          <tr
            v-for="(vendor, index) in vendorStore.vendors"
            :key="vendor.id"
            :class="[
              styles.tableBodyRow,
              { [styles.tableBodyRowZebra]: index % 2 === 0 },
            ]"
            role="row"
            tabindex="0"
            class="vendor-row"
          >
            <td
              :class="styles.tableCellName"
              class="company-cell !text-center !py-3 !pl-4 sm:!text-left"
            >
              <div
                class="company-with-avatar flex items-center gap-3 justify-center sm:justify-start"
              >
                <div
                  class="avatar-initials flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
                  :style="{ backgroundColor: getAvatarColor(vendor.name) }"
                  :title="vendor.name"
                >
                  {{ getInitials(vendor.name) }}
                </div>
                <span class="font-semibold text-primary text-base">{{
                  vendor.name
                }}</span>
              </div>
            </td>
            <td data-label="Contact Person" :class="styles.tableCell">
              {{ vendor.contact_person }}
            </td>
            <td data-label="Email" :class="styles.tableCellEmail">
              {{ vendor.email }}
            </td>
            <td data-label="Type" :class="styles.tableCellType">
              <span
                :class="[
                  styles.badge,
                  vendor.partner_type.toLowerCase() === 'supplier'
                    ? styles.badgeSupplier
                    : styles.badgePartner,
                ]"
              >
                {{ vendor.partner_type }}
              </span>
            </td>
            <td data-label="Action" :class="styles.tableCell">
              <a
                @click.stop="showDeleteConfirmation(vendor)"
                :disabled="vendorStore.loadingDelete === vendor.id"
                aria-label="Delete vendor"
                class="cursor-pointer text-danger"
              >
                <TrashIcon class="w-5 h-5" />
              </a>
            </td>
          </tr>

          <!-- Skeleton Loading Rows -->
          <tr
            v-for="index in 5"
            v-show="vendorStore.loadingFetch"
            :key="`skeleton-${index}`"
            :class="[styles.tableBodyRow, { [styles.tableBodyRowZebra]: true }]"
            role="row"
          >
            <td data-label="Company" :class="styles.tableCellName">
              <div class="flex items-center gap-3">
                <div
                  class="skeleton w-10 h-10 rounded-full flex-shrink-0"
                ></div>
                <div class="skeleton skeleton-text flex-1 max-w-[120px]"></div>
              </div>
            </td>
            <td data-label="Contact Person" :class="styles.tableCell">
              <div class="skeleton skeleton-text"></div>
            </td>
            <td data-label="Email" :class="styles.tableCellEmail">
              <div class="skeleton skeleton-text"></div>
            </td>
            <td data-label="Type" :class="styles.tableCellType">
              <div class="skeleton skeleton-badge"></div>
            </td>
            <td data-label="Actions" :class="styles.tableCell">
              <div class="skeleton w-8 h-8 rounded-md"></div>
            </td>
          </tr>

          <!-- No More Vendors Message -->
          <tr
            v-show="
              !vendorStore.hasMore &&
              !vendorStore.loadingFetch &&
              vendorStore.vendors.length > 0
            "
            class="!border-none my-0 p-0"
          >
            <td :colspan="5" class="no-more-vendors">
              <p class="my-2">No more vendors to load</p>
            </td>
          </tr>
          <!-- Sentinel element for Intersection Observer -->
          <tr class="!border-none my-0 p-0 !bg-transparent">
            <td :colspan="5" class="!bg-transparent">
              <div ref="sentinel" class="sentinel"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ConfirmationDialog
      :is-open="confirmationDialogOpen"
      :item-to-confirm="vendorToDelete?.name || ''"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import { useVendorStore } from "../stores/vendorStore";
import { useFormStyles } from "../composables/useFormStyles";
import ErrorIcon from "./icons/ErrorIcon.vue";
import TrashIcon from "./icons/TrashIcon.vue";
import CompanyIcon from "./icons/CompanyIcon.vue";
import ConfirmationDialog from "./common/ConfirmationDialog.vue";
import type { Vendor } from "../types/Vendor";

const vendorStore = useVendorStore();
const styles = useFormStyles();
const sentinel = ref<HTMLElement | null>(null);
const searchType = ref<string>("name");
const searchQuery = ref<string>("");
let observer: IntersectionObserver | null = null;

// Confirmation Dialog State
const confirmationDialogOpen = ref(false);
const vendorToDelete = ref<Vendor | null>(null);

const showDeleteConfirmation = (vendor: Vendor) => {
  vendorToDelete.value = vendor;
  confirmationDialogOpen.value = true;
};

const confirmDelete = async () => {
  if (vendorToDelete.value?.id) {
    await vendorStore.deleteVendor(vendorToDelete.value.id);
    // The store will handle updating the vendors list
  }
  confirmationDialogOpen.value = false;
  vendorToDelete.value = null;
};

const cancelDelete = () => {
  confirmationDialogOpen.value = false;
  vendorToDelete.value = null;
};

const handleSearch = () => {
  vendorStore.debounceSearch(searchType.value, searchQuery.value);
};

const clearSearch = () => {
  searchQuery.value = "";
  vendorStore.debounceSearch(searchType.value, "");
};

/** Get 2-letter initials from company name, e.g. "Acme Corp" → "AC" */
const getInitials = (name: string): string => {
  if (!name?.trim()) return "??";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

/** Generate a stable hue (0–360) from string for avatar background */
const getAvatarColor = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 55%, 42%)`;
};

const initializeObserver = () => {
  if (!sentinel.value) return;

  // Disconnect existing observer if it exists
  if (observer) {
    observer.disconnect();
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (
          entry.isIntersecting &&
          vendorStore.hasMore &&
          !vendorStore.loadingFetch
        ) {
          vendorStore.loadMore();
        }
      });
    },
    {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    },
  );

  observer.observe(sentinel.value);
};

onMounted(() => {
  vendorStore.fetchVendors();
});

// Initialize observer when sentinel element exists
watch(
  () => sentinel.value,
  (newSentinel) => {
    if (newSentinel) {
      initializeObserver();
    }
  },
);

onBeforeUnmount(() => {
  if (observer && sentinel.value) {
    observer.unobserve(sentinel.value);
    observer.disconnect();
  }
});
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.animate-spin {
  animation: spin 0.8s linear infinite;
}

.sentinel {
  min-height: 2px;
  background: transparent;
}

.skeleton {
  background: linear-gradient(
    90deg,
    rgb(var(--color-border)) 0%,
    rgb(var(--color-border) / 0.5) 50%,
    rgb(var(--color-border)) 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
  border-radius: var(--radius-sm);
}

.skeleton-text {
  height: 1rem;
  width: 100%;
}

.skeleton-badge {
  height: 1.5rem;
  width: 80px;
  border-radius: var(--radius-full);
}

.no-more-vendors {
  text-align: center;
  color: rgb(var(--color-text) / 0.6);
  font-size: var(--font-size-sm);
  font-style: italic;
}

@media (max-width: 768px) {
  .no-more-vendors {
    text-align: center;
    color: rgb(var(--color-text) / 0.6);
    font-size: var(--font-size-sm);
    font-style: italic;
    padding-top: 0;
    padding-left: 0;
  }
}

.no-results-message {
  text-align: center;
  color: rgb(var(--color-text) / 0.6);
  font-size: var(--font-size-sm);
  padding: var(--space-lg) var(--space-md);
}

.no-results-message p {
  margin: 0;
}

.vendor-list-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  padding-bottom: var(--space-lg);
  border-bottom: 2px solid rgb(var(--color-primary) / 0.25);
  background: linear-gradient(
    135deg,
    rgb(var(--color-primary) / 0.04) 0%,
    transparent 50%
  );
  margin: calc(var(--space-xl) * -1) calc(var(--space-xl) * -1) 0;
  padding: var(--space-xl);
  padding-bottom: var(--space-lg);
}

.header-top {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-md);
}

.header-title-wrap {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.header-icon-wrap {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background: linear-gradient(
    135deg,
    rgb(var(--color-primary) / 0.2),
    rgb(var(--color-secondary) / 0.15)
  );
  border: 1px solid rgb(var(--color-primary) / 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon {
  width: 26px;
  height: 26px;
  color: rgb(var(--color-primary));
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.header-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: rgb(var(--color-primary));
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.header-subtitle {
  margin: 0;
  font-size: var(--font-size-sm);
  color: rgb(var(--color-muted));
  font-weight: 500;
}

.header-count {
  flex-shrink: 0;
  display: inline-flex;
  align-items: baseline;
  gap: 2px;
  padding: var(--space-sm) var(--space-md);
  background: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: rgb(var(--color-text));
  box-shadow: var(--shadow-sm);
}

.header-count .count-value {
  color: rgb(var(--color-primary));
  font-size: 1rem;
}

.header-count .count-sep {
  color: rgb(var(--color-muted));
  font-weight: 400;
}

.header-count .count-total {
  color: rgb(var(--color-text-secondary));
}

.header-count .count-label {
  margin-left: 4px;
  color: rgb(var(--color-muted));
  font-weight: 500;
}

.header-search {
  width: 100%;
  max-width: 400px;
}

.search-field {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  border: 2px solid rgb(var(--color-border));
  border-radius: var(--radius-lg);
  background: rgb(var(--color-surface));
  transition: all 0.2s ease;
  overflow: hidden;
}

.search-field:hover {
  border-color: rgb(var(--color-primary) / 0.5);
  box-shadow: 0 2px 8px rgb(var(--color-primary) / 0.08);
}

.search-field:focus-within {
  border-color: rgb(var(--color-primary));
  box-shadow: 0 0 0 3px rgb(var(--color-primary) / 0.15);
}

.search-dropdown-wrap {
  flex-shrink: 0;
  background: rgb(var(--color-muted) / 0.2);
  border-right: 1px solid rgb(var(--color-border));
  display: flex;
  align-items: center;
}

.search-dropdown {
  padding: var(--space-sm) var(--space-md);
  padding-right: var(--space-xl);
  margin-right: var(--space-xs);
  border: none;
  background: transparent;
  color: rgb(var(--color-text));
  font-size: var(--font-size-sm);
  font-family: inherit;
  cursor: pointer;
}

.search-dropdown:focus {
  outline: none;
}

.search-dropdown option {
  background: rgb(var(--color-surface-elevated));
  color: rgb(var(--color-text));
}

.search-input {
  flex: 1;
  min-width: 0;
  padding: var(--space-sm) var(--space-md);
  border: none;
  background: transparent;
  color: rgb(var(--color-text));
  font-size: var(--font-size-sm);
}

.search-input:focus {
  outline: none;
}

.search-input::placeholder {
  color: rgb(var(--color-text) / 0.5);
}

.search-spinner {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 0 var(--space-sm);
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgb(var(--color-border));
  border-top-color: rgb(var(--color-primary));
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.clear-button {
  flex-shrink: 0;
  padding: var(--space-xs) var(--space-sm);
  background: transparent;
  border: none;
  color: rgb(var(--color-text) / 0.6);
  cursor: pointer;
  font-size: var(--font-size-sm);
  transition: color 0.2s ease;
}

.clear-button:hover {
  color: rgb(var(--color-text));
}

@media (max-width: 640px) {
  .vendor-list-header {
    margin-left: calc(var(--space-lg) * -1);
    margin-right: calc(var(--space-lg) * -1);
    padding-left: var(--space-lg);
    padding-right: var(--space-lg);
  }

  .header-icon-wrap {
    width: 40px;
    height: 40px;
  }

  .header-icon {
    width: 22px;
    height: 22px;
  }

  .header-title {
    font-size: 1.25rem;
  }
}

/* Mobile: card + header sticky, only list scrolls */
@media (max-width: 1023px) {
  .vendor-list-card {
    position: sticky;
    top: var(--space-md);
    max-height: calc(100vh - 5rem);
  }

  .vendor-list-card > :first-child {
    flex-shrink: 0;
  }

  .vendor-list-scroll {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }
}

@media (max-width: 768px) {
  :deep(table),
  :deep(thead),
  :deep(tbody),
  :deep(th),
  :deep(td),
  :deep(tr) {
    display: block;
    width: 100%;
  }

  :deep(thead) {
    display: none;
  }

  :deep(tr) {
    margin-bottom: var(--space-lg);
    border: 1px solid rgb(var(--color-border));
    border-radius: var(--radius-md);
    padding: var(--space-md);
    background-color: rgb(var(--color-surface-elevated));
  }

  :deep(td) {
    padding: var(--space-sm) 0;
    text-align: right;
    position: relative;
    padding-left: 50%;
    border: none;
  }

  :deep(td.company-cell) {
    padding: var(--space-md);
    padding-left: var(--space-md);
    text-align: center;
    border-bottom: 2px solid rgb(var(--color-border));
    background: linear-gradient(
      to bottom,
      rgb(var(--color-primary) / 0.06),
      transparent
    );
    border-bottom: 1px solid rgb(var(--color-border) / 0.5);
  }

  :deep(td:last-child) {
    border-bottom: none;
  }

  :deep(td::before) {
    content: attr(data-label);
    position: absolute;
    left: var(--space-md);
    font-weight: var(--font-weight-semibold);
    color: rgb(var(--color-text));
    text-transform: uppercase;
    font-size: var(--font-size-xs);
  }

  :deep(.overflow-x-auto) {
    border: none;
  }
}

.vendor-row:nth-child(even) {
  background-color: rgb(var(--color-surface-elevated) / 0.5);
}

.company-with-avatar {
  min-width: 0;
}

.avatar-initials {
  flex-shrink: 0;
  border: 2px solid rgb(var(--color-primary) / 0.2);
}
</style>
