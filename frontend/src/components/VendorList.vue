<template>
  <div :class="[styles.tableContainer, 'vendor-list-card', 'z-10']">
    <div :class="styles.tableHeader">
      <h2 :class="styles.tableTitle">Vendor Directory</h2>
      <div :class="styles.vendorCount" v-if="vendorStore.vendors.length > 0">
        {{ vendorStore.vendors.length }} of {{ vendorStore.total }} vendor<span
          v-if="vendorStore.vendors.length !== 1"
          >s</span
        >
      </div>
    </div>

    <!-- Search Bar -->
    <div class="search-container">
      <div class="search-wrapper">
        <div class="search-field">
          <div class="search-dropdown-wrap">
            <select
              v-model="searchType"
              class="search-dropdown"
              aria-label="Search filter type"
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
            @input="handleSearch"
            aria-label="Search vendors"
          />
          <div
            v-if="vendorStore.loadingFetch && searchQuery"
            class="search-spinner"
          >
            <div class="spinner-small"></div>
          </div>
          <button
            v-if="searchQuery && !vendorStore.loadingFetch"
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
      class="vendor-list-scroll max-h-[600px] overflow-y-auto"
    >
      <table :class="styles.table" role="table">
        <thead>
          <tr>
            <th :class="styles.tableHeadCell">ID</th>
            <th :class="styles.tableHeadCell">Company</th>
            <th :class="styles.tableHeadCell">Name</th>
            <th :class="styles.tableHeadCell">Email</th>
            <th :class="styles.tableHeadCell">Type</th>
            <th :class="styles.tableHeadCell">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="vendorStore.vendors.length === 0" role="row">
            <td :colspan="6" class="no-results-message">
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
          >
            <td data-label="ID" :class="styles.tableCell">
              {{ vendor.id }}
            </td>
            <td data-label="Company" :class="styles.tableCellName">
              {{ vendor.name }}
            </td>
            <td data-label="Name" :class="styles.tableCell">
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
              <div class="text-center w-full">
                <a
                  @click.stop="showDeleteConfirmation(vendor)"
                  :disabled="vendorStore.loadingDelete === vendor.id"
                  aria-label="Delete vendor"
                  class="cursor-pointer text-danger !text-center"
                >
                  <TrashIcon class="w-5 h-5" />
                </a>
              </div>
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
            <td data-label="ID" :class="styles.tableCell">
              <div class="skeleton skeleton-text"></div>
            </td>
            <td data-label="Name" :class="styles.tableCellName">
              <div class="skeleton skeleton-text"></div>
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
          >
            <td :colspan="5" class="no-more-vendors">
              <p>No more vendors to load</p>
            </td>
          </tr>
          <!-- Sentinel element for Intersection Observer -->
          <tr>
            <td :colspan="6">
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
    }
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
  }
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
  margin-top: 2rem;
  text-align: center;
  min-height: 4px;
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
  padding-top: 20px;
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

.search-container {
  width: 100%;
  max-width: 420px;
  padding: var(--space-md) 0;
  margin-bottom: var(--space-md);
}

.search-wrapper {
  display: flex;
  gap: var(--space-sm);
  align-items: center;
}

.search-field {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-md);
  background-color: rgb(var(--color-surface-elevated));
  transition: all 0.2s ease;
  overflow: hidden;
}

.search-field:hover {
  border-color: rgb(var(--color-primary));
}

.search-field:focus-within {
  border-color: rgb(var(--color-primary));
  box-shadow: 0 0 0 2px rgb(var(--color-primary) / 0.1);
}

.search-dropdown-wrap {
  flex-shrink: 0;
  background-color: rgb(var(--color-muted) / 0.25);
  border-right: 1px solid rgb(var(--color-border));
  display: flex;
  align-items: center;
}

.search-dropdown {
  padding: var(--space-sm) var(--space-md);
  padding-right: var(--space-xl);
  margin-right: var(--space-xs);
  border: none;
  background-color: transparent;
  color: rgb(var(--color-text));
  font-size: var(--font-size-sm);
  font-family: inherit;
  cursor: pointer;
}

.search-dropdown:focus {
  outline: none;
}

/* Option list uses theme variables so dark mode has dark bg + light text */
.search-dropdown option {
  background-color: rgb(var(--color-surface-elevated));
  color: rgb(var(--color-text));
}

.search-input {
  flex: 1;
  min-width: 0;
  padding: var(--space-sm) var(--space-md);
  border: none;
  background-color: transparent;
  color: rgb(var(--color-text));
  font-size: var(--font-size-sm);
  transition: all 0.2s ease;
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
  background-color: transparent;
  border: none;
  color: rgb(var(--color-text) / 0.6);
  cursor: pointer;
  font-size: var(--font-size-sm);
  transition: all 0.2s ease;
}

.clear-button:hover {
  color: rgb(var(--color-text));
}

:deep(.tableWrapper) {
  max-height: 600px;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: var(--radius-md);
}

/* Mobile: card + header sticky, only list scrolls */
@media (max-width: 1023px) {
  .vendor-list-card {
    position: sticky;
    top: var(--space-md);
    max-height: calc(100vh - 5rem);
    overflow: hidden;
  }

  .vendor-list-card > div:first-child,
  .vendor-list-card > .search-container {
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
</style>
