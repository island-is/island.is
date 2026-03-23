import { z } from 'zod'
import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  goproUsername: z.string(),
  goproPassword: z.string(),
  xRoadServicePath: z.string(),
  supremeCourtBearerToken: z.string(),
})

export const VerdictsClientConfig = defineConfig({
  name: 'VerdictsClient',
  schema,
  load(env) {
    return {
      goproUsername: env.required('VERDICTS_GOPRO_USERNAME'),
      goproPassword: env.required('VERDICTS_GOPRO_PASSWORD'),
      xRoadServicePath: env.required(
        'XROAD_VERDICTS_GOPRO_PATH',
        'IS-DEV/GOV/10019/Domstolasyslan-Client/Island-is',
      ),
      supremeCourtBearerToken: env.required(
        'VERDICTS_SUPREME_COURT_BEARER_TOKEN',
      ),
    }
  },
})
