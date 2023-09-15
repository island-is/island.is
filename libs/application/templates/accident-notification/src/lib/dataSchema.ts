import { applicantInformationSchema } from '@island.is/application/ui-forms'
import * as kennitala from 'kennitala'
import { z } from 'zod'
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
  ReviewApprovalEnum,
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

const RepresentativeInfo = z.object({
  name: z.string().refine((x) => x.trim().length > 0, {
    params: error.invalidValue,
  }),
  nationalId: z.string().refine((x) => (x ? kennitala.isPerson(x) : false), {
    params: error.invalidValue,
  }),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
})

const CompanyInfo = z
  .object({
    name: z.string().refine((x) => x.trim().length > 0, {
      params: error.invalidValue,
    }),
    nationalRegistrationId: z
      .string()
      .refine((x) => (x ? kennitala.isCompany(x) : false), {
        params: error.invalidValue,
      }),
  })
  .optional()

export const AccidentNotificationSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  representative: RepresentativeInfo,
  companyInfo: CompanyInfo,
  externalData: z.object({
    nationalRegistry: z.object({
      data: z.object({
        address: z.object({
          locality: z.string(),
          municipalityCode: z.string(),
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
  info: z.object({
    onBehalf: z.enum([OnBehalf.MYSELF, OnBehalf.OTHERS]),
  }),
  timePassedHindrance: z.enum([YES, NO]),
  carAccidentHindrance: z.enum([YES, NO]),
  applicant: applicantInformationSchema(),
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
    ]),
  }),
  additionalAttachments: z.object({
    answer: z.enum([
      AttachmentsEnum.ADDITIONALNOW,
      AttachmentsEnum.ADDITIONALLATER,
    ]),
  }),

  attachments: z.object({
    injuryCertificateFile: z
      .object({
        file: z.array(FileSchema),
        // .refine((v) => v.length > 0, { params: error.requiredFile }),
      })
      .optional(),
    deathCertificateFile: z
      .object({
        file: z.array(FileSchema),
        // .refine((v) => v.length > 0, { params: error.requiredFile }),
      })
      .optional(),
    powerOfAttorneyFile: z
      .object({
        file: z.array(FileSchema),
        // .refine((v) => v.length > 0, { params: error.requiredFile }),
      })
      .optional(),
    additionalFiles: z
      .object({
        file: z.array(FileSchema),
        // .refine((v) => v.length > 0, { params: error.requiredFile }),
      })
      .optional(),
    additionalFilesFromReviewer: z
      .object({
        file: z.array(FileSchema),
      })
      .optional(),
  }),
  wasTheAccidentFatal: z.enum([YES, NO]),
  fatalAccidentUploadDeathCertificateNow: z.enum([YES, NO]),
  accidentDetails: z.object({
    dateOfAccident: z.string().refine((x) => x.trim().length > 0, {
      params: error.invalidValue,
    }),
    isHealthInsured: z.enum([YES, NO]).optional(),
    timeOfAccident: z
      .string()
      .refine((x) => (x ? isValid24HFormatTime(x) : false), {
        params: error.invalidValue,
      }),
    descriptionOfAccident: z.string().refine((x) => x.trim().length > 0, {
      params: error.invalidValue,
    }),
  }),
  isRepresentativeOfCompanyOrInstitue: z.array(z.string()).optional(),
  fishingShipInfo: z.object({
    shipName: z.string().refine((x) => x.trim().length > 0, {
      params: error.invalidValue,
    }),
    shipCharacters: z.string().refine((x) => x.trim().length > 0, {
      params: error.invalidValue,
    }),
    homePort: z.string(),
    shipRegisterNumber: z.string(),
  }),

  onPayRoll: z.object({
    answer: z.enum([YES, NO]),
  }),
  locationAndPurpose: z.object({
    location: z.string().refine((x) => x.trim().length > 0, {
      params: error.invalidValue,
    }),
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
      AgricultureAccidentLocationEnum.OTHER,
      RescueWorkAccidentLocationEnum.TOORFROMRESCUE,
      RescueWorkAccidentLocationEnum.DURINGRESCUE,
      RescueWorkAccidentLocationEnum.OTHER,
      StudiesAccidentLocationEnum.ATTHESCHOOL,
      StudiesAccidentLocationEnum.OTHER,
    ]),
  }),
  homeAccident: z.object({
    address: z.string().refine((x) => x.trim().length > 0, {
      params: error.invalidValue,
    }),
    postalCode: z.string().refine((x) => +x >= 100 && +x <= 999, {
      params: error.invalidValue,
    }),
    community: z
      .string()
      .regex(/^([^0-9]*)$/)
      .refine((x) => x.trim().length > 0, {
        params: error.invalidValue,
      }),
    moreDetails: z.string().optional(),
  }),
  shipLocation: z.object({
    answer: z.enum([
      FishermanWorkplaceAccidentShipLocationEnum.SAILINGORFISHING,
      FishermanWorkplaceAccidentShipLocationEnum.HARBOR,
      FishermanWorkplaceAccidentShipLocationEnum.OTHER,
    ]),
  }),
  workMachineRadio: z.enum([YES, NO]),
  workMachine: z.object({
    desriptionOfMachine: z.string().refine((x) => x.trim().length > 0, {
      params: error.invalidValue,
    }),
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
    type: z.enum([
      WorkAccidentTypeEnum.AGRICULTURE,
      WorkAccidentTypeEnum.FISHERMAN,
      WorkAccidentTypeEnum.GENERAL,
      WorkAccidentTypeEnum.PROFESSIONALATHLETE,
    ]),
  }),
  studiesAccident: z.object({
    type: z.enum([
      StudiesAccidentTypeEnum.APPRENTICESHIP,
      StudiesAccidentTypeEnum.INTERNSHIP,
      StudiesAccidentTypeEnum.VOCATIONALEDUCATION,
    ]),
  }),
  injuredPersonInformation: z.object({
    name: z.string().refine((x) => x.trim().length > 0, {
      params: error.invalidValue,
    }),
    nationalId: z.string().refine((x) => (x ? kennitala.isPerson(x) : false), {
      params: error.invalidValue,
    }),
    email: z
      .string()
      .email()
      .refine((x) => x.trim().length > 0, {
        params: error.invalidValue,
      }),
    phoneNumber: z.string().optional(),
  }),
  juridicalPerson: z.object({
    companyName: z.string().refine((x) => x.trim().length > 0, {
      params: error.invalidValue,
    }),
    companyNationalId: z
      .string()
      .refine((x) => (x ? kennitala.isCompany(x) : false), {
        params: error.invalidValue,
      }),
    companyConfirmation: z.array(z.string()).refine((v) => v.includes(YES), {
      params: error.requiredCheckmark,
    }),
  }),
  childInCustody: z.object({
    name: z.string().refine((x) => x.trim().length > 0, {
      params: error.invalidValue,
    }),
    nationalId: z.string().refine((x) => (x ? kennitala.isPerson(x) : false), {
      params: error.invalidValue,
    }),
  }),
  powerOfAttorney: z.object({
    type: z.enum([
      PowerOfAttorneyUploadEnum.FORCHILDINCUSTODY,
      PowerOfAttorneyUploadEnum.UPLOADLATER,
      PowerOfAttorneyUploadEnum.UPLOADNOW,
    ]),
  }),
  reviewApproval: z
    .enum([
      ReviewApprovalEnum.APPROVED,
      ReviewApprovalEnum.REJECTED,
      ReviewApprovalEnum.NOTREVIEWED,
    ])
    .refine((x) => (x ? x : ReviewApprovalEnum.NOTREVIEWED)),
  reviewComment: z.string().optional(),
})

export type AccidentNotification = z.TypeOf<typeof AccidentNotificationSchema>
