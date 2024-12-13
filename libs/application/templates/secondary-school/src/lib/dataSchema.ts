import { applicantInformationSchema } from '@island.is/application/ui-forms'
import { z } from 'zod'
import { ApplicationType } from '../shared'
import { YES } from '@island.is/application/types'

const FileDocumentSchema = z.object({
  name: z.string(),
  key: z.string(),
})

const CustodianSchema = z
  .object({
    nationalId: z.string().optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
  })
  .refine(
    ({ nationalId, email }) => {
      if (!nationalId) return true
      return !!email
    },
    { path: ['email'] },
  )
  .refine(
    ({ nationalId, phone }) => {
      if (!nationalId) return true
      return !!phone
    },
    { path: ['phone'] },
  )

const OtherContactSchema = z
  .object({
    include: z.boolean(),
    nationalId: z.string().optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
  })
  .refine(
    ({ include, nationalId }) => {
      if (!include) return true
      return !!nationalId
    },
    { path: ['nationalId'] },
  )
  .refine(
    ({ include, email }) => {
      if (!include) return true
      return !!email
    },
    { path: ['email'] },
  )
  .refine(
    ({ include, phone }) => {
      if (!include) return true
      return !!phone
    },
    { path: ['phone'] },
  )

const SelectionSchema = z
  .object({
    include: z.boolean().optional(),
    school: z
      .object({
        id: z.string().optional(),
        name: z.string().optional(),
      })
      .optional(),
    firstProgram: z
      .object({
        id: z.string().optional(),
        nameIs: z.string().optional(),
        nameEn: z.string().optional(),
        registrationEndDate: z.string().optional(),
      })
      .optional(),
    secondProgram: z
      .object({
        require: z.boolean().optional(),
        id: z.string().optional(),
        nameIs: z.string().optional(),
        nameEn: z.string().optional(),
        registrationEndDate: z.string().optional(),
      })
      .optional(),
    thirdLanguage: z
      .object({
        code: z.string().optional(),
        name: z.string().optional(),
      })
      .optional(),
    nordicLanguage: z
      .object({
        code: z.string().optional(),
        name: z.string().optional(),
      })
      .optional(),
    requestDormitory: z.array(z.enum([YES])).optional(),
  })
  .refine(
    ({ include, school }) => {
      if (!include) return true
      return !!school?.id
    },
    { path: ['school.id'] },
  )
  .refine(
    ({ include, firstProgram }) => {
      if (!include) return true
      return !!firstProgram?.id
    },
    { path: ['firstProgram.id'] },
  )
  .refine(
    ({ include, secondProgram }) => {
      if (!include) return true
      if (!secondProgram?.require) return true
      return !!secondProgram?.id
    },
    { path: ['secondProgram.id'] },
  )

export const SecondarySchoolSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: applicantInformationSchema({
    phoneRequired: true,
    emailRequired: true,
  }),
  applicationType: z.object({
    type: z.enum([
      ApplicationType.FRESHMAN,
      ApplicationType.GENERAL_APPLICATION,
    ]),
  }),
  custodians: z.array(CustodianSchema).max(2),
  otherContacts: z.array(OtherContactSchema).max(2),
  selection: z.object({
    first: SelectionSchema,
    second: SelectionSchema.optional(),
    third: SelectionSchema.optional(),
  }),
  extraInformation: z.object({
    nativeLanguage: z.string().optional(),
    otherDescription: z.string().optional(),
    supportingDocuments: z.array(FileDocumentSchema).optional(),
  }),
})

export type SecondarySchool = z.TypeOf<typeof SecondarySchoolSchema>
