import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  username: z.string(),
  password: z.string(),
})

export const IcelandicGovernmentInstitutionVacanciesClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'IcelandicGovernmentInstitutionVacanciesClient',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_ICELANDIC_GOVERNMENT_INSTITUTION_VACANCIES_PATH',
      'IS-DEV/GOV/10021/FJS-Protected/recruitment-v1',
    ),
    username: env.required(
      'ICELANDIC_GOVERNMENT_INSTITUTION_VACANCIES_USERNAME',
    ),
    password: env.required(
      'ICELANDIC_GOVERNMENT_INSTITUTION_VACANCIES_PASSWORD',
    ),
  }),
})
