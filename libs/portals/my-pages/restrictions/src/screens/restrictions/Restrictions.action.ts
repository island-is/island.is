import { FormatMessage } from '@island.is/localization'
import { WrappedActionFn } from '@island.is/portals/core'
import {
  validateFormData,
  ValidateFormDataResult,
} from '@island.is/react-spa/shared'
import {
  CreateLoginRestrictionDocument,
  CreateLoginRestrictionMutation,
  CreateLoginRestrictionMutationVariables,
  RemoveLoginRestrictionDocument,
  RemoveLoginRestrictionMutation,
  RemoveLoginRestrictionMutationVariables,
} from './Restrictions.generated'

import { z } from 'zod'
import { m } from '../../lib/messages'

export enum RestrictionsIntent {
  Enable = 'enable',
  Disable = 'disable',
}

const isoDateRegExp = new RegExp(
  /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/,
)

const createSchema = (formatMessage: FormatMessage) => {
  const invalidIntent = {
    invalid_type_error: formatMessage(m.invalidIntent),
  }

  return z.discriminatedUnion('intent', [
    z.object({
      intent: z.literal(RestrictionsIntent.Enable, invalidIntent),
      until: z
        .string()
        .regex(isoDateRegExp, formatMessage(m.invalidDate))
        .refine((dateUntil) => new Date(dateUntil)),
    }),
    z.object({ intent: z.literal(RestrictionsIntent.Disable, invalidIntent) }),
  ])
}

type SchemaError = ValidateFormDataResult<
  ReturnType<typeof createSchema>
>['errors']

export type RestrictionsResponse =
  | {
      data: CreateLoginRestrictionMutation['createAuthLoginRestriction'] | true
      errors?: never
    }
  | {
      data?: never
      errors: SchemaError | null
    }

export const restrictionsAction: WrappedActionFn = ({
  formatMessage,
  client,
}) => {
  return async ({ request }): Promise<RestrictionsResponse> => {
    const { data, errors } = await validateFormData({
      formData: await request.formData(),
      schema: createSchema(formatMessage),
    })

    if (errors || !data) {
      return {
        errors,
      }
    }

    if (data.intent === RestrictionsIntent.Enable) {
      // Create restriction
      const createRes = await client.mutate<
        CreateLoginRestrictionMutation,
        CreateLoginRestrictionMutationVariables
      >({
        mutation: CreateLoginRestrictionDocument,
        variables: {
          input: {
            until: data.until,
          },
        },
      })

      if (createRes.errors) {
        throw new Error(createRes.errors[0].message)
      }

      const createAuthLoginRestriction =
        createRes.data?.createAuthLoginRestriction

      if (createAuthLoginRestriction) {
        return {
          data: createAuthLoginRestriction,
        }
      }

      throw new Error('Failed to create restriction')
    }

    // Remove restriction
    const removeRes = await client.mutate<
      RemoveLoginRestrictionMutation,
      RemoveLoginRestrictionMutationVariables
    >({
      mutation: RemoveLoginRestrictionDocument,
    })

    if (removeRes.errors) {
      throw new Error(removeRes.errors[0].message)
    }

    const removeAuthLoginRestriction =
      removeRes.data?.removeAuthLoginRestriction

    if (removeAuthLoginRestriction) {
      return {
        data: removeAuthLoginRestriction,
      }
    }

    throw new Error('Failed to remove restriction')
  }
}
