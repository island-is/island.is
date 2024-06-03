import { NO, YES } from '@island.is/application/types'
import * as kennitala from 'kennitala'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { z } from 'zod'
import { RelationOptions, SiblingRelationOptions } from './constants'
import { errorMessages } from './messages'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  childNationalId: z.string().min(1),
  parents: z.object({
    parent1: z.object({
      email: z.string().email(),
      phoneNumber: z.string().refine(
        (p) => {
          const phoneNumber = parsePhoneNumberFromString(p, 'IS')
          const phoneNumberStartStr = ['6', '7', '8']
          return (
            phoneNumber &&
            phoneNumber.isValid() &&
            phoneNumberStartStr.some((substr) =>
              phoneNumber.nationalNumber.startsWith(substr),
            )
          )
        },
        { params: errorMessages.phoneNumber },
      ),
    }),
    parent2: z
      .object({
        email: z.string().email(),
        phoneNumber: z.string().refine(
          (p) => {
            const phoneNumber = parsePhoneNumberFromString(p, 'IS')
            const phoneNumberStartStr = ['6', '7', '8']
            return (
              phoneNumber &&
              phoneNumber.isValid() &&
              phoneNumberStartStr.some((substr) =>
                phoneNumber.nationalNumber.startsWith(substr),
              )
            )
          },
          { params: errorMessages.phoneNumber },
        ),
      })
      .optional(),
  }),
  relatives: z
    .array(
      z.object({
        fullName: z.string().min(1),
        phoneNumber: z.string().refine(
          (p) => {
            const phoneNumber = parsePhoneNumberFromString(p, 'IS')
            const phoneNumberStartStr = ['6', '7', '8']
            return (
              phoneNumber &&
              phoneNumber.isValid() &&
              phoneNumberStartStr.some((substr) =>
                phoneNumber.nationalNumber.startsWith(substr),
              )
            )
          },
          { params: errorMessages.phoneNumber },
        ),
        nationalId: z.string().refine((n) => kennitala.isValid(n), {
          params: errorMessages.nationalId,
        }),
        relation: z.enum([
          RelationOptions.GRANDPARENT,
          RelationOptions.SIBLING,
          RelationOptions.STEPPARENT,
          RelationOptions.RELATIVE,
          RelationOptions.FRIEND_OR_OTHER,
        ]),
      }),
    )
    .refine((r) => r === undefined || r.length > 0, {
      params: errorMessages.relativesRequired,
    }),
  siblings: z
    .array(
      z.object({
        fullName: z.string().min(1),
        nationalId: z.string().refine((n) => kennitala.isValid(n), {
          params: errorMessages.nationalId,
        }),
        relation: z.enum([
          SiblingRelationOptions.SIBLING,
          SiblingRelationOptions.HALF_SIBLING,
          SiblingRelationOptions.STEP_SIBLING,
        ]),
      }),
    )
    // TODO: Skoða betur þegar Reason for transfer er komið inn?
    .refine((r) => r === undefined || r.length > 0, {
      params: errorMessages.siblingsRequired,
    }),
  startDate: z.string(),
  languages: z
    .object({
      otherLanguages: z.enum([YES, NO]),
      languages: z.string().optional(),
    })
    .refine(
      ({ otherLanguages, languages }) =>
        otherLanguages === YES ? !!languages : true,
      {
        path: ['languages'],
        params: errorMessages.languagesRequired,
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
