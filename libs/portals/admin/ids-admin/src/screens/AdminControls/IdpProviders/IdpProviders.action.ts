import { AuthAdminEnvironment } from '@island.is/api/schema'
import { WrappedActionFn } from '@island.is/portals/core'

import {
  CreateIdpProviderDocument,
  CreateIdpProviderMutation,
  CreateIdpProviderMutationVariables,
  UpdateIdpProviderDocument,
  UpdateIdpProviderMutation,
  UpdateIdpProviderMutationVariables,
  DeleteIdpProviderDocument,
  DeleteIdpProviderMutation,
  DeleteIdpProviderMutationVariables,
} from './IdpProviders.generated'

export enum IdpProviderIntent {
  create = 'create',
  update = 'update',
  delete = 'delete',
}

export type IdpProvidersActionResult = {
  intent: IdpProviderIntent
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

export const idpProvidersAction: WrappedActionFn =
  ({ client }) =>
  async ({ request }): Promise<IdpProvidersActionResult> => {
    const formData = await request.formData()
    const intent = formData.get('intent') as IdpProviderIntent

    try {
      switch (intent) {
        case IdpProviderIntent.create: {
          const response = await client.mutate<
            CreateIdpProviderMutation,
            CreateIdpProviderMutationVariables
          >({
            mutation: CreateIdpProviderDocument,
            variables: {
              input: {
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                helptext: formData.get('helptext') as string,
                level: Number(formData.get('level')),
                environments: parseEnvironments(formData),
              },
            },
          })

          if (response.errors?.length) {
            return { intent, globalError: true }
          }

          return { intent, data: response.data?.createAuthAdminIdpProvider }
        }

        case IdpProviderIntent.update: {
          const response = await client.mutate<
            UpdateIdpProviderMutation,
            UpdateIdpProviderMutationVariables
          >({
            mutation: UpdateIdpProviderDocument,
            variables: {
              input: {
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                helptext: formData.get('helptext') as string,
                level: Number(formData.get('level')),
                environments: parseEnvironments(formData),
              },
            },
          })

          if (response.errors?.length) {
            return { intent, globalError: true }
          }

          return { intent, data: response.data?.updateAuthAdminIdpProvider }
        }

        case IdpProviderIntent.delete: {
          const response = await client.mutate<
            DeleteIdpProviderMutation,
            DeleteIdpProviderMutationVariables
          >({
            mutation: DeleteIdpProviderDocument,
            variables: {
              input: {
                name: formData.get('name') as string,
                environments: parseEnvironments(formData),
              },
            },
          })

          if (response.errors?.length) {
            return { intent, globalError: true }
          }

          return { intent, data: response.data?.deleteAuthAdminIdpProvider }
        }

        default:
          return { intent, globalError: true }
      }
    } catch {
      return { intent, globalError: true }
    }
  }
