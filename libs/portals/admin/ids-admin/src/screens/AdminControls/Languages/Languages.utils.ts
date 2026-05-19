import { AuthAdminEnvironment } from '@island.is/api/schema'

import { m } from '../../../lib/messages'
import type { FormErrors, LanguageFormData } from './Languages.types'

export const PAGE_SIZE = 20

const ISO_KEY_REGEX = /^[a-z]{2,5}$/

interface ValidateFormParams {
  formData: LanguageFormData
  isEditing: boolean
  selectedEnvironments: AuthAdminEnvironment[]
  formatMessage: (descriptor: { id: string; defaultMessage: string }) => string
}

export const validateLanguageForm = ({
  formData,
  isEditing,
  selectedEnvironments,
  formatMessage,
}: ValidateFormParams): FormErrors => {
  const errors: FormErrors = {}

  if (!isEditing) {
    if (!formData.isoKey.trim()) {
      errors.isoKey = formatMessage(m.languagesErrorIsoKeyRequired)
    } else if (!ISO_KEY_REGEX.test(formData.isoKey)) {
      errors.isoKey = formatMessage(m.languagesErrorIsoKeyPattern)
    }
  }

  if (!formData.description.trim()) {
    errors.description = formatMessage(m.languagesErrorDescriptionRequired)
  }

  if (!formData.englishDescription.trim()) {
    errors.englishDescription = formatMessage(
      m.languagesErrorEnglishDescriptionRequired,
    )
  }

  if (!isEditing && selectedEnvironments.length === 0) {
    errors.environments = formatMessage(m.languagesErrorEnvironmentRequired)
  }

  return errors
}

export const hasErrors = (errors: FormErrors): boolean =>
  Object.keys(errors).length > 0
