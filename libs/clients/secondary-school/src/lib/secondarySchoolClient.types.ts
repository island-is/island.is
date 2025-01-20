export interface Student {
  isFreshman: boolean
}

export interface Language {
  code: string
  name: string
}

export interface SecondarySchool {
  id: string
  name: string
  thirdLanguages: Language[]
  nordicLanguages: Language[]
  allowRequestDormitory: boolean
  isOpenForAdmissionGeneral: boolean
  isOpenForAdmissionFreshman: boolean
}

export interface Program {
  id: string
  nameIs: string
  nameEn: string
  registrationEndDate: Date
}

export interface ApplicationContact {
  nationalId: string
  name: string
  phone: string
  email: string
  address?: string
  postalCode?: string
  city?: string
}

export interface ApplicationSelectionSchoolProgram {
  priority: number
  programId: string
}

export interface ApplicationSelectionSchool {
  priority: number
  schoolId: string
  programs: ApplicationSelectionSchoolProgram[]
  thirdLanguageCode?: string
  nordicLanguageCode?: string
  requestDormitory?: boolean
}

export interface ApplicationAttachment {
  fileName: string
  fileContent: string
  contentType: string
}

export interface Application {
  nationalId: string
  name: string
  phone: string
  email: string
  address: string
  postalCode: string
  city: string
  isFreshman: boolean
  contacts: ApplicationContact[]
  schools: ApplicationSelectionSchool[]
  nativeLanguageCode?: string
  otherDescription?: string
  attachments: ApplicationAttachment[]
}
