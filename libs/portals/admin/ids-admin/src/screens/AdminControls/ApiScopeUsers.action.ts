import { WrappedActionFn } from '@island.is/portals/core'

import {
  CreateApiScopeUserDocument,
  CreateApiScopeUserMutation,
  CreateApiScopeUserMutationVariables,
  UpdateApiScopeUserDocument,
  UpdateApiScopeUserMutation,
  UpdateApiScopeUserMutationVariables,
  DeleteApiScopeUserDocument,
  DeleteApiScopeUserMutation,
  DeleteApiScopeUserMutationVariables,
} from './ApiScopeUsers.generated'

export enum ApiScopeUserIntent {
  create = 'create',
  update = 'update',
  delete = 'delete',
}

export type ApiScopeUsersActionResult = {
  intent: ApiScopeUserIntent
  data?: unknown
  globalError?: boolean
}

const parseUserAccess = (
  formData: FormData,
  nationalId: string,
): Array<{ nationalId: string; scope: string }> | undefined => {
  const raw = formData.get('userAccess') as string | null
  if (!raw) return undefined
  try {
    const scopes = JSON.parse(raw) as string[]
    return scopes.map((scope) => ({ nationalId, scope }))
  } catch {
    return undefined
  }
}

export const apiScopeUsersAction: WrappedActionFn =
  ({ client }) =>
  async ({ request }): Promise<ApiScopeUsersActionResult> => {
    const formData = await request.formData()
    const intent = formData.get('intent') as ApiScopeUserIntent

    try {
      switch (intent) {
        case ApiScopeUserIntent.create: {
          const nationalId = formData.get('nationalId') as string
          const response = await client.mutate<
            CreateApiScopeUserMutation,
            CreateApiScopeUserMutationVariables
          >({
            mutation: CreateApiScopeUserDocument,
            variables: {
              input: {
                nationalId,
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                userAccess: parseUserAccess(formData, nationalId),
              },
            },
          })

          if (response.errors?.length) {
            return { intent, globalError: true }
          }

          return { intent, data: response.data?.createAuthAdminApiScopeUser }
        }

        case ApiScopeUserIntent.update: {
          const nationalId = formData.get('nationalId') as string
          const response = await client.mutate<
            UpdateApiScopeUserMutation,
            UpdateApiScopeUserMutationVariables
          >({
            mutation: UpdateApiScopeUserDocument,
            variables: {
              input: {
                nationalId,
                name: (formData.get('name') as string) || undefined,
                email: (formData.get('email') as string) || undefined,
                userAccess: parseUserAccess(formData, nationalId),
              },
            },
          })

          if (response.errors?.length) {
            return { intent, globalError: true }
          }

          return { intent, data: response.data?.updateAuthAdminApiScopeUser }
        }

        case ApiScopeUserIntent.delete: {
          const response = await client.mutate<
            DeleteApiScopeUserMutation,
            DeleteApiScopeUserMutationVariables
          >({
            mutation: DeleteApiScopeUserDocument,
            variables: {
              input: {
                nationalId: formData.get('nationalId') as string,
              },
            },
          })

          if (response.errors?.length) {
            return { intent, globalError: true }
          }

          return { intent, data: response.data?.deleteAuthAdminApiScopeUser }
        }

        default:
          return { intent, globalError: true }
      }
    } catch {
      return { intent, globalError: true }
    }
  }
