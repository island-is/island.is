import * as kennitala from 'kennitala'
import { z } from 'zod'

import { defaultEnvironmentSchema } from '../../../utils/schemas'

export enum TenantFormTypes {
  basicInfo = 'basicInfo',
}

const safeText = z
  .string()
  .min(1, 'errorUnsafeChars')
  .regex(/^[^<>%$]+$/, 'errorUnsafeChars')

// Schema for the basic info section of the tenant edit page. Merged with
// `defaultEnvironmentSchema` so the form can round-trip the currently
// selected environment plus any opt-in sync environments.
//
// Note: `name` is immutable – the input is disabled on the form and is
// never read by this schema. `nationalId` IS editable (matches legacy admin
// behaviour).
export const editTenantSchema = {
  [TenantFormTypes.basicInfo]: z
    .object({
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
    })
    .merge(defaultEnvironmentSchema),
}

export type MergedEditTenantFormDataSchema =
  typeof editTenantSchema[keyof typeof editTenantSchema]
