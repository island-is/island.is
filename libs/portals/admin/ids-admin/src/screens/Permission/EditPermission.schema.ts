import { z } from 'zod'

import { Languages } from '../../utils/languages'
import { booleanCheckbox } from '../../utils/forms'
import { defaultEnvironmentSchema } from '../../utils/schemas'
import { zfd } from 'zod-form-data'

export enum PermissionFormTypes {
  CONTENT = 'CONTENT',
  ACCESS_CONTROL = 'ACCESS_CONTROL',
  DELEGATIONS = 'DELEGATIONS',
  CATEGORIES_AND_TAGS = 'CATEGORIES_AND_TAGS',
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
    automaticDelegationGrant: booleanCheckbox,
  })
  .merge(defaultEnvironmentSchema)

const delegationsSchema = z
  .object({
    removedDelegationTypes: zfd.repeatable(z.optional(z.array(z.string()))),
    addedDelegationTypes: zfd.repeatable(z.optional(z.array(z.string()))),
  })
  .merge(defaultEnvironmentSchema)

const categoriesAndTagsSchema = z
  .object({
    categoryIds: z
      .string()
      .optional()
      .transform((val) => (val ? JSON.parse(val) : [])),
    tagIds: z
      .string()
      .optional()
      .transform((val) => (val ? JSON.parse(val) : [])),
    originalCategoryIds: z
      .string()
      .optional()
      .transform((val) => (val ? JSON.parse(val) : [])),
    originalTagIds: z
      .string()
      .optional()
      .transform((val) => (val ? JSON.parse(val) : [])),
  })
  .merge(defaultEnvironmentSchema)
  .transform(
    ({ categoryIds, tagIds, originalCategoryIds, originalTagIds, ...rest }) => {
      const addedCategoryIds = categoryIds.filter(
        (id: string) => !originalCategoryIds.includes(id),
      )
      const removedCategoryIds = originalCategoryIds.filter(
        (id: string) => !categoryIds.includes(id),
      )
      const addedTagIds = tagIds.filter(
        (id: string) => !originalTagIds.includes(id),
      )
      const removedTagIds = originalTagIds.filter(
        (id: string) => !tagIds.includes(id),
      )

      return {
        ...rest,
        addedCategoryIds:
          addedCategoryIds.length > 0 ? addedCategoryIds : undefined,
        removedCategoryIds:
          removedCategoryIds.length > 0 ? removedCategoryIds : undefined,
        addedTagIds: addedTagIds.length > 0 ? addedTagIds : undefined,
        removedTagIds: removedTagIds.length > 0 ? removedTagIds : undefined,
      }
    },
  )

export const schema = {
  [PermissionFormTypes.CONTENT]: contentSchema,
  [PermissionFormTypes.ACCESS_CONTROL]: accessControlSchema,
  [PermissionFormTypes.DELEGATIONS]: delegationsSchema,
  [PermissionFormTypes.CATEGORIES_AND_TAGS]: categoriesAndTagsSchema,
}

export type MergedFormDataSchema = typeof schema[PermissionFormTypes.CONTENT] &
  typeof schema[PermissionFormTypes.ACCESS_CONTROL] &
  typeof schema[PermissionFormTypes.DELEGATIONS] &
  typeof schema[PermissionFormTypes.CATEGORIES_AND_TAGS]
