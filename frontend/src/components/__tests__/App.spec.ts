import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import App from "../../App.vue";
import VendorForm from "../VendorForm.vue";
import VendorList from "../VendorList.vue";

describe("App.vue", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("renders app header with title and subtitle", () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia()],
      },
    });
    expect(wrapper.find("h1").text()).toContain("Vendor Onboarding");
    expect(wrapper.text()).toContain("Manage and organize your vendor");
  });

  it("renders both VendorForm and VendorList components", () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia()],
      },
    });
    expect(wrapper.findComponent(VendorForm).exists()).toBe(true);
    expect(wrapper.findComponent(VendorList).exists()).toBe(true);
  });

  it("has a functional theme toggle button", async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia()],
      },
    });
    const themeButton = wrapper.find("button");
    expect(themeButton.exists()).toBe(true);

    await themeButton.trigger("click");
    expect(document.documentElement.getAttribute("data-theme")).toBeDefined();
  });
});
