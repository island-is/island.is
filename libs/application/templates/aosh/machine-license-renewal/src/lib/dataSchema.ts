import { z } from 'zod'
import { NO, YES } from '@island.is/application/core'
import { applicantInformationSchema } from '@island.is/application/ui-forms'
import { DeliveryMethod } from '../utils/constants'
import { medicalCertificate } from './messages'

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

const LicenseSchema = z
  .object({
    plasticCard: z.enum([YES, NO]),
    // clearOnChange resets the field to an empty string
    deliveryMethod: z.nativeEnum(DeliveryMethod).or(z.literal('')).optional(),
    address: z.string().optional(),
    postalCodeAndCity: z.string().optional(),
    recipient: z.string().optional(),
  })
  .superRefine((license, ctx) => {
    if (license.plasticCard !== YES) {
      return
    }
    if (!license.deliveryMethod) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['deliveryMethod'],
      })
      return
    }
    if (license.deliveryMethod === DeliveryMethod.OTHER_ADDRESS) {
      if (!license.address?.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['address'] })
      }
      if (!license.postalCodeAndCity?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['postalCodeAndCity'],
        })
      }
    }
  })

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: applicantInformationSchema({ emailAndPhoneReadOnly: true }),
  medicalCertificate: z.array(FileSchema).refine((files) => files.length > 0, {
    params: medicalCertificate.errors.required,
  }),
  license: LicenseSchema,
  overview: z.object({
    agreement: z.array(z.literal(YES)).nonempty(),
  }),
})

export type MachineLicenseRenewalAnswers = z.TypeOf<typeof dataSchema>
