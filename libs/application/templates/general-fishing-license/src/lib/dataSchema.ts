import { z } from 'zod'
import { error, fishingLicenseFurtherInformation } from './messages'
import { FishingLicenseEnum } from '../types'
import {
  calculateTotalRailNet,
  licenseHasAreaSelection,
  licenseHasFileUploadField,
  licenseHasRailNetAndRoeNetField,
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
  applicant: applicantInformationSchema,
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
        FishingLicenseEnum.UNKNOWN,
      ])
      .refine((x) => x, {
        params: error.requiredRadioField,
      }),
    chargeType: z.string().min(1),
  }),
  fishingLicenseFurtherInformation: z
    .object({
      // Pseudo field to make this license field visible to this current object
      // To be able to properly configure validation based on which license user is
      // currently applying for
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
          FishingLicenseEnum.UNKNOWN,
        ])
      date: z.string().refine((x) => x.trim().length > 0),
      area: z
        .string()
        .refine((x) => x.trim().length > 0)
        .optional(),
      attachments: z.array(FileSchema).optional(),
      railAndRoeNet: z
        .object({
          railnet: z.string().optional(),
          roenet: z.string().optional(),
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
    })
    .refine(
      ({ license, railAndRoeNet, area, attachments }) => {
        // Condition defaults to true, but is altered depending
        // on which license we are working with each time
        let condition = true
        if (licenseHasAreaSelection(license)) {
          condition = condition && !!area
        }
        if (licenseHasRailNetAndRoeNetField(license)) {
          condition =
            condition && !(!railAndRoeNet?.railnet || !railAndRoeNet?.roenet)
        }
        if (licenseHasFileUploadField(license)) {
          condition = condition && !!attachments && attachments.length >= 1
        }
        return condition
      },
      {
        params:
          fishingLicenseFurtherInformation.errorMessages.missingRequiredFields,
      },
    ),
})

export type GeneralFishingLicense = z.TypeOf<typeof GeneralFishingLicenseSchema>
