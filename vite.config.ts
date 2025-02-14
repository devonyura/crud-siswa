/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: [`@ionic/pwa-elements/loader`],
  },
	base: '/crud-siswa/',
	build: {
		rollupOptions: {
			output: {
				entryFileNames: `assets/[name]-[hash].js`,
				chunkFileNames: `assets/[name]-[hash].js`,
				assetFileNames: `assets/[name]-[hash].[ext]`
			}
		}
	},
  plugins: [
    react(),
    legacy(),
    VitePWA({ 
      registerType: 'autoUpdate',
      manifest: {
				name: 'My PWA App',
				short_name: 'PWA App',
				theme_color: '#ffffff', // 🚀 WAJIB ditambahkan agar bisa diinstal
				background_color: '#ffffff',
				display: 'standalone',
				icons: [
					{
						src: '/icon-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			}
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
});
