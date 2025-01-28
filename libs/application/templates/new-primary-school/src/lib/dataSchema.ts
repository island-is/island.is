import { NO, YES } from '@island.is/application/types'
import * as kennitala from 'kennitala'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { z } from 'zod'
import {
  ApplicationType,
  ReasonForApplicationOptions,
  LanguageEnvironmentOptions,
} from './constants'

import { errorMessages } from './messages'

const validatePhoneNumber = (value: string) => {
  const phoneNumber = parsePhoneNumberFromString(value, 'IS')
  return phoneNumber && phoneNumber.isValid()
}

const phoneNumberSchema = z
  .string()
  .refine((value) => validatePhoneNumber(value), {
    params: errorMessages.phoneNumber,
  })

export const dataSchema = z.object({
  applicationType: z.enum([
    ApplicationType.NEW_PRIMARY_SCHOOL,
    ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL,
  ]),
  approveExternalData: z.boolean().refine((v) => v),
  childNationalId: z.string().min(1),
  childInfo: z
    .object({
      preferredName: z.string().optional(),
      pronouns: z.array(z.string()).optional(),
      differentPlaceOfResidence: z.enum([YES, NO]),
      placeOfResidence: z
        .object({
          streetAddress: z.string(),
          postalCode: z.string(),
        })
        .optional(),
    })
    .refine(
      ({ differentPlaceOfResidence, placeOfResidence }) =>
        differentPlaceOfResidence === YES
          ? placeOfResidence && placeOfResidence.streetAddress.length > 0
          : true,
      { path: ['placeOfResidence', 'streetAddress'] },
    )
    .refine(
      ({ differentPlaceOfResidence, placeOfResidence }) =>
        differentPlaceOfResidence === YES
          ? placeOfResidence && placeOfResidence.postalCode.length > 0
          : true,
      { path: ['placeOfResidence', 'postalCode'] },
    ),
  guardians: z.array(
    z.object({
      email: z.string().email(),
      phoneNumber: phoneNumberSchema,
    }),
  ),
  contacts: z
    .array(
      z.object({
        fullName: z.string().min(1),
        phoneNumber: phoneNumberSchema,
        nationalId: z.string().refine((n) => kennitala.isValid(n), {
          params: errorMessages.nationalId,
        }),
        relation: z.string(),
      }),
    )
    .refine((r) => r === undefined || r.length > 0, {
      params: errorMessages.contactsRequired,
    }),
  reasonForApplication: z
    .object({
      reason: z.string(),
      transferOfLegalDomicile: z
        .object({
          streetAddress: z.string(),
          postalCode: z.string(),
        })
        .optional(),
    })
    .refine(
      ({ reason, transferOfLegalDomicile }) =>
        reason === ReasonForApplicationOptions.MOVING_MUNICIPALITY
          ? transferOfLegalDomicile &&
            transferOfLegalDomicile.streetAddress.length > 0
          : true,
      {
        path: ['transferOfLegalDomicile', 'streetAddress'],
      },
    )
    .refine(
      ({ reason, transferOfLegalDomicile }) =>
        reason === ReasonForApplicationOptions.MOVING_MUNICIPALITY
          ? transferOfLegalDomicile &&
            transferOfLegalDomicile.postalCode.length > 0
          : true,
      {
        path: ['transferOfLegalDomicile', 'postalCode'],
      },
    ),
  newSchool: z.object({
    municipality: z.string(),
    school: z.string(),
  }),
  school: z.object({
    applyForNeighbourhoodSchool: z.enum([YES, NO]),
  }),
  siblings: z
    .array(
      z.object({
        fullName: z.string().min(1),
        nationalId: z.string().refine((n) => kennitala.isValid(n), {
          params: errorMessages.nationalId,
        }),
      }),
    )
    .refine((r) => r === undefined || r.length > 0, {
      params: errorMessages.siblingsRequired,
    }),
  startDate: z.string(),
  languages: z
    .object({
      languageEnvironment: z.string(),
      signLanguage: z.enum([YES, NO]),
      interpreter: z.string().optional(),
      language1: z.string().optional().nullable(),
      language2: z.string().optional().nullable(),
      childLanguage: z.string().optional().nullable(),
    })
    .refine(
      ({ languageEnvironment, language1 }) => {
        return languageEnvironment !== LanguageEnvironmentOptions.ONLY_ICELANDIC
          ? !!language1
          : true
      },
      {
        path: ['language1'],
        params: errorMessages.languagesRequired,
      },
    )
    .refine(
      ({ languageEnvironment, language1, language2, childLanguage }) => {
        return languageEnvironment !==
          LanguageEnvironmentOptions.ONLY_ICELANDIC &&
          !!language1 &&
          !!language2
          ? !!childLanguage
          : true
      },
      {
        path: ['childLanguage'],
        params: errorMessages.languageRequired,
      },
    )
    .refine(
      ({ languageEnvironment, interpreter }) => {
        return languageEnvironment !== LanguageEnvironmentOptions.ONLY_ICELANDIC
          ? !!interpreter
          : true
      },
      {
        path: ['interpreter'],
      },
    ),
  freeSchoolMeal: z
    .object({
      acceptFreeSchoolLunch: z.enum([YES, NO]),
      hasSpecialNeeds: z.string().optional(),
      specialNeedsType: z.string().optional(),
    })
    .refine(
      ({ acceptFreeSchoolLunch, hasSpecialNeeds }) =>
        acceptFreeSchoolLunch === YES
          ? !!hasSpecialNeeds && hasSpecialNeeds.length > 0
          : true,
      {
        path: ['hasSpecialNeeds'],
      },
    )
    .refine(
      ({ acceptFreeSchoolLunch, hasSpecialNeeds, specialNeedsType }) =>
        acceptFreeSchoolLunch === YES && hasSpecialNeeds === YES
          ? !!specialNeedsType && specialNeedsType.length > 0
          : true,
      {
        path: ['specialNeedsType'],
      },
    ),
  allergiesAndIntolerances: z
    .object({
      hasFoodAllergiesOrIntolerances: z.array(z.string()),
      foodAllergiesOrIntolerances: z.array(z.string()).optional(),
      hasOtherAllergies: z.array(z.string()),
      otherAllergies: z.array(z.string()).optional(),
      usesEpiPen: z.string().optional(),
      hasConfirmedMedicalDiagnoses: z.enum([YES, NO]),
      requestMedicationAssistance: z.enum([YES, NO]),
    })
    .refine(
      ({ hasFoodAllergiesOrIntolerances, foodAllergiesOrIntolerances }) =>
        hasFoodAllergiesOrIntolerances.includes(YES)
          ? !!foodAllergiesOrIntolerances &&
            foodAllergiesOrIntolerances.length > 0
          : true,
      {
        path: ['foodAllergiesOrIntolerances'],
        params: errorMessages.foodAllergiesOrIntolerancesRequired,
      },
    )
    .refine(
      ({ hasOtherAllergies, otherAllergies }) =>
        hasOtherAllergies.includes(YES)
          ? !!otherAllergies && otherAllergies.length > 0
          : true,
      {
        path: ['otherAllergies'],
        params: errorMessages.otherAllergiesRequired,
      },
    )
    .refine(
      ({ hasFoodAllergiesOrIntolerances, hasOtherAllergies, usesEpiPen }) =>
        hasFoodAllergiesOrIntolerances.includes(YES) ||
        hasOtherAllergies.includes(YES)
          ? !!usesEpiPen
          : true,
      { path: ['usesEpiPen'] },
    ),
  support: z
    .object({
      developmentalAssessment: z.enum([YES, NO]),
      specialSupport: z.enum([YES, NO]),
      hasIntegratedServices: z.string().optional(),
      hasCaseManager: z.string().optional(),
      caseManager: z
        .object({
          name: z.string(),
          email: z.string().email().optional().or(z.literal('')),
        })
        .optional(),
      requestMeeting: z.array(z.enum([YES, NO])).optional(),
    })
    .refine(
      ({ developmentalAssessment, specialSupport, hasIntegratedServices }) =>
        developmentalAssessment === YES || specialSupport === YES
          ? !!hasIntegratedServices
          : true,
      { path: ['hasIntegratedServices'] },
    )
    .refine(
      ({
        developmentalAssessment,
        specialSupport,
        hasIntegratedServices,
        hasCaseManager,
      }) =>
        (developmentalAssessment === YES || specialSupport === YES) &&
        hasIntegratedServices === YES
          ? !!hasCaseManager
          : true,
      { path: ['hasCaseManager'] },
    )
    .refine(
      ({
        developmentalAssessment,
        specialSupport,
        hasIntegratedServices,
        hasCaseManager,
        caseManager,
      }) =>
        (developmentalAssessment === YES || specialSupport === YES) &&
        hasIntegratedServices === YES &&
        hasCaseManager === YES
          ? caseManager && caseManager.name.length > 0
          : true,
      { path: ['caseManager', 'name'] },
    )
    .refine(
      ({
        developmentalAssessment,
        specialSupport,
        hasIntegratedServices,
        hasCaseManager,
        caseManager,
      }) =>
        (developmentalAssessment === YES || specialSupport === YES) &&
        hasIntegratedServices === YES &&
        hasCaseManager === YES
          ? caseManager && caseManager.email && caseManager.email.length > 0
          : true,
      {
        path: ['caseManager', 'email'],
      },
    ),
})

export type SchemaFormValues = z.infer<typeof dataSchema>
