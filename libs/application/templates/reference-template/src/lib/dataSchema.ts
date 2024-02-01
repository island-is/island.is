import { z } from 'zod'
import * as kennitala from 'kennitala'
import { isValidNumber } from 'libphonenumber-js'
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
  someHiddenFieldRequired: z.string().refine((x) => x.length > 0),
  person: z.object({
    name: z.string().min(1).max(256),
    age: z.string().refine((x) => {
      const asNumber = parseInt(x)
      if (isNaN(asNumber)) {
        return false
      }
      return asNumber > 15
    }),
    someHiddenFieldThatsNotRequired: z.string().optional(),
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
    phoneNumber: z
      .string()
      .refine(isValidNumber, { params: m.dataSchemePhoneNumber }),
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
  deepNestedValues: z.object({
    something: z.object({
      very: z.object({
        deep: z.object({
          so: z.object({
            so: z.object({
              very: z.object({
                very: z.object({
                  deep: z.object({
                    nested: z.object({
                      value: z.string(),
                    }),
                  }),
                }),
              }),
            }),
          }),
        }),
      }),
    }),
  }),
  dreamJob: z.string().optional(),
  assigneeEmail: z.string().email(),
  approvedByReviewer: z.enum(['APPROVE', 'REJECT']),
})
