import { z } from 'zod'
import * as kennitala from 'kennitala'
import { messages } from './messages'
import { EMAIL_REGEX } from '@island.is/application/core'

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
  gender: z
    .string()
    .refine((v) => v && v.length > 0, { params: messages.errors.required }),
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

const subCriteria = z
  .object({
    jobFactors: z.array(z.array(subCriterion)).optional(),
    personalFactors: z.array(z.array(subCriterion)).optional(),
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
  education: z.string(),
  gender: z.string(),
  field: z.string(),
  department: z.string(),
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

const outlierGroup = z.object({
  name: z.string().optional(),
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
  subsidiaries: subsidiaries.optional(),
  criteria: criteria.optional(),
  subCriteria: subCriteria,
  employees: employees,
  roles: roles,
  salaryAnalysis: salaryAnalysis,
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
