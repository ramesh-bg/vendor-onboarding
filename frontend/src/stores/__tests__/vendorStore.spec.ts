import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useVendorStore } from "../../stores/vendorStore";

describe("Vendor Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("initializes with empty vendors array", () => {
    const store = useVendorStore();
    expect(store.vendors).toEqual([]);
  });

  it("initializes with loading as false", () => {
    const store = useVendorStore();
    expect(store.loading).toBe(false);
  });

  it("initializes with error as null", () => {
    const store = useVendorStore();
    expect(store.error).toBeNull();
  });

  it("has fetchVendors action", () => {
    const store = useVendorStore();
    expect(typeof store.fetchVendors).toBe("function");
  });

  it("has addVendor action", () => {
    const store = useVendorStore();
    expect(typeof store.addVendor).toBe("function");
  });

  it("can update vendors manually", () => {
    const store = useVendorStore();
    const mockVendor = {
      id: 1,
      name: "Test Vendor",
      contact_person: "John Doe",
      email: "john@test.com",
      partner_type: "Supplier" as const,
    };

    store.vendors.push(mockVendor);
    expect(store.vendors.length).toBe(1);
    expect(store.vendors[0].name).toBe("Test Vendor");
  });

  it("can update loading state", () => {
    const store = useVendorStore();
    store.loading = true;
    expect(store.loading).toBe(true);

    store.loading = false;
    expect(store.loading).toBe(false);
  });

  it("can update error state", () => {
    const store = useVendorStore();
    store.error = "Test error";
    expect(store.error).toBe("Test error");

    store.error = null;
    expect(store.error).toBeNull();
  });

  it("multiple vendors can be added", () => {
    const store = useVendorStore();

    const vendor1 = {
      id: 1,
      name: "Vendor 1",
      contact_person: "Person 1",
      email: "vendor1@test.com",
      partner_type: "Supplier" as const,
    };

    const vendor2 = {
      id: 2,
      name: "Vendor 2",
      contact_person: "Person 2",
      email: "vendor2@test.com",
      partner_type: "Partner" as const,
    };

    store.vendors.push(vendor1);
    store.vendors.push(vendor2);

    expect(store.vendors.length).toBe(2);
    expect(store.vendors[0].name).toBe("Vendor 1");
    expect(store.vendors[1].name).toBe("Vendor 2");
  });

  it("vendors can be cleared", () => {
    const store = useVendorStore();

    store.vendors.push({
      id: 1,
      name: "Vendor 1",
      contact_person: "Person 1",
      email: "vendor1@test.com",
      partner_type: "Supplier",
    });

    expect(store.vendors.length).toBe(1);

    store.vendors = [];
    expect(store.vendors.length).toBe(0);
  });
});
