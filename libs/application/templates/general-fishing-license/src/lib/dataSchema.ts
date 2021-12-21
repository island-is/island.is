import * as z from 'zod'
import { error } from './messages'
import * as kennitala from 'kennitala'

export const GeneralFishingLicenseSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  externalData: z.object({
    nationalRegistry: z.object({
      data: z.object({
        address: z.object({
          city: z.string(),
          code: z.string(),
          postalCode: z.string().refine((x) => +x >= 100 && +x <= 999, {
            params: error.invalidValue,
          }),
          streetAddress: z.string(),
        }),
        age: z.number(),
        citizenship: z.object({
          code: z.string(),
          name: z.string(),
        }),
        fullName: z.string(),
        legalResidence: z.string(),
        nationalId: z.string(),
      }),
      date: z.string(),
      status: z.enum(['success', 'failure']),
    }),
    userProfile: z.object({
      data: z.object({
        email: z.string(),
        mobilePhoneNumber: z.string(),
      }),
    }),
  }),
  applicant: z.object({
    name: z.string().refine((x) => x.trim().length > 0),
    nationalId: z.string().refine((x) => (x ? kennitala.isPerson(x) : false)),
    address: z.string().refine((x) => x.trim().length > 0),
    postalCode: z.string().refine((x) => +x >= 100 && +x <= 999, {
      params: error.invalidValue,
    }),
    city: z.string().refine((x) => x.trim().length > 0, {
      params: error.invalidValue,
    }),
    email: z.string().email(),
    phoneNumber: z.string().optional(),
  }),
})

export type GeneralFishingLicense = z.TypeOf<typeof GeneralFishingLicenseSchema>
