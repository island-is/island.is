import { AuthAdminEnvironment } from '@island.is/api/schema'
import { WrappedActionFn } from '@island.is/portals/core'

import {
  CreateTranslationDocument,
  CreateTranslationMutation,
  CreateTranslationMutationVariables,
  UpdateTranslationDocument,
  UpdateTranslationMutation,
  UpdateTranslationMutationVariables,
  DeleteTranslationDocument,
  DeleteTranslationMutation,
  DeleteTranslationMutationVariables,
} from './Translations.generated'

export enum TranslationIntent {
  create = 'create',
  update = 'update',
  delete = 'delete',
}

export type TranslationsActionResult = {
  intent: TranslationIntent
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

export const translationsAction: WrappedActionFn =
  ({ client }) =>
  async ({ request }): Promise<TranslationsActionResult> => {
    const formData = await request.formData()
    const intent = formData.get('intent') as TranslationIntent

    try {
      switch (intent) {
        case TranslationIntent.create: {
          const response = await client.mutate<
            CreateTranslationMutation,
            CreateTranslationMutationVariables
          >({
            mutation: CreateTranslationDocument,
            variables: {
              input: {
                language: formData.get('language') as string,
                className: formData.get('className') as string,
                property: formData.get('property') as string,
                key: formData.get('key') as string,
                value: (formData.get('value') as string) ?? '',
                environments: parseEnvironments(formData),
              },
            },
          })

          if (response.errors?.length) {
            return { intent, globalError: true }
          }

          return { intent, data: response.data?.createAuthAdminTranslation }
        }

        case TranslationIntent.update: {
          const response = await client.mutate<
            UpdateTranslationMutation,
            UpdateTranslationMutationVariables
          >({
            mutation: UpdateTranslationDocument,
            variables: {
              input: {
                language: formData.get('language') as string,
                className: formData.get('className') as string,
                property: formData.get('property') as string,
                key: formData.get('key') as string,
                value: (formData.get('value') as string) ?? '',
                environments: parseEnvironments(formData),
              },
            },
          })

          if (response.errors?.length) {
            return { intent, globalError: true }
          }

          return { intent, data: response.data?.updateAuthAdminTranslation }
        }

        case TranslationIntent.delete: {
          const response = await client.mutate<
            DeleteTranslationMutation,
            DeleteTranslationMutationVariables
          >({
            mutation: DeleteTranslationDocument,
            variables: {
              input: {
                language: formData.get('language') as string,
                className: formData.get('className') as string,
                property: formData.get('property') as string,
                key: formData.get('key') as string,
                environments: parseEnvironments(formData),
              },
            },
          })

          if (response.errors?.length) {
            return { intent, globalError: true }
          }

          return { intent, data: response.data?.deleteAuthAdminTranslation }
        }

        default:
          return { intent, globalError: true }
      }
    } catch {
      return { intent, globalError: true }
    }
  }
