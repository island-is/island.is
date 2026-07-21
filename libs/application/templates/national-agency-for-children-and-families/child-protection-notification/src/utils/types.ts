export interface Parent {
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
