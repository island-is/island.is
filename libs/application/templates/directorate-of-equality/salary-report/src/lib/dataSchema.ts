import { z } from 'zod'
import * as kennitala from 'kennitala'
import { messages } from './messages'
import { EMAIL_REGEX } from '@island.is/application/core'
import { Gender } from '../utils/types'
import { PERIOD_ONE_MONTH, PERIOD_TWELVE_MONTHS } from '../utils/constants'
import { isRemedyDateInWindow } from '../utils/dates'

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
  jobTitle: z
    .string()
    .refine((v) => v && v.length > 0, { params: messages.errors.required }),
  email: z.string().refine((v) => EMAIL_REGEX.test(v), {
    params: messages.errors.invalidEmail,
  }),
  phone: z
    .string()
    .refine((v) => v && v.length > 0, { params: messages.errors.required }),
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
    // Filters out soft-deleted rows, which the table only drops from
    // answers after this schema has already validated them.
    list: z
      .preprocess(
        (val) =>
          Array.isArray(val)
            ? val.filter((item) => !(item as { isRemoved?: boolean })?.isRemoved)
            : val,
        z
          .array(
            z.object({
              nationalIdWithName: z.object({
                name: z.string().refine((v) => v && v.length > 0, {
                  params: messages.errors.required,
                }),
                nationalId: z
                  .string()
                  .refine(
                    (v) => kennitala.isValid(v) && kennitala.isCompany(v),
                    {
                      params: messages.errors.invalidCompany,
                    },
                  ),
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
      )
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

// Only the POSTPONED-state explanation is answers-backed; outlier grouping
// itself is decided pre-submit on the DMR draft.
const outlierGroup = z.object({
  name: z.string().optional(),
  reason: z.string().optional(),
  action: z.string().optional(),
  remedyDate: z.string().optional(),
  signatureName: z.string().optional(),
  signatureRole: z.string().optional(),
  employeeOrdinals: z.array(z.number()),
})

const salaryAnalysis = z
  .object({
    postponed: z.array(z.string()).optional(),
    outlierGroups: z.array(outlierGroup).optional(),
    hasMinimumSetOutliers: z.boolean().optional(),
    // Mirrored from the analysis result so the overview screen can read it —
    // see the comment on BenchmarkVerdict.
    benchmarkVerdict: z
      .enum(['within', 'over', 'notComputable', 'unknown'])
      .optional(),
    adjustedGapPercent: z.number().optional(),
    adjustedGapDirection: z.enum(['FEMALE', 'MALE', 'NONE']).optional(),
    outlierPlanReviewed: z.boolean().optional(),
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
      if (!group.remedyDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['outlierGroups', i, 'remedyDate'],
          params: messages.errors.required,
        })
        // The window is re-checked here, not just where the calendar is drawn:
        // POSTPONED keeps a draft for 90 days, so a date that was valid when it
        // was picked can be in the past by the time this runs.
      } else if (!isRemedyDateInWindow(group.remedyDate, new Date())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['outlierGroups', i, 'remedyDate'],
          params: messages.errors.remedyDateOutOfRange,
        })
      }
      // No check for signatureName: the responsible party's name is optional.
      // isOutlierGroupComplete omits it too — that rule gates the Continue
      // button, so the two have to name the same fields.
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

// criteria, subCriteria, employees, and roles live on the DMR draft report
// (see utils/useDraftQuery.ts / useDraftSync.ts), never in applicationAnswers.
export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((value) => value === true, {
    params: messages.prerequisites.errors.approveExternalData,
  }),
  generalInformation: generalInformation.optional(),
  chiefExecutive: chiefExecutive.optional(),
  contactPerson: contactPerson.optional(),
  period: period.optional(),
  subsidiaries: subsidiaries.optional(),
  salaryAnalysis: salaryAnalysis,
  // Navigation-only signal (not mirrored DMR data): section visibility needs
  // a synchronous update, but externalData writes don't reach the visibility
  // reducer without a full refetch that would reset in-flight navigation.
  hasPersonalCriteria: z.boolean().optional(),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
