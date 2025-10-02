import { z } from 'zod'
import * as kennitala from 'kennitala'
import { YesOrNoEnum } from '@island.is/application/core'
import { partiesSchema } from './schemas/landlordAndTenantSchema'
import { registerPropertySchema } from './schemas/propertySearchSchema'
import { otherFeesSchema } from './schemas/otherFeesSchema'
import { securityDepositSchema } from './schemas/securityDepositSchema'
import { rentalAmountSchema } from './schemas/rentalAmountSchema'
import { fireProtectionsSchema } from './schemas/fireProtectionsSchema'
import { propertyInfoSchema } from './schemas/propertyInfoSchema'
import * as m from './messages'
import { rentalPeriodSchema } from './schemas/rentalPeriodSchema'
import { specialProvisionsSchema } from './schemas/specialProvisionsSchema'
import { conditionSchema } from './schemas/conditionSchema'

const applicant = z.object({
  nationalId: z
    .string()
    .refine((val) => (val ? kennitala.isValid(val) : false), {
      params: m.dataSchema.nationalId,
    }),
})

const preSignatureInfo = z.object({
  statement: z
    .string()
    .array()
    .refine((x) => x.includes(YesOrNoEnum.YES), {
      params: m.inReview.preSignatureInfo.statementError,
    }),
})

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant,
  parties: partiesSchema,
  registerProperty: registerPropertySchema,
  propertyInfo: propertyInfoSchema,
  rentalPeriod: rentalPeriodSchema,
  rentalAmount: rentalAmountSchema,
  securityDeposit: securityDepositSchema,
  specialProvisions: specialProvisionsSchema,
  condition: conditionSchema,
  fireProtections: fireProtectionsSchema,
  otherFees: otherFeesSchema,
  preSignatureInfo,
})

export type RentalAgreement = z.TypeOf<typeof dataSchema>
