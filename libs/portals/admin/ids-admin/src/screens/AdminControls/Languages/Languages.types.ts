import type { GetLanguagesQuery } from './Languages.generated'

export type LanguageRow =
  GetLanguagesQuery['authAdminLanguages']['rows'][number]

export interface LanguageFormData {
  isoKey: string
  description: string
  englishDescription: string
}

export const emptyForm: LanguageFormData = {
  isoKey: '',
  description: '',
  englishDescription: '',
}

export interface FormErrors {
  isoKey?: string
  description?: string
  englishDescription?: string
  environments?: string
}
