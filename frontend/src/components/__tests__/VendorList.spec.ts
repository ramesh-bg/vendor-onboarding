import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import VendorList from "../VendorList.vue";
import { useVendorStore } from "../../stores/vendorStore";

describe("VendorList.vue", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("renders vendor directory title", () => {
    const wrapper = mount(VendorList, {
      global: {
        plugins: [createPinia()],
      },
    });
    expect(wrapper.find("h2").text()).toBe("Vendor Directory");
  });

  it("shows loading state when fetching vendors", async () => {
    const wrapper = mount(VendorList, {
      global: {
        plugins: [createPinia()],
      },
    });

    const store = useVendorStore();
    store.loading = true;
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Loading vendors...");
  });

  it("shows empty state when no vendors exist", async () => {
    const wrapper = mount(VendorList, {
      global: {
        plugins: [createPinia()],
      },
    });

    const store = useVendorStore();
    store.vendors = [];
    store.loading = false;
    store.error = null;
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("No Vendors Yet");
    expect(wrapper.text()).toContain("Start by adding your first vendor");
  });

  it("displays error message when fetch fails", async () => {
    const wrapper = mount(VendorList, {
      global: {
        plugins: [createPinia()],
      },
    });

    const store = useVendorStore();
    store.error = "Failed to load vendors";
    store.loading = false;
    store.vendors = [];
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Failed to load vendors");
  });

  it("displays vendor count badge", async () => {
    const wrapper = mount(VendorList, {
      global: {
        plugins: [createPinia()],
      },
    });

    const store = useVendorStore();
    store.vendors = [
      {
        id: 1,
        name: "Vendor 1",
        contact_person: "John",
        email: "john@example.com",
        partner_type: "Supplier" as const,
      },
      {
        id: 2,
        name: "Vendor 2",
        contact_person: "Jane",
        email: "jane@example.com",
        partner_type: "Partner" as const,
      },
    ];
    store.loading = false;
    store.error = null;
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("2 vendors");
  });

  it("renders vendor table with data", async () => {
    const wrapper = mount(VendorList, {
      global: {
        plugins: [createPinia()],
      },
    });

    const store = useVendorStore();
    store.vendors = [
      {
        id: 1,
        name: "Acme Corp",
        contact_person: "John Doe",
        email: "john@acme.com",
        partner_type: "Supplier" as const,
      },
    ];
    store.loading = false;
    store.error = null;
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Acme Corp");
    expect(wrapper.text()).toContain("John Doe");
    expect(wrapper.text()).toContain("john@acme.com");
    expect(wrapper.text()).toContain("Supplier");
  });

  it("renders multiple vendors in table rows", async () => {
    const wrapper = mount(VendorList, {
      global: {
        plugins: [createPinia()],
      },
    });

    const store = useVendorStore();
    store.vendors = [
      {
        id: 1,
        name: "V1",
        contact_person: "P1",
        email: "v1@example.com",
        partner_type: "Supplier" as const,
      },
      {
        id: 2,
        name: "V2",
        contact_person: "P2",
        email: "v2@example.com",
        partner_type: "Partner" as const,
      },
    ];
    store.loading = false;
    store.error = null;
    await wrapper.vm.$nextTick();

    const rows = wrapper.findAll("tbody tr");
    expect(rows.length).toBe(2);
  });

  it("displays Supplier badge correctly", async () => {
    const wrapper = mount(VendorList, {
      global: {
        plugins: [createPinia()],
      },
    });

    const store = useVendorStore();
    store.vendors = [
      {
        id: 1,
        name: "Vendor 1",
        contact_person: "John",
        email: "john@example.com",
        partner_type: "Supplier" as const,
      },
    ];
    store.loading = false;
    store.error = null;
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Supplier");
  });

  it("displays Partner badge correctly", async () => {
    const wrapper = mount(VendorList, {
      global: {
        plugins: [createPinia()],
      },
    });

    const store = useVendorStore();
    store.vendors = [
      {
        id: 1,
        name: "Vendor 1",
        contact_person: "John",
        email: "john@example.com",
        partner_type: "Partner" as const,
      },
    ];
    store.loading = false;
    store.error = null;
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Partner");
  });
});
