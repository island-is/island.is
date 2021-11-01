import * as kennitala from 'kennitala'
import * as z from 'zod'
import { AMOUNT, MONTHS, NO, YES } from '../shared/constants'
import { error } from './messages'

const paymentPlanSchema = z
  .object({
    id: z.string().min(1),
    amountPerMonth: z.number().optional(),
    numberOfMonths: z.number().optional(),
    distribution: z.string().min(1),
    totalAmount: z.string().min(1),
    paymentMode: z.enum([AMOUNT, MONTHS]).refine((x) => x !== null, {
      params: error.paymentMode,
    }),
  })
  .optional()

export const PublicDebtPaymentPlanSchema = z.object({
  // TODO: Applicant schema
  applicant: z.object({
    address: z.string(),
    city: z.string(),
    email: z.string(),
    name: z.string(),
    nationalId: z.string(),
    phoneNumber: z.string(),
    postalCode: z.string(),
  }),
  employer: z.object({
    isCorrectInfo: z.enum([YES, NO]),
    correctedNationalId: z
      .object({
        id: z
          .string()
          .refine(
            (x) =>
              x &&
              x.length !== 0 &&
              kennitala.isValid(x) &&
              kennitala.isCompany(x),
          ),
      })
      .optional(),
  }),
  paymentPlanContext: z.object({
    isFulfilled: z.boolean().refine((x) => x),
    activePayment: z.string().optional(),
  }),
  paymentPlans: z.object({
    one: paymentPlanSchema,
    two: paymentPlanSchema,
    three: paymentPlanSchema,
    four: paymentPlanSchema,
    five: paymentPlanSchema,
    six: paymentPlanSchema,
    seven: paymentPlanSchema,
    eight: paymentPlanSchema,
    nine: paymentPlanSchema,
    ten: paymentPlanSchema,
  }),
})
