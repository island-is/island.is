import * as z from 'zod'
import { m } from '../../lib/messages'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  about: z.object({
    phoneNumber: z.string().refine(
      (p) => {
        const phoneNumber = parsePhoneNumberFromString(p, 'IS')
        return phoneNumber && phoneNumber.isValid()
      },
      { params: m.dataSchemePhoneNumber },
    ),
    email: z.string().email(),
  }),
  properties: z.object({
    short: z.string(),
    cash: z.string(),
  }),
  income: z.object({
    donations: z.string(),
    personal: z.string(),
    capital: z.string(),
  }),
  attachment: z.object({
    file: z.array(FileSchema),
  }),
})
