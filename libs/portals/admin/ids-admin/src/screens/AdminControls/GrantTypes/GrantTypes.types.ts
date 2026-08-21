import { AuthAdminEnvironment } from '@island.is/api/schema'

export interface GrantTypeRow {
  name: string
  availableEnvironments?: AuthAdminEnvironment[] | null
  archivedEnvironments?: AuthAdminEnvironment[] | null
  description: string
}

export interface GrantTypeFormData {
  name: string
  description: string
}

export const emptyForm: GrantTypeFormData = {
  name: '',
  description: '',
}

export interface FormErrors {
  name?: string
  description?: string
  environments?: string
}
