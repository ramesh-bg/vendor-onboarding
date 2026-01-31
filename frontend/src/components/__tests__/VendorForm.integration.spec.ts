import { describe, it, expect, beforeEach } from 'vitest';
import VendorForm from '../VendorForm.vue';
import { mountWithPinia, mockVendors, fillVendorForm } from '../../tests/test-utils';

describe('VendorForm.vue - Integration Tests', () => {
  beforeEach(() => {
    // Each test gets a fresh Pinia instance
  });

  it('prevents submission with empty form', () => {
    const wrapper = mountWithPinia(VendorForm);
    const button = wrapper.find('button[type="submit"]');
    expect(button.attributes('disabled')).toBeDefined();
  });

  it('validates email format before submission', async () => {
    const wrapper = mountWithPinia(VendorForm);
    await wrapper.find('#name').setValue('Test Corp');
    await wrapper.find('#contactPerson').setValue('Test Person');
    await wrapper.find('#email').setValue('invalid-email');
    await wrapper.vm.$nextTick();

    const button = wrapper.find('button[type="submit"]');
    expect(button.attributes('disabled')).toBeDefined();
  });

  it('enables submission with valid email format', async () => {
    const wrapper = mountWithPinia(VendorForm);
    await wrapper.find('#name').setValue('Test Corp');
    await wrapper.find('#contactPerson').setValue('Test Person');
    await wrapper.find('#email').setValue('test@example.com');
    await wrapper.vm.$nextTick();

    const button = wrapper.find('button[type="submit"]');
    expect(button.attributes('disabled')).not.toBeDefined();
  });

  it('requires all mandatory fields', async () => {
    const wrapper = mountWithPinia(VendorForm);
    await wrapper.find('#name').setValue('Test Corp');
    await wrapper.vm.$nextTick();

    const button = wrapper.find('button[type="submit"]');
    expect(button.attributes('disabled')).toBeDefined();
  });

  it('fills form completely with vendor data', async () => {
    const wrapper = mountWithPinia(VendorForm);
    await fillVendorForm(wrapper, mockVendors.single);
    await wrapper.vm.$nextTick();

    expect((wrapper.find('#name').element as HTMLInputElement).value).toBe(mockVendors.single.name);
    expect((wrapper.find('#email').element as HTMLInputElement).value).toBe(
      mockVendors.single.email
    );
  });

  it('allows partner type selection', async () => {
    const wrapper = mountWithPinia(VendorForm);
    await wrapper.find('select').setValue('Partner');
    expect((wrapper.find('select').element as HTMLSelectElement).value).toBe('Partner');
  });

  it('renders form with all required fields', () => {
    const wrapper = mountWithPinia(VendorForm);
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.findAll('input').length).toBe(3);
    expect(wrapper.findAll('select').length).toBe(1);
    expect(wrapper.findAll('label').length).toBe(4);
  });

  it('has Supplier as default partner type', () => {
    const wrapper = mountWithPinia(VendorForm);
    const select = wrapper.find('select');
    expect((select.element as HTMLSelectElement).value).toBe('Supplier');
  });
});
