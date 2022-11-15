import {
  PaymentScheduleConditions,
  PaymentScheduleDebts,
  PaymentScheduleEmployer,
  PaymentScheduleInitialSchedule,
  PaymentScheduleType,
} from '@island.is/api/schema'
import { SuccessfulDataProviderResult } from '@island.is/application/types'
import { z } from 'zod'
import {
  PaymentPlanSchema,
  PublicDebtPaymentPlanSchema,
  ApplicantSchema,
  CorrectedEmployerSchema,
  PaymentPlansSchema,
} from '../lib/dataSchema'
import { AMOUNT, MONTHS } from '../shared/constants'

export type PaymentPlanBuildIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export type PaymentPlanKeys =
  | 'one'
  | 'two'
  | 'three'
  | 'four'
  | 'five'
  | 'six'
  | 'seven'
  | 'eight'
  | 'nine'
  | 'ten'

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

export interface PrerequisitesResult extends SuccessfulDataProviderResult {
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

export interface PaymentDistribution {
  monthAmount: number | null
  monthCount: number | null
  totalAmount: number
  scheduleType: PaymentScheduleType
}

export interface NatRegResult extends SuccessfulDataProviderResult {
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

interface IdsRegResult extends SuccessfulDataProviderResult {
  data: {
    name: string
    nationalId: string
    address: {
      streetAddress: string
      postalCode: string
      city: string
    }
  }
}

export type PaymentPlanExternalData = {
  paymentPlanPrerequisites?: PrerequisitesResult
  nationalRegistry?: NatRegResult
  identityRegistry?: IdsRegResult
  userProfile?: UserProfileResult
}

const PaymentMode = z.enum([AMOUNT, MONTHS])
export type PaymentModeState = z.infer<typeof PaymentMode>
export type PaymentPlan = z.TypeOf<typeof PaymentPlanSchema>
export type Applicant = z.TypeOf<typeof ApplicantSchema>
export type CorrectedEmployer = z.TypeOf<typeof CorrectedEmployerSchema>
export type PaymentPlans = z.TypeOf<typeof PaymentPlansSchema>

export type PublicDebtPaymentPlan = z.TypeOf<typeof PublicDebtPaymentPlanSchema>
