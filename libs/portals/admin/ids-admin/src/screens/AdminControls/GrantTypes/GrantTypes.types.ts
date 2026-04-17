export interface GrantTypeRow {
  name: string
  description: string
  archived?: string | null
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
