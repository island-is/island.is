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
