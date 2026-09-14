import { YesOrNo } from '@island.is/application/core'

export type ParentKey = 'parent1' | 'parent2'

export const PARENT_KEYS: ReadonlyArray<ParentKey> = ['parent1', 'parent2']

export interface Parent {
  knowsNationalId?: YesOrNo
  nationalIdInfo?: {
    nationalId?: string
    name?: string
    email?: string
    phone?: string
  }
  name?: string
  age?: string
  gender?: string
  country?: string
  citizenship?: string
  address?: string
  postalCode?: string
  municipality?: string
  municipalityPostalCode?: string
  needsInterpreter?: string[]
  preferredLanguage?: string
}

export type Category = {
  code: string
  label: string
  subCategories?: Category[]
}

export type ReasonForNotificationSubCategoryAnswers = {
  subCategory?: string[]
  subSubCategories?: string[]
}

export type ReasonForNotificationAnswers = Record<
  string,
  Record<string, ReasonForNotificationSubCategoryAnswers>
>
