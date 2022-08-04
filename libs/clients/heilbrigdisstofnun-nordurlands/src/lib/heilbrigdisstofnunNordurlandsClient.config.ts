import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  url: z.string(),
  fetch: z.object({
    timeout: z.number().int(),
  }),
  apiKey: z.string(),
})

export const HeilbrigdisstofnunNordurlandsClientConfig = defineConfig({
  name: 'HeilbrigdisstofnunNordurlandsApi',
  schema,
  load(env) {
    return {
      url: env.required(
        'HEILBRIGDISSTOFNUN_NORDURLANDS_API_URL',
        'https://external.api.saga.dev.hc.t.is',
      ),
      fetch: {
        timeout:
          env.optionalJSON('HEILBRIGDISSTOFNUN_NORDURLANDS_API_TIMEOUT') ??
          10000,
      },
      // TODO: add to AWS env
      apiKey: env.required('HEILBRIGDISSTOFNUN_NORDURLANDS_API_KEY'),
    }
  },
})
