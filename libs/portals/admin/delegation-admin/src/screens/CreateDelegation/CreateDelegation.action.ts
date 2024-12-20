import { z } from 'zod'
import kennitala from 'kennitala'
import isFuture from 'date-fns/isFuture'
import { WrappedActionFn } from '@island.is/portals/core'
import {
  validateFormData,
  ValidateFormDataResult,
} from '@island.is/react-spa/shared'
import {
  CreateDelegationDocument,
  CreateDelegationMutation,
  CreateDelegationMutationVariables,
} from './CreateDelegation.generated'
import {
  findProblemInApolloError,
  Problem,
  ProblemType,
} from '@island.is/shared/problem'

const schema = z
  .object({
    fromNationalId: z
      .string()
      .min(1, 'errorNationalIdFromRequired')
      .transform((fromNationalId) => kennitala.sanitize(fromNationalId))
      .refine(
        (fromNationalId) => kennitala.isValid(fromNationalId),
        'errorNationalIdFromInvalid',
      ),
    toNationalId: z
      .string()
      .min(1, 'errorNationalIdToRequired')
      .transform((toNationalId) => kennitala.sanitize(toNationalId))
      .refine(
        (toNationalId) => kennitala.isValid(toNationalId),
        'errorNationalIdToInvalid',
      ),
    type: z.string(),
    validTo: z.string().optional(),
    referenceId: z.string().min(1, 'errorReferenceIdRequired'),
    confirmed: z.string().optional(),
  })
  .superRefine(({ validTo }, ctx) => {
    if (validTo && !isFuture(new Date(validTo))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'errorValidTo',
        path: ['validTo'],
      })
    }
  })

export type CreateDelegationResult = ValidateFormDataResult<typeof schema> & {
  /**
   * Global error message if the mutation fails
   */
  globalError?: boolean
  problem?: Problem
  success?: boolean
}

export const createDelegationAction: WrappedActionFn =
  ({ client }) =>
  async ({ request }): Promise<CreateDelegationResult | Response> => {
    const formData = await request.formData()
    const result = await validateFormData({ formData, schema })

    if (result.errors || !result.data || result.data.confirmed !== 'true') {
      return result
    }

    const { validTo, confirmed, ...rest } = result.data

    const input: CreateDelegationMutationVariables['input'] = { ...rest }

    if (validTo) {
      input.validTo = new Date(validTo)
    }

    try {
      await client.mutate<
        CreateDelegationMutation,
        CreateDelegationMutationVariables
      >({
        mutation: CreateDelegationDocument,
        variables: {
          input,
        },
      })

      return {
        errors: null,
        data: null,
        globalError: false,
        success: true,
      }
    } catch (e) {
      const problem = findProblemInApolloError(e)
      return {
        errors: null,
        data: null,
        globalError: true,
        problem,
      }
    }
  }
