import { AuthAdminEnvironment } from '@island.is/api/schema'

import { m } from '../../../lib/messages'
import type { IdpProviderFormData, FormErrors } from './IdpProviders.types'

export const PAGE_SIZE = 20

const NAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_.-]*$/
const DESCRIPTION_INVALID_CHARS = /[<>%$]/

interface ValidateFormParams {
  formData: IdpProviderFormData
  isEditing: boolean
  selectedEnvironments: AuthAdminEnvironment[]
  formatMessage: (descriptor: { id: string; defaultMessage: string }) => string
}

export const validateIdpProviderForm = ({
  formData,
  isEditing,
  selectedEnvironments,
  formatMessage,
}: ValidateFormParams): FormErrors => {
  const errors: FormErrors = {}

  if (!isEditing) {
    if (!formData.name.trim()) {
      errors.name = formatMessage(m.idpProvidersErrorNameRequired)
    } else if (!NAME_REGEX.test(formData.name)) {
      errors.name = formatMessage(m.idpProvidersErrorNamePattern)
    }
  }

  if (!formData.description.trim()) {
    errors.description = formatMessage(m.idpProvidersErrorDescriptionRequired)
  } else if (DESCRIPTION_INVALID_CHARS.test(formData.description)) {
    errors.description = formatMessage(m.idpProvidersErrorDescriptionChars)
  }

  if (!formData.helptext.trim()) {
    errors.helptext = formatMessage(m.idpProvidersErrorHelptextRequired)
  }

  if (formData.level < 1 || formData.level > 4) {
    errors.level = formatMessage(m.idpProvidersErrorLevelRange)
  }

  if (!isEditing && selectedEnvironments.length === 0) {
    errors.environments = formatMessage(m.idpProvidersErrorEnvironmentRequired)
  }

  return errors
}

export const hasErrors = (errors: FormErrors): boolean =>
  Object.keys(errors).length > 0
