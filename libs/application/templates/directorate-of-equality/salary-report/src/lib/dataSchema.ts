import { z } from 'zod'
import * as kennitala from 'kennitala'
import { messages } from './messages'
import { EMAIL_REGEX } from '@island.is/application/core'
import { Gender } from '../utils/types'
import { PERIOD_ONE_MONTH, PERIOD_TWELVE_MONTHS } from '../utils/constants'

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
  email: z.string().refine((v) => EMAIL_REGEX.test(v), {
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
  email: z.string().refine((v) => EMAIL_REGEX.test(v), {
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
  nonBinary: z.string().refine((v) => v !== '' && Number(v) >= 0, {
    params: messages.errors.invalidNonNegativeNumber,
  }),
})

const period = z
  .object({
    period: z
      .enum([PERIOD_TWELVE_MONTHS, PERIOD_ONE_MONTH])
      .refine((v) => !!v, { params: messages.errors.required }),
    year: z.string().nullish(),
    month: z.string().nullish(),
  })
  .superRefine((val, ctx) => {
    if (val.period !== PERIOD_ONE_MONTH) return
    if (!val.year) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['year'],
        params: messages.errors.required,
      })
    }
    if (!val.month) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['month'],
        params: messages.errors.required,
      })
    }
  })

const subsidiaries = z
  .object({
    includesSubsidiaries: z
      .enum(['yes', 'no'])
      .refine((v) => !!v, { params: messages.errors.required }),
    list: z
      .array(
        z.object({
          nationalIdWithName: z.object({
            name: z.string().refine((v) => v && v.length > 0, {
              params: messages.errors.required,
            }),
            nationalId: z
              .string()
              .refine((v) => kennitala.isValid(v) && kennitala.isCompany(v), {
                params: messages.errors.invalidCompany,
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
      })
      .optional(),
  })
  .superRefine((val, ctx) => {
    // If the applicant says they have subsidiaries, the list can't be empty.
    if (
      val.includesSubsidiaries === 'yes' &&
      (!val.list || val.list.length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['list'],
        params: messages.errors.required,
      })
    }
  })

// Only the POSTPONED-state improvement-plan explanation (reason/action/
// signature) is answers-backed — the outlier GROUPING itself (which
// employees belong to which group) is decided pre-submit, on the DMR draft,
// via the per-screen draft reads/`syncSalaryDraft`. By the time POSTPONED is
// reached the draft has already been submitted, so this key holds a fresh
// explanation-only shape at that point (see OutlierGroupPanel/OutlierEditor).
const outlierGroup = z.object({
  reason: z.string().optional(),
  action: z.string().optional(),
  signatureName: z.string().optional(),
  signatureRole: z.string().optional(),
  employeeOrdinals: z.array(z.number()),
})

const salaryAnalysis = z
  .object({
    postponed: z.array(z.string()).optional(),
    outlierGroups: z.array(outlierGroup).optional(),
  })
  .superRefine((val, ctx) => {
    // Explanations are only required when there's something to explain (a
    // group with detected outliers) and the applicant hasn't postponed the
    // improvement plan — the form hides these inputs in both other cases, so
    // requiring them unconditionally would silently block submission.
    if (val.postponed?.includes('yes')) return
    val.outlierGroups?.forEach((group, i) => {
      if (group.employeeOrdinals.length === 0) return
      if (!group.reason) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['outlierGroups', i, 'reason'],
          params: messages.errors.required,
        })
      }
      if (!group.action) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['outlierGroups', i, 'action'],
          params: messages.errors.required,
        })
      }
      if (!group.signatureName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['outlierGroups', i, 'signatureName'],
          params: messages.errors.required,
        })
      }
      if (!group.signatureRole) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['outlierGroups', i, 'signatureRole'],
          params: messages.errors.required,
        })
      }
    })
  })
  .optional()

// `criteria`, `subCriteria`, `employees`, and `roles` — everything from the
// `dataEntry` (Excel upload) screen onward — are deliberately absent here.
// That data lives exclusively on the DMR draft report (see the per-screen
// utils/useDraftQuery.ts reads and utils/useDraftSync.ts writes, the latter
// calling the custom directorateOfEqualitySyncSalaryReportDraft GraphQL
// mutation); it is never written to or read from applicationAnswers.
export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((value) => value === true, {
    params: messages.prerequisites.errors.approveExternalData,
  }),
  generalInformation: generalInformation.optional(),
  chiefExecutive: chiefExecutive.optional(),
  contactPerson: contactPerson.optional(),
  employeeCount: employeeCount.optional(),
  period: period.optional(),
  subsidiaries: subsidiaries.optional(),
  salaryAnalysis: salaryAnalysis,
  // Navigation signal ONLY — not real form data, and deliberately not a
  // mirror of any DMR content. `employeeClassificationSubSection`'s
  // visibility needs to know "does a PERSONAL criterion exist" the instant
  // CriteriaEditor/ExcelTemplateDownload create one, but that data lives on
  // the DMR draft, and the reducer that computes section visibility holds
  // its own stale copy of `externalData` that a plain
  // `updateApplicationExternalData` call never reaches (only a full
  // application refetch does, which resets in-flight navigation — see the
  // `answerQuestions` calls in those two screens). Answers-backed state,
  // by contrast, updates the reducer synchronously and safely via the same
  // `ANSWER` action every other field already uses.
  hasPersonalCriteria: z.boolean().optional(),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
