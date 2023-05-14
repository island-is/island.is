import { z } from 'zod'

import { WrappedActionFn } from '@island.is/portals/core'
import {
  validateFormData,
  ValidateFormDataResult,
} from '@island.is/react-spa/shared'
import { AuthAdminEnvironment } from '@island.is/api/schema'

import {
  RevokeSecretsDocument,
  RevokeSecretsMutation,
  RevokeSecretsMutationVariables,
} from './RevokeSecrets.generated'
import IDSAdmin from '../../../screens/IDSAdmin'
import { IDSAdminPaths } from '../../../lib/paths'
import { redirect } from 'react-router-dom'

const schema = z.object({
  environment: z.nativeEnum(AuthAdminEnvironment),
})

const resultSchema = z.boolean()

export type RevokeSecretsResult =
  | (ValidateFormDataResult<typeof resultSchema> & {
      /** Global error message if the mutation fails */
      globalError?: boolean
    })
  | undefined

export const revokeSecretsAction: WrappedActionFn = ({ client }) => async ({
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
      RevokeSecretsMutation,
      RevokeSecretsMutationVariables
    >({
      mutation: RevokeSecretsDocument,
      variables: {
        input: {
          clientId: params['client'] as string,
          tenantId: params['tenant'] as string,
          environment: result.data.environment,
        },
      },
    })

    return {
      data: response.data?.revokeAuthAdminClientSecrets,
    }
  } catch (e) {
    return {
      errors: null,
      data: null,
      globalError: true,
    }
  }
}
