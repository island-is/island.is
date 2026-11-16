import { SjukraScope } from '@island.is/auth/scopes'
import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  fetch: z.object({
    timeout: z.number().int(),
    scope: z.array(z.string()),
  }),
  xRoadServicePath: z.string(),
  apiKey: z.string(),
})

export const SpeechTherapyClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'SpeechTherapyClientConfig',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_HEALTH_INSURANCE_SPEECH_THERAPY_PATH',
      'IS-DEV/GOV/10007/SJUKRA-Protected/speech',
    ),
    apiKey: env.required('XROAD_HEALTH_INSURANCE_SPEECH_THERAPY_API_KEY', ''),
    fetch: {
      timeout: 30000,
      scope: [SjukraScope.speechWaitingList],
    },
  }),
})
