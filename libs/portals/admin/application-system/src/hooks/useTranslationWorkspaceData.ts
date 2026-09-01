import { useMemo } from 'react'
import { createWorkspacePreviewApplication } from '../components/TranslationWorkspaceFieldPreview'
import {
  useGetApplicationTemplateIntrospectionQuery,
  useGetApplicationTranslationsQuery,
} from '../queries/translations.generated'
import type { WorkspaceTemplateIntrospection } from '../types/translationWorkspace'
import {
  buildPersistedByKey,
  hasDraftChangesInRows,
} from '../utils/translationWorkspaceEditing'
import { useTemplateCustomFields } from './useTemplateCustomFields'

export const useTranslationWorkspaceData = (typeId: string | undefined) => {
  const { customFields } = useTemplateCustomFields(typeId)

  const previewApplication = useMemo(
    () => createWorkspacePreviewApplication(typeId),
    [typeId],
  )

  const { data, loading, error } = useGetApplicationTemplateIntrospectionQuery({
    variables: { typeId: typeId ?? '' },
    skip: !typeId,
    fetchPolicy: 'network-only',
  })

  const introspection = (data?.applicationTemplateIntrospection ??
    null) as WorkspaceTemplateIntrospection | null

  const namespace = introspection?.translationNamespaces[0] ?? typeId ?? ''

  const {
    data: translationsData,
    loading: translationsLoading,
    error: translationsError,
    refetch: refetchTranslations,
  } = useGetApplicationTranslationsQuery({
    variables: { namespace },
    skip: !typeId || !introspection,
  })

  const translationRows = translationsData?.applicationTranslations

  const persistedByKey = useMemo(
    () => buildPersistedByKey(translationRows),
    [translationRows],
  )

  const hasDraftChanges = useMemo(
    () => hasDraftChangesInRows(translationRows),
    [translationRows],
  )

  const isLoading = loading || Boolean(introspection && translationsLoading)
  const loadError = error ?? translationsError

  return {
    introspection,
    namespace,
    customFields,
    previewApplication,
    persistedByKey,
    hasDraftChanges,
    isLoading,
    loadError,
    refetchTranslations,
  }
}
