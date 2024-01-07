import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import glsl from 'vite-plugin-glsl';
import viteBasicSslPlugin from '@vitejs/plugin-basic-ssl';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteBasicSslPlugin(), glsl({include:['**/*.vert', '**/*.frag',]})],
  assetsInclude: ['**/*.glb', '**/*.mind'],
})
