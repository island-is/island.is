import { z } from 'zod'
import * as kennitala from 'kennitala'
import { YES } from '@island.is/application/core'
import { isValidEmail, isValidPhoneNumber } from '../utils'
import { error as errorMessages } from '../lib/messages'

const applicantInformationSchema = z.object({
  nationalId: z
    .string()
    .refine(
      (nationalId) =>
        nationalId && nationalId.length !== 0 && kennitala.isValid(nationalId),
    ),
  name: z.string(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  email: z.string(),
  phoneNumber: z.string(),
})

export const contactInformationSchema = z
  .object({
    email: z.string().nullish().or(z.literal('')),
    name: z.string().nullish().or(z.literal('')),
    phoneNumber: z.string().nullish().or(z.literal('')),
    sameAsApplicant: z.array(z.string()).optional(),
  })
  .superRefine((val, ctx) => {
    const isSame = val.sameAsApplicant?.includes(YES) ?? false

    if (!isSame) {
      if (!val.email || val.email.trim() === '') {
        ctx.addIssue({
          path: ['email'],
          code: z.ZodIssueCode.custom,
          params: errorMessages.emailRequired,
        })
      }

      if (!val.email || !isValidEmail(val.email)) {
        ctx.addIssue({
          path: ['email'],
          code: z.ZodIssueCode.custom,
          params: errorMessages.invalidEmail,
        })
      }
      if (!val.name || val.name.trim() === '') {
        ctx.addIssue({
          path: ['name'],
          code: z.ZodIssueCode.custom,
          params: errorMessages.nameRequired,
        })
      }

      if (!val.phoneNumber || val.phoneNumber.trim() === '') {
        ctx.addIssue({
          path: ['phoneNumber'],
          code: z.ZodIssueCode.custom,
          params: errorMessages.phoneNumberRequired,
        })
      }

      if (!val.phoneNumber || !isValidPhoneNumber(val.phoneNumber)) {
        ctx.addIssue({
          path: ['phoneNumber'],
          code: z.ZodIssueCode.custom,
          params: errorMessages.invalidPhoneNumber,
        })
      }
    }
  })

export const MachineAnswersSchema = z.object({
  machine: z
    .object({
      id: z.string().optional(),
      date: z.string().optional(),
      type: z.string().optional(),
      plate: z.string().optional(),
      subType: z.string().optional(),
      category: z.string().optional(),
      regNumber: z.string().optional(),
      ownerNumber: z.string().optional(),
      findVehicle: z.boolean().optional(),
      isValid: z.boolean().optional(),
    })
    .refine(({ isValid, findVehicle }) => {
      return (findVehicle && isValid) || !findVehicle
    }),
  approveExternalData: z.boolean().refine((v) => v),
  location: z.object({
    address: z.string().min(1),
    city: z.string().min(1),
    postalCode: z
      .string()
      .min(1)
      .refine(
        (data): data is string =>
          typeof data === 'string' &&
          !isNaN(Number(data)) &&
          (data.length === 3 || data.length === 0),
      ),
    comment: z.string().min(1),
  }),
  contactInformation: contactInformationSchema,
  applicant: applicantInformationSchema,
})

export type MachineAnswers = z.TypeOf<typeof MachineAnswersSchema>
