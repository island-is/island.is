import { IProgramExtraApplicationField } from './programExtraApplicationField'
import { IProgramUglaExtraApplicationSettings } from './programUglaExtraApplicationSettings'
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
  applicationStartDate?: Date
  applicationEndDate?: Date
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
  externalUrlIs?: string
  externalUrlEn?: string
  admissionRequirementsIs?: string
  admissionRequirementsEn?: string
  studyRequirementsIs?: string
  studyRequirementsEn?: string
  costInformationIs?: string
  costInformationEn?: string
  arrangementIs?: string
  arrangementEn?: string
  allowException: boolean
  allowThirdLevelQualification: boolean
  modeOfDelivery: ModeOfDelivery[]
  extraApplicationFields?: IProgramExtraApplicationField[]
  specializations?: IProgramSpecialization[]
  applicationPeriodOpen: boolean
  applicationInUniversityGateway: boolean
}
