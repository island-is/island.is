import { z } from 'zod'
import { zfd } from 'zod-form-data'

import {
  AuthAdminTranslatedValue,
  AuthAdminRefreshTokenExpiration,
  AuthAdminClientClaim,
  AuthAdminClientSso,
} from '@island.is/api/schema'

import { booleanCheckbox } from '../../utils/forms'
import { defaultEnvironmentSchema } from '../../utils/schemas'

export enum ClientFormTypes {
  advancedSettings = 'advancedSettings',
  applicationUrls = 'applicationUrls',
  delegations = 'delegations',
  lifeTime = 'lifeTime',
  permissions = 'permissions',
  translations = 'translations',
}

const splitStringOnCommaOrSpaceOrNewLine = (s: string) => {
  return s.split(/[\s\n,]+/).filter(Boolean)
}

const transformCustomClaims = (s: string): AuthAdminClientClaim[] => {
  if (!s) {
    return []
  }

  const array = splitStringOnCommaOrSpaceOrNewLine(s)

  return array.map((claim) => {
    const [type, value] = claim.split('=')
    return { type, value }
  })
}

const checkIfStringIsListOfUrls = (urls: string) => {
  if (urls.trim() === '') {
    return true
  }

  const urlsArray = splitStringOnCommaOrSpaceOrNewLine(urls)

  for (const url of urlsArray) {
    try {
      // Firefox does not support wildcard subdomains, so we need to remove it before validating the url
      new URL(url.replace('*.', ''))
    } catch (e) {
      return false
    }
  }

  return true
}

const checkIfStringIsArrayOfValidClaims = (claims: string) => {
  if (!claims) {
    return true
  }

  const array = splitStringOnCommaOrSpaceOrNewLine(claims)

  const regex = /^\w+=\w+$/

  for (const claim of array) {
    if (!regex.test(claim)) {
      return false
    }
  }
  return true
}

const checkIfStringIsPositiveNumber = (number: string) => {
  return /^[0-9]+$/.test(number.trim())
}

export const schema = {
  [ClientFormTypes.lifeTime]: z
    .object({
      absoluteRefreshTokenLifetime: z
        .string()
        .refine(checkIfStringIsPositiveNumber, {
          message: 'errorPositiveNumber',
        })
        .transform((s) => {
          return Number(s)
        }),
      refreshTokenExpiration: z.optional(z.string()).transform((s) => {
        return s === 'on'
          ? AuthAdminRefreshTokenExpiration.Sliding
          : AuthAdminRefreshTokenExpiration.Absolute
      }),
      slidingRefreshTokenLifetime: z.optional(z.string()).transform((s) => {
        return typeof s === 'string' && s.length > 0 ? Number(s) : undefined
      }),
      sso: booleanCheckbox,
    })
    .merge(defaultEnvironmentSchema)
    .refine(
      (data) => {
        if (
          data.refreshTokenExpiration ===
            AuthAdminRefreshTokenExpiration.Sliding &&
          data.slidingRefreshTokenLifetime !== undefined
        ) {
          return checkIfStringIsPositiveNumber(
            data.slidingRefreshTokenLifetime.toString(),
          )
        }
        return true
      },
      {
        message: 'errorPositiveNumber',
        path: ['inactivityLifetime'],
      },
    )
    .transform((data) => {
      const { sso, ...rest } = data

      return {
        ...rest,
        sso: sso ? AuthAdminClientSso.enabled : AuthAdminClientSso.disabled,
      }
    }),
  [ClientFormTypes.applicationUrls]: z
    .object({
      redirectUris: z
        .string()
        .refine(checkIfStringIsListOfUrls, {
          message: 'errorInvalidUrls',
        })
        .transform(splitStringOnCommaOrSpaceOrNewLine),
      postLogoutRedirectUris: z
        .string()
        .refine(checkIfStringIsListOfUrls, {
          message: 'errorInvalidUrls',
        })
        .transform(splitStringOnCommaOrSpaceOrNewLine),
    })
    .merge(defaultEnvironmentSchema),
  [ClientFormTypes.translations]: z
    .object({
      is_displayName: z.string().nonempty({ message: 'errorRequired' }),
      en_displayName: z.string(),
    })
    .merge(defaultEnvironmentSchema)
    .transform((data) => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { is_displayName, en_displayName, ...rest } = data
      return {
        ...rest,
        displayName: [
          {
            locale: 'is',
            value: is_displayName,
          },
          {
            locale: 'en',
            value: en_displayName,
          },
        ] as AuthAdminTranslatedValue[],
      }
    }),
  [ClientFormTypes.delegations]: z
    .object({
      promptDelegations: booleanCheckbox,
      requireApiScopes: booleanCheckbox,
      removedDelegationTypes: zfd.repeatable(z.optional(z.array(z.string()))),
      addedDelegationTypes: zfd.repeatable(z.optional(z.array(z.string()))),
    })
    .merge(defaultEnvironmentSchema),
  [ClientFormTypes.advancedSettings]: z
    .object({
      requirePkce: booleanCheckbox,
      allowOfflineAccess: booleanCheckbox,
      supportTokenExchange: booleanCheckbox,
      requireConsent: booleanCheckbox,
      singleSession: booleanCheckbox,
      accessTokenLifetime: z
        .string()
        .refine(checkIfStringIsPositiveNumber, {
          message: 'errorPositiveNumber',
        })
        .transform((s) => {
          return Number(s)
        }),
      customClaims: z
        .string()
        .refine(checkIfStringIsArrayOfValidClaims, {
          message: 'errorInvalidClaims',
        })
        .transform((s) => {
          return transformCustomClaims(s)
        }),
    })
    .merge(defaultEnvironmentSchema),
  [ClientFormTypes.permissions]: z
    .object({
      addedScopes: zfd.repeatable(z.optional(z.array(z.string()))),
      removedScopes: zfd.repeatable(z.optional(z.array(z.string()))),
    })
    .merge(defaultEnvironmentSchema),
}

export type MergedFormDataSchema =
  typeof schema[ClientFormTypes.advancedSettings] &
    typeof schema[ClientFormTypes.applicationUrls] &
    typeof schema[ClientFormTypes.delegations] &
    typeof schema[ClientFormTypes.lifeTime] &
    typeof schema[ClientFormTypes.permissions] &
    typeof schema[ClientFormTypes.translations]
