import { z } from 'zod'
import {
  EducationNotFinishedSchema,
  ExemptionEducationSchema,
  RepeateableEducationDetailsSchema,
  OtherDocumentsSchema,
} from '../lib/dataSchema'
import { ProgramExtraApplicationFieldFieldTypeEnum } from '@island.is/clients/university-gateway-api'

export type EducationDetailsItem = z.TypeOf<
  typeof RepeateableEducationDetailsSchema
>

export type EducationDetailsItemExemption = z.TypeOf<
  typeof ExemptionEducationSchema
>
export type EducationDetailsItemNotFinished = z.TypeOf<
  typeof EducationNotFinishedSchema
>

export type OtherDocumentsDetailsItem = z.TypeOf<typeof OtherDocumentsSchema>

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
  extraApplicationFields: Array<ProgramExtraApplicationField>
}

type ModeOfDelivery = {
  modeOfDelivery: string
}

export type ProgramExtraApplicationField = {
  externalKey: string
  fieldType: ProgramExtraApplicationFieldFieldTypeEnum
}
