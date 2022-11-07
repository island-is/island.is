import * as z from 'zod'
import { error, fishingLicenseFurtherInformation } from './messages'
import * as kennitala from 'kennitala'
import { FishingLicenseEnum } from '../types'
import {
  calculateTotalRailNet,
  MAXIMUM_TOTAL_RAIL_NET_LENGTH,
} from '../utils/licenses'

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

export const GeneralFishingLicenseSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  externalData: z.object({
    identityRegistry: z.object({
      data: z.object({
        date: z.string(),
        status: z.enum(['success', 'failure']),
        name: z.string(),
        nationalId: z.string(),
        address: z.object({
          streetAddress: z.string(),
          city: z.string(),
          postalCode: z.string(),
        }),
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
      .enum([
        FishingLicenseEnum.HOOKCATCHLIMIT,
        FishingLicenseEnum.FISHWITHDANISHSEINE,
        FishingLicenseEnum.GREYSLEPP,
        FishingLicenseEnum.NORTHICEOCEANCOD,
        FishingLicenseEnum.CATCHLIMIT,
        FishingLicenseEnum.LUMPFISH,
        FishingLicenseEnum.COSTALFISHERIES,
        FishingLicenseEnum.FREETIME,
        FishingLicenseEnum.FREETIMEHOOK,
        FishingLicenseEnum.FREETIMEHOOKMED,
        FishingLicenseEnum.COMMONWHELK,
        FishingLicenseEnum.OCEANQUAHOGIN,
        FishingLicenseEnum.CRUSTACEANS,
      ])
      .refine((x) => x, {
        params: error.requiredRadioField,
      }),
    chargeType: z.string().min(1),
  }),
  fishingLicenseFurtherInformation: z.object({
    date: z.string().refine((x) => x.trim().length > 0),
    area: z
      .string()
      .refine((x) => x.trim().length > 0)
      .optional(),
    attachments: z.array(FileSchema).optional(), // TODO: make only optional for those licenses that shouldn't have attatchments
    railAndRoeNet: z // TODO: make only optinal for those licenses that shouldn't have roe and rail nets
      .object({
        railnet: z.string().optional(), // TODO: make only optional for those licenses that shouldn't have roe and rail nets
        roenet: z.string().optional(), // TODO: make only optional for those licenses that shouldn't have roe and rail nets
      })
      .refine(
        ({ railnet, roenet }) =>
          calculateTotalRailNet(railnet, roenet) <=
          MAXIMUM_TOTAL_RAIL_NET_LENGTH,
        {
          params:
            fishingLicenseFurtherInformation.errorMessages.railNetTooLarge,
        },
      )
      .optional(),
  }),
})

export type GeneralFishingLicense = z.TypeOf<typeof GeneralFishingLicenseSchema>
