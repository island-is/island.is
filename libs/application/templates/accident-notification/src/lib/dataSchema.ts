import * as kennitala from 'kennitala'
import * as z from 'zod'
import { NO, YES } from '../constants'
import {
  AccidentTypeEnum,
  AgricultureAccidentLocationEnum,
  AttachmentsEnum,
  FishermanWorkplaceAccidentLocationEnum,
  FishermanWorkplaceAccidentShipLocationEnum,
  GeneralWorkplaceAccidentLocationEnum,
  PowerOfAttorneyUploadEnum,
  ProfessionalAthleteAccidentLocationEnum,
  RescueWorkAccidentLocationEnum,
  StudiesAccidentLocationEnum,
  StudiesAccidentTypeEnum,
  WhoIsTheNotificationForEnum,
  WorkAccidentTypeEnum,
} from '../types'
import { isValid24HFormatTime } from '../utils'
import { error } from './messages/error'

export enum OnBehalf {
  MYSELF = 'myself',
  OTHERS = 'others',
}

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

const CompanyInfoSchema = z.object({
  nationalRegistrationId: z
    .string()
    .refine((x) => (x ? kennitala.isCompany(x) : false)),
  name: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
})

export const AccidentNotificationSchema = z.object({
  externalData: z.object({
    nationalRegistry: z.object({
      data: z.object({
        address: z.object({
          city: z.string(),
          code: z.string(),
          postalCode: z.string(),
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
  approveExternalData: z.boolean().refine((p) => p),
  info: z.object({
    onBehalf: z.enum([OnBehalf.MYSELF, OnBehalf.OTHERS]),
  }),
  timePassedHindrance: z.enum([YES, NO]),
  carAccidentHindrance: z.enum([YES, NO]),
  applicant: z.object({
    name: z.string().min(1, error.required.defaultMessage),
    nationalId: z.string().refine((x) => (x ? kennitala.isPerson(x) : false)),
    address: z.string().min(1, error.required.defaultMessage),
    postalCode: z.string().min(1, error.required.defaultMessage),
    city: z.string().min(1, error.required.defaultMessage),
    email: z.string().email(),
    phoneNumber: z.string().optional(),
  }),
  whoIsTheNotificationFor: z.object({
    answer: z.enum([
      WhoIsTheNotificationForEnum.JURIDICALPERSON,
      WhoIsTheNotificationForEnum.ME,
      WhoIsTheNotificationForEnum.POWEROFATTORNEY,
      WhoIsTheNotificationForEnum.CHILDINCUSTODY,
    ]),
  }),
  injuryCertificate: z.object({
    answer: z.enum([
      AttachmentsEnum.HOSPITALSENDSCERTIFICATE,
      AttachmentsEnum.INJURYCERTIFICATE,
      AttachmentsEnum.SENDCERTIFICATELATER,
      AttachmentsEnum.INJUREDSENDSCERTIFICATE,
    ]),
  }),
  attachments: z.object({
    injuryCertificateFile: z
      .object({
        file: z
          .array(FileSchema)
          .refine((v) => v.length > 0, { params: error.requiredFile }),
      })
      .optional(),
    deathCertificateFile: z
      .object({
        file: z
          .array(FileSchema)
          .refine((v) => v.length > 0, { params: error.requiredFile }),
      })
      .optional(),
    powerOfAttorneyFile: z
      .object({
        file: z
          .array(FileSchema)
          .refine((v) => v.length > 0, { params: error.requiredFile }),
      })
      .optional(),
  }),
  wasTheAccidentFatal: z.enum([YES, NO]),
  fatalAccidentUploadDeathCertificateNow: z.enum([YES, NO]),
  accidentDetails: z.object({
    dateOfAccident: z.string(),
    isHealthInsured: z.enum([YES, NO]).optional(),
    timeOfAccident: z
      .string()
      .refine((x) => (x ? isValid24HFormatTime(x) : false)),
    descriptionOfAccident: z.string().min(1),
  }),
  isRepresentativeOfCompanyOrInstitue: z.array(z.string()).optional(),
  companyInfo: CompanyInfoSchema,
  schoolInfo: CompanyInfoSchema,
  fishingCompanyInfo: CompanyInfoSchema,
  rescueSquadInfo: CompanyInfoSchema,
  sportsClubInfo: CompanyInfoSchema,
  fishingShipInfo: z.object({
    shipName: z.string().min(1),
    shipCharacters: z.string().min(1),
    homePort: z.string(),
    shipRegisterNumber: z.string(),
  }),
  onPayRoll: z.object({
    answer: z.enum([YES, NO]),
  }),
  locationAndPurpose: z.object({
    location: z.string().min(1),
  }),
  accidentLocation: z.object({
    answer: z.enum([
      GeneralWorkplaceAccidentLocationEnum.ATTHEWORKPLACE,
      GeneralWorkplaceAccidentLocationEnum.TOORFROMTHEWORKPLACE,
      GeneralWorkplaceAccidentLocationEnum.OTHER,
      FishermanWorkplaceAccidentLocationEnum.ONTHESHIP,
      FishermanWorkplaceAccidentLocationEnum.TOORFROMTHEWORKPLACE,
      FishermanWorkplaceAccidentLocationEnum.OTHER,
      ProfessionalAthleteAccidentLocationEnum.SPORTCLUBSFACILITES,
      ProfessionalAthleteAccidentLocationEnum.TOORFROMTHESPORTCLUBSFACILITES,
      ProfessionalAthleteAccidentLocationEnum.OTHER,
      AgricultureAccidentLocationEnum.ATTHEWORKPLACE,
      AgricultureAccidentLocationEnum.TOORFROMTHEWORKPLACE,
      RescueWorkAccidentLocationEnum.TOORFROMRESCUE,
      RescueWorkAccidentLocationEnum.DURINGRESCUE,
      RescueWorkAccidentLocationEnum.OTHER,
      StudiesAccidentLocationEnum.ATTHESCHOOL,
      StudiesAccidentLocationEnum.OTHER,
    ]),
  }),
  homeAccident: z.object({
    address: z.string().min(1),
    postalCode: z.string().min(1),
    community: z.string().min(1),
    moreDetails: z.string().optional(),
  }),
  fishermanLocation: z.object({
    answer: z.enum([
      FishermanWorkplaceAccidentShipLocationEnum.SAILINGORFISHING,
      FishermanWorkplaceAccidentShipLocationEnum.HARBOR,
      FishermanWorkplaceAccidentShipLocationEnum.OTHER,
    ]),
    locationAndPurpose: z.object({
      location: z.string().min(1),
    }),
  }),
  workMachineRadio: z.enum([YES, NO]),
  workMachine: z.object({
    desriptionOfMachine: z.string().min(1),
  }),
  accidentType: z.object({
    radioButton: z.enum([
      AccidentTypeEnum.WORK,
      AccidentTypeEnum.HOMEACTIVITIES,
      AccidentTypeEnum.RESCUEWORK,
      AccidentTypeEnum.SPORTS,
      AccidentTypeEnum.STUDIES,
    ]),
  }),
  workAccident: z.object({
    type: z
      .enum([
        WorkAccidentTypeEnum.AGRICULTURE,
        WorkAccidentTypeEnum.FISHERMAN,
        WorkAccidentTypeEnum.GENERAL,
        WorkAccidentTypeEnum.PROFESSIONALATHLETE,
      ])
      .optional(),
  }),
  studiesAccident: z.object({
    type: z
      .enum([
        StudiesAccidentTypeEnum.APPRENTICESHIP,
        StudiesAccidentTypeEnum.INTERNSHIP,
        StudiesAccidentTypeEnum.VOCATIONALEDUCATION,
      ])
      .optional(),
  }),
  injuredPersonInformation: z.object({
    name: z.string().min(1, error.required.defaultMessage),
    nationalId: z.string().refine((x) => (x ? kennitala.isPerson(x) : false)),
    email: z.string().email().min(1, error.required.defaultMessage),
    phoneNumber: z.string().optional(),
  }),
  juridicalPerson: z.object({
    companyName: z.string().min(1, error.required.defaultMessage),
    companyNationalId: z
      .string()
      .refine((x) => (x ? kennitala.isCompany(x) : false)),
    companyConfirmation: z.array(z.string()).refine((v) => v.includes(YES), {
      params: error.requiredCheckmark,
    }),
  }),
  childInCustody: z.object({
    name: z.string().min(1, error.required.defaultMessage),
    nationalId: z.string().refine((x) => (x ? kennitala.isPerson(x) : false)),
    email: z.string().optional(),
    phoneNumber: z.string().optional(),
  }),
  powerOfAttorney: z.object({
    type: z.enum([
      PowerOfAttorneyUploadEnum.FORCHILDINCUSTODY,
      PowerOfAttorneyUploadEnum.UPLOADLATER,
      PowerOfAttorneyUploadEnum.UPLOADNOW,
    ]),
  }),
  comment: z.object({
    description: z.string().optional(),
  }),
  overview: z.object({
    custom: z.string().optional(),
  }),
  reviewerApproved: z.boolean().optional(),
})

export type AccidentNotification = z.TypeOf<typeof AccidentNotificationSchema>
