export interface LanguageToggleDialogConfig {
  title?: string
  description?: string
  cancelButtonText?: string
  showConfirmButton?: boolean
  confirmButtonText?: string
  confirmButtonHref?: string
}

const getString = (value: unknown) =>
  typeof value === 'string' && value.trim().length > 0 ? value : undefined

/**
 * Reads the "translation not available" dialog config from a CMS configJson field.
 * Expected shape:
 * {
 *   "translationNotAvailableModal": {
 *     "title": "...",
 *     "description": "...",
 *     "cancelButtonText": "View in Icelandic",
 *     "showConfirmButton": true,
 *     "confirmButtonText": "Go to home page",
 *     "confirmButtonHref": "/en"
 *   }
 * }
 */
export const getLanguageToggleDialogConfig = (
  configJson: Record<string, unknown> | null | undefined,
): LanguageToggleDialogConfig | undefined => {
  const config = configJson?.translationNotAvailableModal
  if (!config || typeof config !== 'object') {
    return undefined
  }
  const values = config as Record<string, unknown>
  const result: LanguageToggleDialogConfig = {
    title: getString(values.title),
    description: getString(values.description),
    cancelButtonText: getString(values.cancelButtonText),
    showConfirmButton:
      typeof values.showConfirmButton === 'boolean'
        ? values.showConfirmButton
        : undefined,
    confirmButtonText: getString(values.confirmButtonText),
    confirmButtonHref: getString(values.confirmButtonHref),
  }
  // Strip undefined values so the result can be serialized as page props
  return Object.fromEntries(
    Object.entries(result).filter(([, value]) => value !== undefined),
  ) as LanguageToggleDialogConfig
}
