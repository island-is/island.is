import { z } from 'zod'
import {
  applicantInformationSchema,
  capitalIncomeSchema,
  currentEducationSchema,
  currentJobSchema,
  currentSituationSchema,
  educationHistorySchema,
  educationSchema,
  employmentHistorySchema,
  familyInformationSchema,
  jobWishesSchema,
  licenseSchema,
  otherBenefitsSchema,
  payoutSchema,
  previousEducationSchema,
  taxDiscountSchema,
  vacationSchema,
} from '../lib/schemas'
import {
  introductoryMeetingSchema,
  languageSkillsSchema,
} from '../lib/dataSchema'
import { FileSchema } from '../lib/schemas/fileSchema'
import { reasonForJobSearchSchema } from '../lib/schemas/reasonForJobSearchSchema'

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
export type ApplicantInAnswers = z.TypeOf<typeof applicantInformationSchema>
export type CurrentSituationInAnswers = z.TypeOf<typeof currentSituationSchema>
export type CurrentEmploymentInAnswers = z.TypeOf<typeof currentJobSchema>
export type EmploymentHistoryInAnswers = z.TypeOf<
  typeof employmentHistorySchema
>
export type IntroductoryMeetingInAnswers = z.TypeOf<
  typeof introductoryMeetingSchema
>
export type JobWishesInAnswers = z.TypeOf<typeof jobWishesSchema>
export type LicensesInAnswers = z.TypeOf<typeof licenseSchema>
export type PayoutInAnswers = z.TypeOf<typeof payoutSchema>
export type TaxDiscountInAnswers = z.TypeOf<typeof taxDiscountSchema>
export type VacationInAnswers = z.TypeOf<typeof vacationSchema>
export type OtherBenefitsInAnswers = z.TypeOf<typeof otherBenefitsSchema>
export type CapitalIncomeInAnswers = z.TypeOf<typeof capitalIncomeSchema>
export type EducationHistoryInAnswers = z.TypeOf<typeof previousEducationSchema>
export type CurrentEducationInAnswers = z.infer<typeof currentEducationSchema>
export type EducationInAnswers = z.TypeOf<typeof educationSchema>
export type PreviousEducationInAnswers = z.TypeOf<
  typeof previousEducationSchema
>
export type ReasonsForJobSearchInAnswers = z.TypeOf<
  typeof reasonForJobSearchSchema
>
export type FileSchemaInAnswers = z.TypeOf<typeof FileSchema>
export type LanguagesInAnswers = z.TypeOf<typeof languageSkillsSchema>
