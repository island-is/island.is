import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { z } from 'zod'
import {
  ApplicationType,
  Employment,
  HomeAllowanceHousing,
  NO,
  YES,
} from './constants'
import { oldAgePensionFormMessage } from './messages'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicationType: z.object({
    option: z.enum([
      ApplicationType.OLD_AGE_PENSION,
      ApplicationType.HALF_OLD_AGE_PENSION,
      ApplicationType.SAILOR_PENSION,
    ]),
  }),
  questions: z.object({
    pensionFund: z.enum([YES, NO]),
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
      { params: oldAgePensionFormMessage.errors.phonenumber },
    ),
  }),
  employment: z.object({
    status: z.enum([Employment.EMPLOYEE, Employment.SELFEMPLOYED]),
  }),
  residenceHistory: z.object({
    question: z.enum([YES, NO]),
  }),
  period: z.object({
    year: z.string(),
    month: z.string(),
  }),
  onePaymentPerYear: z.object({
    question: z.enum([YES, NO]),
  }),
  homeAllowance: z.object({
    housing: z.enum([
      HomeAllowanceHousing.HOUSEOWNER,
      HomeAllowanceHousing.RENTER,
    ]),
    children: z.enum([YES, NO]),
  }),
})

export type SchemaFormValues = z.infer<typeof dataSchema>
