import { z } from 'zod'
import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  groupName: z.string().optional(),
  serviceName: z.string().optional(),
  defaultNamespace: z.string().optional(),
})

export const AuditConfig = defineConfig<z.infer<typeof schema>>({
  name: 'AuditConfigurations',
  schema,
  load: (env) => ({
    groupName: env.required('AUDIT_GROUP_NAME', '') || undefined,
    serviceName: env.optional('AUDIT_SERVICE_NAME'),
    defaultNamespace: env.required(
      'AUDIT_DEFAULT_NAMESPACE', '@island.is/local-dev',
    ),
  }),
})
