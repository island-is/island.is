import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

export const DEFAULT_CACHE_TTL = 1 * 1000 // 1 minute

const LicenseServiceConfigSchema = z.object({
  barcodeSecretKey: z.string(),
  barcodeExpireTimeInSec: z.number(),
  barcodeSessionExpireTimeInSec: z.number(),
  redis: z.object({
    nodes: z.array(z.string()),
    ssl: z.boolean(),
    cacheTtl: z.number(),
  }),
})

export const LicenseConfig = defineConfig({
  name: 'LicenseServiceConfig',
  schema: LicenseServiceConfigSchema,
  load: (env) => ({
    barcodeSecretKey: env.required('LICENSE_SERVICE_BARCODE_SECRET_KEY', ''),
    barcodeExpireTimeInSec:
      env.optionalJSON('BARCODE_EXPIRE_TIME_IN_SEC') ?? 60,
    barcodeSessionExpireTimeInSec:
      env.optionalJSON('BARCODE_SESSION_EXPIRE_TIME_IN_SEC') ?? 3600,
    redis: {
      nodes: env.requiredJSON('LICENSE_SERVICE_REDIS_NODES', [
        'localhost:7010',
        'localhost:7011',
        'localhost:7012',
        'localhost:7013',
        'localhost:7014',
        'localhost:7015',
      ]),
      ssl: env.optionalJSON('LICENSE_SERVICE_REDIS_USE_SSL', false) ?? true,
      cacheTtl:
        env.optionalJSON('LICENSE_SERVICE_BARCODES_CACHE_TTL') ??
        DEFAULT_CACHE_TTL,
    },
  }),
})
