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
  needsInterpreter?: string[]
  preferredLanguage?: string
}

export type Category = {
  code: string
  label: string
  subCategories?: Category[]
}
