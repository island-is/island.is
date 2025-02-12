import { applicantInformationSchema } from '@island.is/application/ui-forms'
import * as kennitala from 'kennitala'
import { z } from 'zod'
import { AMOUNT, MONTHS } from '../shared/constants'
import { error } from './messages'
import { NO, YES } from '@island.is/application/core'

export const PaymentPlanSchema = z
  .object({
    id: z.string().min(1),
    amountPerMonth: z.number().optional(),
    numberOfMonths: z.number().optional(),
    distribution: z.array(z.any()).min(1),
    totalAmount: z.string().min(1),
    paymentMode: z.enum([AMOUNT, MONTHS]).refine((x) => x !== null, {
      params: error.paymentMode,
    }),
  })
  .optional()

export const ApplicantSchema = z.object({
  address: z.string().optional(),
  city: z.string().optional(),
  email: z.string(),
  name: z.string().optional(),
  nationalId: z.string().optional(),
  phoneNumber: z.string().optional(),
  postalCode: z.string(),
})

export const CorrectedEmployerSchema = z.object({
  nationalId: z
    .string()
    .refine((x) => x && x.length !== 0 && kennitala.isValid(x), {
      params: error.nationalId,
    }),
  label: z.string().min(1),
  value: z.string().optional(),
  validEmployer: z.boolean().refine((x) => x === true, {
    params: error.invalidEmployer,
  }),
})

export const PaymentPlansSchema = z.object({
  one: PaymentPlanSchema,
  two: PaymentPlanSchema,
  three: PaymentPlanSchema,
  four: PaymentPlanSchema,
  five: PaymentPlanSchema,
  six: PaymentPlanSchema,
  seven: PaymentPlanSchema,
  eight: PaymentPlanSchema,
  nine: PaymentPlanSchema,
  ten: PaymentPlanSchema,
})

export const PublicDebtPaymentPlanSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: applicantInformationSchema(),
  employer: z.object({
    isCorrectInfo: z.enum([YES, NO]),
  }),
  correctedEmployer: CorrectedEmployerSchema,
  paymentPlanContext: z.object({
    isFulfilled: z.boolean().refine((x) => x),
    activePayment: z.string().optional(),
  }),
  paymentPlans: PaymentPlansSchema,
})
