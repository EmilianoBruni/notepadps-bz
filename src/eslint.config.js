import { FlatCompat } from '@eslint/eslintrc';
import { defineConfig } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import { includeIgnoreFile } from '@eslint/compat';
import { fileURLToPath } from 'node:url';

// exclude files from the .gitignore file
const gitIgnorePath = fileURLToPath(new URL('../.gitignore', import.meta.url));
const gitIgnore = includeIgnoreFile(gitIgnorePath);

const compat = new FlatCompat({
    baseDirectory: import.meta.dirname
});

const eslintConfig = [
    ...defineConfig(gitIgnore),
    ...nextCoreWebVitals,
    ...nextTypescript,
    ...compat.config({
        plugins: ['prettier'],

        rules: {
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'prettier/prettier': 'warn',
            'no-unused-vars': 'off',
            'import/no-anonymous-default-export': 'off',
            'jsx-a11y/no-autofocus': 'off'
        }
    }),
    {
        ignores: [
            'node_modules/**',
            '.next/**',
            'out/**',
            'build/**',
            'next-env.d.ts'
        ]
    }
];

export default eslintConfig;
