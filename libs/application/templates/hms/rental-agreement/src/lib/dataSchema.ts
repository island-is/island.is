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
import { isValidMobileNumber, isValidPhoneNumber } from '../utils/utils'

const applicant = z
  .object({
    nationalId: z
      .string()
      .refine((val) => (val ? kennitala.isValid(val) : false), {
        params: m.dataSchema.nationalId,
      }),
    email: z.string().email(),
    phoneNumber: z.string(),
  })
  .superRefine((data, ctx) => {
    const { phoneNumber, nationalId } = data

    if (!phoneNumber) {
      ctx.addIssue({
        message: 'Phone number is required',
        params: m.landlordAndTenantDetails.phoneNumberEmptyError,
        code: z.ZodIssueCode.custom,
        path: ['phoneNumber'],
      })
    } else if (!kennitala.isCompany(nationalId)) {
      if (!isValidMobileNumber(phoneNumber)) {
        ctx.addIssue({
          message: 'Phone number is not a mobile number',
          params: m.landlordAndTenantDetails.phoneNumberMobileError,
          code: z.ZodIssueCode.custom,
          path: ['phoneNumber'],
        })
      }
    } else {
      if (!isValidPhoneNumber(phoneNumber)) {
        ctx.addIssue({
          message: 'Phone number is not a valid phone number',
          params: m.landlordAndTenantDetails.phoneNumberInvalidError,
          code: z.ZodIssueCode.custom,
          path: ['phoneNumber'],
        })
      }
    }
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
