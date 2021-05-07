import * as z from 'zod'

export const PublicDebtPaymentPlanSchema = z.object({
  externalData: z.object({
    paymentPlanPrerequisites: z.object({
      maxDebt: z.number(),
      totalDebt: z.number(),
      disposableIncome: z.number(),
      alimony: z.number(),
      minimumPayment: z.number(),
      maxDebtOk: z.boolean(),
      maxDebtText: z.string(),
      taxesOk: z.boolean(),
      taxesText: z.string(),
      taxReturnsOk: z.boolean(),
      taxReturnsText: z.string(),
      vatOk: z.boolean(),
      vatText: z.string(),
      citOk: z.boolean(),
      citText: z.string(),
      accommodationTaxOk: z.boolean(),
      accommodationTaxText: z.string(),
      withholdingTaxOk: z.boolean(),
      withholdingTaxText: z.string(),
      wageReturnsOk: z.boolean(),
      wageReturnsText: z.string(),
    }),
    nationalRegistry: z.object({
      data: z.object({
        address: z.object({
          city: z.string(),
          code: z.string(),
          postalCode: z.string(),
          streetAddress: z.string(),
        }),
        age: z.number(),
        citizenship: z.object({
          code: z.string(),
          name: z.string(),
        }),
        fullName: z.string(),
        legalResidence: z.string(),
        nationalId: z.string(),
      }),
      date: z.string(),
      status: z.enum(['success', 'failure']),
    }),
    userProfile: z.object({
      data: z.object({
        email: z.string(),
        mobilePhoneNumber: z.string(),
      }),
      date: z.string(),
      status: z.enum(['success', 'failure']),
    }),
  }),
})

export type PublicDebtPaymentPlan = z.TypeOf<typeof PublicDebtPaymentPlanSchema>
