import { z } from 'zod'

import { AuthAdminEnvironment } from '@island.is/api/schema'

import {
  contactEmailSchema,
  nationalIdSchema,
  safeTextSchema,
} from '../tenantValidation'

export const createTenantSchema = z.object({
  name: z
    .string()
    .min(1, 'errorTenantName')
    .regex(/^@[a-z0-9_.-]+$/, 'errorTenantName'),
  nationalId: nationalIdSchema,
  displayName: safeTextSchema,
  description: safeTextSchema,
  organisationLogoKey: z.string().min(1, 'errorOrgLogoKey'),
  contactEmail: contactEmailSchema,
  environments: z
    .array(z.nativeEnum(AuthAdminEnvironment))
    .nonempty('errorEnvironment'),
})

export type CreateTenantFormValues = z.infer<typeof createTenantSchema>
