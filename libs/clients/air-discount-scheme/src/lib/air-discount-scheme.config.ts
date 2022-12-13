import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
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
      timeout: env.optionalJSON('AIR_DISCOUNT_SCHEME_CLIENT_TIMEOUT') ?? 20000,
      basePath: env.required(
        'AIR_DISCOUNT_SCHEME_BACKEND_URL',
        'http://localhost:4248',
      ),
    }
  },
})
