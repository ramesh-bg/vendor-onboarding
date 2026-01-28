<template>
  <div :class="styles.formContainer">
    <h2 :class="styles.formHeader">Add New Vendor</h2>
    <form @submit.prevent="submitForm" :class="styles.formGroupContainer">
      <div :class="styles.formGroup">
        <label for="name" :class="styles.label">Name:</label>
        <div :class="styles.inputWrapper">
          <svg
            :class="styles.inputIcon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            placeholder="Company name"
            :class="styles.inputWithIcon"
          />
        </div>
      </div>

      <div :class="styles.formGroup">
        <label for="contactPerson" :class="styles.label">Contact Person:</label>
        <div :class="styles.inputWrapper">
          <svg
            :class="styles.inputIcon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <input
            id="contactPerson"
            v-model="form.contact_person"
            type="text"
            required
            placeholder="Contact person name"
            :class="styles.inputWithIcon"
          />
        </div>
      </div>

      <div :class="styles.formGroup">
        <label for="email" :class="styles.label">Email:</label>
        <div :class="styles.inputWrapper">
          <svg
            :class="styles.inputIcon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <rect x="2" y="4" width="20" height="16" rx="2"></rect>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
          </svg>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            placeholder="contact@example.com"
            :class="styles.inputWithIcon"
          />
        </div>
      </div>

      <div :class="styles.formGroup">
        <label for="partnerType" :class="styles.label">Partner Type:</label>
        <select
          id="partnerType"
          v-model="form.partner_type"
          required
          :class="styles.selectField"
        >
          <option value="Supplier">Supplier</option>
          <option value="Partner">Partner</option>
        </select>
      </div>

      <div :class="styles.formGroupContainer">
        <button
          type="submit"
          :disabled="vendorStore.loading || isSubmitting || !isFormValid"
          :class="styles.buttonBase"
        >
          {{
            vendorStore.loading || isSubmitting ? "Submitting..." : "Add Vendor"
          }}
        </button>
        <div v-if="formValidationError" :class="styles.errorMessage">
          {{ formValidationError }}
        </div>
        <div v-if="vendorStore.error" :class="styles.errorMessage">
          {{ vendorStore.error }}
        </div>
        <div v-if="success" :class="styles.successMessage">
          Vendor added successfully!
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import { useVendorStore } from "../stores/vendorStore";
import { useFormStyles } from "../composables/useFormStyles";
import type { Vendor } from "../types/Vendor";

const vendorStore = useVendorStore();
const styles = useFormStyles();

const form = reactive<Vendor>({
  name: "",
  contact_person: "",
  email: "",
  partner_type: "Supplier",
});

const success = ref(false);
const isSubmitting = ref(false);
const formValidationError = ref("");

// Validate form fields
const isFormValid = computed(() => {
  return (
    form.name.trim() !== "" &&
    form.contact_person.trim() !== "" &&
    form.email.trim() !== "" &&
    isValidEmail(form.email)
  );
});

// Validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const resetForm = () => {
  form.name = "";
  form.contact_person = "";
  form.email = "";
  form.partner_type = "Supplier";
  formValidationError.value = "";
};

const submitForm = async () => {
  // Prevent multiple submissions
  if (isSubmitting.value) {
    return;
  }

  formValidationError.value = "";
  success.value = false;

  // Validate form fields
  if (!form.name.trim()) {
    formValidationError.value = "Please enter a vendor name";
    return;
  }

  if (!form.contact_person.trim()) {
    formValidationError.value = "Please enter a contact person name";
    return;
  }

  if (!form.email.trim()) {
    formValidationError.value = "Please enter an email address";
    return;
  }

  if (!isValidEmail(form.email)) {
    formValidationError.value = "Please enter a valid email address";
    return;
  }

  isSubmitting.value = true;

  try {
    await vendorStore.addVendor({ ...form });
    success.value = true;

    // Reset the form after successful submission
    setTimeout(() => {
      resetForm();
      success.value = false;
    }, 2000);
  } catch (err) {
    // Error is already handled in the store
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slideIn {
  animation: slideIn 0.3s ease;
}

.bg-select {
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 20px;
}

@media (max-width: 1024px) {
  :deep(.sticky) {
    position: static;
    top: auto;
  }
}
</style>
