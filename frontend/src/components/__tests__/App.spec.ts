import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import App from '../../App.vue';
import VendorForm from '../VendorForm.vue';
import VendorList from '../VendorList.vue';
import { useVendorStore } from '../../stores/vendorStore';

describe('App.vue', () => {
  const pinia = createPinia();

  beforeEach(() => {
    setActivePinia(pinia);
    const store = useVendorStore();
    store.fetchVendors = vi.fn();
  });

  it('renders app header with title and subtitle', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [pinia],
      },
    });
    expect(wrapper.text()).toContain('Maersk');
    expect(wrapper.text()).toContain('Vendor Portal');
  });

  it('renders both VendorForm and VendorList components', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [pinia],
      },
    });
    expect(wrapper.findComponent(VendorForm).exists()).toBe(true);
    expect(wrapper.findComponent(VendorList).exists()).toBe(true);
  });

  it('has a functional theme toggle button', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [pinia],
      },
    });
    const themeButton = wrapper.find('button');
    expect(themeButton.exists()).toBe(true);

    await themeButton.trigger('click');
    expect(document.documentElement.getAttribute('data-theme')).toBeDefined();
  });
});
