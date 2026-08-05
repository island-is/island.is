import { z } from 'zod'
import {
  educationSchema,
  licenseSchema,
  languageSkillsSchema,
  bankAccountSchema,
  otherAddressSchema,
} from '../lib/dataSchema'

export type EducationInAnswers = z.TypeOf<typeof educationSchema>
export type LicenseInAnswers = z.TypeOf<typeof licenseSchema>
export type LanguagesInAnswers = z.TypeOf<typeof languageSkillsSchema>
export type BankAccountInAnswers = z.TypeOf<typeof bankAccountSchema>
export type OtherAddressInAnswers = z.TypeOf<typeof otherAddressSchema>
