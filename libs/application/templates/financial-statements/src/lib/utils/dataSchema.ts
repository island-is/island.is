import * as z from 'zod'
import { m } from '../../lib/messages'
import { parsePhoneNumberFromString } from 'libphonenumber-js'


export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  person: z.object({
    phoneNumber: z.string().refine(
      (p) => {
        const phoneNumber = parsePhoneNumberFromString(p, 'IS')
        return phoneNumber && phoneNumber.isValid()
      },
      { params: m.dataSchemePhoneNumber },
    ),
    email: z.string().email(),
  }),
  careerHistory: z.enum(['yes', 'no']).optional(),
  careerHistoryCompanies: z
    .array(
      // TODO checkbox answers are [undefined, 'aranja', undefined] and we need to do something about it...
      z.union([z.enum(['government', 'aranja', 'advania']), z.undefined()]),
    )
    .nonempty(),
  dreamJob: z.string().optional(),
})
