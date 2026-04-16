import { AuthAdminEnvironment } from '@island.is/api/schema'

import { m } from '../../lib/messages'
import type { ApiScopeUserFormData, FormErrors } from './ApiScopeUsers.types'

export const PAGE_SIZE = 20

const NATIONAL_ID_REGEX = /^\d{10}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface ValidateFormParams {
  formData: ApiScopeUserFormData
  isEditing: boolean
  selectedEnvironments: AuthAdminEnvironment[]
  formatMessage: (descriptor: { id: string; defaultMessage: string }) => string
}

export const validateApiScopeUserForm = ({
  formData,
  isEditing,
  selectedEnvironments,
  formatMessage,
}: ValidateFormParams): FormErrors => {
  const errors: FormErrors = {}

  if ((!isEditing || formData.name) && formData.name.length < 2) {
    errors.name = formatMessage(m.apiScopeUsersErrorNameMinLength)
  }

  if (!NATIONAL_ID_REGEX.test(formData.nationalId)) {
    errors.nationalId = formatMessage(m.apiScopeUsersErrorNationalId)
  }

  if (!formData.email.trim()) {
    errors.email = formatMessage(m.apiScopeUsersErrorEmailRequired)
  } else if (!EMAIL_REGEX.test(formData.email)) {
    errors.email = formatMessage(m.apiScopeUsersErrorEmailFormat)
  }

  if (!isEditing && selectedEnvironments.length === 0) {
    errors.environments = formatMessage(m.apiScopeUsersErrorEnvironmentRequired)
  }

  return errors
}

export const hasErrors = (errors: FormErrors): boolean =>
  Object.keys(errors).length > 0
