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
      usePronounAndPreferredName: z.array(z.string()),
      preferredName: z.string().optional(),
      pronouns: z.array(z.string()).optional().nullable(),
      differentPlaceOfResidence: z.enum([YES, NO]),
      placeOfResidence: z
        .object({
          streetAddress: z.string(),
          postalCode: z.string(),
        })
        .optional(),
    })
    .refine(
      ({ usePronounAndPreferredName, preferredName }) =>
        usePronounAndPreferredName.includes(YES) ? !!preferredName : true,
      { path: ['preferredName'] },
    )
    .refine(
      ({ usePronounAndPreferredName, pronouns }) =>
        usePronounAndPreferredName.includes(YES)
          ? !!pronouns && pronouns.length > 0
          : true,
      { path: ['pronouns'] },
    )
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
    z
      .object({
        email: z.string().email(),
        phoneNumber: phoneNumberSchema,
        requiresInterpreter: z.array(z.string()),
        preferredLanguage: z.string().optional().nullable(),
      })
      .refine(
        ({ requiresInterpreter, preferredLanguage }) =>
          requiresInterpreter.includes(YES) ? !!preferredLanguage : true,
        {
          path: ['preferredLanguage'],
          params: errorMessages.languageRequired,
        },
      ),
  ),
  relatives: z
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
      params: errorMessages.relativesRequired,
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
  currentSchool: z
    .object({
      municipality: z.string().optional().nullable(),
      school: z.string().optional().nullable(),
    })
    .refine(
      ({ municipality, school }) =>
        !municipality || (school && school.length > 0),
      {
        path: ['school'],
      },
    )
    .optional(),
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
  startingSchool: z
    .object({
      expectedStartDate: z.string(),
      temporaryStay: z.string().min(1).optional(),
      expectedEndDate: z.string().optional(),
    })
    .refine(
      ({ expectedStartDate, expectedEndDate, temporaryStay }) =>
        !(
          temporaryStay === YES &&
          expectedEndDate &&
          new Date(expectedStartDate) > new Date(expectedEndDate)
        ),
      {
        path: ['expectedEndDate'],
        params: errorMessages.expectedEndDateMessage,
      },
    )
    .refine(
      ({ expectedEndDate, temporaryStay }) =>
        !(temporaryStay === YES && !expectedEndDate),
      {
        path: ['expectedEndDate'],
        params: errorMessages.expectedEndDateRequired,
      },
    ),
  languages: z
    .object({
      languageEnvironment: z.string(),
      signLanguage: z.enum([YES, NO]),
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
    ),
  healthProtection: z
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
      hasWelfareContact: z.string().optional(),
      welfareContact: z
        .object({
          name: z.string(),
          email: z.string().email().optional().or(z.literal('')),
        })
        .optional(),
      hasCaseManager: z.string().optional(),
      caseManager: z
        .object({
          name: z.string(),
          email: z.string().email().optional().or(z.literal('')),
        })
        .optional(),
      hasIntegratedServices: z.string().optional(),
      requestingMeeting: z.array(z.enum([YES, NO])).optional(),
    })
    .refine(
      ({ hasDiagnoses, hasHadSupport, hasWelfareContact }) =>
        hasDiagnoses === YES || hasHadSupport === YES
          ? !!hasWelfareContact
          : true,
      { path: ['hasWelfareContact'] },
    )
    .refine(
      ({ hasDiagnoses, hasHadSupport, hasWelfareContact, welfareContact }) =>
        (hasDiagnoses === YES || hasHadSupport === YES) &&
        hasWelfareContact === YES
          ? welfareContact && welfareContact.name.length > 0
          : true,
      { path: ['welfareContact', 'name'] },
    )
    .refine(
      ({ hasDiagnoses, hasHadSupport, hasWelfareContact, welfareContact }) =>
        (hasDiagnoses === YES || hasHadSupport === YES) &&
        hasWelfareContact === YES
          ? welfareContact &&
            welfareContact.email &&
            welfareContact.email.length > 0
          : true,
      { path: ['welfareContact', 'email'] },
    )
    .refine(
      ({ hasDiagnoses, hasHadSupport, hasWelfareContact, hasCaseManager }) =>
        (hasDiagnoses === YES || hasHadSupport === YES) &&
        hasWelfareContact === YES
          ? !!hasCaseManager
          : true,
      { path: ['hasCaseManager'] },
    )
    .refine(
      ({
        hasDiagnoses,
        hasHadSupport,
        hasWelfareContact,
        hasCaseManager,
        caseManager,
      }) =>
        (hasDiagnoses === YES || hasHadSupport === YES) &&
        hasWelfareContact === YES &&
        hasCaseManager === YES
          ? caseManager && caseManager.name.length > 0
          : true,
      { path: ['caseManager', 'name'] },
    )
    .refine(
      ({
        hasDiagnoses,
        hasHadSupport,
        hasWelfareContact,
        hasCaseManager,
        caseManager,
      }) =>
        (hasDiagnoses === YES || hasHadSupport === YES) &&
        hasWelfareContact === YES &&
        hasCaseManager === YES
          ? caseManager && caseManager.email && caseManager.email.length > 0
          : true,
      {
        path: ['caseManager', 'email'],
      },
    )
    .refine(
      ({
        hasDiagnoses,
        hasHadSupport,
        hasIntegratedServices,
        hasWelfareContact,
      }) =>
        (hasDiagnoses === YES || hasHadSupport === YES) &&
        hasWelfareContact === YES
          ? !!hasIntegratedServices
          : true,
      { path: ['hasIntegratedServices'] },
    ),
})

export type SchemaFormValues = z.infer<typeof dataSchema>
