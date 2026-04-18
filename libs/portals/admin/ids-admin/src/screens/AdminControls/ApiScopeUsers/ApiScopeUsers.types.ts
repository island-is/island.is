export interface ApiScopeUserRow {
  nationalId: string
  name?: string | null
  email: string
}

export interface ApiScopeUserFormData {
  nationalId: string
  name: string
  email: string
}

export const emptyForm: ApiScopeUserFormData = {
  nationalId: '',
  name: '',
  email: '',
}

export interface FormErrors {
  name?: string
  nationalId?: string
  email?: string
  environments?: string
}

export type ScopeOption = {
  label: string
  value: string
  description?: string
}
