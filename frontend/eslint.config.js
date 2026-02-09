import js from '@eslint/js';
import ts from 'typescript-eslint';
import vue from 'eslint-plugin-vue';
import globals from 'globals';
import vueParser from 'vue-eslint-parser';

export default [
  {
    ignores: ['node_modules', 'dist', 'build', 'coverage', '.git'],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ['**/*.{vue,js,jsx,cjs,mjs,ts,tsx,cts,mts}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: vueParser,
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      vue: vue,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      ...Object.fromEntries(Object.keys(vue.rules).map((rule) => [`vue/${rule}`, 'off'])),
    },
  },
];
