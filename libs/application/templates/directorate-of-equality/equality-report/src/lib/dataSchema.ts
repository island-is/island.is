import { z } from 'zod'
import * as kennitala from 'kennitala'
import { messages } from './messages'
import { EMAIL_REGEX } from '@island.is/application/core'
import { Gender } from '../utils/constants'

const generalInformation = z.object({
  companyName: z.string().optional(),
  nationalId: z.string().optional(),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  municipality: z.string().optional(),
  numberOfEmployees: z.string().optional(),
  isatClassification: z.string().optional(),
})

const chiefExecutive = z.object({
  name: z
    .string()
    .refine((v) => v && v.length > 0, { params: messages.errors.required }),
  email: z
    .string()
    .refine((v) => v && v.length > 0, { params: messages.errors.required })
    .refine((v) => EMAIL_REGEX.test(v), {
      params: messages.errors.invalidEmail,
    }),
  jobTitle: z
    .string()
    .refine((v) => v && v.length > 0, { params: messages.errors.required }),
  gender: z.nativeEnum(Gender),
})

const contactPerson = z.object({
  name: z
    .string()
    .refine((v) => v && v.length > 0, { params: messages.errors.required }),
  jobTitle: z
    .string()
    .refine((v) => v && v.length > 0, { params: messages.errors.required }),
  email: z
    .string()
    .refine((v) => v && v.length > 0, { params: messages.errors.required })
    .refine((v) => EMAIL_REGEX.test(v), {
      params: messages.errors.invalidEmail,
    }),
  phone: z
    .string()
    .refine((v) => v && v.length > 0, { params: messages.errors.required }),
})

const employeeCount = z.object({
  women: z.string().refine((v) => v !== '' && Number(v) >= 0, {
    params: messages.errors.invalidNonNegativeNumber,
  }),
  men: z.string().refine((v) => v !== '' && Number(v) >= 0, {
    params: messages.errors.invalidNonNegativeNumber,
  }),
  // Optional — unlike women/men, companies aren't required to report this.
  nonBinary: z
    .string()
    .refine(
      (v) =>
        v === '' ||
        (v.trim() !== '' && Number.isFinite(Number(v)) && Number(v) >= 0),
      {
        params: messages.errors.invalidNonNegativeNumber,
      },
    ),
})

// A TableRepeater row carries the table's own bookkeeping: a row the applicant
// just added is `{ isUnsaved: true }` with no fields on it yet, and a deleted
// one is only flagged `isRemoved` — the real splice happens in the table's
// beforeSubmit callback, which runs after this schema. Both shapes have to
// parse, so the row is all-optional here and the actual rules live in the
// refinement below, which can skip the rows that aren't really there.
const subsidiaryRow = z.object({
  nationalIdWithName: z
    .object({
      name: z.string().optional(),
      nationalId: z.string().optional(),
    })
    .optional(),
  isRemoved: z.boolean().optional(),
})

const subsidiaries = z
  .object({
    includesSubsidiaries: z
      .enum(['yes', 'no'])
      .refine((v) => !!v, { params: messages.errors.required }),
    list: z.array(subsidiaryRow).optional(),
  })
  .superRefine((val, ctx) => {
    // The list is only part of the answer when the applicant said yes — the
    // service discards it otherwise. Validating it anyway would block the
    // screen on rows the table no longer renders.
    if (val.includesSubsidiaries !== 'yes') return

    const rows = val.list ?? []
    if (rows.every((row) => row.isRemoved)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['list'],
        params: messages.errors.required,
      })
      return
    }

    const seen = new Set<string>()
    // Indices are those of the unfiltered array so the error paths line up
    // with the rows react-hook-form is still rendering.
    rows.forEach((row, i) => {
      if (row.isRemoved) return
      const { name, nationalId } = row.nationalIdWithName ?? {}

      if (!name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['list', i, 'nationalIdWithName', 'name'],
          params: messages.errors.required,
        })
      }

      if (
        !nationalId ||
        !(kennitala.isValid(nationalId) && kennitala.isCompany(nationalId))
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['list', i, 'nationalIdWithName', 'nationalId'],
          params: messages.errors.invalidCompanyNationalId,
        })
      } else if (seen.has(nationalId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['list', i, 'nationalIdWithName', 'nationalId'],
          params: messages.errors.duplicateSubsidiary,
        })
      } else {
        seen.add(nationalId)
      }
    })
  })

const goalsAndActions = z.object({
  filename: z.string().refine((v) => v.length > 0, {
    params: messages.errors.required,
  }),
})

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((value) => value === true, {
    params: messages.prerequisites.errors.approveExternalData,
  }),
  generalInformation: generalInformation.optional(),
  chiefExecutive: chiefExecutive.optional(),
  contactPerson: contactPerson.optional(),
  employeeCount: employeeCount.optional(),
  subsidiaries: subsidiaries.optional(),
  goalsAndActions: goalsAndActions.optional(),
  // Set by the state machine on the DRAFT_RETRY -> IN_REVIEW transition, never
  // by a form: IN_REVIEW is reached from both DRAFT and DRAFT_RETRY and the
  // conclusion screen has no other way to tell a revision from a first send.
  hasBeenRevised: z.boolean().optional(),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
