import { z } from 'zod'
import { m } from './messages'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { EMAIL_REGEX } from '@island.is/application/core'

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
})

const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid() && phoneNumber.length > 0
}

export const isValidEmail = (value: string): boolean => EMAIL_REGEX.test(value)

export const GeneralPetitionSchema = z.object({
  approveTermsAndConditions: z
    .boolean()
    .refine((v) => v, m.validationApproveTerms.defaultMessage as string),
  documents: z.array(FileSchema).optional(),
  listName: z
    .string()
    .refine(
      (p) => p.trim().length > 0,
      m.validationListName.defaultMessage as string,
    ),
  aboutList: z
    .string()
    .refine(
      (p) => p.trim().length > 0,
      m.validationAboutList.defaultMessage as string,
    ),
  dates: z
    .object({
      dateFrom: z
        .string()
        .refine(
          (p) => p.trim().length > 0,
          m.validationSelectDate.defaultMessage as string,
        ),
      dateTil: z
        .string()
        .refine(
          (p) => p.trim().length > 0,
          m.validationSelectDate.defaultMessage as string,
        ),
    })
    .superRefine(({ dateFrom, dateTil }, ctx) => {
      const from = new Date(dateFrom)
      const to = new Date(dateTil)

      // Ensure dateFrom is before dateTil
      if (from >= to) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: m.validationTilBeforeFrom.defaultMessage as string,
          path: ['dateTil'],
        })
      }

      // Ensure dateTil is within 3 months from dateFrom
      const maxEndDate = new Date(from)
      maxEndDate.setMonth(maxEndDate.getMonth() + 3)
      if (to > maxEndDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: m.validationDateTooFarInFuture.defaultMessage as string,
          path: ['dateTil'],
        })
      }
    }),
  phone: z.string().refine((v) => isValidPhoneNumber(v), {
    message: m.validationPhone.defaultMessage as string,
  }),
  email: z
    .string()
    .min(3)
    .refine((v) => isValidEmail(v), {
      message: m.validationEmail.defaultMessage as string,
    }),
})

export type File = z.TypeOf<typeof FileSchema>
export type GeneralPetition = z.TypeOf<typeof GeneralPetitionSchema>
