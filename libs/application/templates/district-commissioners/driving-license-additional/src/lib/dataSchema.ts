import { z } from 'zod'
import { applicantInformationSchema } from '@island.is/application/ui-forms'
import { AdvancedLicense, B_ADVANCED, BE, Pickup } from '../utils'
const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})
export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  delivery: z
    .object({
      deliveryMethod: z.enum([Pickup.POST, Pickup.DISTRICT]).optional(),
      jurisdiction: z.string().nullish(),
    })
    .refine(
      ({ deliveryMethod, jurisdiction }) => {
        return deliveryMethod === Pickup.DISTRICT ? !!jurisdiction : true
      },
      {
        // Attach the error to the jurisdiction field (path is relative to the
        // `delivery` object, so this resolves to `delivery.jurisdiction`) so
        // `validateAnswers()` surfaces it on the field instead of the object root.
        path: ['jurisdiction'],
      },
    ),
  healthCertificate: z.array(FileSchema).nonempty(),
  applicationFor: z.enum([BE, B_ADVANCED]),
  // Only relevant when `applicationFor === B_ADVANCED`. The field is rendered
  // exclusively for that case (form condition) and blocks submit until at least
  // one category is selected (setBeforeSubmitCallback in AdvancedLicenseSelection),
  // so it stays optional here to avoid blocking BE applicants who never set it.
  advancedLicense: z
    .array(z.enum(Object.values(AdvancedLicense) as [string, ...string[]]))
    .optional(),
  applicant: applicantInformationSchema({ phoneRequired: true }),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
