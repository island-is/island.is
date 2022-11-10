import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  tokenExchangeScope: z.array(z.string()),
  timeout: z.number(),
  basePath: z.string(),
})

export const AirDiscountSchemeClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'AirDiscountSchemeClient',
  schema,
  load(env) {
    return {
      tokenExchangeScope: env.optionalJSON(
        'AIR_DISCOUNT_SCHEME_CLIENT_SCOPE',
      ) ?? ['@vegagerdin.is/air-discount-scheme-scope'],
      timeout: env.optionalJSON('AIR_DISCOUNT_SCHEME_CLIENT_TIMEOUT') ?? 20000,
      basePath: env.required(
        'AIR_DISCOUNT_SCHEME_API_URL', // TODO: make sure this is set
        'http://localhost:4248',
      ),
    }
  },
})
