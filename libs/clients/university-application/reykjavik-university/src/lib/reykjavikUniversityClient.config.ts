import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  url: z.string(),
  fetch: z.object({
    timeout: z.number().int(),
  }),
})

export const ReykjavikUniversityApplicationClientConfig = defineConfig({
  name: 'ReykjavikUniversityApplicationApi',
  schema,
  load(env) {
    return {
      url: 'https://devproxy.ru.is/test/api/custom',
      fetch: {
        timeout: env.optionalJSON('REYKJAVIK_UNIVERSITY_TIMEOUT') ?? 20000,
      },
    }
  },
})
