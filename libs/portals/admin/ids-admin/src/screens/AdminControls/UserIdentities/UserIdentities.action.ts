import { AuthAdminEnvironment } from '@island.is/api/schema'
import { WrappedActionFn } from '@island.is/portals/core'

import {
  DeactivateUserIdentityDocument,
  DeactivateUserIdentityMutation,
  DeactivateUserIdentityMutationVariables,
  ReactivateUserIdentityDocument,
  ReactivateUserIdentityMutation,
  ReactivateUserIdentityMutationVariables,
} from './UserIdentities.generated'

export enum UserIdentityIntent {
  deactivate = 'deactivate',
  reactivate = 'reactivate',
}

export type UserIdentitiesActionResult = {
  intent: UserIdentityIntent
  data?: unknown
  globalError?: boolean
}

const parseEnvironments = (formData: FormData): AuthAdminEnvironment[] => {
  const raw = formData.get('environments') as string | null
  if (!raw) return []
  return JSON.parse(raw) as AuthAdminEnvironment[]
}

export const userIdentitiesAction: WrappedActionFn =
  ({ client }) =>
  async ({ request }): Promise<UserIdentitiesActionResult> => {
    const formData = await request.formData()
    const intent = formData.get('intent') as UserIdentityIntent
    const subjectId = formData.get('subjectId') as string
    const environments = parseEnvironments(formData)

    try {
      switch (intent) {
        case UserIdentityIntent.deactivate: {
          const response = await client.mutate<
            DeactivateUserIdentityMutation,
            DeactivateUserIdentityMutationVariables
          >({
            mutation: DeactivateUserIdentityDocument,
            variables: { input: { subjectId, environments } },
          })

          if (response.errors?.length) {
            return { intent, globalError: true }
          }

          return {
            intent,
            data: response.data?.deactivateAuthAdminUserIdentity,
          }
        }

        case UserIdentityIntent.reactivate: {
          const response = await client.mutate<
            ReactivateUserIdentityMutation,
            ReactivateUserIdentityMutationVariables
          >({
            mutation: ReactivateUserIdentityDocument,
            variables: { input: { subjectId, environments } },
          })

          if (response.errors?.length) {
            return { intent, globalError: true }
          }

          return {
            intent,
            data: response.data?.reactivateAuthAdminUserIdentity,
          }
        }

        default:
          return { intent, globalError: true }
      }
    } catch {
      return { intent, globalError: true }
    }
  }
