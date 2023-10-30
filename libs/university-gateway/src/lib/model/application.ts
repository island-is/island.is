import { Season } from '../types/season'
import { ModeOfDelivery } from '../types/modeOfDelivery'

export interface IApplication {
  programExternalId: string
  modeOfDelivery: ModeOfDelivery
  startingSemesterYear: number
  startingSemesterSeason: Season
  applicant: IApplicationApplicant
  preferredLanguage?: string
  educationList: IApplicationEducation[]
  workExperienceList: IApplicationWorkExperience[]
  extraFieldList: IApplicationExtraFields[]
}

export interface IApplicationApplicant {
  nationalId: string
  givenName: string
  middleName?: string
  familyName: string
  email: string
  phone: string
  genderCode: string
  citizenshipCode: string
  streetAddress: string
  postalCode: string
  city: string
  municipalityCode: string
  countryCode: string
}

export interface IApplicationEducation {
  school: string
  degree: string
}

export interface IApplicationWorkExperience {
  company: string
  jobTitle: string
}

export interface IApplicationExtraFields {
  key: string
  value: object
}
