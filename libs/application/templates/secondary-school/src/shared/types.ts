export type Language = {
  code: string
  name: string
}

export type SecondarySchool = {
  id: string
  name: string
  thirdLanguages: Language[]
}

export type Program = {
  id: string
  name: string
}
