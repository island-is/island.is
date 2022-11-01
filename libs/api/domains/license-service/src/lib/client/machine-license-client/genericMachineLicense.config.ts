import { defineConfig } from '@island.is/nest/config'
import { SmartSolutionsApiConfigSchema as schema } from '@island.is/clients/smartsolutions'
import * as z from 'zod'

export const GenericMachineLicenseConfig = defineConfig<z.infer<typeof schema>>(
  {
    name: 'GenericMachineLicenseConfig ',
    schema,
    load: (env) => ({
      apiKey: env.required('VE_PKPASS_API_KEY'),
      apiUrl: env.required(
        'SMART_SOLUTIONS_API_URL',
        'https://smartpages-api-dev.smartsolutions.is/graphql',
      ),
      passTemplateId: env.required('MACHINE_LICENSE_PASS_TEMPLATE_ID'),
    }),
  },
)
