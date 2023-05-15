import { z } from 'zod'

import { AuthAdminEnvironment } from '@island.is/api/schema'
import { WrappedActionFn } from '@island.is/portals/core'
import { validateFormData } from '@island.is/react-spa/shared'

import {
  RotateSecretDocument,
  RotateSecretMutation,
  RotateSecretMutationVariables,
} from './RotateSecret.generated'

const schema = z.object({
  environment: z.nativeEnum(AuthAdminEnvironment),
  revokeOldSecrets: z
    .string()
    .optional()
    .transform((s) => s === 'true'),
})

export type RotateSecretResult =
  | {
      data: RotateSecretMutation['rotateAuthAdminClientSecret']
      /** Global error message if the mutation fails */
      globalError?: boolean
    }
  | undefined

export const rotateSecretAction: WrappedActionFn = ({ client }) => async ({
  request,
  params,
}) => {
  const formData = await request.formData()
  const result = await validateFormData({ formData, schema })

  if (result.errors || !result.data) {
    return result
  }

  try {
    const response = await client.mutate<
      RotateSecretMutation,
      RotateSecretMutationVariables
    >({
      mutation: RotateSecretDocument,
      variables: {
        input: {
          clientId: params['client'] as string,
          tenantId: params['tenant'] as string,
          environment: result.data.environment,
          revokeOldSecrets: result.data?.revokeOldSecrets,
        },
      },
    })

    return {
      data: response.data?.rotateAuthAdminClientSecret,
    }
  } catch (e) {
    return {
      errors: null,
      data: null,
      globalError: true,
    }
  }
}
