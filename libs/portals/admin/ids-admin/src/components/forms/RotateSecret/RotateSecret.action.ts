import { z } from 'zod'

import { WrappedActionFn } from '@island.is/portals/core'
import {
  validateFormData,
  ValidateFormDataResult,
} from '@island.is/react-spa/shared'

import {
  RotateSecretDocument,
  RotateSecretMutation,
  RotateSecretMutationVariables,
} from './RotateSecret.generated'
import { AuthAdminEnvironment } from '@island.is/api/schema'

const schema = z.object({
  environment: z.nativeEnum(AuthAdminEnvironment),
  revokeOldSecrets: z
    .string()
    .optional()
    .transform((s) => {
      return s === 'true'
    }),
})

const resultSchema = z.object({
  decryptedValue: z.string(),
})

export type RotateSecretResult =
  | (ValidateFormDataResult<typeof resultSchema> & {
      /** Global error message if the mutation fails */
      globalError?: boolean
    })
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
