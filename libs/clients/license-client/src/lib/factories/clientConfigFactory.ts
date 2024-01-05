import { defineConfig } from '@island.is/nest/config'
import { SmartSolutionsApiConfigSchema as schema } from '@island.is/clients/smartsolutions'
import * as z from 'zod'

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
