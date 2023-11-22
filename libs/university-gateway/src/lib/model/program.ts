import { IProgramExtraApplicationField } from './programExtraApplicationField'
import { IProgramSpecialization } from './programSpecialization'
import { Season } from '../types/season'
import { DegreeType } from '../types/degreeType'
import { ModeOfDelivery } from '../types/modeOfDelivery'

export interface IProgram {
  externalId: string
  nameIs: string
  nameEn: string
  departmentNameIs: string
  departmentNameEn: string
  startingSemesterYear: number
  startingSemesterSeason: Season
  applicationStartDate: Date
  applicationEndDate: Date
  schoolAnswerDate?: Date
  studentAnswerDate?: Date
  degreeType: DegreeType
  degreeAbbreviation: string
  credits: number
  descriptionIs: string
  descriptionEn: string
  durationInYears: number
  costPerYear?: number
  iscedCode: string
  languages: string[]
  externalUrlIs?: string
  externalUrlEn?: string
  admissionRequirementsIs?: string
  admissionRequirementsEn?: string
  studyRequirementsIs?: string
  studyRequirementsEn?: string
  costInformationIs?: string
  costInformationEn?: string
  modeOfDelivery: ModeOfDelivery[]
  extraApplicationFields?: IProgramExtraApplicationField[]
  specializations?: IProgramSpecialization[]
}
