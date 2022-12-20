import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  fetch: z.object({
    timeout: z.number().int(),
    scope: z.array(z.string()),
  }),
  username: z.string(),
  password: z.string(),
})

export const CourtBankruptcyCertClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'CourtBankruptcyCertClient',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_COURT_BANKRUPTCY_CERT_PATH',
      'IS-DEV/GOV/10019/Domstolasyslan',
    ),
    fetch: {
      timeout: 30000,
      scope: ['@island.is/internal'],
    },
    username: env.required('DOMSYSLA_USERNAME'),
    password: env.required('DOMSYSLA_PASSWORD'),
  }),
})
