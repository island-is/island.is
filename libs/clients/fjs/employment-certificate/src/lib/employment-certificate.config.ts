import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const DEFAULT_TIMEOUT = 20000

const schema = z.object({
  xRoadServicePath: z.string().optional(),
  directBaseUrl: z.string().optional(),
  tokenExchangeScope: z.array(z.string()),
  fetchTimeout: z.number().int().positive(),
})

const parseScope = (value?: string): string[] =>
  (value ?? '').split(/[\s,]+/).filter(Boolean)

const parseTimeout = (value?: string): number => {
  const timeout = Math.trunc(Number(value))
  return Number.isFinite(timeout) && timeout > 0 ? timeout : DEFAULT_TIMEOUT
}

/**
 * Every value is optional and parsed leniently, so this config can never stop
 * an app from starting. Without a base URL the client throws when it is called.
 */
export const EmploymentCertificateClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'EmploymentCertificateClientConfig',
  schema,
  load: (env) => ({
    // No dev fallback: the X-Road service isn't registered yet.
    xRoadServicePath: env.optional('XROAD_FJS_EMPLOYMENT_CERTIFICATE_PATH'),
    // Calls the API directly instead of through X-Road. Local development
    // only: deployed environments run with NODE_ENV=production and ignore it.
    directBaseUrl:
      process.env.NODE_ENV !== 'production'
        ? env.optional('FJS_EMPLOYMENT_CERTIFICATE_DIRECT_URL')
        : undefined,
    // Comma separated. Empty means the user's own token is forwarded.
    tokenExchangeScope: parseScope(
      env.optional('XROAD_FJS_EMPLOYMENT_CERTIFICATE_SCOPE'),
    ),
    fetchTimeout: parseTimeout(
      env.optional('XROAD_FJS_EMPLOYMENT_CERTIFICATE_TIMEOUT'),
    ),
  }),
})
