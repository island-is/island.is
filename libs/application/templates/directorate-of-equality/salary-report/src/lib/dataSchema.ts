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

const jobFactor = z.object({
  type: z.string(),
  title: z.string(),
  description: z.string(),
  weight: z.string().refine((v) => v !== '' && Number(v) >= 0, {
    params: messages.errors.invalidNonNegativeNumber,
  }),
})

const personalFactor = z.object({
  title: z
    .string()
    .refine((v) => v && v.length > 0, { params: messages.errors.required }),
  description: z.string().optional(),
  weight: z.string().refine((v) => v !== '' && Number(v) >= 0, {
    params: messages.errors.invalidNonNegativeNumber,
  }),
})

const criteria = z
  .object({
    jobFactors: z.array(jobFactor).min(1),
    personalFactors: z.array(personalFactor).optional(),
  })
  .superRefine((val, ctx) => {
    const jobTotal = (val.jobFactors ?? []).reduce(
      (sum, f) => sum + (Number(f.weight) || 0),
      0,
    )
    const personalTotal = (val.personalFactors ?? []).reduce(
      (sum, f) => sum + (Number(f.weight) || 0),
      0,
    )
    // Allow a small tolerance so valid decimal weights (e.g. 33.33 + 33.33 +
    // 33.34) aren't rejected by floating-point rounding.
    if (Math.abs(jobTotal + personalTotal - 100) > 0.001) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['jobFactors'],
        params: messages.report.criteria.weightSumError,
      })
    }
    // Personal-factor titles are the key linking a criterion to the step
    // assignments stored on each employee, and deleting a criterion cascades
    // by that title — two criteria sharing one title would make the delete
    // strip both. Job-factor titles come from a fixed set and can't collide.
    const seen = new Set<string>()
    ;(val.personalFactors ?? []).forEach((factor, i) => {
      const title = factor.title?.trim()
      if (!title) return
      if (seen.has(title)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['personalFactors', i, 'title'],
          params: messages.errors.duplicateCriterionTitle,
        })
      } else {
        seen.add(title)
      }
    })
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

const subCriterionStep = z.object({
  description: z.string(),
})

const subCriterion = z.object({
  title: z.string(),
  description: z.string().optional(),
  weight: z.string(),
  stepCount: z.string(),
  steps: z.array(subCriterionStep),
})

// Sub-criterion titles are the key linking a sub-criterion to the step
// assignments on employees/roles, matched as a (criterionTitle, subTitle)
// pair — so they only have to be unique within their own criterion's group,
// not globally. Deleting a sub-criterion cascades by that pair, and a
// duplicate title would make the delete strip both.
const uniqueSubCriterionTitles = (
  groups: { title: string }[][],
  ctx: z.RefinementCtx,
  factorsKey: 'jobFactors' | 'personalFactors',
) =>
  groups.forEach((group, groupIndex) => {
    const seen = new Set<string>()
    group.forEach((sub, i) => {
      const title = sub.title?.trim()
      if (!title) return
      if (seen.has(title)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [factorsKey, groupIndex, i, 'title'],
          params: messages.errors.duplicateSubCriterionTitle,
        })
      } else {
        seen.add(title)
      }
    })
  })

const subCriteria = z
  .object({
    jobFactors: z.array(z.array(subCriterion)).optional(),
    personalFactors: z.array(z.array(subCriterion)).optional(),
  })
  .superRefine((val, ctx) => {
    uniqueSubCriterionTitles(val.jobFactors ?? [], ctx, 'jobFactors')
    uniqueSubCriterionTitles(val.personalFactors ?? [], ctx, 'personalFactors')
  })
  .optional()

const employeeStepAssignment = z.object({
  subTitle: z.string(),
  stepOrder: z.number(),
  criterionTitle: z.string(),
})

const employee = z.object({
  ordinal: z.number(),
  identifier: z.string().min(1),
  roleTitle: z.string(),
  gender: z.string(),
  // Nullish, not just optional: the API returns `null` for an empty Svið/Deild
  // cell and the imported report is seeded straight into answers.
  field: z.string().nullish(),
  department: z.string().nullish(),
  startDate: z.string(),
  workRatio: z.number(),
  baseSalary: z.number(),
  additionalFixedOvertime: z.number().nullish(),
  additionalFixedCarAllowance: z.number().nullish(),
  bonusOccasionalCarAllowance: z.number().nullish(),
  bonusOccasionalOvertime: z.number().nullish(),
  bonusPayments: z.number().nullish(),
  bonusOther: z.number().nullish(),
  personalStepAssignments: z.array(employeeStepAssignment).default([]),
})

const employees = z.array(employee).optional()

const stepAssignment = z.object({
  criterionTitle: z.string(),
  subTitle: z.string(),
  stepOrder: z.number(),
})

const role = z.object({
  title: z.string(),
  stepAssignments: z.array(stepAssignment),
})

const roles = z.array(role).optional()

// No `name`: the form doesn't let the applicant label a group, and the API
// assigns a default server-side when it's omitted. Add it back alongside a
// real input, not before.
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
  criteria: criteria.optional(),
  subCriteria: subCriteria,
  employees: employees,
  roles: roles,
  salaryAnalysis: salaryAnalysis,
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
