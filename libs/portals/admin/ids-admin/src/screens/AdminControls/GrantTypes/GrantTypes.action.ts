import { AuthAdminEnvironment } from '@island.is/api/schema'
import { WrappedActionFn } from '@island.is/portals/core'

import {
  CreateGrantTypeDocument,
  CreateGrantTypeMutation,
  CreateGrantTypeMutationVariables,
  UpdateGrantTypeDocument,
  UpdateGrantTypeMutation,
  UpdateGrantTypeMutationVariables,
  DeleteGrantTypeDocument,
  DeleteGrantTypeMutation,
  DeleteGrantTypeMutationVariables,
} from './GrantTypes.generated'

export enum GrantTypeIntent {
  create = 'create',
  update = 'update',
  delete = 'delete',
}

export type GrantTypesActionResult = {
  intent: GrantTypeIntent
  data?: unknown
  globalError?: boolean
}

const parseEnvironments = (
  formData: FormData,
): AuthAdminEnvironment[] | undefined => {
  const raw = formData.get('environments') as string | null
  if (!raw) return undefined
  return JSON.parse(raw) as AuthAdminEnvironment[]
}

export const grantTypesAction: WrappedActionFn =
  ({ client }) =>
  async ({ request }): Promise<GrantTypesActionResult> => {
    const formData = await request.formData()
    const intent = formData.get('intent') as GrantTypeIntent

    try {
      switch (intent) {
        case GrantTypeIntent.create: {
          const response = await client.mutate<
            CreateGrantTypeMutation,
            CreateGrantTypeMutationVariables
          >({
            mutation: CreateGrantTypeDocument,
            variables: {
              input: {
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                environments: parseEnvironments(formData),
              },
            },
          })

          if (response.errors?.length) {
            return { intent, globalError: true }
          }

          return { intent, data: response.data?.createAuthAdminGrantType }
        }

        case GrantTypeIntent.update: {
          const response = await client.mutate<
            UpdateGrantTypeMutation,
            UpdateGrantTypeMutationVariables
          >({
            mutation: UpdateGrantTypeDocument,
            variables: {
              input: {
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                environments: parseEnvironments(formData),
              },
            },
          })

          if (response.errors?.length) {
            return { intent, globalError: true }
          }

          return { intent, data: response.data?.updateAuthAdminGrantType }
        }

        case GrantTypeIntent.delete: {
          const response = await client.mutate<
            DeleteGrantTypeMutation,
            DeleteGrantTypeMutationVariables
          >({
            mutation: DeleteGrantTypeDocument,
            variables: {
              input: {
                name: formData.get('name') as string,
              },
            },
          })

          if (response.errors?.length) {
            return { intent, globalError: true }
          }

          return { intent, data: response.data?.deleteAuthAdminGrantType }
        }

        default:
          return { intent, globalError: true }
      }
    } catch {
      return { intent, globalError: true }
    }
  }
