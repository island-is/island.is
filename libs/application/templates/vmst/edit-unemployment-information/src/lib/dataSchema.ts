import { z } from 'zod'
import { YES, YesOrNoEnum } from '@island.is/application/core'
import { application as applicationMessages } from './messages'

export const educationSchema = z.object({
  levelOfStudy: z.string(),
  degree: z.string(),
  courseOfStudy: z.string(),
  endDate: z.string(),
})

export const licenseSchema = z
  .object({
    hasDrivingLicense: z.array(z.string()).optional(),
    drivingLicenseTypes: z.array(z.string()).optional(),
    hasHeavyMachineryLicense: z.array(z.string()).optional(),
    heavyMachineryLicensesTypes: z.array(z.string()).optional().nullable(),
  })
  .refine(
    ({ hasDrivingLicense, drivingLicenseTypes }) => {
      if (
        hasDrivingLicense &&
        hasDrivingLicense.length > 0 &&
        hasDrivingLicense[0] === YES
      ) {
        return (
          drivingLicenseTypes !== undefined && drivingLicenseTypes.length > 0
        )
      }

      return true
    },
    { path: ['drivingLicenseTypes'] },
  )
  .refine(
    ({ hasHeavyMachineryLicense, heavyMachineryLicensesTypes }) => {
      if (
        hasHeavyMachineryLicense &&
        hasHeavyMachineryLicense.length > 0 &&
        hasHeavyMachineryLicense[0] === YES
      ) {
        return (
          heavyMachineryLicensesTypes && heavyMachineryLicensesTypes.length > 0
        )
      }

      return true
    },
    { path: ['heavyMachineryLicensesTypes'] },
  )

export const languageSkillsSchema = z.object({
  language: z.string(),
  skill: z
    .string()
    .optional()
    .refine((v) => v !== undefined && v !== '', {
      params: applicationMessages.requiredError,
    }),
})

export const bankAccountSchema = z.object({
  bankNumber: z.string(),
  ledger: z.string(),
  accountNumber: z.string(),
})

export const otherAddressSchema = z
  .object({
    otherAddress: z.string().optional(),
    otherPostcode: z.string().nullish(),
    currentAddressIsNotDifferent: z.array(z.string()).optional(),
  })
  .refine(
    ({ currentAddressIsNotDifferent, otherPostcode }) => {
      if (
        currentAddressIsNotDifferent &&
        currentAddressIsNotDifferent.length > 0 &&
        currentAddressIsNotDifferent[0] === YES
      ) {
        return true
      }
      return !!otherPostcode
    },
    {
      path: ['otherPostcode'],
    },
  )
  .refine(
    ({ currentAddressIsNotDifferent, otherAddress }) => {
      if (
        currentAddressIsNotDifferent &&
        currentAddressIsNotDifferent.length > 0 &&
        currentAddressIsNotDifferent[0] === YES
      ) {
        return true
      }
      return !!otherAddress
    },
    {
      path: ['otherAddress'],
    },
  )

export const editUnemploymentInfoDataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  otherAddress: otherAddressSchema,
  password: z.string().min(4),
  bankAccount: bankAccountSchema,
  jobWishes: z.array(z.string()),
  educationHistory: z.array(educationSchema),
  languageSkills: z.array(languageSkillsSchema),
  licenses: licenseSchema,
  euresAgreement: z
    .nativeEnum(YesOrNoEnum)
    .refine((v) => Object.values(YesOrNoEnum).includes(v)),
})

export type ApplicationAnswers = z.TypeOf<typeof editUnemploymentInfoDataSchema>
