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

const subsidiaries = z.object({
  includesSubsidiaries: z
    .enum(['yes', 'no'])
    .refine((v) => !!v, { params: messages.errors.required }),
  list: z.optional(
    z
      .array(
        z.object({
          nationalIdWithName: z.object({
            name: z.string().min(1),
            nationalId: z
              .string()
              .refine((v) => kennitala.isValid(v) && kennitala.isCompany(v), {
                params: messages.errors.invalidCompanyNationalId,
              }),
          }),
        }),
      )
      .superRefine((items, ctx) => {
        const seen = new Set<string>()
        items.forEach((item, i) => {
          const id = item.nationalIdWithName?.nationalId
          if (id && seen.has(id)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [i, 'nationalIdWithName', 'nationalId'],
              params: messages.errors.duplicateSubsidiary,
            })
          } else if (id) {
            seen.add(id)
          }
        })
      }),
  ),
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
