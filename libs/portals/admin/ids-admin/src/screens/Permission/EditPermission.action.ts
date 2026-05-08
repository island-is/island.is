import { RouterActionResponse, WrappedActionFn } from '@island.is/portals/core'
import {
  validateFormData,
  ValidateFormDataResult,
} from '@island.is/react-spa/shared'
import {
  AuthAdminEnvironment,
  AuthAdminEnvironmentFailure,
} from '@island.is/api/schema'

import {
  PatchAuthAdminScopeDocument,
  PatchAuthAdminScopeMutation,
  PatchAuthAdminScopeMutationVariables,
} from './EditPermission.generated'
import {
  UpdateScopeUsersDocument,
  UpdateScopeUsersMutation,
  UpdateScopeUsersMutationVariables,
} from './components/PermissionAccessControl.generated'
import { authAdminEnvironments } from '../../utils/environments'
import { getIntent } from '../../utils/getIntent'
import {
  MergedFormDataSchema,
  PermissionFormTypes,
  schema,
} from './EditPermission.schema'

export type EditPermissionResult = RouterActionResponse<
  PatchAuthAdminScopeMutation['patchAuthAdminScope']['environments'],
  ValidateFormDataResult<MergedFormDataSchema>['errors'],
  keyof typeof PermissionFormTypes
> & {
  failedEnvironments?: Pick<
    AuthAdminEnvironmentFailure,
    'environment' | 'message'
  >[]
}

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

    const { syncEnvironments, environment, ...rawData } = result.data

    // Extract scope user fields if present (only in ACCESS_CONTROL intent)
    const { addedScopeUserNationalIds, removedScopeUserNationalIds, ...data } =
      rawData as typeof rawData & {
        addedScopeUserNationalIds?: string[]
        removedScopeUserNationalIds?: string[]
      }

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

      const failedEnvironments: NonNullable<
        EditPermissionResult['failedEnvironments']
      > = [
        ...(patchScopeResult.data?.patchAuthAdminScope.failedEnvironments ??
          []),
      ]

      // Update scope users if there are changes
      const hasUserChanges =
        (addedScopeUserNationalIds && addedScopeUserNationalIds.length > 0) ||
        (removedScopeUserNationalIds && removedScopeUserNationalIds.length > 0)

      if (intent === PermissionFormTypes.ACCESS_CONTROL && hasUserChanges) {
        const updateUsersResult = await client.mutate<
          UpdateScopeUsersMutation,
          UpdateScopeUsersMutationVariables
        >({
          mutation: UpdateScopeUsersDocument,
          variables: {
            input: {
              tenantId,
              scopeName,
              addedNationalIds: addedScopeUserNationalIds ?? [],
              removedNationalIds: removedScopeUserNationalIds ?? [],
              environments,
            },
          },
        })

        if (updateUsersResult.errors?.length) {
          const transportMessage = updateUsersResult.errors
            .map((e) => e.message)
            .join('; ')
          for (const env of environments) {
            failedEnvironments.push({
              environment: env,
              message: `Updating scope users failed: ${transportMessage}`,
            })
          }
        } else {
          const userFailures =
            updateUsersResult.data?.updateAuthAdminScopeUsers
              .failedEnvironments ?? []
          failedEnvironments.push(...userFailures)
        }
      }

      return {
        data: patchScopeResult.data?.patchAuthAdminScope.environments ?? null,
        intent,
        ...(failedEnvironments.length > 0 && { failedEnvironments }),
      }
    } catch (e) {
      return globalErrorResponse
    }
  }
