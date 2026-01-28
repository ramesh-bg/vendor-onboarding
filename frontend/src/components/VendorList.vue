<template>
  <div :class="styles.tableContainer">
    <div :class="styles.tableHeader">
      <h2 :class="styles.tableTitle">Vendor Directory</h2>
      <div :class="styles.vendorCount" v-if="vendorStore.vendors.length > 0">
        {{ vendorStore.vendors.length }} vendor<span
          v-if="vendorStore.vendors.length !== 1"
          >s</span
        >
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="vendorStore.loading"
      :class="styles.loadingState"
      role="status"
      aria-live="polite"
    >
      <div :class="styles.spinner"></div>
      <p class="text-primary font-medium">Loading vendors...</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="vendorStore.error"
      :class="styles.errorState"
      role="alert"
      aria-live="assertive"
    >
      <svg
        :class="styles.errorIcon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <p>{{ vendorStore.error }}</p>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="vendorStore.vendors.length === 0"
      :class="styles.emptyState"
      role="status"
    >
      <svg
        :class="styles.emptyIcon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
        <path d="M9 12h6"></path>
      </svg>
      <h3 :class="styles.emptyTitle">No Vendors Yet</h3>
      <p :class="styles.emptyDescription">
        Start by adding your first vendor using the form on the left.
      </p>
    </div>

    <!-- Vendor Table -->
    <div v-else :class="styles.tableWrapper">
      <table :class="styles.table" role="table">
        <thead>
          <tr>
            <th :class="styles.tableHeadCell">ID</th>
            <th :class="styles.tableHeadCell">Name</th>
            <th :class="styles.tableHeadCell">Contact Person</th>
            <th :class="styles.tableHeadCell">Email</th>
            <th :class="styles.tableHeadCell">Type</th>
          </tr>
        </thead>
        <tbody>
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
            <td data-label="Name" :class="styles.tableCellName">
              {{ vendor.name }}
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
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useVendorStore } from "../stores/vendorStore";
import { useFormStyles } from "../composables/useFormStyles";

const vendorStore = useVendorStore();
const styles = useFormStyles();

onMounted(() => {
  vendorStore.fetchVendors();
});
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 0.8s linear infinite;
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
