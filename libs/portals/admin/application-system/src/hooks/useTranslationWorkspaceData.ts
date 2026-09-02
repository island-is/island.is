import { getOwnedTranslationNamespaces } from '@island.is/application/utils'
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
  const {
    customFields,
    previewApplicationData,
    loading: customFieldsLoading,
    error: customFieldsError,
  } = useTemplateCustomFields(typeId)

  const previewApplication = useMemo(
    () => createWorkspacePreviewApplication(typeId, previewApplicationData),
    [typeId, previewApplicationData],
  )

  const { data, loading, error } = useGetApplicationTemplateIntrospectionQuery({
    variables: { typeId: typeId ?? '' },
    skip: !typeId,
    fetchPolicy: 'network-only',
  })

  const introspection = (data?.applicationTemplateIntrospection ??
    null) as WorkspaceTemplateIntrospection | null

  const namespace =
    getOwnedTranslationNamespaces(
      introspection?.translationNamespaces ?? [],
    )[0] ??
    typeId ??
    ''

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

  const isLoading =
    loading ||
    customFieldsLoading ||
    Boolean(introspection && translationsLoading)
  const loadError = error ?? translationsError ?? customFieldsError

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
