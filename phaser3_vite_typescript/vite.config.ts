import { defineConfig } from 'vite';
import replace from '@rollup/plugin-replace';

export default defineConfig({
  build: {
    // Viteは4k以下の小さな画像をbase64でインライン化しリンク切れを起こすので以下で対処
    assetsInlineLimit: 0,
    rollupOptions: {
      plugins: [
        //  Toggle the booleans here to enable / disable Phaser 3 features:
        replace({
          'typeof CANVAS_RENDERER': "'true'",
          'typeof WEBGL_RENDERER': "'true'",
          'typeof EXPERIMENTAL': "'true'",
          'typeof PLUGIN_CAMERA3D': "'false'",
          'typeof PLUGIN_FBINSTANT': "'false'",
          'typeof FEATURE_SOUND': "'true'"
        })
      ]
    }
  },
  server: {
    port: 8000
  },
  base: "/routine/"
});
