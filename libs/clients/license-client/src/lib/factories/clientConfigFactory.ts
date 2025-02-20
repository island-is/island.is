import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  apiKey: z.string(),
  apiUrl: z.string(),
  passTemplateId: z.string(),
})

export const clientConfigFactory = (licenseId: string, organisation: string) =>
  defineConfig<z.infer<typeof schema>>({
    name: `${licenseId}DigitalLicenseClientConfig`,
    schema,
    load: (env) => ({
      apiKey: env.required(`${organisation}_PKPASS_API_KEY`, ''),
      apiUrl: env.required(
        'SMART_SOLUTIONS_API_URL',
        'https://smartpages-api-dev.smartsolutions.is/graphql',
      ),
      passTemplateId: env.required(
        `${licenseId.toUpperCase()}_LICENSE_PASS_TEMPLATE_ID`,
        '',
      ),
    }),
  })
