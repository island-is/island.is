export interface Language {
  code: string
  nameIs: string
  nameEn: string
}

export interface SecondarySchool {
  id: string
  name: string
  thirdLanguages: Language[]
}

export interface Program {
  id: string
  nameIs: string
  nameEn: string
  registrationEndDate: Date
}

export interface Application {
  nationalId: string
}
