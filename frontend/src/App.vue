<script setup lang="ts">
import { useTheme } from "./composables/useTheme";
import VendorForm from "./components/VendorForm.vue";
import VendorList from "./components/VendorList.vue";

const { theme, toggleTheme } = useTheme();
</script>

<template>
  <div class="max-w-7xl mx-auto p-md min-h-screen flex flex-col">
    <header
      class="flex justify-between items-center p-lg mb-2xl border-b-2 border-primary/20 gap-lg bg-gradient-to-br from-primary/5 to-secondary/5 rounded-t-lg"
    >
      <div class="flex flex-col gap-sm flex-1">
        <div>
          <h1 class="text-2xl text-primary font-bold m-0">Vendor Onboarding</h1>
          <p class="text-sm text-muted m-0 font-normal tracking-widest">
            Manage and organize your vendor
          </p>
        </div>
      </div>
      <button
        @click="toggleTheme"
        class="text-2xl bg-surface border-2 border-primary rounded-lg p-sm cursor-pointer transition-all flex items-center justify-center w-12 h-12 flex-shrink-0 hover:bg-primary/10 hover:scale-110 focus:outline-none focus:shadow-lg"
        :title="`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`"
      >
        {{ theme === "light" ? "🌙" : "☀️" }}
      </button>
    </header>
    <main class="flex-1 flex flex-col my-5">
      <div
        class="grid grid-cols-1 gap-5 auto-rows-max lg:grid-cols-2 lg:gap-2xl lg:items-start"
      >
        <VendorForm />
        <VendorList />
      </div>
    </main>
  </div>
</template>
