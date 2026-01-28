import { createPinia, setActivePinia } from "pinia";
import { mount } from "@vue/test-utils";
import type { ComponentMountingOptions } from "@vue/test-utils";

/**
 * Setup Pinia for tests
 */
export function setupPinia() {
  const pinia = createPinia();
  setActivePinia(pinia);
  return pinia;
}

/**
 * Mount a component with Pinia already configured
 */
export function mountWithPinia<T>(
  component: any,
  options: ComponentMountingOptions<T> = {},
) {
  const pinia = setupPinia();

  return mount(component, {
    global: {
      plugins: [pinia],
      ...options.global,
    },
    ...options,
  });
}

/**
 * Create mock vendor data for testing
 */
export const mockVendors = {
  single: {
    id: 1,
    name: "Acme Corporation",
    contact_person: "John Doe",
    email: "john@acme.com",
    partner_type: "Supplier",
  },

  multiple: [
    {
      id: 1,
      name: "Acme Corporation",
      contact_person: "John Doe",
      email: "john@acme.com",
      partner_type: "Supplier",
    },
    {
      id: 2,
      name: "Global Partners Inc",
      contact_person: "Jane Smith",
      email: "jane@globalpartners.com",
      partner_type: "Partner",
    },
    {
      id: 3,
      name: "Tech Suppliers Ltd",
      contact_person: "Mike Johnson",
      email: "mike@techsuppliers.com",
      partner_type: "Supplier",
    },
  ],
};

/**
 * Wait for async operations
 */
export async function waitForAsync() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Find input by label text
 */
export function findInputByLabel(wrapper: any, labelText: string) {
  const label = wrapper
    .findAll("label")
    .find((el: any) => el.text().includes(labelText));

  if (!label) return null;

  const forId = label.attributes("for");
  return wrapper.find(`#${forId}`);
}

/**
 * Fill form with vendor data
 */
export async function fillVendorForm(wrapper: any, vendor: any) {
  await wrapper.find("#name").setValue(vendor.name);
  await wrapper.find("#contactPerson").setValue(vendor.contact_person);
  await wrapper.find("#email").setValue(vendor.email);
  await wrapper.find("select").setValue(vendor.partner_type);
}
