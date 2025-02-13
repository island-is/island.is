import { applicantInformationSchema } from '@island.is/application/ui-forms'
import { z } from 'zod'
import { ApplicationType } from '../utils'
import { YES } from '@island.is/application/core'
import { error } from './messages'
import * as kennitala from 'kennitala'

const FileDocumentSchema = z.object({
  name: z.string(),
  key: z.string(),
})

const CustodianSchema = z.object({
  person: z.object({
    nationalId: z.string().min(1),
    name: z.string().min(1),
    email: z.string().min(1),
    phone: z.string().min(1),
  }),
  legalDomicile: z.object({
    streetAddress: z.string().min(1),
    postalCode: z.string().min(1),
    city: z.string().optional(),
  }),
})

const MainOtherContactSchema = z
  .object({
    applicantNationalId: z.string(),
    required: z.boolean(),
    person: z
      .object({
        nationalId: z.string().optional(),
        name: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
      })
      .optional(),
  })
  .refine(
    ({ required, person }) => {
      if (!required) return true
      return !!person?.nationalId && kennitala.isValid(person.nationalId)
    },
    { path: ['person', 'nationalId'] },
  )
  .refine(
    ({ required, person }) => {
      if (!required) return true
      return !!person?.name
    },
    { path: ['person', 'name'] },
  )
  .refine(
    ({ required, person }) => {
      if (!required) return true
      return !!person?.email
    },
    { path: ['person', 'email'] },
  )
  .refine(
    ({ required, person }) => {
      if (!required) return true
      return !!person?.phone
    },
    { path: ['person', 'phone'] },
  )
  .refine(
    ({ person, applicantNationalId }) => {
      if (person?.nationalId === applicantNationalId) return false
      return true
    },
    { path: ['person', 'nationalId'], params: error.errorSameAsApplicant },
  )

const OtherContactSchema = z.object({
  person: z.object({
    nationalId: z
      .string()
      .min(1)
      .refine((nationalId) => kennitala.isValid(nationalId)),
    name: z.string().min(1),
    email: z.string().min(1),
    phone: z.string().min(1),
  }),
})

const SelectionSchema = z
  .object({
    include: z.boolean().optional(),
    school: z
      .object({
        id: z.string().optional().nullable(),
        name: z.string().optional(),
      })
      .optional(),
    firstProgram: z
      .object({
        id: z.string().optional(),
        nameIs: z.string().optional(),
        nameEn: z.string().optional(),
        registrationEndDate: z.string().optional(),
        isSpecialNeedsProgram: z.boolean().optional(),
      })
      .optional(),
    secondProgram: z
      .object({
        // Note: this include is only used for zod validation if there is only one program available, but a freshman should pick two
        include: z.boolean().optional(),
        require: z.boolean().optional(),
        id: z.string().optional().nullable(),
        nameIs: z.string().optional(),
        nameEn: z.string().optional(),
        registrationEndDate: z.string().optional(),
      })
      .optional(),
    thirdLanguage: z
      .object({
        code: z.string().optional().nullable(),
        name: z.string().optional(),
      })
      .optional(),
    nordicLanguage: z
      .object({
        code: z.string().optional().nullable(),
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
    { path: ['school', 'id'] },
  )
  .refine(
    ({ include, firstProgram }) => {
      if (!include) return true
      return !!firstProgram?.id
    },
    { path: ['firstProgram', 'id'] },
  )
  .refine(
    ({ include, secondProgram }) => {
      if (!include) return true
      if (!secondProgram?.include || !secondProgram?.require) return true
      return !!secondProgram?.id
    },
    { path: ['secondProgram', 'id'] },
  )

export const SecondarySchoolSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: applicantInformationSchema({
    phoneRequired: true,
    emailRequired: true,
  }),
  applicationType: z
    .object({
      value: z.nativeEnum(ApplicationType),
      isOpenForAdmissionFreshman: z.boolean().optional(),
      isOpenForAdmissionGeneral: z.boolean().optional(),
    })
    .refine(
      ({ value, isOpenForAdmissionFreshman, isOpenForAdmissionGeneral }) => {
        if (value === ApplicationType.FRESHMAN)
          return isOpenForAdmissionFreshman
        else if (value === ApplicationType.GENERAL_APPLICATION)
          return isOpenForAdmissionGeneral
        return true
      },
    ),
  custodians: z.array(CustodianSchema).max(2),
  mainOtherContact: MainOtherContactSchema,
  otherContacts: z.array(OtherContactSchema).max(1),
  selection: z.array(SelectionSchema),
  extraInformation: z.object({
    nativeLanguageCode: z.string().optional().nullable(),
    otherDescription: z.string().optional(),
    supportingDocuments: z.array(FileDocumentSchema).optional(),
  }),
})

export type SecondarySchool = z.TypeOf<typeof SecondarySchoolSchema>
