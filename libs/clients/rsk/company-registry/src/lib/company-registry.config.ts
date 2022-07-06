import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xRoadProviderId: z.string(),
  cacheControl: z.string(),
  redis: z.object({
    nodes: z.array(z.string()),
    ssl: z.boolean(),
  }),
})

export const CompanyRegistryConfig = defineConfig<z.infer<typeof schema>>({
  name: 'CompanyRegistryClient',
  schema,
  load(env) {
    return {
      xRoadProviderId: env.required(
        'COMPANY_REGISTRY_XROAD_PROVIDER_ID',
        'IS-DEV/GOV/10006/Skatturinn/ft-v1',
      ),
      cacheControl:
        env.optional('COMPANY_REGISTRY_CACHE_CONTROL') ??
        'public, max-age=86400, stale-while-revalidate=2592000', // 1 day, 30 days,
      redis: {
        nodes: env.optionalJSON('COMPANY_REGISTRY_REDIS_NODES') ?? [],
        ssl: env.optionalJSON('COMPANY_REGISTRY_REDIS_SSL', false) ?? true,
      },
    }
  },
})
