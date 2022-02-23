import { defineConfig } from '../defineConfig'

export const XRoadConfig = defineConfig({
  name: 'XRoadConfig',
  load: (env) => ({
    xRoadBasePath: env.required('XROAD_BASE_PATH', 'http://localhost:8081'),
    xRoadClient: env.required(
      'XROAD_CLIENT_ID',
      'IS-DEV/GOV/10000/island-is-client',
    ),
  }),
})
