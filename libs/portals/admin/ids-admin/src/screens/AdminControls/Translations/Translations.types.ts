import type { GetTranslationsQuery } from './Translations.generated'

export type TranslationRow =
  GetTranslationsQuery['authAdminTranslations']['rows'][number]

export interface TranslationFormData {
  language: string
  className: string
  property: string
  key: string
  value: string
}

export const emptyForm: TranslationFormData = {
  language: '',
  className: '',
  property: '',
  key: '',
  value: '',
}

export interface FormErrors {
  language?: string
  className?: string
  property?: string
  key?: string
  value?: string
  environments?: string
}
