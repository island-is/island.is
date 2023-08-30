import { RouterActionResponse, WrappedActionFn } from '@island.is/portals/core'
import {
  validateFormData,
  ValidateFormDataResult,
} from '@island.is/react-spa/shared'
import { AuthAdminEnvironment } from '@island.is/api/schema'

import {
  PatchAuthAdminScopeDocument,
  PatchAuthAdminScopeMutation,
  PatchAuthAdminScopeMutationVariables,
} from './EditPermission.generated'
import { authAdminEnvironments } from '../../utils/environments'
import { getIntent } from '../../utils/getIntent'
import {
  MergedFormDataSchema,
  PermissionFormTypes,
  schema,
} from './EditPermission.schema'

export type EditPermissionResult = RouterActionResponse<
  PatchAuthAdminScopeMutation['patchAuthAdminScope'],
  ValidateFormDataResult<MergedFormDataSchema>['errors'],
  keyof typeof PermissionFormTypes
>

export const editPermissionAction: WrappedActionFn =
  ({ client }) =>
  async ({ request, params }): Promise<EditPermissionResult> => {
    const tenantId = params['tenant']
    const scopeName = params['permission']

    if (!tenantId) throw new Error('Tenant id not found')
    if (!scopeName) throw new Error('Permission id not found')

    const formData = await request.formData()
    const { intent, sync } = getIntent(formData, PermissionFormTypes)
    const saveInAllEnvironments =
      formData.get(`${intent}_saveInAllEnvironments`) ?? false

    const result = await validateFormData({
      formData,
      schema: schema[intent],
    })

    if (result.errors || !result.data) {
      return {
        errors: result.errors,
        data: null,
        globalError: false,
        intent,
      }
    }

    const { syncEnvironments, environment, ...data } = result.data

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
      const patchScopeResult = await client.mutate<
        PatchAuthAdminScopeMutation,
        PatchAuthAdminScopeMutationVariables
      >({
        mutation: PatchAuthAdminScopeDocument,
        variables: {
          input: {
            ...data,
            tenantId,
            scopeName,
            environments,
          },
        },
      })

      if (patchScopeResult.errors?.length) {
        return globalErrorResponse
      }

      return {
        data: patchScopeResult.data?.patchAuthAdminScope ?? null,
        intent,
      }
    } catch (e) {
      return globalErrorResponse
    }
  }
