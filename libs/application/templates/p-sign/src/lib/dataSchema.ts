import { z } from 'zod'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { PICK_UP, SEND_HOME } from './constants'
import { m } from './messages'
import { EMAIL_REGEX, NO, YES } from '@island.is/application/core'

const isValidEmail = (value: string) => EMAIL_REGEX.test(value)

const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
})

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  nationalId: z.string(),
  address: z.string(),
  city: z.string(),
  email: z.string().refine((v) => isValidEmail(v)),
  phone: z.string().refine((v) => isValidPhoneNumber(v)),
  name: z.string(),
  validityPeriod: z.string(),
  photo: z
    .object({
      attachments: z.array(FileSchema),
      qualityPhoto: z.enum([YES, NO]),
    })
    .partial()
    .refine(
      ({ attachments, qualityPhoto }) =>
        (attachments && attachments.length > 0 && qualityPhoto === NO) ||
        qualityPhoto === YES ||
        (!qualityPhoto && attachments && attachments.length > 0),
      {
        message: m.missingAttachmentValidationError.defaultMessage,
        path: ['attachments'],
      },
    ),
  delivery: z
    .object({
      deliveryMethod: z.string(),
      district: z.string(),
    })
    .partial()
    .refine(
      ({ deliveryMethod, district }) =>
        (deliveryMethod === PICK_UP && !!district) ||
        (deliveryMethod === SEND_HOME && (!district || !!district)),
      {
        message: m.missingDistrictValidationError.defaultMessage,
        path: ['district'],
      },
    ),
  meme: z.string(),
})

export type File = z.TypeOf<typeof FileSchema>
export type PSignSchema = z.TypeOf<typeof dataSchema>
