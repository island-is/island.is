import * as kennitala from 'kennitala'
import { z } from 'zod'

import { AuthAdminEnvironment } from '@island.is/api/schema'

const safeText = z
  .string()
  .min(1, 'errorUnsafeChars')
  .regex(/^[^<>%$]+$/, 'errorUnsafeChars')

export const createTenantSchema = z.object({
  name: z
    .string()
    .min(1, 'errorTenantName')
    .regex(/^@[a-z0-9_.-]+$/, 'errorTenantName'),
  nationalId: z
    .string()
    .min(1, 'errorNationalId')
    .refine((value) => value.length === 10 && kennitala.isValid(value), {
      message: 'errorNationalId',
    }),
  displayName: safeText,
  description: safeText,
  organisationLogoKey: z.string().min(1, 'errorOrgLogoKey'),
  contactEmail: z.string().email('errorEmail').or(z.literal('')).optional(),
  environments: z
    .array(z.nativeEnum(AuthAdminEnvironment))
    .nonempty('errorEnvironment'),
})

export type CreateTenantFormValues = z.infer<typeof createTenantSchema>
