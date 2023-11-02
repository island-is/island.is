import { z } from 'zod'
import { m } from './messages'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
})

const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

const emailRegex =
  /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i
export const isValidEmail = (value: string) => emailRegex.test(value)

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
    .refine(
      ({ dateFrom, dateTil }) =>
        !dateFrom || !dateTil || new Date(dateFrom) <= new Date(dateTil),
      {
        message: m.validationTilBeforeFrom.defaultMessage as string,
        path: ['dateTil'],
      },
    ),
  phone: z.string().refine((v) => isValidPhoneNumber(v)),
  email: z.string().refine((v) => isValidEmail(v)),
})

export type File = z.TypeOf<typeof FileSchema>
export type GeneralPetition = z.TypeOf<typeof GeneralPetitionSchema>
