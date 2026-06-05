import { z } from 'zod'

const registerIncomeEntrySchema = z.object({
  // Casual work / Part-time company lookup
  company: z
    .object({
      nationalId: z.string().optional(),
      name: z.string().optional(),
    })
    .optional(),
  // Casual work fields
  monthFrom: z.string().min(1).optional(),
  monthTo: z.string().min(1).optional(),
  estimatedIncome: z.string().min(1).optional(),
  // Part-time fields
  jobStart: z.string().min(1).optional(),
  workPercentage: z.string().min(1).optional(),
  // Contract work fields
  contractJobStart: z.string().min(1).optional(),
  workEnds: z.string().min(1).optional(),
  // Capital income fields
  paymentType: z.string().min(1).optional(),
  amountPerMonth: z.string().min(1).optional(),
  paymentFrequency: z.string().min(1).optional(),
  // Pension fields
  pensionType: z.string().min(1).optional(),
  pensionFund: z.string().min(1).optional(),
  // Social insurance fields
  socialPaymentType: z.string().min(1).optional(),
})

export const dataSchema = z.object({
  typeOfIncome: z.string().min(1),
  registerIncome: z.array(registerIncomeEntrySchema).min(1),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
