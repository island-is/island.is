import { AuthAdminEnvironment } from '@island.is/api/schema'
import { WrappedActionFn } from '@island.is/portals/core'

import {
  CreateLanguageDocument,
  CreateLanguageMutation,
  CreateLanguageMutationVariables,
  UpdateLanguageDocument,
  UpdateLanguageMutation,
  UpdateLanguageMutationVariables,
  DeleteLanguageDocument,
  DeleteLanguageMutation,
  DeleteLanguageMutationVariables,
} from './Languages.generated'

export enum LanguageIntent {
  create = 'create',
  update = 'update',
  delete = 'delete',
}

export type LanguagesActionResult = {
  intent: LanguageIntent
  data?: unknown
  globalError?: boolean
  errorMessage?: string
}

const parseEnvironments = (
  formData: FormData,
): AuthAdminEnvironment[] | undefined => {
  const raw = formData.get('environments') as string | null
  if (!raw) return undefined
  return JSON.parse(raw) as AuthAdminEnvironment[]
}

export const languagesAction: WrappedActionFn =
  ({ client }) =>
  async ({ request }): Promise<LanguagesActionResult> => {
    const formData = await request.formData()
    const intent = formData.get('intent') as LanguageIntent

    try {
      switch (intent) {
        case LanguageIntent.create: {
          const response = await client.mutate<
            CreateLanguageMutation,
            CreateLanguageMutationVariables
          >({
            mutation: CreateLanguageDocument,
            variables: {
              input: {
                isoKey: formData.get('isoKey') as string,
                description: formData.get('description') as string,
                englishDescription: formData.get(
                  'englishDescription',
                ) as string,
                environments: parseEnvironments(formData),
              },
            },
          })

          if (response.errors?.length) {
            return {
              intent,
              globalError: true,
              errorMessage: response.errors[0].message,
            }
          }

          return { intent, data: response.data?.createAuthAdminLanguage }
        }

        case LanguageIntent.update: {
          const response = await client.mutate<
            UpdateLanguageMutation,
            UpdateLanguageMutationVariables
          >({
            mutation: UpdateLanguageDocument,
            variables: {
              input: {
                isoKey: formData.get('isoKey') as string,
                description: formData.get('description') as string,
                englishDescription: formData.get(
                  'englishDescription',
                ) as string,
                environments: parseEnvironments(formData),
              },
            },
          })

          if (response.errors?.length) {
            return {
              intent,
              globalError: true,
              errorMessage: response.errors[0].message,
            }
          }

          return { intent, data: response.data?.updateAuthAdminLanguage }
        }

        case LanguageIntent.delete: {
          const response = await client.mutate<
            DeleteLanguageMutation,
            DeleteLanguageMutationVariables
          >({
            mutation: DeleteLanguageDocument,
            variables: {
              input: {
                isoKey: formData.get('isoKey') as string,
                environments: parseEnvironments(formData),
              },
            },
          })

          if (response.errors?.length) {
            return {
              intent,
              globalError: true,
              errorMessage: response.errors[0].message,
            }
          }

          return { intent, data: response.data?.deleteAuthAdminLanguage }
        }

        default:
          return { intent, globalError: true }
      }
    } catch (error) {
      return {
        intent,
        globalError: true,
        errorMessage: error instanceof Error ? error.message : undefined,
      }
    }
  }
