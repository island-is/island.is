import * as z from 'zod'
import { error } from './messages'
import * as kennitala from 'kennitala'
import { FishingLicenseEnum } from '../types'

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
  shipSelection: z.object({
    ship: z.enum(['0', '1', '2', '3', '4', '5']).refine((x) => x, {
      params: error.requiredRadioField,
    }),
    registrationNumber: z.string(),
  }),
  fishingLicense: z.object({
    license: z
      .enum([FishingLicenseEnum.HOOKCATCHLIMIT, FishingLicenseEnum.CATCHLIMIT])
      .refine((x) => x, {
        params: error.requiredRadioField,
      }),
    chargeType: z.string().min(1),
  }),
})

export type GeneralFishingLicense = z.TypeOf<typeof GeneralFishingLicenseSchema>
