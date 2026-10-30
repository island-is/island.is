import { z } from 'zod'
import { applicantInformationSchema } from '@island.is/application/ui-forms'
import { AdvancedLicense, Pickup } from '../utils'
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
  applicationFor: z.enum(['BE', 'B-advanced']),
  // Optional at the field level so BE applicants (who never set it) aren't
  // blocked. Keeping the whole schema a plain object (no top-level refine)
  // matters: the framework only partial-validates ZodObject schemas, so an
  // object-level refine would turn this into a ZodEffects and force every
  // required field on every partial save. The "B-advanced needs at least one
  // category" rule is enforced in the UI by the AdvancedLicenseSelection
  // component instead.
  advancedLicense: z.array(z.nativeEnum(AdvancedLicense)).optional(),
  applicant: applicantInformationSchema({ phoneRequired: true }),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
