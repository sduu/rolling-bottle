import { defineConfig, normalizePath } from 'vite';
import path from 'path';
import { glob } from 'glob';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import handlebars from 'vite-plugin-handlebars';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: path.resolve('index.html'),
        ...glob.sync('./src/**/*.html').reduce((entries, file) => {
          if (!file.includes('components')) {
            const name = path.relative('src', file).replace(/\.html$/, '');
            entries[name] = path.resolve(file);
          }
          return entries;
        }, {}),
      },
    },
    outDir: 'dist',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      output: {
        comments: false,
      },
    },
  },
  plugins: [
    handlebars({
      partialDirectory: [path.resolve(__dirname, 'src/components')],
      context: {
        siteTitle: 'ROLLING BOTTLE',
      },
    }),
    viteStaticCopy({
      targets: [
        {
          src: normalizePath(path.resolve(__dirname, 'src/assets/images')),
          dest: './assets',
        },
      ],
    }),
  ],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
});
