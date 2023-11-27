import { defineConfig } from '@island.is/nest/config'

export const auditTrailModuleConfig = defineConfig({
  name: 'AuditTrailModule',
  load: (env) => ({
    useGenericLogger:
      env.optional('AUDIT_TRAIL_USE_GENERIC_LOGGER', 'true') === 'true',
    groupName: env.required('AUDIT_TRAIL_GROUP_NAME', ''),
    serviceName: 'judicial-system-api',
    region: env.required('AUDIT_TRAIL_REGION', ''),
  }),
})
