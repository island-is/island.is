import { z, ZodType } from 'zod'
import { WrappedActionFn } from '@island.is/portals/core'
import {
  validateFormData,
  ValidateFormDataResult,
} from '@island.is/react-spa/shared'
import {
  UpdateClientDocument,
  UpdateClientMutation,
  UpdateClientMutationVariables,
} from './EditClient.generated'
import {
  AuthAdminEnvironment,
  AuthAdminTranslatedValue,
  AuthAdminRefreshTokenExpiration,
} from '@island.is/api/schema'

export enum ClientFormTypes {
  applicationUrls = 'applicationUrl',
  lifeTime = 'lifeTime',
  translations = 'translations',
  delegations = 'delegations',
  advancedSettings = 'advancedSettings',
}

const splitStringOnCommaOrSpaceOrNewLine = (s: string) => {
  return s.split(/\s*,\s*|\s+|\n+/)
}

const transformCustomClaims = (s: string) => {
  if (!s) {
    return []
  }

  const array = splitStringOnCommaOrSpaceOrNewLine(s)

  return array.map((claim) => {
    const [type, value] = claim.split('=')
    return { type, value } as { type: string; value: string }
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
  allEnvironments: z.optional(z.string()).transform((s) => {
    return s === 'true'
  }),
  environment: z.nativeEnum(AuthAdminEnvironment),
})

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
      return {
        allEnvironments: data.allEnvironments,
        environment: data.environment,
        displayName: [
          {
            locale: 'is',
            value: data.is_displayName,
          },
          {
            locale: 'en',
            value: data.en_displayName,
          },
        ] as AuthAdminTranslatedValue[],
      }
    }),
  [ClientFormTypes.delegations]: z
    .object({
      supportsProcuringHolders: z.optional(z.string()).transform((s) => {
        return s === 'true'
      }),
      supportsLegalGuardians: z.optional(z.string()).transform((s) => {
        return s === 'true'
      }),
      promptDelegations: z.optional(z.string()).transform((s) => {
        return s === 'true'
      }),
      supportsPersonalRepresentatives: z.optional(z.string()).transform((s) => {
        return s === 'true'
      }),
      supportsCustomDelegation: z.optional(z.string()).transform((s) => {
        return s === 'true'
      }),
      requireApiScopes: z.optional(z.string()).transform((s) => {
        return s === 'true'
      }),
    })
    .merge(defaultSchema),
  [ClientFormTypes.advancedSettings]: z
    .object({
      requirePkce: z.optional(z.string()).transform((s) => {
        return s === 'true'
      }),
      allowOfflineAccess: z.optional(z.string()).transform((s) => {
        return s === 'true'
      }),
      supportTokenExchange: z.optional(z.string()).transform((s) => {
        return s === 'true'
      }),
      requireConsent: z.optional(z.string()).transform((s) => {
        return s === 'true'
      }),
      slidingRefreshTokenLifetime: z
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
}

export type EditApplicationResult<T extends ZodType> =
  | (ValidateFormDataResult<T> & {
      /**
       * Global error message if the mutation fails
       */
      globalError?: boolean
    })
  | undefined

export const editApplicationAction: WrappedActionFn = ({ client }) => async ({
  request,
  params,
}) => {
  const formData = await request.formData()
  const intent = formData.get('intent') as ClientFormTypes

  const result = await validateFormData({
    formData,
    schema: schema[intent],
  })

  const { data, errors } = result

  if (errors || !data) {
    return result
  }

  const { allEnvironments, environment, ...rest } = data

  try {
    const response = await client.mutate<
      UpdateClientMutation,
      UpdateClientMutationVariables
    >({
      mutation: UpdateClientDocument,
      variables: {
        input: {
          clientId: params['client'] as string,
          tenantId: params['tenant'] as string,
          environments: allEnvironments
            ? [
                AuthAdminEnvironment.Development,
                AuthAdminEnvironment.Staging,
                AuthAdminEnvironment.Production,
              ]
            : [environment],
          ...rest,
        },
      },
    })

    return response.data
  } catch (error) {
    return {
      errors: null,
      data: null,
      globalError: true,
    }
  }
}
