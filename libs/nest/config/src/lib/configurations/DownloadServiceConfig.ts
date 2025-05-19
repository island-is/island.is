import { defineConfig } from '../defineConfig'

export const DownloadServiceConfig = defineConfig({
  name: 'DownloadService',
  load: (env) => ({
    baseUrl: "https://featupdate-vehicles-ownership-report-api.dev01.devland.is"
  }),
})
