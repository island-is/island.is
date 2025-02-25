import * as kennitala from 'kennitala'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { z } from 'zod'
import {
  ApplicationType,
  LanguageEnvironmentOptions,
  ReasonForApplicationOptions,
} from './constants'

import { NO, YES } from '@island.is/application/core'
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
  currentNursery: z.object({
    municipality: z.string(),
    nursery: z.string(),
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
  expectedStartDate: z.string(),
  languages: z
    .object({
      languageEnvironment: z.string(),
      signLanguage: z.enum([YES, NO]),
      guardianRequiresInterpreter: z.string().optional(),
      selectedLanguages: z
        .array(z.object({ code: z.string().optional().nullable() }))
        .optional(),
      preferredLanguage: z.string().optional().nullable(),
    })
    .superRefine(({ languageEnvironment, selectedLanguages }, ctx) => {
      const checkAndAddIssue = (index: number) => {
        // If required 2 languages but the second language field is still hidden
        // else check if applicant has selected a languages
        if (index === 1 && selectedLanguages?.length === 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            params: errorMessages.twoLanguagesRequired,
            path: ['selectedLanguages'],
          })
        } else if (!selectedLanguages?.[index]?.code) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            params: errorMessages.languageRequired,
            path: ['selectedLanguages', index, 'code'],
          })
        }
      }

      if (
        languageEnvironment ===
        LanguageEnvironmentOptions.ONLY_OTHER_THAN_ICELANDIC
      ) {
        checkAndAddIssue(0)
      } else if (
        languageEnvironment === LanguageEnvironmentOptions.ICELANDIC_AND_OTHER
      ) {
        checkAndAddIssue(0)
        checkAndAddIssue(1)
      }
    })
    .refine(
      ({ languageEnvironment, selectedLanguages, preferredLanguage }) => {
        if (
          (languageEnvironment ===
            LanguageEnvironmentOptions.ONLY_OTHER_THAN_ICELANDIC &&
            !!selectedLanguages &&
            selectedLanguages?.length >= 1) ||
          (languageEnvironment ===
            LanguageEnvironmentOptions.ICELANDIC_AND_OTHER &&
            !!selectedLanguages &&
            selectedLanguages?.length >= 2)
        ) {
          return !!preferredLanguage
        }

        return true
      },
      {
        path: ['preferredLanguage'],
        params: errorMessages.languageRequired,
      },
    )
    .refine(
      ({ languageEnvironment, guardianRequiresInterpreter }) => {
        return languageEnvironment !== LanguageEnvironmentOptions.ONLY_ICELANDIC
          ? !!guardianRequiresInterpreter
          : true
      },
      {
        path: ['guardianRequiresInterpreter'],
      },
    ),
  freeSchoolMeal: z
    .object({
      acceptFreeSchoolLunch: z.enum([YES, NO]),
      hasSpecialNeeds: z.string().optional(),
      specialNeedsType: z.string().optional().nullable(),
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
      foodAllergiesOrIntolerances: z.array(z.string()).optional().nullable(),
      hasOtherAllergies: z.array(z.string()),
      otherAllergies: z.array(z.string()).optional().nullable(),
      usesEpiPen: z.string().optional(),
      hasConfirmedMedicalDiagnoses: z.enum([YES, NO]),
      requestsMedicationAdministration: z.enum([YES, NO]),
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
      hasDiagnoses: z.enum([YES, NO]),
      hasHadSupport: z.enum([YES, NO]),
      hasIntegratedServices: z.string().optional(),
      hasCaseManager: z.string().optional(),
      caseManager: z
        .object({
          name: z.string(),
          email: z.string().email().optional().or(z.literal('')),
        })
        .optional(),
      requestingMeeting: z.array(z.enum([YES, NO])).optional(),
    })
    .refine(
      ({ hasDiagnoses, hasHadSupport, hasIntegratedServices }) =>
        hasDiagnoses === YES || hasHadSupport === YES
          ? !!hasIntegratedServices
          : true,
      { path: ['hasIntegratedServices'] },
    )
    .refine(
      ({
        hasDiagnoses,
        hasHadSupport,
        hasIntegratedServices,
        hasCaseManager,
      }) =>
        (hasDiagnoses === YES || hasHadSupport === YES) &&
        hasIntegratedServices === YES
          ? !!hasCaseManager
          : true,
      { path: ['hasCaseManager'] },
    )
    .refine(
      ({
        hasDiagnoses,
        hasHadSupport,
        hasIntegratedServices,
        hasCaseManager,
        caseManager,
      }) =>
        (hasDiagnoses === YES || hasHadSupport === YES) &&
        hasIntegratedServices === YES &&
        hasCaseManager === YES
          ? caseManager && caseManager.name.length > 0
          : true,
      { path: ['caseManager', 'name'] },
    )
    .refine(
      ({
        hasDiagnoses,
        hasHadSupport,
        hasIntegratedServices,
        hasCaseManager,
        caseManager,
      }) =>
        (hasDiagnoses === YES || hasHadSupport === YES) &&
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
