import {
  validateContactInfo,
  validateCounterParty,
  validateTerms,
} from '@island.is/application/templates/family-matters-core/utils/dataSchema'
import { error } from './messages/index'
import { z } from 'zod'
import { YesOrNoEnum } from '@island.is/application/core'

enum Duration {
  Permanent = 'permanent',
  Temporary = 'temporary',
}

enum ChildSupportPayment {
  Agreement = 'agreement',
  ChildSupport = 'childSupport',
}

const { counterParty, invalidEmail, invalidPhoneNumber, approveTerms } =
  error.validation

const parentContactInfo = validateContactInfo({
  email: invalidEmail,
  phone: invalidPhoneNumber,
})

export const dataSchema = z.object({
  useMocks: z.enum(['yes', 'no']).optional(),
  approveExternalData: z.boolean().refine((v) => v, {
    params: error.validation.dataGathering,
  }),
  selectedChildren: z
    .array(z.string())
    .refine((v) => v && v.length > 0, { params: error.validation.selectChild }),
  residenceChangeReason: z.string().optional(),
  parentA: parentContactInfo,
  counterParty: validateCounterParty({
    email: invalidEmail,
    phone: invalidPhoneNumber,
    counterParty,
  }),
  parentB: parentContactInfo,
  approveTerms: validateTerms(approveTerms),
  approveTermsParentB: validateTerms(approveTerms),
  approveChildSupportTerms: validateTerms(approveTerms),
  approveChildSupportTermsParentB: validateTerms(approveTerms),
  selectDuration: z
    .object({
      type: z.enum([Duration.Permanent, Duration.Temporary]).refine((v) => v, {
        params: error.validation.durationType,
      }),
      date: z.string().optional(),
    })
    .refine((v) => (v.type === Duration.Temporary ? v.date : true), {
      params: error.validation.durationDate,
      path: ['date'],
    }),
  confirmContract: z.object({
    terms: validateTerms(approveTerms),
    timestamp: z.string(),
  }),
  selectChildSupportPayment: z
    .enum([ChildSupportPayment.Agreement, ChildSupportPayment.ChildSupport])
    .refine((v) => v, { params: error.validation.childSupportPayment }),
  confirmContractParentB: validateTerms(approveTerms),
  acceptContract: z.enum([YesOrNoEnum.YES, YesOrNoEnum.NO]).refine((v) => v, {
    params: error.validation.acceptContract,
  }),
})

export type answersSchema = z.infer<typeof dataSchema>
