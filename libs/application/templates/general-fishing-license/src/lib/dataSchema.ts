import * as z from 'zod'
import { error } from './messages'
import * as kennitala from 'kennitala'
import { FishingLicenseEnum } from '../types'

export const GeneralFishingLicenseSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  externalData: z.object({
    companyNationalRegistry: z.object({
      data: z.object({
        type: z.enum(['company', 'person']),
        // Shared between company and person
        nationalId: z.string(),
        date: z.string(),
        status: z.enum(['success', 'failure']),
        // only company
        name: z.string().optional(),
        companyInfo: z
          .object({
            address: z
              .object({
                streetAddress: z.string(),
                postalCode: z.string(),
                locality: z.string(),
                country: z.string(),
                municipalityNumber: z.string(),
              })
              .optional(),
          })
          .optional(),
        // only person
        fullName: z.string().optional(),
        legalResidence: z.string().optional(),
        age: z.number().optional(),
        citizenship: z
          .object({
            code: z.string(),
            name: z.string(),
          })
          .optional(),
        address: z
          .object({
            city: z.string(),
            code: z.string(),
            postalCode: z.string().refine((x) => +x >= 100 && +x <= 999, {
              params: error.invalidValue,
            }),
            streetAddress: z.string(),
          })
          .optional(),
      }),
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
    nationalId: z
      .string()
      .refine((x) =>
        x ? kennitala.isPerson(x) || kennitala.isCompany(x) : false,
      ),
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
