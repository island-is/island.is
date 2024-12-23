export type Language = {
  code: string
  name: string
}

export type SecondarySchool = {
  id: string
  name: string
  thirdLanguages: Language[]
  nordicLanguages: Language[]
  allowRequestDormitory: boolean
}

export type Program = {
  id: string
  nameIs: string
  nameEn: string
  registrationEndDate: Date
}
