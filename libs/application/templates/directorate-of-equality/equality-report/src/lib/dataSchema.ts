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
  email: z
    .string()
    .refine((v) => v && v.length > 0, { params: messages.errors.required })
    .refine((v) => EMAIL_REGEX.test(v), {
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
  nonBinary: z.string().refine((v) => v !== '' && Number(v) >= 0, {
    params: messages.errors.invalidNonNegativeNumber,
  }),
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

const HTML_NAMED_ENTITIES: Record<string, string> = {
  nbsp: ' ',
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
}

const decodeHtmlEntities = (value: string) =>
  value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
    if (entity[0] === '#') {
      const codePoint =
        entity[1].toLowerCase() === 'x'
          ? parseInt(entity.slice(2), 16)
          : parseInt(entity.slice(1), 10)
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint)
    }
    return HTML_NAMED_ENTITIES[entity.toLowerCase()] ?? match
  })

const decodeEditorHtml = (base64: string) => {
  try {
    return atob(base64)
      .replace(/<[^>]*>/g, '')
      .trim()
  } catch {
    return ''
  }
}

const information = z.object({
  checkbox: z
    .array(z.string())
    .nullish()
    .refine((v) => v == null || v.includes('agree'), {
      params: messages.errors.required,
    }),
})

const goalsAndActions = z.object({
  customField: z.string().refine((v) => decodeEditorHtml(v).length > 0, {
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
  information: information.optional(),
  goalsAndActions: goalsAndActions.optional(),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
