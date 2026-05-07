import { AuthAdminEnvironment } from '@island.is/api/schema'

export interface IdpProviderRow {
  name: string
  availableEnvironments?: AuthAdminEnvironment[] | null
  description: string
  helptext: string
  level: number
}

export interface IdpProviderFormData {
  name: string
  description: string
  helptext: string
  level: number
}

export const emptyForm: IdpProviderFormData = {
  name: '',
  description: '',
  helptext: '',
  level: 1,
}

export interface FormErrors {
  name?: string
  description?: string
  helptext?: string
  level?: string
  environments?: string
}
