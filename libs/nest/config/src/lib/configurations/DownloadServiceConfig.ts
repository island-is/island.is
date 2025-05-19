import { defineConfig } from '../defineConfig'

export const DownloadServiceConfig = defineConfig({
  name: 'DownloadService',
  load: (env) => ({
    baseUrl: env.required(
      'DOWNLOAD_SERVICE_BASE_PATH',
      'http://localhost:3377',
    ),
  }),
})
