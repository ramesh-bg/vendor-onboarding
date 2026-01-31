<script setup lang="ts">
import VendorForm from './components/VendorForm.vue';
import VendorList from './components/VendorList.vue';
import AppHeader from './components/common/AppHeader.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <div class="flex-1 max-w-[96%] mx-auto py-xl px-lg pb-lg w-full">
      <main class="flex-1 flex flex-col overflow-y-auto">
        <div class="grid grid-cols-1 gap-xl items-start lg:grid-cols-[380px_1fr] lg:gap-2xl">
          <aside>
            <VendorForm />
          </aside>
          <section class="lg:min-w-0" aria-label="Vendor directory">
            <VendorList />
          </section>
        </div>
      </main>
    </div>
  </div>
</template>
