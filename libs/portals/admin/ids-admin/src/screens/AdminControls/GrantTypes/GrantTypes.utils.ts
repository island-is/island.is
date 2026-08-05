import { AuthAdminEnvironment } from '@island.is/api/schema'

import { m } from '../../../lib/messages'
import type { GrantTypeFormData, FormErrors } from './GrantTypes.types'

export const PAGE_SIZE = 20

const NAME_REGEX = /^(?=[a-z])[a-z_:.-]+(?<=[a-z])$/
const DESCRIPTION_INVALID_CHARS = /[<>%$]/

interface ValidateFormParams {
  formData: GrantTypeFormData
  isEditing: boolean
  selectedEnvironments: AuthAdminEnvironment[]
  formatMessage: (descriptor: { id: string; defaultMessage: string }) => string
}

export const validateGrantTypeForm = ({
  formData,
  isEditing,
  selectedEnvironments,
  formatMessage,
}: ValidateFormParams): FormErrors => {
  const errors: FormErrors = {}

  if (!isEditing) {
    if (!formData.name.trim()) {
      errors.name = formatMessage(m.grantTypesErrorNameRequired)
    } else if (!NAME_REGEX.test(formData.name)) {
      errors.name = formatMessage(m.grantTypesErrorNamePattern)
    }
  }

  if (!formData.description.trim()) {
    errors.description = formatMessage(m.grantTypesErrorDescriptionRequired)
  } else if (DESCRIPTION_INVALID_CHARS.test(formData.description)) {
    errors.description = formatMessage(m.grantTypesErrorDescriptionChars)
  }

  if (!isEditing && selectedEnvironments.length === 0) {
    errors.environments = formatMessage(m.grantTypesErrorEnvironmentRequired)
  }

  return errors
}

export const hasErrors = (errors: FormErrors): boolean =>
  Object.keys(errors).length > 0
