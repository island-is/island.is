import { YesOrNo } from '@island.is/application/core'
import { z } from 'zod'
import {
  currentJobSchema,
  educationHistorySchema,
  employmentHistorySchema,
  familyInformationSchema,
  previousEducationSchema,
} from '../lib/schemas'

export enum EmploymentStatus {
  UNEMPLOYED = 'unemployed',
  EMPLOYED = 'employed',
  PARTJOB = 'partjob',
  OCCASIONAL = 'occasional',
}

export enum WorkingAbility {
  ABLE = 'able',
  PARTLY_ABLE = 'partlyAble',
  DISABILITY = 'disability',
}

export enum EducationType {
  CURRENT = 'current',
  LAST_SEMESTER = 'lastSemester',
  LAST_YEAR = 'lastYear',
}

export type FamilyInformationInAnswers = z.TypeOf<
  typeof familyInformationSchema
>

export type CurrentEmploymentInAnswers = z.TypeOf<typeof currentJobSchema>
export type EmploymentHistoryInAnswers = z.TypeOf<
  typeof employmentHistorySchema
>
export type LastJobsInAnswers = z.infer<
  typeof employmentHistorySchema
>['lastJobs']

export interface VacationDaysInAnswers {
  startDate: string
  endDate: string
}

export interface PaymentsFromPensionInAnswers {
  paymentAmount: string
  typeOfPayment: string
}

export interface PaymentsFromPrivatePensionInAnswers {
  privatePensionFund: string
  paymentAmount: string
}

export interface CapitalIncomeInAnswers {
  amount: string
}

export interface PaymentsFromSicknessAllowanceInAnswers {
  dateFrom: string
  dateTo: string
  union: string
  file: Array<string>
}

export type EducationHistoryInAnswers = z.TypeOf<typeof educationHistorySchema>
export type CurrentEducationInAnswers = z.infer<
  typeof educationHistorySchema
>['currentStudies']
export type PreviousEducationInAnswers = z.TypeOf<
  typeof previousEducationSchema
>

export interface LanguagesInAnswers {
  language: string
  skill: string
}

export interface FileInAnswers {
  key: string
  name: string
}
