<template>
  <header
    class="border-b border-primary shadow-sm sticky top-0 navbar-bg z-[200]"
  >
    <div class="flex justify-between px-8 py-4">
      <a href="/" class="flex items-center gap-4" aria-label="Home">
        <img
          src="/assets/icons/maersk.svg"
          alt="Maersk Logo"
          class="maersk-logo"
        />
        <div>
          <div class="company-name">Maersk</div>
          <div class="app-badge">Vendor Portal</div>
        </div>
      </a>
      <!-- Actions -->
      <div class="navbar-actions">
        <button
          type="button"
          class="theme-btn"
          :title="`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`"
          :aria-label="`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`"
          @click="toggleTheme"
        >
          <span class="theme-btn-inner">
            <SunIcon v-if="theme === 'dark'" class="theme-icon" />
            <MoonIcon v-else class="theme-icon" />
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
.navbar {
  position: relative;
  width: 100%;
  flex-shrink: 0;
  min-height: 72px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.navbar-bg {
  background: rgb(var(--color-surface-elevated));
  border-bottom: 1px solid rgb(var(--color-border) / 0.7);
  backdrop-filter: blur(12px);
}

.maersk-logo {
  width: 32px;
  height: 32px;
}

.company-name {
  font-size: 1.4rem;
  font-weight: 800;
  color: rgb(var(--color-text));
  letter-spacing: -0.04em;
  line-height: 1.1;
  font-family: var(--font-sans);
}

.app-badge {
  font-size: 0.75rem;
  font-weight: 700;
  color: rgb(var(--color-primary));
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

/* Center: App Title */
.navbar-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
}

.title-block {
  text-align: center;
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-md);
  background: rgb(var(--color-bg) / 0.4);
  border: 1px solid rgb(var(--color-border) / 0.5);
  box-shadow: 0 1px 4px rgb(0 0 0 / 0.03);
  backdrop-filter: blur(6px);
}

.navbar-title {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: rgb(var(--color-text));
  letter-spacing: -0.02em;
  line-height: 1.25;
  text-shadow: 0 0.5px 1px rgb(0 0 0 / 0.05);
}

.navbar-subtitle {
  margin: 1px 0 0;
  font-size: var(--font-size-xs);
  color: rgb(var(--color-muted));
  font-weight: 500;
}

/* Actions */
.navbar-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
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

.theme-btn-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.theme-icon {
  width: 24px;
  height: 24px;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar-inner {
    padding: var(--space-sm) var(--space-lg);
    gap: var(--space-md);
  }

  .navbar-center {
    display: none;
  }

  .logo-mark {
    width: 44px;
    height: 44px;
  }

  .maersk-logo {
    width: 28px;
    height: 28px;
  }

  .company-name {
    font-size: 1.1rem;
  }

  .app-badge {
    font-size: 0.6rem;
  }

  .theme-btn {
    width: 44px;
    height: 44px;
  }

  .theme-icon {
    width: 20px;
    height: 20px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .navbar-inner {
    padding: var(--space-sm) var(--space-xl);
  }

  .navbar-title {
    font-size: 1.2rem;
  }

  .title-block {
    padding: var(--space-xs) var(--space-sm);
  }
}
</style>
