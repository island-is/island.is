import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { redirect } from 'react-router-dom'

import { WrappedActionFn } from '@island.is/portals/core'
import {
  replaceParams,
  validateFormData,
  ValidateFormDataResult,
} from '@island.is/react-spa/shared'

const schema = z.object({
  nationalIdFrom: z.string().min(1, 'errorNationalIdFrom'),
  nationalIdTo: z.string().min(1, 'errorNationalIdTo'),
  accessType: z.string(),
  validToDate: z.string().optional(),
  validInfinite: z.string(),
  referenceId: z.string(),
})

export type CreateDelegationResult = ValidateFormDataResult<typeof schema> & {
  /**
   * Global error message if the mutation fails
   */
  globalError?: boolean
}

export const createDelegationAction: WrappedActionFn =
  ({ client }) =>
  async ({ request }): Promise<any | Response> => {
    // TODO type
    const formData = await request.formData()
    const result = await validateFormData({ formData, schema })

    console.log(result)

    if (result.errors || !result.data) {
      return result
    }

    const { data } = result

    // temp
    return {
      errors: null,
      data: null,
      globalError: true,
    }

    // try {
    //   await client.mutate<
    //     CreateAuthAdminScopeMutation,
    //     CreateAuthAdminScopeMutationVariables
    //   >({
    //     mutation: CreateAuthAdminScopeDocument,
    //     variables: {
    //       input: data,
    //     },
    //   })

    //   return redirect(
    //     replaceParams({
    //       href: IDSAdminPaths.IDSAdminPermission,
    //       params: {
    //         tenant: data?.tenantId,
    //         permission: data?.name,
    //       },
    //     }),
    //   )
    // } catch (e) {
    //   return {
    //     errors: null,
    //     data: null,
    //     globalError: true,
    //   }
    // }
  }
