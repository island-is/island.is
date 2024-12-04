import { applicantInformationSchema } from '@island.is/application/ui-forms'
import { z } from 'zod'
import { ApplicationType } from '../shared'
import { YES } from '@island.is/application/core'

const FileDocumentSchema = z.object({
  name: z.string(),
  key: z.string(),
})

const CustodianSchema = z
  .object({
    nationalId: z.string().optional(),
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
    school: z.object({
      id: z.string().optional(),
      name: z.string().optional(),
    }),
    firstProgram: z.object({
      id: z.string().optional(),
      name: z.string().optional(),
    }),
    secondProgram: z.object({
      id: z.string().optional(),
      name: z.string().optional(),
    }),
    thirdLanguage: z.object({
      code: z.string().optional(),
      name: z.string().optional(),
    }),
    nordicLanguage: z.object({
      code: z.string().optional(),
      name: z.string().optional(),
    }),
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
      return !!secondProgram?.id
    },
    { path: ['secondProgram.id'] },
  )
  .refine(
    ({ include, thirdLanguage }) => {
      if (!include) return true
      return !!thirdLanguage?.code
    },
    { path: ['thirdLanguage.code'] },
  )

export const SecondarySchoolSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: applicantInformationSchema({
    phoneRequired: true,
    emailRequired: true,
  }),
  otherAddress: z.object({
    address: z.string().optional(),
    postalCode: z.string().optional(),
  }),
  applicationType: z.object({
    type: z.enum([
      ApplicationType.FRESHMAN,
      ApplicationType.GENERAL_APPLICATION,
    ]),
  }),
  custodians: z.array(CustodianSchema),
  otherContact: OtherContactSchema.optional(),
  supportingDocuments: z
    .object({
      attachments: z.array(FileDocumentSchema),
    })
    .optional(),
  selection: z.object({
    first: SelectionSchema,
    second: SelectionSchema,
    third: SelectionSchema.optional(),
  }),
  extraInformation: z.object({
    nativeLanguage: z.string().optional(),
    hasDisability: z.array(z.enum([YES])).optional(),
    disabilityDescription: z.string().optional(),
    otherDescription: z.string().optional(),
  }),
  approveTermsAndConditions: z.array(z.enum([YES])),
})

export type SecondarySchool = z.TypeOf<typeof SecondarySchoolSchema>
