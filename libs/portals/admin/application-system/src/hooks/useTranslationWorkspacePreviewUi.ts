import { useCallback, useState } from 'react'

export const useTranslationWorkspacePreviewUi = () => {
  const [showValidationErrors, setShowValidationErrors] = useState(false)
  const [focusedFieldId, setFocusedFieldId] = useState<string | null>(null)
  const [fieldsTabActive, setFieldsTabActive] = useState(false)
  const [fieldErrorOverrides, setFieldErrorOverrides] = useState<Set<string>>(
    () => new Set(),
  )
  const [previewFieldValues, setPreviewFieldValues] = useState<
    Record<string, string>
  >({})

  const handleToggleValidationErrors = useCallback(() => {
    setShowValidationErrors((prev) => !prev)
  }, [])

  const handleFocusedFieldChange = useCallback((fieldId: string | null) => {
    setFocusedFieldId(fieldId)
  }, [])

  const handleSetPreviewFieldValue = useCallback(
    (fieldId: string, value: string) => {
      setPreviewFieldValues((prev) => ({ ...prev, [fieldId]: value }))
    },
    [],
  )

  const handleToggleFieldError = useCallback((fieldId: string) => {
    setFieldErrorOverrides((prev) => {
      const next = new Set(prev)
      if (next.has(fieldId)) {
        next.delete(fieldId)
      } else {
        next.add(fieldId)
      }
      return next
    })
  }, [])

  const handleFieldsTabChange = useCallback((tab: string) => {
    setFieldsTabActive(tab === 'fields')
  }, [])

  return {
    showValidationErrors,
    focusedFieldId,
    fieldsTabActive,
    fieldErrorOverrides,
    previewFieldValues,
    handleToggleValidationErrors,
    handleFocusedFieldChange,
    handleSetPreviewFieldValue,
    handleToggleFieldError,
    handleFieldsTabChange,
  }
}
