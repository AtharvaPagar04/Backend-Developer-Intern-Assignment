// @ts-check

import globals from 'globals';
import js from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
      curly: 'error',
      'no-multiple-empty-lines': ['warn', { max: 1 }],
    },
  },
  {
    // Relax rules inside test files
    files: ['tests/**/*.js'],
    languageOptions: {
      globals: { ...globals.jest },
    },
    rules: {
      'no-unused-vars': 'off',
    },
  },
];
