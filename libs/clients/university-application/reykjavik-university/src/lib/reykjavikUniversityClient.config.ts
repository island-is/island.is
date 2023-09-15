import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  url: z.string(),
  fetch: z.object({
    timeout: z.number().int(),
  }),
  clientId: z.string(),
  secret: z.string(),
})

export const ReykjavikUniversityApplicationClientConfig = defineConfig({
  name: 'ReykjavikUniversityApplicationApi',
  schema,
  load(env) {
    return {
      url: env.required(
        'REYKJAVIK_UNIVERSITY_HOST',
        'https://devproxy.ru.is/test/api/custom',
      ),
      fetch: {
        timeout: env.optionalJSON('REYKJAVIK_UNIVERSITY_TIMEOUT') ?? 20000,
      },
      clientId: env.required('REYKJAVIK_UNIVERSITY_USERNAME'),
      secret: env.required('REYKJAVIK_UNIVERSITY_PASSWORD'),
    }
  },
})
