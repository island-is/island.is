import {
  validateFormData,
  ValidateFormDataResult,
} from '@island.is/react-spa/shared'
import { WrappedActionFn } from '@island.is/portals/core'
import { z } from 'zod'
import { AuthAdminEnvironment } from '@island.is/api/schema'
import {
  PublishClientDocument,
  PublishClientMutation,
  PublishClientMutationVariables,
} from './PublishClient.generated'

const schema = z.object({
  targetEnvironment: z.nativeEnum(AuthAdminEnvironment),
  sourceEnvironment: z.nativeEnum(AuthAdminEnvironment),
})

export type PublishEnvironmentResult =
  | (ValidateFormDataResult<typeof schema> & {
      /**
       * Global error message if the mutation fails
       */
      globalError?: boolean
    })
  | undefined

export const publishClientAction: WrappedActionFn = ({ client }) => async ({
  request,
  params,
}) => {
  const formData = await request.formData()
  const result = await validateFormData({ formData, schema })

  if (result.errors || !result.data) {
    return result
  }

  const { data } = result

  try {
    const response = await client.mutate<
      PublishClientMutation,
      PublishClientMutationVariables
    >({
      mutation: PublishClientDocument,
      variables: {
        input: {
          clientId: params['client'] as string,
          tenantId: params['tenant'] as string,
          targetEnvironment: data?.targetEnvironment,
          sourceEnvironment: data?.sourceEnvironment,
        },
      },
    })

    return {
      data: response.data?.publishAuthAdminClient,
    }
  } catch (e) {
    return {
      errors: null,
      data: null,
      globalError: true,
    }
  }
}
