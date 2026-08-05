import { z } from 'zod'

import { Languages } from '../../utils/languages'
import { booleanCheckbox } from '../../utils/forms'
import { defaultEnvironmentSchema } from '../../utils/schemas'

const safeParseStringArray = (val: string | undefined): string[] => {
  if (!val) return []
  try {
    const parsed = JSON.parse(val)
    if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'string')) {
      return parsed
    }
    return []
  } catch {
    return []
  }
}

const safeParseOptionalStringArray = (
  val: string | undefined,
): string[] | undefined => {
  if (val === undefined || val === null) return undefined
  if (val === '') return []
  try {
    const parsed = JSON.parse(val)
    if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'string')) {
      return parsed
    }
    return undefined
  } catch {
    return undefined
  }
}

const SUBJECT_ID_PLACEHOLDER = '{{subjectId}}'

export const buildThirdPartyLoginUrl = (
  originUrl: string,
  targetLinkUri: string,
): string => {
  try {
    const url = new URL(originUrl)
    url.searchParams.set('target_link_uri', targetLinkUri)
    url.search = `login_hint=${SUBJECT_ID_PLACEHOLDER}&${url.searchParams.toString()}`
    return url.toString()
  } catch {
    return ''
  }
}

export enum PermissionFormTypes {
  CONTENT = 'CONTENT',
  SECURITY_AND_CAPABILITIES = 'SECURITY_AND_CAPABILITIES',
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
    }) => {
      return {
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
      }
    },
  )

const securityAndCapabilitiesSchema = z
  .object({
    allowsWrite: booleanCheckbox,
    requiresConfirmation: booleanCheckbox,
  })
  .merge(defaultEnvironmentSchema)

const accessControlSchema = z
  .object({
    isAccessControlled: booleanCheckbox,
    grantToAuthenticatedUser: booleanCheckbox,
    automaticDelegationGrant: booleanCheckbox,
    addedScopeUserNationalIds: z
      .string()
      .optional()
      .transform(safeParseStringArray),
    removedScopeUserNationalIds: z
      .string()
      .optional()
      .transform(safeParseStringArray),
  })
  .merge(defaultEnvironmentSchema)

const delegationsSchema = z
  .object({
    supportedDelegationTypes: z
      .string()
      .optional()
      .transform(safeParseOptionalStringArray),
    categoryIds: z.string().optional().transform(safeParseOptionalStringArray),
    tagIds: z.string().optional().transform(safeParseOptionalStringArray),
    originUrl: z
      .union([z.literal(''), z.string().url({ message: 'errorInvalidUrl' })])
      .optional(),
    targetLinkUri: z
      .union([z.literal(''), z.string().url({ message: 'errorInvalidUrl' })])
      .optional(),
  })
  .merge(defaultEnvironmentSchema)
  .transform(
    ({
      supportedDelegationTypes,
      categoryIds,
      tagIds,
      originUrl,
      targetLinkUri,
      ...rest
    }) => {
      const thirdPartyLoginUrl =
        originUrl && targetLinkUri
          ? buildThirdPartyLoginUrl(originUrl, targetLinkUri)
          : originUrl || targetLinkUri
          ? undefined
          : ''

      return {
        ...rest,
        ...(supportedDelegationTypes !== undefined && {
          supportedDelegationTypes,
        }),
        ...(categoryIds !== undefined && { categoryIds }),
        ...(tagIds !== undefined && { tagIds }),
        ...(thirdPartyLoginUrl !== undefined && { thirdPartyLoginUrl }),
      }
    },
  )

const categoriesAndTagsSchema = z
  .object({
    categoryIds: z.string().optional().transform(safeParseOptionalStringArray),
    tagIds: z.string().optional().transform(safeParseOptionalStringArray),
  })
  .merge(defaultEnvironmentSchema)
  .transform(({ categoryIds, tagIds, ...rest }) => {
    return {
      ...rest,
      ...(categoryIds !== undefined && { categoryIds }),
      ...(tagIds !== undefined && { tagIds }),
    }
  })

export const schema = {
  [PermissionFormTypes.CONTENT]: contentSchema,
  [PermissionFormTypes.SECURITY_AND_CAPABILITIES]:
    securityAndCapabilitiesSchema,
  [PermissionFormTypes.ACCESS_CONTROL]: accessControlSchema,
  [PermissionFormTypes.DELEGATIONS]: delegationsSchema,
  // CATEGORIES_AND_TAGS is now merged into CONTENT
  [PermissionFormTypes.CATEGORIES_AND_TAGS]: categoriesAndTagsSchema,
}

export type MergedFormDataSchema = typeof schema[PermissionFormTypes.CONTENT] &
  typeof schema[PermissionFormTypes.SECURITY_AND_CAPABILITIES] &
  typeof schema[PermissionFormTypes.ACCESS_CONTROL] &
  typeof schema[PermissionFormTypes.DELEGATIONS]
