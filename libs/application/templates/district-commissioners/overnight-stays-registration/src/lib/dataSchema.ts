import { z } from 'zod'
import { applicationMessages as m } from './messages'

const isValidAdvertisementUrl = (value: string) => {
  try {
    const url = new URL(value.trim())
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Every rendered amount field registers a key in the map, so a blank value means the
 * user left it empty. Zero is a legitimate income, hence only negatives are rejected.
 */
const amountRecordSchema = z
  .record(
    z.string(),
    z.union([z.string(), z.number()]).superRefine((value, ctx) => {
      const normalized =
        typeof value === 'number' ? String(value) : value.trim()

      if (normalized.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: m.pricingAmountRequired,
        })
        return
      }

      const amount = Number(normalized.replace(/[^\d-]/g, ''))

      if (!Number.isFinite(amount) || amount < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: m.pricingAmountInvalid,
        })
      }
    }),
  )
  .default({})

const pricingSchema = z.preprocess(
  (value) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return value
    }

    const pricing = value as Record<string, unknown>

    return pricing.method === 'perVisit'
      ? { ...pricing, monthlyAmounts: {} }
      : { ...pricing, perVisitAmounts: {} }
  },
  z
    .object({
      method: z.enum(['monthly', 'perVisit']).default('monthly'),
      monthlyAmounts: amountRecordSchema,
      perVisitAmounts: amountRecordSchema,
    })
    .default({
      method: 'monthly',
      monthlyAmounts: {},
      perVisitAmounts: {},
    }),
)

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  year: z.string().min(1, m.yearRequired.defaultMessage).optional(),
  homeLodgingId: z
    .string()
    .min(1, m.homeLodgingSchemaRequired.defaultMessage)
    .optional(),
  applicant: z
    .object({
      name: z.string().optional(),
      nationalId: z.string().optional(),
      address: z.string().optional(),
      email: z.string().email().or(z.literal('')).optional(),
      phoneNumber: z.string().optional(),
    })
    .optional(),
  advertisements: z.preprocess(
    (value) => (value === '' ? [] : value),
    z
      .array(
        z.object({
          url: z.string().superRefine((value, ctx) => {
            if (value.trim().length === 0) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                params: m.advertisementRequired,
              })
              return
            }

            if (!isValidAdvertisementUrl(value)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                params: m.advertisementInvalidUrl,
              })
            }
          }),
        }),
      )
      .optional(),
  ),
  noActiveAdvertisement: z.preprocess(
    (value) => {
      if (value === true) return ['true']
      if (value === false) return []
      return value
    },
    z.array(z.string()).default([]),
  ),
  noOvernightStays: z.array(z.string()).default([]),
  overnightDates: z.array(z.string()).default([]),
  pricing: pricingSchema,
  comments: z.string().optional(),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
