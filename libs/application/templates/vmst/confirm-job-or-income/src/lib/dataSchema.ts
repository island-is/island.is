import { z } from 'zod'
import { PaymentFrequency } from '../utils/constants'
import { errorMessages } from './messages'

const casualWorkEntrySchema = z.object({
  company: z.object({
    nationalId: z.string().min(1),
    name: z.string().optional(),
  }),
  dateFrom: z.string().min(1),
  dateTo: z.string().min(1),
  estimatedIncome: z.string().min(1),
})

const casualWorkArraySchema = z
  .array(casualWorkEntrySchema)
  .superRefine((entries, ctx) => {
    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        const a = entries[i]
        const b = entries[j]
        if (!a.company?.nationalId || !b.company?.nationalId) continue
        if (a.company.nationalId !== b.company.nationalId) continue
        const aFrom = Date.parse(a.dateFrom)
        const aTo = Date.parse(a.dateTo)
        const bFrom = Date.parse(b.dateFrom)
        const bTo = Date.parse(b.dateTo)
        if (
          Number.isNaN(aFrom) ||
          Number.isNaN(aTo) ||
          Number.isNaN(bFrom) ||
          Number.isNaN(bTo)
        )
          continue
        // Inclusive overlap: touching endpoints count as an overlap.
        if (aFrom <= bTo && bFrom <= aTo) {
          for (const path of [
            [j, 'dateFrom'],
            [j, 'dateTo'],
          ] as const) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [...path],
              params: errorMessages.casualWorkOverlappingPeriods,
            })
          }
        }
      }
    }
  })

const partTimeEntrySchema = z.object({
  company: z.object({
    nationalId: z.string().min(1),
    name: z.string().optional(),
  }),
  jobStart: z.string().min(1),
  jobEnd: z.string().optional(),
  workPercentage: z.string().min(1),
  estimatedIncome: z.string().min(1),
  // Used to correlate this row with the 3rd party validation response.
  validationId: z.string().optional(),
  disabled: z.enum(['true', 'false']).optional(),
})

const partTimeArraySchema = z
  .array(partTimeEntrySchema)
  .superRefine((entries, ctx) => {
    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        const a = entries[i]
        const b = entries[j]
        if (!a.company?.nationalId || !b.company?.nationalId) continue
        if (a.company.nationalId !== b.company.nationalId) continue
        const aFrom = Date.parse(a.jobStart)
        const bFrom = Date.parse(b.jobStart)
        if (Number.isNaN(aFrom) || Number.isNaN(bFrom)) continue
        // Missing jobEnd is treated as an open-ended (infinite) period.
        const aTo = a.jobEnd ? Date.parse(a.jobEnd) : Number.POSITIVE_INFINITY
        const bTo = b.jobEnd ? Date.parse(b.jobEnd) : Number.POSITIVE_INFINITY
        if (Number.isNaN(aTo) || Number.isNaN(bTo)) continue
        if (aFrom <= bTo && bFrom <= aTo) {
          for (const path of [
            [j, 'jobStart'],
            [j, 'jobEnd'],
          ] as const) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [...path],
              params: errorMessages.partTimeOverlappingPeriods,
            })
          }
        }
      }
    }
  })

const contractWorkEntrySchema = z.object({
  contractJobStart: z.string().min(1),
  workEnds: z.string().min(1),
})

const capitalIncomeEntrySchema = z
  .object({
    paymentType: z.string().min(1),
    amountPerMonth: z.string().min(1),
    paymentFrequency: z.nativeEnum(PaymentFrequency),
    dateFrom: z.string().min(1),
    dateTo: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentFrequency === PaymentFrequency.ONE_TIME && !data.dateTo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['dateTo'],
        params: errorMessages.dateToRequiredForOneTime,
      })
    }
  })

const socialInsuranceEntrySchema = z
  .object({
    socialPaymentType: z.string().min(1),
    amountPerMonth: z.string().min(1),
    paymentFrequency: z.nativeEnum(PaymentFrequency),
    dateFrom: z.string().min(1),
    dateTo: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentFrequency === PaymentFrequency.ONE_TIME && !data.dateTo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['dateTo'],
        params: errorMessages.dateToRequiredForOneTime,
      })
    }
  })

const pensionEntrySchema = z
  .object({
    pensionFund: z.string().min(1),
    pensionType: z.string().min(1),
    amountPerMonth: z.string().min(1),
    paymentFrequency: z.nativeEnum(PaymentFrequency),
    dateFrom: z.string().min(1),
    dateTo: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentFrequency === PaymentFrequency.ONE_TIME && !data.dateTo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['dateTo'],
        params: errorMessages.dateToRequiredForOneTime,
      })
    }
  })

const incomeTypeEnum = z.enum([
  'casualWork',
  'partTime',
  'contractWork',
  'pension',
  'capitalIncome',
  'socialInsurance',
])

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  typeOfIncome: z.array(incomeTypeEnum).min(1),
  registerCasualWork: casualWorkArraySchema.optional(),
  registerPartTime: partTimeArraySchema.optional(),
  registerContractWork: z.array(contractWorkEntrySchema).optional(),
  registerCapitalIncome: z.array(capitalIncomeEntrySchema).optional(),
  registerSocialInsurance: z.array(socialInsuranceEntrySchema).optional(),
  registerPension: z.array(pensionEntrySchema).optional(),
  partTimeValidationErrorTitle: z.string().optional(),
  partTimeValidationErrorMessage: z.string().optional(),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
