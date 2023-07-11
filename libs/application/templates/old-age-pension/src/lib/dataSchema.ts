import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { z } from 'zod'
import {
  ApplicationType,
  HouseholdSupplementHousing,
  NO,
  taxLevelOptions,
  YES,
} from './constants'
import { oldAgePensionFormMessage } from './messages'
import addYears from 'date-fns/addYears'
import addMonths from 'date-fns/addMonths'

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
      { params: oldAgePensionFormMessage.errors.phoneNumber },
    ),
  }),
  residenceHistory: z.object({
    question: z.enum([YES, NO]),
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
      { params: oldAgePensionFormMessage.errors.period },
    ),
  onePaymentPerYear: z.object({
    question: z.enum([YES, NO]),
  }),
  householdSupplement: z.object({
    housing: z.enum([
      HouseholdSupplementHousing.HOUSEOWNER,
      HouseholdSupplementHousing.RENTER,
    ]),
    children: z.enum([YES, NO]),
  }),
  paymentInfo: z.object({
    bank: z.string(),
    spouseAllowance: z.enum([YES, NO]),
    spouseAllownaceUsage: z.string().optional(),
    personalAllowance: z.enum([YES, NO]),
    personalAllowanceUsage: z.string().optional(),
    taxLevel: z.enum([
      taxLevelOptions.INCOME,
      taxLevelOptions.FIRST_LEVEL,
      taxLevelOptions.SECOND_LEVEL,
    ]),
  }),
})

export type SchemaFormValues = z.infer<typeof dataSchema>
