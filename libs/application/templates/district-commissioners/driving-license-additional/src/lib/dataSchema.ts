import { z } from 'zod'
import { applicantInformationSchema } from '@island.is/application/ui-forms'
import { AdvancedLicense, B_ADVANCED, BE, Pickup } from '../utils'
const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})
export const dataSchema = z
  .object({
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
    // Optional at the field level so BE applicants (who never set it) aren't
    // blocked; the object-level refine below makes it required for B-advanced.
    advancedLicense: z
      .array(z.enum(Object.values(AdvancedLicense) as [string, ...string[]]))
      .optional(),
    applicant: applicantInformationSchema({ phoneRequired: true }),
  })
  // A B-advanced application must request at least one category, so we never
  // bill the B-advanced charge for an empty selection even if a UI path lets
  // it through.
  .refine(
    ({ applicationFor, advancedLicense }) =>
      applicationFor !== B_ADVANCED ||
      (!!advancedLicense && advancedLicense.length > 0),
    { path: ['advancedLicense'] },
  )

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
