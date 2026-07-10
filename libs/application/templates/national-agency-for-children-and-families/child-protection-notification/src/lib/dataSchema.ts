import { NO, YES } from '@island.is/application/core'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { z } from 'zod'
import { KnowsNationalId } from '../utils/constants'
import { errorMessages } from './messages'

const isValidPhone = (value: string) => {
  const phone = parsePhoneNumberFromString(value, 'IS')
  return phone ? phone.isValid() : false
}

const phoneNumberSchema = z.string().refine((value) => isValidPhone(value), {
  params: errorMessages.phoneNumber,
})

type PreferredIdentityInput = {
  usePronounAndPreferredName?: string[]
  preferredName?: string
  preferredPronoun?: string[] | null
}

const addPreferredIdentityIssues = (
  ctx: z.RefinementCtx,
  data: PreferredIdentityInput | undefined,
  infoPath: 'nationalIdInfo' | 'manualInfo',
) => {
  const prefersIdentity = data?.usePronounAndPreferredName?.includes(YES)
  const hasPreferredIdentity =
    !!data?.preferredName || !!data?.preferredPronoun?.length

  // If preferred identity is requested, at least one of preferred name or pronoun must be provided.
  if (prefersIdentity && !hasPreferredIdentity) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: [infoPath, 'preferredName'],
      params: errorMessages.required,
    })
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: [infoPath, 'preferredPronoun'],
      params: errorMessages.required,
    })
  }
}

const serviceProviderSchema = z.object({
  service: z.string(),
  serviceType: z.string(),
  contactPersonWorkEmail: z.string().email(),
  contactPersonWorkPhone: phoneNumberSchema,
})

const childSchema = z
  .object({
    knowsNationalId: z.nativeEnum(KnowsNationalId).optional(),
    noNationalIdReason: z.string().optional(),
    nationalIdInfo: z
      .object({
        nationalId: z.string().optional(),
        name: z.string().optional(),
        phone: phoneNumberSchema.optional().or(z.literal('')),
        email: z.string().email().optional().or(z.literal('')),
        usePronounAndPreferredName: z.array(z.string()).optional(),
        preferredName: z.string().optional(),
        preferredPronoun: z.array(z.string()).nullish(),
      })
      .optional(),
    manualInfo: z
      .object({
        name: z.string().optional(),
        age: z.string().optional(),
        gender: z.string().optional(),
        usePronounAndPreferredName: z.array(z.string()).optional(),
        preferredName: z.string().optional(),
        preferredPronoun: z.array(z.string()).nullish(),
        country: z.string().optional(),
        address: z.string().optional(),
        postalCode: z.string().optional(),
        municipality: z.string().optional(),
        language: z.string().optional(),
        needsInterpreter: z.array(z.string()).optional(),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.knowsNationalId === KnowsNationalId.YES) {
      if (!data.nationalIdInfo?.nationalId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['nationalIdInfo', 'nationalId'],
          params: errorMessages.required,
        })
      } else if (!data.nationalIdInfo?.name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['nationalIdInfo', 'nationalId'],
          params: errorMessages.invalidNationalId,
        })
      }

      addPreferredIdentityIssues(ctx, data.nationalIdInfo, 'nationalIdInfo')
    }

    if (data.knowsNationalId === KnowsNationalId.NO) {
      if (!data.noNationalIdReason) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['noNationalIdReason'],
          params: errorMessages.required,
        })
      }

      addPreferredIdentityIssues(ctx, data.manualInfo, 'manualInfo')
    }
  })

const parentSchema = z.object({
  nationalIdInfo: z
    .object({
      nationalId: z.string().optional(),
      name: z.string().optional(),
      email: z.string().email().optional().or(z.literal('')),
      phone: phoneNumberSchema.optional().or(z.literal('')),
    })
    .optional(),
  name: z.string().optional(),
  age: z.string().optional(),
  gender: z.string().optional(),
  country: z.string().optional(),
  citizenship: z.string().optional(),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  municipality: z.string().optional(),
  needsInterpreter: z.array(z.string()).optional(),
  preferredLanguage: z.string().optional(),
})

const parentsSchema = z
  .object({
    knowsParentNationalIds: z.enum([YES, NO]).optional(),
    parent1: parentSchema.optional(),
    parent2: parentSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.knowsParentNationalIds) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['knowsParentNationalIds'],
        params: errorMessages.required,
      })
      return
    }

    if (data.knowsParentNationalIds === YES) {
      for (const key of ['parent1', 'parent2'] as const) {
        const nationalId = data[key]?.nationalIdInfo?.nationalId
        const name = data[key]?.nationalIdInfo?.name

        if (!nationalId) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [key, 'nationalIdInfo', 'nationalId'],
            params: errorMessages.required,
          })
        } else if (!name) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [key, 'nationalIdInfo', 'nationalId'],
            params: errorMessages.invalidNationalId,
          })
        }
      }
    }

    if (data.knowsParentNationalIds === NO) {
      for (const key of ['parent1', 'parent2'] as const) {
        const parent = data[key]
        const needsPreferredLanguage =
          parent?.citizenship !== 'IS' &&
          parent?.needsInterpreter?.includes(YES)

        // If parent is non-Icelandic and interpreter is requested, preferred language is required.
        if (needsPreferredLanguage && !parent?.preferredLanguage) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [key, 'preferredLanguage'],
            params: errorMessages.required,
          })
        }
      }
    }
  })

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  serviceProvider: serviceProviderSchema,
  child: childSchema.optional(),
  parents: parentsSchema.optional(),
  protectiveFactors: z
    .record(z.unknown())
    .optional()
    .superRefine((data, ctx) => {
      if (!data) return
      for (const [sectionCode, sectionAnswers] of Object.entries(data)) {
        if (!sectionAnswers || typeof sectionAnswers !== 'object') continue
        const section = sectionAnswers as Record<string, unknown>
        for (const [key, value] of Object.entries(section)) {
          if (
            /^sub\d+$/.test(key) &&
            Array.isArray(value) &&
            value.includes(YES)
          ) {
            const itemsKey = `${key}Items`
            const items = section[itemsKey]
            if (!Array.isArray(items) || items.length === 0) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: [sectionCode, itemsKey],
                params: errorMessages.required,
              })
            }
          }
        }
      }
    }),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
