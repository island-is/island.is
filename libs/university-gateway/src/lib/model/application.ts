import { Season } from '../types/season'
import { ModeOfDelivery } from '../types/modeOfDelivery'
import { FieldType } from '../types/fieldType'

export interface IApplication {
  id: string
  programExternalId: string
  modeOfDelivery: ModeOfDelivery
  startingSemesterYear: number
  startingSemesterSeason: Season
  applicant: IApplicationApplicant
  preferredLanguage?: string
  educationList: IApplicationEducation[]
  workExperienceList: IApplicationWorkExperience[]
  extraFieldList: IApplicationExtraFields[]
  educationOption?: string
  attachments?: Array<IApplicationAttachment>
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
  schoolName?: string
  degree?: string
  degreeName?: string
  degreeCountry?: string
  finishedUnits?: string
  degreeStartDate?: string
  degreeEndDate?: string
  moreDetails?: string
}

export interface IApplicationWorkExperience {
  company: string
  jobTitle: string
}

export interface IApplicationAttachment {
  fileName: string
  fileUrl: string
}

export interface IApplicationExtraFields {
  fieldType: FieldType
  externalKey: string
  value: object
}
