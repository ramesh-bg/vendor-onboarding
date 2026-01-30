<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-md z-[1000]"
    >
      <div
        class="bg-surface-elevated p-lg rounded-lg shadow-xl max-w-sm w-full transition-all transform duration-300 ease-out scale-100 opacity-100"
      >
        <h3 class="text-xl font-semibold text-text mb-md">Confirm Deletion</h3>
        <p class="text-text-secondary mb-lg">
          Are you sure you want to delete <span class="font-medium text-primary">{{ itemToConfirm }}</span>?
          This action cannot be undone.
        </p>
        <div class="flex justify-end gap-md">
          <button
            @click="emit('cancel')"
            :class="styles.buttonSecondary"
          >
            Cancel
          </button>
          <button
            @click="emit('confirm')"
            :class="styles.buttonDanger"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useFormStyles } from "../../composables/useFormStyles";

interface Props {
  isOpen: boolean;
  itemToConfirm: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

const styles = useFormStyles();
</script>
