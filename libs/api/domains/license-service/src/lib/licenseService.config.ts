import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'
import { DEFAULT_CACHE_TTL } from './licenseService.constants'

const LicenseServiceConfigSchema = z.object({
  redis: z.object({
    nodes: z.array(z.string()),
    ssl: z.boolean(),
    cacheTtl: z.number(),
  }),
})

export const LicenseServiceConfig = defineConfig({
  name: 'LicenseServiceConfig',
  schema: LicenseServiceConfigSchema,
  load: (env) => {
    const cacheTtlEnv = env.optional('LICENSE_SERVICE_BARCODES_CACHE_TTL')
    const cacheTtl = cacheTtlEnv ? Number(cacheTtlEnv) : DEFAULT_CACHE_TTL

    return {
      redis: {
        nodes: env.requiredJSON('REDIS_URL_NODE_01', [
          'localhost:7000',
          'localhost:7001',
          'localhost:7002',
          'localhost:7003',
          'localhost:7004',
          'localhost:7005',
        ]),
        ssl: env.requiredJSON('REDIS_USE_SSL', false),
        cacheTtl,
      },
    }
  },
})
