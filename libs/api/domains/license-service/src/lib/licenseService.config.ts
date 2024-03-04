import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'
import { DEFAULT_CACHE_TTL } from './licenseService.constants'

const LicenseServiceConfigSchema = z.object({
  barcodeSecretKey: z.string(),
  redis: z.object({
    nodes: z.array(z.string()),
    ssl: z.boolean(),
    cacheTtl: z.number(),
  }),
})

export const LicenseServiceConfig = defineConfig({
  name: 'LicenseServiceConfig',
  schema: LicenseServiceConfigSchema,
  load: (env) => ({
    barcodeSecretKey: env.required(
      'LICENSE_SERVICE_BARCODE_SECRET_KEY',''
    ),
    redis: {
      nodes: env.requiredJSON('LICENSE_SERVICE_REDIS_NODES', [
        'localhost:7000',
        'localhost:7001',
        'localhost:7002',
        'localhost:7003',
        'localhost:7004',
        'localhost:7005',
      ]),
      ssl: env.optionalJSON('LICENSE_SERVICE_REDIS_USE_SSL', false) ?? true,
      cacheTtl:
        env.optionalJSON('LICENSE_SERVICE_BARCODES_CACHE_TTL') ??
        DEFAULT_CACHE_TTL,
    },
  }),
})
