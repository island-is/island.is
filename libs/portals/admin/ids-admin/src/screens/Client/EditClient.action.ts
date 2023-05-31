import { z } from 'zod'
import { zfd } from 'zod-form-data'

import { RouterActionResponse, WrappedActionFn } from '@island.is/portals/core'
import {
  validateFormData,
  ValidateFormDataResult,
} from '@island.is/react-spa/shared'
import {
  AuthAdminEnvironment,
  AuthAdminTranslatedValue,
  AuthAdminRefreshTokenExpiration,
  AuthAdminClientClaim,
} from '@island.is/api/schema'

import {
  UpdateClientDocument,
  UpdateClientMutation,
  UpdateClientMutationVariables,
} from './EditClient.generated'
import { getIntent } from '../../utils/getIntent'
import { authAdminEnvironments } from '../../utils/environments'
import { booleanCheckbox } from '../../utils/forms'

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
      new URL(url)
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

const defaultSchema = z.object({
  environment: z.nativeEnum(AuthAdminEnvironment),
  syncEnvironments: zfd.repeatable(
    z.optional(z.array(z.nativeEnum(AuthAdminEnvironment))),
  ),
})

const schema = {
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
      slidingRefreshTokenLifetime: z.string().transform((s) => {
        return Number(s)
      }),
    })
    .merge(defaultSchema)
    .refine(
      (data) => {
        if (data.refreshTokenExpiration) {
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
    ),
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
    .merge(defaultSchema),
  [ClientFormTypes.translations]: z
    .object({
      is_displayName: z.string().nonempty({ message: 'errorRequired' }),
      en_displayName: z.string(),
    })
    .merge(defaultSchema)
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
      supportsProcuringHolders: booleanCheckbox,
      supportsLegalGuardians: booleanCheckbox,
      promptDelegations: booleanCheckbox,
      supportsPersonalRepresentatives: booleanCheckbox,
      supportsCustomDelegation: booleanCheckbox,
      requireApiScopes: booleanCheckbox,
    })
    .merge(defaultSchema),
  [ClientFormTypes.advancedSettings]: z
    .object({
      requirePkce: booleanCheckbox,
      allowOfflineAccess: booleanCheckbox,
      supportTokenExchange: booleanCheckbox,
      requireConsent: booleanCheckbox,
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
    .merge(defaultSchema),
  [ClientFormTypes.permissions]: z
    .object({
      addedScopes: zfd.repeatable(z.optional(z.array(z.string()))),
      removedScopes: zfd.repeatable(z.optional(z.array(z.string()))),
    })
    .merge(defaultSchema),
}

type MergedFormDataSchema = typeof schema[ClientFormTypes.advancedSettings] &
  typeof schema[ClientFormTypes.applicationUrls] &
  typeof schema[ClientFormTypes.delegations] &
  typeof schema[ClientFormTypes.lifeTime] &
  typeof schema[ClientFormTypes.permissions] &
  typeof schema[ClientFormTypes.translations]

export type EditClientResult = RouterActionResponse<
  UpdateClientMutation['patchAuthAdminClient'],
  ValidateFormDataResult<MergedFormDataSchema>['errors'],
  keyof typeof ClientFormTypes
>

export const editClientAction: WrappedActionFn = ({ client }) => async ({
  request,
  params,
}): Promise<EditClientResult> => {
  const tenantId = params['tenant']
  const clientId = params['client']

  if (!tenantId) throw new Error('Tenant id not found')
  if (!clientId) throw new Error('Client id not found')

  const formData = await request.formData()
  const { intent, sync } = getIntent(formData, ClientFormTypes)
  const saveInAllEnvironments =
    formData.get(`${intent}_saveInAllEnvironments`) ?? false

  const { data, errors } = await validateFormData({
    formData,
    schema: schema[intent],
  })

  if (errors || !data) {
    return {
      errors,
      data: null,
      globalError: false,
      intent,
    }
  }

  const { syncEnvironments, environment, ...rest } = data

  const environments: AuthAdminEnvironment[] = []

  // If sync settings from this environment was clicked for current form intent, i.e. form section
  // then update all environments with the same settings as the current environment intent
  if (sync && syncEnvironments && syncEnvironments.length > 0) {
    environments.push(...syncEnvironments)
    // If the save in all environments was enabled, then update all environments
  } else if (saveInAllEnvironments) {
    environments.push(...authAdminEnvironments)
  } else {
    // Otherwise, just update the current environment
    environments.push(environment)
  }

  const globalErrorResponse = {
    errors: null,
    data: null,
    globalError: true,
    intent,
  }

  try {
    const response = await client.mutate<
      UpdateClientMutation,
      UpdateClientMutationVariables
    >({
      mutation: UpdateClientDocument,
      variables: {
        input: {
          ...rest,
          clientId,
          tenantId,
          environments,
        },
      },
    })

    if (response.errors?.length) {
      return globalErrorResponse
    }

    return {
      data: response.data?.patchAuthAdminClient ?? null,
      intent,
    }
  } catch (error) {
    return globalErrorResponse
  }
}
