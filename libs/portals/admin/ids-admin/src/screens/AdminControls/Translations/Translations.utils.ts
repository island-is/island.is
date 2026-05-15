import { AuthAdminEnvironment } from '@island.is/api/schema'

import { m } from '../../../lib/messages'
import type { FormErrors, TranslationFormData } from './Translations.types'

export const PAGE_SIZE = 20

export const buildTranslationKey = (key: {
  language: string
  className: string
  property: string
  key: string
}) => `${key.language}|${key.className}|${key.property}|${key.key}`

interface ValidateFormParams {
  formData: TranslationFormData
  isEditing: boolean
  selectedEnvironments: AuthAdminEnvironment[]
  formatMessage: (descriptor: { id: string; defaultMessage: string }) => string
}

export const validateTranslationForm = ({
  formData,
  isEditing,
  selectedEnvironments,
  formatMessage,
}: ValidateFormParams): FormErrors => {
  const errors: FormErrors = {}

  if (!isEditing) {
    if (!formData.language.trim()) {
      errors.language = formatMessage(m.translationsErrorLanguageRequired)
    }
    if (!formData.className.trim()) {
      errors.className = formatMessage(m.translationsErrorClassNameRequired)
    }
    if (!formData.property.trim()) {
      errors.property = formatMessage(m.translationsErrorPropertyRequired)
    }
    if (!formData.key.trim()) {
      errors.key = formatMessage(m.translationsErrorKeyRequired)
    }
    if (selectedEnvironments.length === 0) {
      errors.environments = formatMessage(
        m.translationsErrorEnvironmentRequired,
      )
    }
  }

  return errors
}

export const hasErrors = (errors: FormErrors): boolean =>
  Object.keys(errors).length > 0
