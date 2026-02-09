import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import VendorForm from '../VendorForm.vue';

describe('VendorForm.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders form with title and all required fields', () => {
    const wrapper = mount(VendorForm, {
      global: {
        plugins: [createPinia()],
      },
    });
    expect(wrapper.find('h2').text()).toBe('Add New Vendor');
    expect(wrapper.findAll('input').length).toBe(3); // name, contactPerson, email
    expect(wrapper.findAll('select').length).toBe(1); // partner type
    expect(wrapper.findAll('label').length).toBe(4);
  });

  it('disables submit button when form is empty', () => {
    const wrapper = mount(VendorForm, {
      global: {
        plugins: [createPinia()],
      },
    });
    const button = wrapper.find('button[type="submit"]');
    expect(button.attributes('disabled')).toBeDefined();
  });

  it('enables submit button when all fields are valid', async () => {
    const wrapper = mount(VendorForm, {
      global: {
        plugins: [createPinia()],
      },
    });

    await wrapper.find('#name').setValue('Acme Corp');
    await wrapper.find('#contactPerson').setValue('John Doe');
    await wrapper.find('#email').setValue('john@acme.com');
    await wrapper.vm.$nextTick();

    const button = wrapper.find('button[type="submit"]');
    expect(button.attributes('disabled')).not.toBeDefined();
  });

  it('validates email format', async () => {
    const wrapper = mount(VendorForm, {
      global: {
        plugins: [createPinia()],
      },
    });

    await wrapper.find('#name').setValue('Acme Corp');
    await wrapper.find('#contactPerson').setValue('John Doe');
    await wrapper.find('#email').setValue('invalid-email');
    await wrapper.vm.$nextTick();

    const button = wrapper.find('button[type="submit"]');
    expect(button.attributes('disabled')).toBeDefined();
  });

  it('has Supplier as default partner type', () => {
    const wrapper = mount(VendorForm, {
      global: {
        plugins: [createPinia()],
      },
    });
    const select = wrapper.find('select');
    expect((select.element as HTMLSelectElement).value).toBe('Supplier');
  });

  it('allows changing partner type', async () => {
    const wrapper = mount(VendorForm, {
      global: {
        plugins: [createPinia()],
      },
    });

    await wrapper.find('select').setValue('Partner');
    expect((wrapper.find('select').element as HTMLSelectElement).value).toBe('Partner');
  });
});
