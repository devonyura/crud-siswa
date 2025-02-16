import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  server: {
    url: "http://localhost:8100",
    cleartext: true,
    allowNavigation: ["api.rindapermai.com"]
  },
  appId: 'io.ionic.starter',
  appName: 'CRUD SISWA',
  webDir: 'dist',
};

export default config;
