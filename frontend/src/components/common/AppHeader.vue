<template>
  <header
    class="border-b border-primary shadow-sm sticky top-0 z-[200] header-bg"
  >
    <div class="flex justify-between px-8 py-4">
      <a href="/" class="flex items-center gap-4" aria-label="Home">
        <img
          src="/assets/icons/maersk.svg"
          alt="Maersk Logo"
          class="w-8 h-8 md:w-7 md:h-7"
        />
        <div>
          <div class="text-base md:text-xl font-extrabold text-text tracking-tight leading-tight">Maersk</div>
          <div class="text-[0.6rem] md:text-xs font-bold text-primary uppercase tracking-widest">Vendor Portal</div>
        </div>
      </a>
      <div class="flex-shrink-0 flex items-center gap-sm">
        <button
          type="button"
          class="theme-btn"
          :title="`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`"
          :aria-label="`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`"
          @click="toggleTheme"
        >
          <span class="flex items-center justify-center w-full h-full relative">
            <SunIcon class="theme-icon w-6 h-6 md:w-5 md:h-5 theme-icon-sun" aria-hidden="true" />
            <MoonIcon class="theme-icon w-6 h-6 md:w-5 md:h-5 theme-icon-moon" aria-hidden="true" />
          </span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useTheme } from "../../composables/useTheme";
import SunIcon from "../icons/SunIcon.vue";
import MoonIcon from "../icons/MoonIcon.vue";

const { theme, toggleTheme } = useTheme();
</script>

<style scoped>
.header-bg {
  background: rgb(var(--color-surface-elevated));
  border-bottom: 1px solid rgb(var(--color-border) / 0.7);
  backdrop-filter: blur(12px);
}

.theme-btn {
  position: relative;
  width: 48px;
  height: 48px;
  padding: 0;
  border: none;
  border-radius: var(--radius-md);
  background: rgb(var(--color-surface));
  color: rgb(var(--color-text-secondary));
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow:
    0 1px 4px rgb(0 0 0 / 0.04),
    inset 0 1px 0 rgb(255 255 255 / 0.2);
  border: 1px solid rgb(var(--color-border) / 0.7);
}

.theme-btn:hover {
  background: rgb(var(--color-primary) / 0.08);
  color: rgb(var(--color-primary));
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgb(var(--color-primary) / 0.1);
}

.theme-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgb(var(--color-primary) / 0.2);
}

.theme-btn:active {
  transform: translateY(0);
}

.theme-icon {
  position: absolute;
  inset: 0;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-icon-sun {
  opacity: 0;
}

.theme-icon-moon {
  opacity: 0;
}

[data-theme="dark"] .theme-icon-sun {
  opacity: 1;
}

[data-theme="light"] .theme-icon-moon {
  opacity: 1;
}

@media (max-width: 768px) {
  .theme-btn {
    width: 44px;
    height: 44px;
  }
}
</style>
