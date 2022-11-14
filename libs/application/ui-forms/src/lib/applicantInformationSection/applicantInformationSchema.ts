import * as z from 'zod'

export const applicantInformationSchema = z.object({
  name: z.string(),
  nationalId: z.string(),
  address: z.string(),
  postalCode: z.string(),
  city: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
})
