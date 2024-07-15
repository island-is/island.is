import { defineConfig } from '@island.is/nest/config'

export const sharedAuthModuleConfig = defineConfig({
  name: 'SharedAuthModule',
  load: (env) => ({
    jwtSecret: env.required('AUTH_JWT_SECRET', 'jwt-secret'),
    secretToken: env.required(
      'BACKEND_ACCESS_TOKEN',
      'secret-backend-api-token',
    ),
  }),
})
