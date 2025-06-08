import { defineConfig } from 'rolldown';

export default defineConfig({
  input: {
    "content-script": './src/content-script.js',
    background: './src/background.js',
    options: './src/options.js',
    popup: './src/popup.js',
  },
  output: {
    dir: 'dist',
  }
});