import { z } from 'zod'
import * as kennitala from 'kennitala'
import { NO, YES } from '@island.is/application/core'
import { ApplicationTypes, ModeOfDelivery } from '@island.is/university-gateway'

const UserSchemaBase = z.object({
  nationalId: z
    .string()
    .refine(
      (nationalId) =>
        nationalId &&
        nationalId.length !== 0 &&
        kennitala.isValid(nationalId) &&
        (kennitala.isCompany(nationalId) ||
          kennitala.info(nationalId).age >= 18),
    ),
  name: z.string().min(1),
  address: z.string().min(1),
  postalCode: z.string().min(1),
  email: z.string().min(1),
  phone: z.string().min(1),
})

export const UserInformationSchema = z.intersection(
  UserSchemaBase,
  z.object({
    approved: z.boolean().optional(),
  }),
)

const FileDocumentSchema = z.object({
  name: z.string(),
  key: z.string(),
})

const ProgramSchema = z.object({
  university: z.string(),
  universityName: z.string(),
  program: z.string(),
  programName: z.string(),
})

export const EducationNotFinishedSchema = z.object({
  school: z.string(),
  degreeLevel: z.string(),
  moreDetails: z.string().optional(),
})

export const ExemptionEducationSchema = z.object({
  degreeAttachments: z.array(FileDocumentSchema).optional(), // TODO not optional
  moreDetails: z.string().optional(),
})

export const RepeateableEducationDetailsSchema = z
  .object({
    school: z.string().optional(),
    degreeLevel: z.string().optional(),
    degreeMajor: z.string().optional(),
    finishedUnits: z.string().optional(),
    averageGrade: z.string().optional(),
    degreeCountry: z.string().optional(),
    beginningDate: z.string().optional(),
    endDate: z.string().optional(),
    degreeFinished: z.string().optional(),
    moreDetails: z.string().optional(),
    degreeAttachments: z.array(FileDocumentSchema).optional(),
    wasRemoved: z.string(),
    readOnly: z.string(),
  })
  .refine(
    ({ wasRemoved, school }) => {
      return wasRemoved === 'true' || (school && school.length > 0)
    },
    {
      path: ['school'],
    },
  )
  .refine(
    ({ wasRemoved, degreeLevel }) => {
      return wasRemoved === 'true' || (degreeLevel && degreeLevel.length > 0)
    },
    {
      path: ['degreeLevel'],
    },
  )
  .refine(
    ({ wasRemoved, degreeCountry }) => {
      return (
        wasRemoved === 'true' || (degreeCountry && degreeCountry.length > 0)
      )
    },
    {
      path: ['degreeCountry'],
    },
  )
  .refine(
    ({ wasRemoved, beginningDate }) => {
      return (
        wasRemoved === 'true' || (beginningDate && beginningDate.length > 0)
      )
    },
    {
      path: ['beginningDate'],
    },
  )
  .refine(
    ({ wasRemoved, endDate }) => {
      return wasRemoved === 'true' || (endDate && endDate.length > 0)
    },
    {
      path: ['endDate'],
    },
  )

const EducationDetailsSchema = z.object({
  finishedDetails: z.array(RepeateableEducationDetailsSchema).optional(),
  exemptionDetails: ExemptionEducationSchema.optional(),
  notFinishedDetails: EducationNotFinishedSchema.optional(),
  thirdLevelDetails: RepeateableEducationDetailsSchema.optional(),
})

export const OtherDocumentsSchema = z.object({
  attachments: z.array(FileDocumentSchema).optional(),
})

const ModeOfDeliverInformationSchema = z.object({
  chosenMode: z.enum([
    ModeOfDelivery.ONLINE,
    ModeOfDelivery.ON_SITE,
    ModeOfDelivery.MIXED,
    ModeOfDelivery.REMOTE,
    'EMPTY_MODE_OF_DELIVERY',
  ]),
  location: z.string().optional(),
})

export const UniversitySchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  userInformation: UserInformationSchema,
  programInformation: ProgramSchema,
  modeOfDeliveryInformation: ModeOfDeliverInformationSchema,
  educationOptions: z
    .enum([
      ApplicationTypes.DIPLOMA,
      ApplicationTypes.EXEMPTION,
      ApplicationTypes.NOTFINISHED,
      ApplicationTypes.THIRDLEVEL,
    ])
    .optional(),
  educationDetails: EducationDetailsSchema,
  otherDocuments: z.array(OtherDocumentsSchema).optional(),
})

export type UniversityApplication = z.TypeOf<typeof UniversitySchema>
