import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import unusedImports from 'eslint-plugin-unused-imports';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      // Development Dependencies
      'node_modules/',
      '.vscode/',
      '.github/',
      // Build and Output
      'dist/',
      'build/',

      // Test and Config
      'test/',
      'jest.setup.*',
      'jest.config.*',
      // Documentation and Info
      'README.md',
      '*.md',
    ],
  },
  // Base JavaScript/TypeScript configuration
  js.configs.recommended,
  ...fixupConfigRules(compat.extends('eslint-config-prettier')),
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        fetch: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettier,
      'unused-imports': unusedImports,
    },
    rules: {
      // // TypeScript recommended rules
      // ...tseslint.configs.recommended.rules,
      // ...tseslint.configs['recommended-requiring-type-checking'].rules,

      radix: 'off',
      'no-bitwise': 'off',
      'prettier/prettier': [
        'warn',
        {
          quoteProps: 'consistent',
          singleQuote: true,
          tabWidth: 2,
          trailingComma: 'es5',
          useTabs: false,
        },
      ],
      'no-new-wrappers': 'off',
      'no-eval': [
        'warn',
        {
          allowIndirect: true,
        },
      ],

      // Enable TypeScript-specific rules
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // '@typescript-eslint/no-unsafe-argument': 'error',

      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
];
