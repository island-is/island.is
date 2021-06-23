// import { parsePhoneNumberFromString } from 'libphonenumber-js'
import * as z from 'zod'
import { error } from './messages/error'

export const ComplaintsToAlthingiOmbudsmanSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v, { params: error.required }),
  /* information: z.object({
    name: z.string().nonempty(),
    ssn: z.string().refine((x) => (x ? kennitala.isPerson(x) : false)),
    address: z.string().nonempty(),
    postcode: z.string().nonempty(),
    city: z.string().nonempty(),
    email: z
      .string()
      .email()
      .refine((val) => (val ? val.length > 0 : false), {
        params: error.required,
      }),
    phone: z.string().refine(
      (p) => {
        const phoneNumber = parsePhoneNumberFromString(p, 'IS')
        return phoneNumber && phoneNumber.isValid()
      },
      {
        params: error.required,
      },
    ),
  }), */
})

export type ComplaintsToAlthingiOmbudsman = z.TypeOf<
  typeof ComplaintsToAlthingiOmbudsmanSchema
>
