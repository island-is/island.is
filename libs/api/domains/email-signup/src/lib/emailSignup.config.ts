import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  fiskistofaZenterEmail: z.string(),
  fiskistofaZenterPassword: z.string(),
})

export const EmailSignupConfig = defineConfig({
  name: 'EmailSignup',
  schema,
  load(env) {
    return {
      fiskistofaZenterEmail: env.required('FISKISTOFA_ZENTER_EMAIL'),
      fiskistofaZenterPassword: env.required('FISKISTOFA_ZENTER_PASSWORD'),
    }
  },
})
