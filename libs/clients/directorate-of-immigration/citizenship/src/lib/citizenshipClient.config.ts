import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  url: z.string(),
  scope: z.array(z.string()),
})

export const CitizenshipClientConfig = defineConfig({
  name: 'CitizenshipApi',
  schema,
  load(env) {
    return {
      url: 'https://utl-umsokn.azurewebsites.net',
      scope: ['@utl.is/umsoknir'],
    }
  },
})
