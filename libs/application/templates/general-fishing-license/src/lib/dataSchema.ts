import * as z from 'zod'

export const GeneralFishingLicenseSchema = z.object({
  applicant: z.object({
    name: z.string().refine((x) => x.trim().length > 0),
  }),
})

export type GeneralFishingLicense = z.TypeOf<typeof GeneralFishingLicenseSchema>
