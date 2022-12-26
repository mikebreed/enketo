import { resolve } from 'path';
import { defineConfig } from 'vitest/config';
import { VitePluginNode } from 'vite-plugin-node';
import config from './config/config.json';

export default defineConfig({
    assetsInclude: ['**/*.xml', '**/*.xsl'],
    build: {
        lib: {
            entry: resolve(__dirname, './src/transformer.ts'),
            name: 'enketo-transformer',
        },
        minify: false,
        outDir: 'dist',
        sourcemap: true,
    },
    esbuild: {
        sourcemap: 'inline',
    },
    plugins: [
        ...VitePluginNode({
            adapter: 'express',
            appPath: './app.ts',
            exportName: 'app',
            tsCompiler: 'esbuild',
        }),
    ],
    server: {
        port: config.port,
    },
    ssr: {
        target: 'node',
    },
    test: {
        // Vitest uses thread-based concurrency by defualt.
        // While this would significantly improve the speed
        // of test runs, native Node extensions using N-API
        // are often not thread safe. In this case, that
        // means we cannot use concurrency for testing
        // functionality which depends on libxmljs/libxslt.
        threads: false,

        coverage: {
            provider: 'istanbul',
            include: ['src/**/*.ts'],
            reporter: ['html', 'text-summary', 'json'],
            reportsDirectory: './test-coverage',
        },

        globals: true,
        include: ['test/**/*.spec.ts'],
        reporters: 'verbose',
        sequence: { shuffle: true },
    },
});
