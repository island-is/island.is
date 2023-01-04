import { defineConfig } from '@island.is/nest/config'
import {
  SmartSolutionsConfig,
  SmartSolutionsApiConfigSchema as schema,
} from '@island.is/clients/smartsolutions'

export const DisabilityLicenseClientConfig = defineConfig<SmartSolutionsConfig>(
  {
    name: 'DisabilityLicenseClientConfig',
    schema,
    load: (env) => ({
      apiKey: env.required('TR_PKPASS_API_KEY', ''),
      apiUrl: env.required(
        'SMART_SOLUTIONS_API_URL',
        'https://smartpages-api-dev.smartsolutions.is/graphql',
      ),
      passTemplateId: env.required('DISABILITY_LICENSE_PASS_TEMPLATE_ID', ''),
    }),
  },
)
