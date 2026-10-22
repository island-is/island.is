import { useEffect, useRef, useState } from 'react'
import type { ApplicationTypes } from '@island.is/application/types'
import {
  getApplicationTranslationWorkspacePreview,
  getApplicationUIFields,
  type TranslationWorkspacePreviewApplicationData,
} from '@island.is/application/template-loader'
import type { PreviewFieldComponent } from '../utils/previewFieldRegistry'
import {
  loadCustomFieldPropsByForm,
  type CustomFieldPropsByForm,
} from '../utils/customFieldProps'

type CustomFieldMap = Record<string, PreviewFieldComponent>

export const useTemplateCustomFields = (typeId: string | undefined) => {
  const [fields, setFields] = useState<CustomFieldMap>({})
  const [previewApplicationData, setPreviewApplicationData] =
    useState<TranslationWorkspacePreviewApplicationData>({})
  const [customFieldPropsByForm, setCustomFieldPropsByForm] =
    useState<CustomFieldPropsByForm>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const loadedRef = useRef<string | null>(null)

  useEffect(() => {
    if (!typeId) {
      setFields({})
      setPreviewApplicationData({})
      setCustomFieldPropsByForm({})
      setLoading(false)
      setError(null)
      loadedRef.current = null
      return
    }

    if (loadedRef.current === typeId) return

    let cancelled = false
    setFields({})
    setPreviewApplicationData({})
    setCustomFieldPropsByForm({})
    setLoading(true)
    setError(null)

    Promise.all([
      getApplicationUIFields(typeId as ApplicationTypes),
      getApplicationTranslationWorkspacePreview(
        typeId as ApplicationTypes,
      ).catch(() => ({} as TranslationWorkspacePreviewApplicationData)),
      loadCustomFieldPropsByForm(typeId as ApplicationTypes).catch(
        () => ({} as CustomFieldPropsByForm),
      ),
    ])
      .then(([uiFields, previewData, propsByForm]) => {
        if (cancelled) return
        setFields(uiFields as CustomFieldMap)
        setPreviewApplicationData(previewData)
        setCustomFieldPropsByForm(propsByForm)
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

  return {
    customFields: fields,
    previewApplicationData,
    customFieldPropsByForm,
    loading,
    error,
  }
}
