// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';

export default [
  {
    ignores: ['dist/**', '.astro/**', 'node_modules/**', '.netlify/**'],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,

  {
    files: ['**/*.astro'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: { ...globals.browser },
    },
    rules: {
      // Frontmatter is parsed as TypeScript but ESLint does not track the TS
      // global/type namespaces there (`HTMLElementTagNameMap` et al). Real
      // undefined references are still caught by `astro check`.
      'no-undef': 'off',
    },
  },

  {
    files: ['src/**/*.ts'],
    languageOptions: {
      globals: { ...globals.browser },
    },
  },

  {
    files: ['**/*.config.{js,mjs}', 'eslint.config.js', 'scripts/**/*.mjs'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
];
