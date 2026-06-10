import { z } from 'zod'

import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  basePath: z.string().url(),
  username: z.string(),
  password: z.string(),
  apiKey: z.string(),
})

export const CustomsCalculatorClientConfig = defineConfig({
  name: 'CustomsCalculatorClientConfig',
  schema,
  load: (env) => ({
    basePath: env.required(
      'SKATTUR_TOLLUR_REIKNIVEL_BASE_PATH',
      'https://skatt-test.hysing.is/gateway/tollur-reiknivel/v1',
    ),
    username: env.required('SKATTUR_TOLLUR_REIKNIVEL_USERNAME'),
    password: env.required('SKATTUR_TOLLUR_REIKNIVEL_PASSWORD'),
    apiKey: env.required('SKATTUR_TOLLUR_REIKNIVEL_API_KEY'),
  }),
})
