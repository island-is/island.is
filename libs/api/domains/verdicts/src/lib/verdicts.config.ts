import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  courtOfAppealAppealsUrl: z.string().url(),
})

export const VerdictsApiModuleConfig = defineConfig({
  name: 'VerdictsApiModuleConfig',
  schema,
  load: (env) => ({
    courtOfAppealAppealsUrl: env.required('VERDICTS_LANDSRETTUR_APPEALS_URL'),
  }),
})
