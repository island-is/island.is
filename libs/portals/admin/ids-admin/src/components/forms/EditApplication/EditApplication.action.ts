import { z, ZodType } from 'zod'
import { WrappedActionFn } from '@island.is/portals/core'
import {
  validateFormData,
  ValidateFormDataResult,
} from '@island.is/react-spa/shared'

export enum ClientFormTypes {
  applicationUrls = 'applicationUrl',
  lifeTime = 'lifeTime',
  translations = 'translations',
}

const splitStringOnCommaOrSpaceOrNewLine = (s: string) => {
  return s.split(/\s*,\s*|\s+|\n+/)
}

const checkIfStringIsListOfUrls = (urls: string) => {
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

const checkIfStringIsPositiveNumber = (number: string) => {
  return /^[0-9]+$/.test(number.trim())
}

const defaultSchema = z.object({
  allEnvironments: z.optional(z.string()).transform((s) => {
    return s === 'true'
  }),
})

export const schema = {
  [ClientFormTypes.lifeTime]: z
    .object({
      absoluteLifeTime: z
        .string()
        .refine(checkIfStringIsPositiveNumber, {
          message: 'errorPositiveNumber',
        })
        .transform((s) => {
          return Number(s)
        }),
      inactivityExpiration: z.optional(z.string()).transform((s) => {
        return s === 'on'
      }),
      inactivityLifeTime: z.string().transform((s) => {
        return Number(s)
      }),
    })
    .merge(defaultSchema)
    .refine(
      (data) => {
        if (data.inactivityExpiration) {
          return checkIfStringIsPositiveNumber(
            data.inactivityLifeTime.toString(),
          )
        }
        return true
      },
      {
        message: 'errorPositiveNumber',
        path: ['inactivityLifeTime'],
      },
    ),
  [ClientFormTypes.applicationUrls]: z
    .object({
      callbackUrls: z
        .string()
        .refine(checkIfStringIsListOfUrls, {
          message: 'errorInvalidUrls',
        })
        .transform(splitStringOnCommaOrSpaceOrNewLine),
      logoutUrls: z
        .string()
        .refine(checkIfStringIsListOfUrls, {
          message: 'errorInvalidUrls',
        })
        .transform(splitStringOnCommaOrSpaceOrNewLine),
      cors: z
        .string()
        .refine(checkIfStringIsListOfUrls, {
          message: 'errorInvalidUrls',
        })
        .transform(splitStringOnCommaOrSpaceOrNewLine),
    })
    .merge(defaultSchema),
  [ClientFormTypes.translations]: z
    .object({
      is_displayName: z.string(),
      en_displayName: z.string(),
    })
    .merge(defaultSchema)
    .transform((data) => {
      return {
        translation: [
          {
            locale: 'is',
            displayName: data.is_displayName,
          },
          {
            locale: 'en',
            displayName: data.en_displayName,
          },
        ],
      }
    }),
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

  //Todo: call graphql mutation for the given intent

  return result
}
