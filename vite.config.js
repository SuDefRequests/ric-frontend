import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Extract the plain hostname without 'https://'
const ngrokHost = 'b7ac-103-170-252-58.ngrok-free.app';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Allow this specific ngrok domain (or all ngrok free domains: ['.ngrok-free.app'])
    allowedHosts: [ngrokHost, '.ngrok-free.app'],
    
    // Configure HMR for ngrok tunnel
    hmr: {
      host: ngrokHost,
      protocol: 'wss',
      clientPort: 443,
    },
  },
});