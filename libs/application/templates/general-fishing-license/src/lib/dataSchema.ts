import { z } from 'zod'
import { error, fishingLicenseFurtherInformation } from './messages'
import { FishingLicenseEnum } from '../types'
import {
  calculateTotalRailNet,
  MAXIMUM_TOTAL_RAIL_NET_LENGTH,
} from '../utils/licenses'
import { applicantInformationSchema } from '@island.is/application/ui-forms'

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

export const GeneralFishingLicenseSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  externalData: z.object({
    identity: z.object({
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
  applicant: applicantInformationSchema({ phoneRequired: true }),
  shipSelection: z.object({
    ship: z.string().refine((x) => x, {
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
        FishingLicenseEnum.URCHIN,
        FishingLicenseEnum.UNKNOWN,
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
      .optional()
      .refine((x) => x === undefined || x.trim().length > 0),
    attachments: z
      .array(FileSchema)
      .optional()
      .refine((x) => x === undefined || (x.length > 0 && x.length < 3), {
        params:
          fishingLicenseFurtherInformation.errorMessages.attachmentLimitError,
      }),
    railAndRoeNet: z
      .object({
        railnet: z.string().optional(),
        roenet: z.string().optional(),
      })
      .optional()
      .refine(
        (res) =>
          !res ||
          (res?.railnet === undefined && res?.roenet === undefined) ||
          calculateTotalRailNet(res.railnet, res.roenet) <=
            MAXIMUM_TOTAL_RAIL_NET_LENGTH,
        {
          params:
            fishingLicenseFurtherInformation.errorMessages.railNetTooLarge,
        },
      ),
  }),
})

export type GeneralFishingLicense = z.TypeOf<typeof GeneralFishingLicenseSchema>
