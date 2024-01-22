import { z } from 'zod'
import * as kennitala from 'kennitala'
import { NO, YES } from '@island.is/application/core'

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
  program: z.string(),
  modeOfDelivery: z.string().optional(), //z.enum(['Online', 'OnSite']), // TODO have dyncamic or static or just have a string?
  examLocation: z.string().optional(), // TODO make conditional requirement if the mode of delivery Online is chosen
})

export const RepeateableEducationDetailsSchema = z
  .object({
    school: z.string(),
    degreeLevel: z.string(),
    degreeMajor: z.string().optional(),
    finishedUnits: z.string().optional(),
    averageGrade: z.string().optional(),
    degreeCountry: z.string(),
    beginningDate: z.string(),
    endDate: z.string(),
    degreeFinished: z.array(z.enum([YES])).optional(),
    moreDetails: z.string().optional(),
    degreeAttachments: z.array(FileDocumentSchema),
    wasRemoved: z.string(),
  })
  .refine(
    ({ wasRemoved, school }) => {
      console.log('school here', school)
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

const otherDocumentsSchema = z.object({
  degreeAttachments: FileDocumentSchema,
})

export const UniversitySchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  userInformation: UserInformationSchema,
  programInformation: ProgramSchema,
  educationOptions: z
    .enum(['diploma', 'notFinished', 'exemption', 'thirdLevel'])
    .optional(),
  educationDetails: z.array(RepeateableEducationDetailsSchema),
  otherDocuments: otherDocumentsSchema,
})

export type UniversityApplication = z.TypeOf<typeof UniversitySchema>
