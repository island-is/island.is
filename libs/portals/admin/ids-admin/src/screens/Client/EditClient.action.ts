import { RouterActionResponse, WrappedActionFn } from '@island.is/portals/core'
import {
  validateFormData,
  ValidateFormDataResult,
} from '@island.is/react-spa/shared'
import { AuthAdminEnvironment } from '@island.is/api/schema'

import {
  UpdateClientDocument,
  UpdateClientMutation,
  UpdateClientMutationVariables,
} from './EditClient.generated'
import { getIntent } from '../../utils/getIntent'
import { authAdminEnvironments } from '../../utils/environments'
import {
  ClientFormTypes,
  MergedFormDataSchema,
  schema,
} from './EditClient.schema'

export type EditClientResult = RouterActionResponse<
  UpdateClientMutation['patchAuthAdminClient'],
  ValidateFormDataResult<MergedFormDataSchema>['errors'],
  keyof typeof ClientFormTypes
>

export const editClientAction: WrappedActionFn =
  ({ client }) =>
  async ({ request, params }): Promise<EditClientResult> => {
    const tenantId = params['tenant']
    const clientId = params['client']

    if (!tenantId) throw new Error('Tenant id not found')
    if (!clientId) throw new Error('Client id not found')

    const formData = await request.formData()
    const { intent, sync } = getIntent(formData, ClientFormTypes)
    const saveInAllEnvironments =
      formData.get(`${intent}_saveInAllEnvironments`) ?? false

    const { data, errors } = await validateFormData({
      formData,
      schema: schema[intent],
    })

    if (errors || !data) {
      return {
        errors,
        data: null,
        globalError: false,
        intent,
      }
    }

    const { syncEnvironments, environment, ...rest } = data

    const environments: AuthAdminEnvironment[] = []

    // If sync settings from this environment was clicked for current form intent, i.e. form section
    // then update all environments with the same settings as the current environment intent
    if (sync && syncEnvironments && syncEnvironments.length > 0) {
      environments.push(...syncEnvironments)
      // If the save in all environments was enabled, then update all environments
    } else if (saveInAllEnvironments) {
      environments.push(...authAdminEnvironments)
    } else {
      // Otherwise, just update the current environment
      environments.push(environment)
    }

    const globalErrorResponse = {
      errors: null,
      data: null,
      globalError: true,
      intent,
    }

    try {
      const response = await client.mutate<
        UpdateClientMutation,
        UpdateClientMutationVariables
      >({
        mutation: UpdateClientDocument,
        variables: {
          input: {
            ...rest,
            clientId,
            tenantId,
            environments,
          },
        },
      })

      if (response.errors?.length) {
        return globalErrorResponse
      }

      return {
        data: response.data?.patchAuthAdminClient ?? null,
        intent,
      }
    } catch (error) {
      return globalErrorResponse
    }
  }
