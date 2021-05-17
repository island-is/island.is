import {
  validateContactInfo,
  validateCounterParty,
  validateTerms,
} from '@island.is/application/templates/family-matters-core/utils/dataSchema'
import { error } from './messages/index'
import * as z from 'zod'

enum Duration {
  Permanent = 'permanent',
  Temporary = 'temporary',
}

const {
  counterParty,
  invalidEmail,
  invalidPhoneNumber,
  approveTerms,
} = error.validation
const parentContactInfo = validateContactInfo(invalidEmail, invalidPhoneNumber)

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v, {
    params: error.validation.dataGathering,
  }),
  selectedChildren: z
    .array(z.string())
    .refine((v) => v && v.length > 0, { params: error.validation.selectChild }),
  selectedLegalResidence: z.string().refine((v) => v, {
    params: error.validation.selectLegalResidence,
  }),
  parentA: parentContactInfo,
  counterParty: validateCounterParty(
    counterParty,
    invalidEmail,
    invalidPhoneNumber,
  ),
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
  approveTerms: validateTerms(2, approveTerms),
  approveChildSupportTerms: validateTerms(1, approveTerms),
  parentB: parentContactInfo,
})

export type answersSchema = z.infer<typeof dataSchema>
