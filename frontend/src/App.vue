<script setup lang="ts">
import VendorForm from "./components/VendorForm.vue";
import VendorList from "./components/VendorList.vue";
import AppHeader from "./components/common/AppHeader.vue";
</script>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-root {
  flex: 1;
  max-width: 96%;
  margin: 0 auto;
  padding: var(--space-xl) var(--space-lg) var(--space-lg);
  width: 100%;
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.app-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-xl);
  align-items: start;
}

@media (min-width: 1024px) {
  .app-grid {
    grid-template-columns: 380px 1fr;
    gap: var(--space-2xl);
  }

  .app-list-col {
    min-width: 0;
  }
}
</style>

<template>
  <div class="app-wrapper">
    <AppHeader />
    <div class="app-root">
      <main class="app-main">
        <div class="app-grid">
          <aside class="app-form-col">
            <VendorForm />
          </aside>
          <section class="app-list-col" aria-label="Vendor directory">
            <VendorList />
          </section>
        </div>
      </main>
    </div>
  </div>
</template>
