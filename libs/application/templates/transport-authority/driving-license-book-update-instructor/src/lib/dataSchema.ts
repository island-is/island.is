import { z } from 'zod'

export const DrivingLicenseBookUpdateInstructorSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  newInstructor: z.object({
    nationalId: z.string(),
  }),
})

export type DrivingLicenseBookUpdateInstructor = z.TypeOf<
  typeof DrivingLicenseBookUpdateInstructorSchema
>
