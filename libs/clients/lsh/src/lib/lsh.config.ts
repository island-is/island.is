import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  baseUrl: z.string(),
  bloodScope: z.array(z.string()),
  questionnaireScope: z.array(z.string()),
})

export const LshClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'LshClientConfig',
  schema,
  load(env) {
    return {
      baseUrl: env.required(
        'XROAD_LSH_PATH',
        'IS-DEV/GOV/10022/Landspitali-Protected/external-patient-api-v1',
      ),
      bloodScope: ['@landspitali.is/patientdata:read'],
      questionnaireScope: [
        '@landspitali.is/sjukraskrar:read',
        '@landspitali.is/questionnaires:read',
        '@landspitali.is/questionnaires:write',
      ],
    }
  },
})
