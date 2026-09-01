import { useEffect, useRef, useState } from 'react'
import type { ApplicationTypes } from '@island.is/application/types'
import {
  getApplicationTranslationWorkspacePreview,
  getApplicationUIFields,
  type TranslationWorkspacePreviewApplicationData,
} from '@island.is/application/template-loader'
import type { PreviewFieldComponent } from '../utils/previewFieldRegistry'

type CustomFieldMap = Record<string, PreviewFieldComponent>

export const useTemplateCustomFields = (typeId: string | undefined) => {
  const [fields, setFields] = useState<CustomFieldMap>({})
  const [previewApplicationData, setPreviewApplicationData] =
    useState<TranslationWorkspacePreviewApplicationData>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const loadedRef = useRef<string | null>(null)

  useEffect(() => {
    if (!typeId || loadedRef.current === typeId) return

    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.all([
      getApplicationUIFields(typeId as ApplicationTypes),
      getApplicationTranslationWorkspacePreview(
        typeId as ApplicationTypes,
      ).catch(() => ({}) as TranslationWorkspacePreviewApplicationData),
    ])
      .then(([uiFields, previewData]) => {
        if (cancelled) return
        console.log(
          '[useTemplateCustomFields] Loaded fields for',
          typeId,
          Object.keys(uiFields),
        )
        setFields(uiFields as CustomFieldMap)
        setPreviewApplicationData(previewData)
        loadedRef.current = typeId
      })
      .catch((err) => {
        if (cancelled) return
        console.warn(
          `[useTemplateCustomFields] Failed to load fields for ${typeId}`,
          err,
        )
        setError(err instanceof Error ? err : new Error(String(err)))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [typeId])

  return { customFields: fields, previewApplicationData, loading, error }
}
