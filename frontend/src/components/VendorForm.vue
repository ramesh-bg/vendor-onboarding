<template>
  <div :class="styles.formContainer" class="vendor-form-card z-[100]">
    <h2 :class="styles.formHeader">Add New Vendor</h2>
    <form @submit.prevent="submitForm" :class="styles.formGroupContainer">
      <div :class="styles.formGroup">
        <label for="name" :class="styles.label"
          >Name<span
            v-if="!fieldConfig.name.required"
            :class="styles.optionalLabel"
          >
            (optional)</span
          >:</label
        >
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
            :required="fieldConfig.name.required"
            placeholder="Company name"
            :class="[
              styles.inputWithIcon,
              touched.name && getFieldError('name') && styles.inputError,
            ]"
            @blur="markTouched('name')"
          />
        </div>
        <div :class="styles.fieldErrorSlot">
          <p
            v-if="touched.name && getFieldError('name')"
            :class="styles.fieldError"
          >
            {{ getFieldError("name") }}
          </p>
        </div>
      </div>

      <div :class="styles.formGroup">
        <label for="contactPerson" :class="styles.label">Contact Person</label>
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
            :required="fieldConfig.contact_person.required"
            placeholder="Contact person name"
            :class="[
              styles.inputWithIcon,
              touched.contact_person &&
                getFieldError('contact_person') &&
                styles.inputError,
            ]"
            @blur="markTouched('contact_person')"
          />
        </div>
        <div :class="styles.fieldErrorSlot">
          <p
            v-if="touched.contact_person && getFieldError('contact_person')"
            :class="styles.fieldError"
          >
            {{ getFieldError("contact_person") }}
          </p>
        </div>
      </div>

      <div :class="styles.formGroup">
        <label for="email" :class="styles.label"
          >Email<span
            v-if="!fieldConfig.email.required"
            :class="styles.optionalLabel"
          >
            (optional)</span
          >:</label
        >
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
            :required="fieldConfig.email.required"
            placeholder="contact@example.com"
            :class="[
              styles.inputWithIcon,
              touched.email && getFieldError('email') && styles.inputError,
            ]"
            @blur="markTouched('email')"
          />
        </div>
        <div :class="styles.fieldErrorSlot">
          <p
            v-if="touched.email && getFieldError('email')"
            :class="styles.fieldError"
          >
            {{ getFieldError("email") }}
          </p>
        </div>
      </div>

      <div :class="styles.formGroup">
        <label for="partnerType" :class="styles.label"
          >Partner Type<span
            v-if="!fieldConfig.partner_type.required"
            :class="styles.optionalLabel"
          >
            (optional)</span
          >:</label
        >
        <select
          id="partnerType"
          v-model="form.partner_type"
          :required="fieldConfig.partner_type.required"
          :class="[
            styles.selectField,
            touched.partner_type &&
              getFieldError('partner_type') &&
              styles.inputError,
          ]"
          @blur="markTouched('partner_type')"
        >
          <option value="Supplier">Supplier</option>
          <option value="Partner">Partner</option>
        </select>
        <div :class="styles.fieldErrorSlot">
          <p
            v-if="touched.partner_type && getFieldError('partner_type')"
            :class="styles.fieldError"
          >
            {{ getFieldError("partner_type") }}
          </p>
        </div>
      </div>

      <div :class="styles.formGroupContainer">
        <button
          type="submit"
          :disabled="vendorStore.loadingAdd || isSubmitting || !isFormValid"
          :class="styles.buttonBase"
        >
          {{
            vendorStore.loadingAdd || isSubmitting
              ? "Submitting..."
              : "Add Vendor"
          }}
        </button>
        <div v-if="formValidationError" :class="styles.errorMessage">
          {{ formValidationError }}
        </div>
        <div v-if="vendorStore.addError" :class="styles.errorMessage">
          {{ vendorStore.addError }}
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

type FormFieldKey = "name" | "contact_person" | "email" | "partner_type";

// Single source of truth for required/optional (like Angular validators)
const fieldConfig: Record<FormFieldKey, { required: boolean }> = {
  name: { required: true },
  contact_person: { required: true },
  email: { required: true },
  partner_type: { required: true },
};

const touched = reactive<Record<FormFieldKey, boolean>>({
  name: false,
  contact_person: false,
  email: false,
  partner_type: false,
});

const success = ref(false);
const isSubmitting = ref(false);
const formValidationError = ref("");

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const markTouched = (field: FormFieldKey) => {
  touched[field] = true;
};

// Per-field error from config (reactive to form + fieldConfig)
function getFieldError(field: FormFieldKey): string {
  switch (field) {
    case "name":
      if (fieldConfig.name.required && !form.name.trim())
        return "Name is required.";
      return "";
    case "contact_person":
      if (fieldConfig.contact_person.required && !form.contact_person.trim())
        return "Contact person is required.";
      return "";
    case "email":
      if (fieldConfig.email.required && !form.email.trim())
        return "Email is required.";
      if (form.email.trim() && !isValidEmail(form.email))
        return "Please enter a valid email address.";
      return "";
    case "partner_type":
      if (fieldConfig.partner_type.required && !form.partner_type)
        return "Partner type is required.";
      return "";
  }
}

// Form valid when all required fields pass + email format when present
const isFormValid = computed(() => {
  if (fieldConfig.name.required && !form.name.trim()) return false;
  if (fieldConfig.contact_person.required && !form.contact_person.trim())
    return false;
  if (fieldConfig.email.required && !form.email.trim()) return false;
  if (form.email.trim() && !isValidEmail(form.email)) return false;
  if (fieldConfig.partner_type.required && !form.partner_type) return false;
  return true;
});

const resetForm = () => {
  form.name = "";
  form.contact_person = "";
  form.email = "";
  form.partner_type = "Supplier";
  formValidationError.value = "";
  touched.name = false;
  touched.contact_person = false;
  touched.email = false;
  touched.partner_type = false;
};

const submitForm = async () => {
  // Prevent multiple submissions
  if (isSubmitting.value) {
    return;
  }

  formValidationError.value = "";
  success.value = false;

  // Mark all fields touched so per-field errors show on submit
  touched.name = true;
  touched.contact_person = true;
  touched.email = true;
  touched.partner_type = true;

  // Validate form fields (per-field errors are shown via touched + computed errors)
  if (!isFormValid.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    const created = await vendorStore.addVendor({ ...form });
    // Update the list locally in the component (store stays agnostic)
    if (created) {
      vendorStore.vendors.unshift(created);
      if (typeof vendorStore.total === "number") {
        vendorStore.total = vendorStore.total + 1;
      }
    }

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

@media (max-width: 1023px) {
  .vendor-form-card {
    position: static;
  }
}
</style>
