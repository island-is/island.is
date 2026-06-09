import { z } from 'zod'

const casualWorkEntrySchema = z.object({
  company: z.object({
    nationalId: z.string().min(1),
    name: z.string().optional(),
  }),
  monthFrom: z.string().min(1),
  monthTo: z.string().min(1),
  estimatedIncome: z.string().min(1),
})

const partTimeEntrySchema = z.object({
  company: z.object({
    nationalId: z.string().min(1),
    name: z.string().optional(),
  }),
  jobStart: z.string().min(1),
  workPercentage: z.string().min(1),
  estimatedIncome: z.string().min(1),
})

const contractWorkEntrySchema = z.object({
  contractJobStart: z.string().min(1),
  workEnds: z.string().min(1),
})

const capitalIncomeEntrySchema = z.object({
  paymentType: z.string().min(1),
  amountPerMonth: z.string().min(1),
  paymentFrequency: z.string().min(1),
})

const socialInsuranceEntrySchema = z.object({
  socialPaymentType: z.string().min(1),
  amountPerMonth: z.string().min(1),
  paymentFrequency: z.string().min(1),
})

const pensionEntrySchema = z.object({
  pensionFund: z.string().min(1),
  pensionType: z.string().min(1),
  amountPerMonth: z.string().min(1),
})

export const dataSchema = z.object({
  typeOfIncome: z.string().min(1),
  registerCasualWork: z.array(casualWorkEntrySchema).optional(),
  registerPartTime: z.array(partTimeEntrySchema).optional(),
  registerContractWork: z.array(contractWorkEntrySchema).optional(),
  registerCapitalIncome: z.array(capitalIncomeEntrySchema).optional(),
  registerSocialInsurance: z.array(socialInsuranceEntrySchema).optional(),
  registerPension: z.array(pensionEntrySchema).optional(),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
