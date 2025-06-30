import { z } from 'zod'

export const drivingLicenseSchema = z.object({
  drivingLicenseType: z.array(z.string()).optional(),
  heavyMachineryLicenses: z.array(z.string()).optional(),
})
