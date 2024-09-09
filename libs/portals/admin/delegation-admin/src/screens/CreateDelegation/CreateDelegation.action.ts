import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { redirect } from 'react-router-dom'

import { WrappedActionFn } from '@island.is/portals/core'
import {
  replaceParams,
  validateFormData,
  ValidateFormDataResult,
} from '@island.is/react-spa/shared'
import {
  CreateDelegationDocument,
  CreateDelegationMutation,
  CreateDelegationMutationVariables,
} from './CreateDelegation.generated'
import { DelegationAdminPaths } from '../../lib/paths'

const schema = z.object({
  fromNationalId: z.string().min(1, 'errorNationalIdFrom'),
  toNationalId: z.string().min(1, 'errorNationalIdTo'),
  type: z.string(),
  validTo: z.string().optional(),
  validInfinite: z.string(),
  referenceId: z.string().min(1, 'errorReferenceId'),
})

export type CreateDelegationResult = ValidateFormDataResult<typeof schema> & {
  /**
   * Global error message if the mutation fails
   */
  globalError?: boolean
}

export const createDelegationAction: WrappedActionFn =
  ({ client }) =>
  async ({ request }): Promise<CreateDelegationResult | Response> => {
  console.log('In action')
    const formData = await request.formData()
    const result = await validateFormData({ formData, schema })

    if (result.errors || !result.data) {
      return result
    }

    const { data } = result

    console.log('Data', data)

    const { validInfinite, validTo, ...rest } = data

    try {
     await client.mutate<
        CreateDelegationMutation,
        CreateDelegationMutationVariables
      >({
        mutation: CreateDelegationDocument,
        variables: {
          input: {
            ...rest,
            validTo: validInfinite === "true" ? null : validTo
          },
        },
      })

      return redirect(DelegationAdminPaths.Root)

    } catch (e) {
      return {
        errors: null,
        data: null,
        globalError: true,
      }
    }
  }
