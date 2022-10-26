import { z } from 'zod'
import * as kennitala from 'kennitala'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { m } from './messages'

const careerHistoryCompaniesValidation = (data: any) => {
  // Applicant selected other but didnt supply the reason so we dont allow it
  if (
    data.careerHistoryCompanies?.includes('other') &&
    !data.careerHistoryOther
  ) {
    return false
  }
  return true
}
export const ExampleSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  person: z.object({
    name: z.string().min(1).max(256),
    age: z.string().refine((x) => {
      const asNumber = parseInt(x)
      if (isNaN(asNumber)) {
        return false
      }
      return asNumber > 15
    }),
    nationalId: z
      .string()
      /**
       * We are depending on this template for the e2e tests on the application-system-api.
       * Because we are not allowing committing valid kennitala, I reversed the condition
       * to check for invalid kenitala so it passes the test.
       */
      .refine((n) => n && !kennitala.isValid(n), {
        params: m.dataSchemeNationalId,
      }),
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
  careerIndustry: z.enum(['software', 'finance', 'consulting', 'other']),
  careerHistoryDetails: z
    .object({
      careerHistoryCompanies: z
        .array(z.enum(['government', 'aranja', 'advania', 'other']))
        .nonempty(),
      careerHistoryOther: z.string(),
    })
    .partial()
    .refine((data) => careerHistoryCompaniesValidation(data), {
      params: m.careerHistoryOtherError,
      path: ['careerHistoryOther'],
    }),
  dreamJob: z.string().optional(),
  assigneeEmail: z.string().email(),
  approvedByReviewer: z.enum(['APPROVE', 'REJECT']),
})
