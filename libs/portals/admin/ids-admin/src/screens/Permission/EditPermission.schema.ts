import { z } from 'zod'

import { Languages } from '../../utils/languages'
import { booleanCheckbox } from '../../utils/forms'
import { defaultEnvironmentSchema } from '../../utils/schemas'

export enum PermissionFormTypes {
  CONTENT = 'CONTENT',
  ACCESS_CONTROL = 'ACCESS_CONTROL',
}

const contentSchema = z
  .object({
    is_displayName: z.string().nonempty('errorDisplayName'),
    is_description: z.string().nonempty('errorDescription'),
    en_displayName: z.optional(z.string()),
    en_description: z.optional(z.string()),
  })
  .merge(defaultEnvironmentSchema)
  .transform(
    ({
      is_description: isDescription,
      en_description: enDescription,
      is_displayName: isDisplayName,
      en_displayName: enDisplayName,
      ...rest
    }) => ({
      ...rest,
      displayName: [
        {
          locale: Languages.IS,
          value: isDisplayName,
        },
        {
          locale: Languages.EN,
          value: enDisplayName ?? '',
        },
      ],
      description: [
        {
          locale: Languages.IS,
          value: isDescription,
        },
        {
          locale: Languages.EN,
          value: enDescription ?? '',
        },
      ],
    }),
  )

const accessControlSchema = z
  .object({
    isAccessControlled: booleanCheckbox,
    grantToAuthenticatedUser: booleanCheckbox,
    grantToProcuringHolders: booleanCheckbox,
    grantToLegalGuardians: booleanCheckbox,
    allowExplicitDelegationGrant: booleanCheckbox,
    grantToPersonalRepresentatives: booleanCheckbox,
  })
  .merge(defaultEnvironmentSchema)

export const schema = {
  [PermissionFormTypes.CONTENT]: contentSchema,
  [PermissionFormTypes.ACCESS_CONTROL]: accessControlSchema,
}

export type MergedFormDataSchema = typeof schema[PermissionFormTypes.CONTENT] &
  typeof schema[PermissionFormTypes.ACCESS_CONTROL]
