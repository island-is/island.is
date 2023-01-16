import { defineConfig } from '@island.is/nest/config'
import { SmartSolutionsApiConfigSchema as schema } from '@island.is/clients/smartsolutions'
import * as z from 'zod'

export const GenericDisabilityLicenseConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'GenericDisabilityLicenseConfig',
  schema,
  load: (env) => ({
    apiKey: env.required('TR_PKPASS_API_KEY', ''),
    apiUrl: env.required(
      'SMART_SOLUTIONS_API_URL',
      'https://smartpages-api-dev.smartsolutions.is/graphql',
    ),
    passTemplateId: env.required('DISABILITY_LICENSE_PASS_TEMPLATE_ID', ''),
  }),
})
