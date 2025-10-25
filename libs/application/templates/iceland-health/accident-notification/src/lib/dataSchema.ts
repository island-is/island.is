import { applicantInformationSchema } from '@island.is/application/ui-forms'
import * as kennitala from 'kennitala'
import { z } from 'zod'
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
  OnBehalf,
  Status,
} from '../utils/enums'
import { error } from './messages/error'
import { isValid24HFormatTime } from '../utils/dateUtils'
import { YES, YesOrNoEnum } from '@island.is/application/core'

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

const representative = z.object({
  name: z.string().refine((x) => x.trim().length > 0, {
    params: error.invalidValue,
  }),
  nationalId: z.string().refine((x) => (x ? kennitala.isPerson(x) : false), {
    params: error.invalidValue,
  }),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
})

const companyInfo = z
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

const externalData = z.object({
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
    status: z.nativeEnum(Status),
  }),
  userProfile: z.object({
    data: z.object({
      email: z.string(),
      mobilePhoneNumber: z.string(),
    }),
  }),
})

const attachments = z.object({
  injuryCertificateFile: z.object({ file: z.array(FileSchema) }).optional(),
  policeReportFile: z.object({ file: z.array(FileSchema) }).optional(),
  deathCertificateFile: z.object({ file: z.array(FileSchema) }).optional(),
  powerOfAttorneyFile: z.object({ file: z.array(FileSchema) }).optional(),
  additionalFiles: z.object({ file: z.array(FileSchema) }).optional(),
  additionalFilesFromReviewer: z
    .object({ file: z.array(FileSchema) })
    .optional(),
})

const accidentDetails = z.object({
  dateOfAccident: z.string().refine((x) => x.trim().length > 0, {
    params: error.invalidValue,
  }),
  isHealthInsured: z.nativeEnum(YesOrNoEnum).optional(),
  timeOfAccident: z
    .string()
    .refine((x) => (x ? isValid24HFormatTime(x) : false), {
      params: error.invalidValue,
    }),
  descriptionOfAccident: z.string().refine((x) => x.trim().length > 0, {
    params: error.invalidValue,
  }),
  accidentSymptoms: z.string().refine((x) => x.trim().length > 0, {
    params: error.invalidValue,
  }),
  dateOfDoctorVisit: z.string().optional(),
  timeOfDoctorVisit: z
    .string()
    .optional()
    .refine((x) => (x ? isValid24HFormatTime(x) : true)),
})

const fishingShipInfo = z.object({
  shipName: z.string().refine((x) => x.trim().length > 0, {
    params: error.invalidValue,
  }),
  shipCharacters: z.string().refine((x) => x.trim().length > 0, {
    params: error.invalidValue,
  }),
  homePort: z.string(),
  shipRegisterNumber: z.string(),
})

const homeAccident = z.object({
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
})

const injuredPersonInformation = z.object({
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
  jobTitle: z.string().optional(),
})

const juridicalPerson = z.object({
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
})

const childInCustody = z.object({
  name: z.string().refine((x) => x.trim().length > 0, {
    params: error.invalidValue,
  }),
  nationalId: z.string().refine((x) => (x ? kennitala.isPerson(x) : false), {
    params: error.invalidValue,
  }),
})

export const AccidentNotificationSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  representative,
  companyInfo,
  externalData,
  info: z.object({
    onBehalf: z.nativeEnum(OnBehalf),
  }),
  timePassedHindrance: z.nativeEnum(YesOrNoEnum),
  carAccidentHindrance: z.nativeEnum(YesOrNoEnum),
  applicant: applicantInformationSchema(),
  whoIsTheNotificationFor: z.object({
    answer: z.nativeEnum(WhoIsTheNotificationForEnum),
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
  attachments,
  wasTheAccidentFatal: z.nativeEnum(YesOrNoEnum),
  fatalAccidentUploadDeathCertificateNow: z.nativeEnum(YesOrNoEnum),
  accidentDetails,
  isRepresentativeOfCompanyOrInstitue: z.array(z.string()).optional(),
  fishingShipInfo,
  onPayRoll: z.object({
    answer: z.nativeEnum(YesOrNoEnum),
  }),
  locationAndPurpose: z.object({
    location: z.string().refine((x) => x.trim().length > 0, {
      params: error.invalidValue,
    }),
  }),
  accidentLocation: z.object({
    answer: z.union([
      z.nativeEnum(GeneralWorkplaceAccidentLocationEnum),
      z.nativeEnum(FishermanWorkplaceAccidentLocationEnum),
      z.nativeEnum(ProfessionalAthleteAccidentLocationEnum),
      z.nativeEnum(AgricultureAccidentLocationEnum),
      z.nativeEnum(RescueWorkAccidentLocationEnum),
      z.nativeEnum(StudiesAccidentLocationEnum),
    ]),
  }),
  homeAccident,
  shipLocation: z.object({
    answer: z.nativeEnum(FishermanWorkplaceAccidentShipLocationEnum),
  }),
  workMachineRadio: z.nativeEnum(YesOrNoEnum),
  workMachine: z.object({
    descriptionOfMachine: z.string().refine((x) => x.trim().length > 0, {
      params: error.invalidValue,
    }),
  }),
  accidentType: z.object({
    radioButton: z.nativeEnum(AccidentTypeEnum),
  }),
  workAccident: z.object({
    type: z.nativeEnum(WorkAccidentTypeEnum),
    jobTitle: z.string().optional(),
  }),
  studiesAccident: z.object({
    type: z.nativeEnum(StudiesAccidentTypeEnum),
  }),
  injuredPersonInformation,
  juridicalPerson,
  childInCustody,
  powerOfAttorney: z.object({
    type: z.nativeEnum(PowerOfAttorneyUploadEnum),
  }),
  reviewApproval: z
    .nativeEnum(ReviewApprovalEnum)
    .refine((x) => x ?? ReviewApprovalEnum.NOTREVIEWED),
  reviewComment: z.string().optional(),
})

export type AccidentNotification = z.TypeOf<typeof AccidentNotificationSchema>
