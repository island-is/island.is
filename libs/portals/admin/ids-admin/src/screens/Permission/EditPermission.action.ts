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
import {
  AuthAdminScopeDocument,
  AuthAdminScopeQuery,
  AuthAdminScopeQueryVariables,
} from './Permission.generated'
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
      // If the save in all environments was enabled,
      // then update every environment the scope is configured in.
    } else if (saveInAllEnvironments) {
      environments.push(environment, ...(syncEnvironments ?? []))
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

      if (
        intent === PermissionFormTypes.ACCESS_CONTROL &&
        sync &&
        syncEnvironments &&
        syncEnvironments.length > 0
      ) {
        // Sync users from the source (current) environment to the target
        // environments. Refetch with network-only so deltas are computed
        // against the authoritative current state — the Apollo cache may
        // be stale (e.g., unsaved dropdown edits, recent writes elsewhere).
        const freshScope = await client.query<
          AuthAdminScopeQuery,
          AuthAdminScopeQueryVariables
        >({
          query: AuthAdminScopeDocument,
          variables: { input: { tenantId, scopeName } },
          fetchPolicy: 'network-only',
        })

        const envs = freshScope.data?.authAdminScope?.environments ?? []
        const sourceUserIds =
          envs.find((e) => e.environment === environment)?.userNationalIds ?? []

        for (const targetEnv of syncEnvironments) {
          const targetUserIds =
            envs.find((e) => e.environment === targetEnv)?.userNationalIds ?? []
          const added = sourceUserIds.filter(
            (id) => !targetUserIds.includes(id),
          )
          const removed = targetUserIds.filter(
            (id) => !sourceUserIds.includes(id),
          )

          if (added.length === 0 && removed.length === 0) continue

          const syncResult = await client.mutate<
            UpdateScopeUsersMutation,
            UpdateScopeUsersMutationVariables
          >({
            mutation: UpdateScopeUsersDocument,
            variables: {
              input: {
                tenantId,
                scopeName,
                addedNationalIds: added,
                removedNationalIds: removed,
                environments: [targetEnv],
              },
            },
          })

          if (syncResult.errors?.length) {
            const transportMessage = syncResult.errors
              .map((e) => e.message)
              .join('; ')
            failedEnvironments.push({
              environment: targetEnv,
              message: `Syncing scope users failed: ${transportMessage}`,
            })
          } else {
            const userFailures =
              syncResult.data?.updateAuthAdminScopeUsers.failedEnvironments ??
              []
            failedEnvironments.push(...userFailures)
          }
        }
      } else if (
        intent === PermissionFormTypes.ACCESS_CONTROL &&
        hasUserChanges
      ) {
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
