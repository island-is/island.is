import {
  PaymentScheduleConditions,
  PaymentScheduleDebts,
  PaymentScheduleEmployer,
  PaymentScheduleInitialSchedule,
} from '@island.is/api/schema'
import { SuccessfulDataProviderResult } from '@island.is/application/core'
import * as z from 'zod'
import { NO, YES } from '../shared/constants'

interface PrerequisitesResult extends SuccessfulDataProviderResult {
  data: {
    conditions: PaymentScheduleConditions
    debts: PaymentScheduleDebts[]
    allInitialSchedules: PaymentScheduleInitialSchedule[]
    employer: PaymentScheduleEmployer
  }
}

interface UserProfileResult extends SuccessfulDataProviderResult {
  data: {
    email: string
    mobilePhoneNumber: string
  }
}

interface NatRegResult extends SuccessfulDataProviderResult {
  data: {
    nationalId: string
    age: number
    fullName: string
    citizenship: {
      code: string
      name: string
    }
    legalResidence: string
    address: {
      code: string
      postalCode: string
      city: string
      streetAddress: string
      lastUpdated: string
    }
  }
}

export type PaymentPlanExternalData = {
  paymentPlanPrerequisites?: PrerequisitesResult
  nationalRegistry?: NatRegResult
  userProfile?: UserProfileResult
}

const paymentPlanSchema = z
  .object({
    id: z.string().nonempty(),
    amountPerMonth: z.number().optional(),
    numberOfMonths: z.number().optional(),
  })
  .optional()

export const PublicDebtPaymentPlanSchema = z.object({
  // TODO: Applicant schema
  employer: z.object({
    isCorrectInfo: z.enum([YES, NO]),
    correctedNationalId: z.string().optional(),
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

export const paymentPlanIndexKeyMapper = {
  0: 'one',
  1: 'two',
  2: 'three',
  3: 'four',
  4: 'five',
  5: 'six',
  6: 'seven',
  7: 'eight',
  8: 'nine',
  9: 'ten',
}

export const paymentPlanEntryKeys = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
]

export type PublicDebtPaymentPlan = z.TypeOf<typeof PublicDebtPaymentPlanSchema>
