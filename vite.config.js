import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Month and year of the build, shown as "Last updated" in the footer.
  define: { __UPDATED__: JSON.stringify(new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })) },
});
