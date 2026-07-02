import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { z } from 'zod'
import { KnowsNationalId, KnowsParentNationalId } from '../utils/constants'
import { errorMessages } from './messages'

const isValidPhone = (value: string) => {
  const phone = parsePhoneNumberFromString(value, 'IS')
  return phone ? phone.isValid() : false
}

const phoneNumberSchema = z.string().refine((value) => isValidPhone(value), {
  params: errorMessages.phoneNumber,
})

const serviceProviderSchema = z.object({
  service: z.string(),
  serviceType: z.string(),
  contactPersonWorkEmail: z.string().email(),
  contactPersonWorkPhone: phoneNumberSchema,
})

const childSchema = z
  .object({
    knowsNationalId: z
      .enum([KnowsNationalId.YES, KnowsNationalId.NO, KnowsNationalId.UNBORN])
      .optional(),
    noNationalIdReason: z.string().optional(),
    nationalIdInfo: z
      .object({
        nationalId: z.string().optional(),
        name: z.string().optional(),
        phone: z
          .string()
          .refine((v) => isValidPhone(v), { params: errorMessages.phoneNumber })
          .optional()
          .or(z.literal('')),
        email: z.string().email().optional().or(z.literal('')),
        usePronounAndPreferredName: z.array(z.string()).optional(),
        preferredName: z.string().optional(),
        preferredPronoun: z.string().optional(),
      })
      .optional(),
    manualInfo: z
      .object({
        name: z.string().optional(),
        age: z.string().optional(),
        gender: z.string().optional(),
        usePronounAndPreferredName: z.array(z.string()).optional(),
        preferredName: z.string().optional(),
        preferredPronoun: z.string().optional(),
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
    }

    if (
      data.knowsNationalId === KnowsNationalId.NO &&
      !data.noNationalIdReason
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['noNationalIdReason'],
        params: errorMessages.required,
      })
    }
  })

const parentSchema = z.object({
  nationalIdInfo: z
    .object({
      nationalId: z.string().optional(),
      name: z.string().optional(),
      email: z.string().email().optional().or(z.literal('')),
      phone: z
        .string()
        .refine((v) => isValidPhone(v), { params: errorMessages.phoneNumber })
        .optional()
        .or(z.literal('')),
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
})

const expectantParentsSchema = z
  .object({
    knowsParentNationalIds: z
      .enum([KnowsParentNationalId.YES, KnowsParentNationalId.NO])
      .optional(),
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

    if (data.knowsParentNationalIds !== KnowsParentNationalId.YES) return

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
  })

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  serviceProvider: serviceProviderSchema,
  child: childSchema.optional(),
  expectantParents: expectantParentsSchema.optional(),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
