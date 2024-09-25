import { z } from 'zod'
import { isValidNumber } from 'libphonenumber-js'
import * as kennitala from 'kennitala'
import * as m from './messages'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  person: z.object({
    nationalId: z.string().refine((n) => n && !kennitala.isValid(n), {
      params: m.dataSchema.nationalId,
    }),
    name: z.string().min(2).max(256),
    age: z.string().refine((x) => {
      const asNumber = parseInt(x)
      if (isNaN(asNumber)) {
        return false
      }
      return asNumber > 15
    }),
    email: z.string().email(),
    phoneNumber: z
      .string()
      .refine(isValidNumber, { params: m.dataSchema.phoneNumber }),
  }),
})
