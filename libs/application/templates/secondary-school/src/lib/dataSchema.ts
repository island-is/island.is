import { applicantInformationSchema } from '@island.is/application/ui-forms'
import { z } from 'zod'
import { ApplicationType } from '../shared'
import { hasDuplicates } from '../utils'
import { YES } from '@island.is/application/core'
import { error } from './messages'
import * as kennitala from 'kennitala'

const FileDocumentSchema = z.object({
  name: z.string(),
  key: z.string(),
})

const CustodianSchema = z.object({
  person: z.object({
    nationalId: z
      .string()
      .min(1)
      .refine((nationalId) => kennitala.isValid(nationalId)),
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
        // Note: is true if more than one program is available (this is only used for zod validation)
        include: z.boolean().optional(),
        // Note: is true if freshman and firstProgram is not special needs program
        require: z.boolean().optional(),
        id: z.string().optional().nullable(),
        nameIs: z.string().optional(),
        nameEn: z.string().optional(),
        registrationEndDate: z.string().optional(),
        isSpecialNeedsProgram: z.boolean().optional(),
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
    ({ school }) => {
      return !!school?.id
    },
    { path: ['school', 'id'] },
  )
  .refine(
    ({ firstProgram }) => {
      return !!firstProgram?.id
    },
    { path: ['firstProgram', 'id'] },
  )
  .refine(
    ({ secondProgram }) => {
      if (!secondProgram?.include || !secondProgram?.require) return true
      return !!secondProgram?.id
    },
    { path: ['secondProgram', 'id'] },
  )
  .refine(
    ({ firstProgram, secondProgram }) => {
      return (
        !firstProgram?.id ||
        !secondProgram?.id ||
        firstProgram?.id !== secondProgram?.id
      )
    },
    { path: ['secondProgram', 'id'], params: error.errorProgramDuplicate },
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
  otherContacts: z.array(OtherContactSchema).max(2),
  selection: z
    .array(SelectionSchema)
    .refine(
      (arr) => {
        const schoolIds = [arr[0]?.school?.id || '', arr[1]?.school?.id || '']
        return !hasDuplicates(schoolIds.filter((x) => !!x))
      },
      { path: ['1', 'school', 'id'], params: error.errorSchoolDuplicate },
    )
    .refine(
      (arr) => {
        const schoolIds = arr.map((x) => x?.school?.id || '')
        return !hasDuplicates(schoolIds.filter((x) => !!x))
      },
      { path: ['2', 'school', 'id'], params: error.errorSchoolDuplicate },
    ),
  extraInformation: z.object({
    nativeLanguageCode: z.string().optional().nullable(),
    otherDescription: z.string().optional(),
    supportingDocuments: z.array(FileDocumentSchema).optional(),
  }),
})

export type SecondarySchool = z.TypeOf<typeof SecondarySchoolSchema>
