import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
})

export const FjarskiptastofaSelfAssessmentClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'FjarskiptastofaSelfAssessmentClientConfig',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_FJARSKIPTASTOFA_SELF_ASSESSMENT_PATH',
      'IS-DEV/GOV/10100/Fjarskiptastofa-Protected/assessment-v1',
    ),
  }),
})
