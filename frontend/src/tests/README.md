# Test Suite Documentation

## Overview

Comprehensive test coverage for the Vendor Onboarding application using Vitest, @testing-library/vue, and @pinia/testing.

## Test Files

### 1. **App.spec.ts** - Main Application Component

Tests for the root App.vue component.

**Coverage:**

- Main container rendering
- Header with title and subtitle
- VendorForm and VendorList component presence
- Theme toggle button functionality
- Responsive grid layout
- Header styling and gradient

**Run:** `npm run test`

---

### 2. **VendorForm.spec.ts** - Form Component Unit Tests

Unit tests for the VendorForm.vue component.

**Coverage:**

- Form title rendering
- All input fields (name, contactPerson, email)
- Partner type select options
- Form labels
- Submit button
- Form validation (required fields)
- Email format validation
- SVG icons rendering
- Component styling classes

**Key Tests:**

```typescript
// Input validation
it('disables submit button when form is invalid');
it('enables submit button when all fields are valid');

// Email validation
it('shows error message for invalid email');

// Default values
it('has default partner type value');
```

---

### 3. **VendorForm.integration.spec.ts** - Form Integration Tests

Advanced integration tests for form interactions.

**Coverage:**

- Form validation workflows
- Email format validation
- Field interaction and updates
- Form reset functionality
- Partner type selection
- Visual element rendering
- Error and success message display

**Test Groups:**

- **Form Validation:** Email format, required fields
- **Form Interaction:** Field updates, form clearing
- **Partner Type Selection:** Default, changing, options
- **Visual Elements:** Structure, labels, icons, styling
- **Messages:** Error and success displays

---

### 4. **VendorList.spec.ts** - Table Component Tests

Tests for the VendorList.vue component.

**Coverage:**

- Table title rendering
- Loading state display
- Empty state display
- Error state display
- Vendor count badge
- Table header rendering
- Vendor data display
- Multiple vendors rendering
- Badge styling (Supplier/Partner)
- Responsive data attributes
- Container styling

**Key Tests:**

```typescript
// States
it('shows loading state when loading is true');
it('shows empty state when no vendors exist');
it('shows error state when error exists');

// Data Display
it('renders multiple vendors in table');
it('renders correct badge styling for Supplier');
it('renders correct badge styling for Partner');

// UI Elements
it('shows loading spinner');
it('shows empty state icon');
```

---

### 5. **vendorStore.spec.ts** - Pinia Store Tests

Tests for the vendor store state management.

**Coverage:**

- Initial state (empty vendors, loading=false, error=null)
- Actions (fetchVendors, addVendor)
- State mutations
- Multiple vendors management
- Error handling
- Loading state management

**Test Groups:**

- **Initialization:** Default state values
- **Actions:** Function existence
- **State Updates:** Manual vendor updates, loading, error
- **Multiple Operations:** Adding, clearing vendors

---

## Test Utilities - `test-utils.ts`

Helper functions for writing tests efficiently.

### Available Functions

```typescript
// Setup Pinia for tests
setupPinia();

// Mount component with Pinia
mountWithPinia(component, options);

// Mock vendor data
mockVendors.single;
mockVendors.multiple;

// Async utilities
waitForAsync();

// Form helpers
fillVendorForm(wrapper, vendor);
findInputByLabel(wrapper, labelText);
```

### Usage Example

```typescript
import { mountWithPinia, mockVendors, fillVendorForm } from '../tests/test-utils';

describe('VendorForm', () => {
  it('fills and submits form', async () => {
    const wrapper = mountWithPinia(VendorForm);
    await fillVendorForm(wrapper, mockVendors.single);

    const button = wrapper.find('button[type="submit"]');
    expect(button.attributes('disabled')).not.toBeDefined();
  });
});
```

---

## Running Tests

### Run all tests

```bash
npm run test
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Run tests with coverage

```bash
npm run test:coverage
```

### Run specific test file

```bash
npm run test -- VendorForm.spec.ts
```

### Run tests matching pattern

```bash
npm run test -- --grep "Form Validation"
```

---

## Test Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── VendorForm.vue
│   │   ├── VendorList.vue
│   │   └── __tests__/
│   │       ├── App.spec.ts
│   │       ├── VendorForm.spec.ts
│   │       ├── VendorForm.integration.spec.ts
│   │       └── VendorList.spec.ts
│   ├── stores/
│   │   ├── vendorStore.ts
│   │   └── __tests__/
│   │       └── vendorStore.spec.ts
│   └── tests/
│       └── test-utils.ts
├── vitest.config.ts
└── package.json
```

---

## Configuration

### vitest.config.ts

- **Environment:** happy-dom (lightweight DOM implementation)
- **Globals:** True (no need to import describe, it, expect)
- **Include:** All `.spec.ts` and `.test.ts` files
- **Path Alias:** `@` -> `./src`

---

## Testing Best Practices

1. **Use test utilities** - Leverage `test-utils.ts` for common operations
2. **Organize by concern** - Group related tests using `describe` blocks
3. **Clear test names** - Use descriptive names that explain what's being tested
4. **One assertion per test** - Keep tests focused and simple
5. **Setup/teardown** - Use `beforeEach` for consistent test state
6. **Mock dependencies** - Mock Pinia stores and API calls
7. **Test behavior** - Test what users see and do, not implementation details

---

## Coverage Goals

- **App.vue:** 90%+ coverage
- **VendorForm.vue:** 85%+ coverage
- **VendorList.vue:** 85%+ coverage
- **vendorStore.ts:** 95%+ coverage

---

## CI/CD Integration

These tests can be integrated into your CI/CD pipeline:

```yaml
# Example GitHub Actions
- name: Run tests
  run: npm run test

- name: Generate coverage
  run: npm run test:coverage
```

---

## Troubleshooting

### Tests fail with "Cannot find module"

- Ensure all imports use correct relative paths
- Check vitest.config.ts path aliases

### Async tests timeout

- Use `async`/`await` properly
- Call `vm.$nextTick()` for Vue reactivity updates

### Store not updating

- Verify `setActivePinia(createPinia())` is called in `beforeEach`
- Check that tests use `setupPinia()` or `mountWithPinia()`

### Component not rendering

- Verify global plugins are configured in mount options
- Check that Pinia is registered in the test setup

---

## Next Steps

1. Run `npm run test` to execute all tests
2. Run `npm run test:coverage` to see coverage reports
3. Add more tests as new features are developed
4. Maintain >80% code coverage for production quality

---

## References

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Pinia Testing](https://pinia.vuejs.org/cookbook/testing.html)
- [@testing-library/vue](https://github.com/testing-library/vue-testing-library)
