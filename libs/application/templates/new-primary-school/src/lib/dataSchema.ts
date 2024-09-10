import { NO, YES } from '@island.is/application/types'
import * as kennitala from 'kennitala'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { z } from 'zod'
import {
  ReasonForApplicationOptions,
  SiblingRelationOptions,
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
  approveExternalData: z.boolean().refine((v) => v),
  childNationalId: z.string().min(1),
  childInfo: z
    .object({
      gender: z.string().optional(),
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
  parents: z.object({
    parent1: z.object({
      email: z.string().email(),
      phoneNumber: phoneNumberSchema,
    }),
    parent2: z
      .object({
        email: z.string().email(),
        phoneNumber: phoneNumberSchema,
      })
      .optional(),
  }),
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
  reasonForApplication: z
    .object({
      reason: z.nativeEnum(ReasonForApplicationOptions),
      movingAbroad: z
        .object({
          country: z.string().optional(),
        })
        .optional(),
      transferOfLegalDomicile: z
        .object({
          streetAddress: z.string(),
          postalCode: z.string(),
        })
        .optional(),
    })
    .refine(
      ({ reason, movingAbroad }) =>
        reason === ReasonForApplicationOptions.MOVING_ABROAD
          ? movingAbroad && !!movingAbroad.country
          : true,
      {
        path: ['movingAbroad', 'country'],
      },
    )
    .refine(
      ({ reason, transferOfLegalDomicile }) =>
        reason === ReasonForApplicationOptions.TRANSFER_OF_LEGAL_DOMICILE
          ? transferOfLegalDomicile &&
            transferOfLegalDomicile.streetAddress.length > 0
          : true,
      {
        path: ['transferOfLegalDomicile', 'streetAddress'],
      },
    )
    .refine(
      ({ reason, transferOfLegalDomicile }) =>
        reason === ReasonForApplicationOptions.TRANSFER_OF_LEGAL_DOMICILE
          ? transferOfLegalDomicile &&
            transferOfLegalDomicile.postalCode.length > 0
          : true,
      {
        path: ['transferOfLegalDomicile', 'postalCode'],
      },
    ),
  schools: z.object({
    newSchool: z.object({
      municipality: z.string(),
      school: z.string(),
    }),
  }),
  siblings: z
    .array(
      z.object({
        fullName: z.string().min(1),
        nationalId: z.string().refine((n) => kennitala.isValid(n), {
          params: errorMessages.nationalId,
        }),
        relation: z.nativeEnum(SiblingRelationOptions),
      }),
    )
    .refine((r) => r === undefined || r.length > 0, {
      params: errorMessages.siblingsRequired,
    }),
  startDate: z.string(),
  languages: z
    .object({
      nativeLanguage: z.string(),
      otherLanguagesSpokenDaily: z.enum([YES, NO]),
      otherLanguages: z.array(z.string()).optional(),
    })
    .refine(
      ({ otherLanguagesSpokenDaily, otherLanguages }) =>
        otherLanguagesSpokenDaily === YES
          ? !!otherLanguages && otherLanguages.length > 0
          : true,
      {
        path: ['otherLanguages'],
        params: errorMessages.languagesRequired,
      },
    ),
  allergiesAndIntolerances: z
    .object({
      hasFoodAllergies: z.array(z.string()),
      hasFoodIntolerances: z.array(z.string()),
      foodAllergies: z.array(z.string()).optional(),
      foodIntolerances: z.array(z.string()).optional(),
      isUsingEpiPen: z.array(z.string()),
    })
    .refine(
      ({ hasFoodAllergies, foodAllergies }) =>
        hasFoodAllergies.includes(YES)
          ? !!foodAllergies && foodAllergies.length > 0
          : true,
      {
        path: ['foodAllergies'],
        params: errorMessages.foodAllergyRequired,
      },
    )
    .refine(
      ({ hasFoodIntolerances, foodIntolerances }) =>
        hasFoodIntolerances.includes(YES)
          ? !!foodIntolerances && foodIntolerances.length > 0
          : true,
      {
        path: ['foodIntolerances'],
        params: errorMessages.foodIntoleranceRequired,
      },
    ),
  support: z.object({
    developmentalAssessment: z.enum([YES, NO]),
    specialSupport: z.enum([YES, NO]),
    requestMeeting: z.array(z.enum([YES, NO])).optional(),
  }),
  photography: z
    .object({
      photographyConsent: z.enum([YES, NO]),
      photoSchoolPublication: z.enum([YES, NO]).optional(),
      photoMediaPublication: z.enum([YES, NO]).optional(),
    })
    .refine(
      ({ photographyConsent, photoSchoolPublication }) =>
        photographyConsent === YES ? !!photoSchoolPublication : true,
      {
        path: ['photoSchoolPublication'],
      },
    )
    .refine(
      ({ photographyConsent, photoMediaPublication }) =>
        photographyConsent === YES ? !!photoMediaPublication : true,
      {
        path: ['photoMediaPublication'],
      },
    ),
})

export type SchemaFormValues = z.infer<typeof dataSchema>
