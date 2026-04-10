import { z } from 'zod'

import { defaultEnvironmentSchema } from '../../../utils/schemas'
import {
  contactEmailSchema,
  nationalIdSchema,
  safeTextSchema,
} from '../tenantValidation'

export enum TenantFormTypes {
  basicInfo = 'basicInfo',
}

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
      nationalId: nationalIdSchema,
      displayName: safeTextSchema,
      description: safeTextSchema,
      organisationLogoKey: z.string().min(1, 'errorOrgLogoKey'),
      contactEmail: contactEmailSchema,
    })
    .merge(defaultEnvironmentSchema),
}

export type MergedEditTenantFormDataSchema =
  typeof editTenantSchema[keyof typeof editTenantSchema]
