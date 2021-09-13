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
  companyName: z.string().min(1),
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
      date: z.string(),
      status: z.enum(['success', 'failure']),
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
  attachments: z.object({
    injuryCertificate: z.enum([
      AttachmentsEnum.HOSPITALSENDSCERTIFICATE,
      AttachmentsEnum.INJURYCERTIFICATE,
      AttachmentsEnum.SENDCERTIFICATELATER,
      AttachmentsEnum.INJUREDSENDSCERTIFICATE,
    ]),
    injuryCertificateFile: z.array(FileSchema).optional(),
    deathCertificateFile: z.array(FileSchema).optional(),
    powerOfAttorneyFile: z.array(FileSchema).optional(),
  }),
  wasTheAccidentFatal: z.enum([YES, NO]),
  fatalAccidentUploadDeathCertificateNow: z.enum([YES, NO]),
  accidentDetails: z.object({
    dateOfAccident: z.string().min(1),
    isHealthInsured: z.enum([YES, NO]),
    timeOfAccident: z
      .string()
      .refine((x) => (x ? isValid24HFormatTime(x) : false)),
    descriptionOfAccident: z.string().min(1),
  }),
  isRepresentativeOfCompanyOrInstitue: z.enum([YES, NO]),
  companyInfo: CompanyInfoSchema,
  schoolInfo: CompanyInfoSchema,
  fishingCompanyInfo: CompanyInfoSchema,
  sportsClubInfo: CompanyInfoSchema,
  rescueSquadInfo: CompanyInfoSchema,
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
    companyConfirmation: z.enum([YES]),
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
})

export type AccidentNotification = z.TypeOf<typeof AccidentNotificationSchema>
