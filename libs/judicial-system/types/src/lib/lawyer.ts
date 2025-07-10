export interface Lawyer {
  name: string
  practice: string
  email: string
  phoneNr: string
  nationalId: string
}

export type LawyerFull = {
  Id: number
  Name: string
  Title: string
  Phone: string
  Address: string
  City: string
  PostNumber: string
  Email: string
  Practice: string
  Education: string
  WebPage: string
  CaseCategories: []
  FirstName: string
  MiddleName: string
  SurName: string
  SSN: string
  MailBox: string
  Fax: string
  GSM: string
  HomePhone: string
  DirectPhone: string
  NonIcelandicPhone: string
  PracticeResponsible: string
  LawyerRepresentative: string
  Sex: string
  HdlLicense: string | null
  HrlLicense: string | null
  Insurance: string
  Country: string
  IsPracticing: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Languages: null | any
  InternationConnection: string
}

export type LawyerRegistry = {
  id: string
  created: Date
  modified: Date
  name: string
  email: string
  nationalId: string
  phoneNumber: string
  practice: string
  isLitigator: boolean
}

export const mapToLawyer = (lawyer: LawyerRegistry): Lawyer => {
  return {
    name: lawyer.name,
    practice: lawyer.practice,
    email: lawyer.email,
    phoneNr: lawyer.phoneNumber,
    nationalId: lawyer.nationalId.replace(/\D/g, ''), // Remove all non-numeric characters
  }
}

export enum LawyerType {
  LITIGATORS = 'LITIGATORS',
}
