import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { z } from 'zod'
import { NO, YES, HouseholdSupplementHousing } from './constants'
import { householdSupplementFormMessage } from './messages'
import { addYears } from 'date-fns'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  questions: z.object({
    pensionFund: z.enum([YES, NO]),
    abroad: z.enum([YES, NO]),
  }),
  applicantInfo: z.object({
    email: z.string().email(),
    phonenumber: z.string().refine(
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
      { params: householdSupplementFormMessage.errors.phonenumber },
    ),
  }),
  paymentInfo: z.object({
    bank: z.string(),
  }),
  householdSupplement: z.object({
    housing: z.enum([
      HouseholdSupplementHousing.HOUSEOWNER,
      HouseholdSupplementHousing.RENTER,
    ]),
    children: z.enum([YES, NO]),
  }),
  period: z
    .object({
      year: z.string(),
      month: z.string(),
    })
    .refine(
      (p) => {
        const today = new Date()
        const startDate = addYears(today, -2)
        const selectedDate = new Date(p.year + p.month)
        return startDate < selectedDate
      },
      { params: householdSupplementFormMessage.errors.period },
    ),
})

export type SchemaFormValues = z.infer<typeof dataSchema>
