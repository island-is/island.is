import { z } from 'zod'
import {
  EducationNotFinishedSchema,
  ExemptionEducationSchema,
  RepeateableEducationDetailsSchema,
} from '../lib/dataSchema'

export type EducationDetailsItem = z.TypeOf<
  typeof RepeateableEducationDetailsSchema
>

export type EducationDetailsItemExemption = z.TypeOf<
  typeof ExemptionEducationSchema
>
export type EducationDetailsItemNotFinished = z.TypeOf<
  typeof EducationNotFinishedSchema
>

export type CurrentApplication = {
  id: string
  nationalId: string
}

export type UniversityGatewayProgram = {
  active: boolean
  applicationEndDate: string
  applicationInUniversityGateway: boolean
  applicationPeriodOpen: boolean
  applicationStartDate: string
  costPerYear?: number
  credits: number
  degreeAbbreviation: string
  degreeType: string
  departmentNameEn: string
  departmentNameIs: string
  descriptionEn: string
  descriptionIs: string
  durationInYears: number
  externalId: string
  id: string
  iscedCode: string
  modeOfDelivery: Array<ModeOfDelivery>
  nameEn: string
  nameIs: string
  schoolAnswerDate?: string
  specializationExternalId?: string
  specializationNameEn?: string
  specializationNameIs?: string
  startingSemesterSeason: string
  startingSemesterYear: number
  studentAnswerDate?: string
  universityContentfulKey: string
  universityId: string
}

type ModeOfDelivery = {
  modeOfDelivery: string
}
