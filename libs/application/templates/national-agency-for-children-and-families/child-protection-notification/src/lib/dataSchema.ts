import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { z } from 'zod'
import { KnowsNationalId, KnowsParentNationalId } from '../utils/constants'

const isValidPhone = (value: string) => {
  const phone = parsePhoneNumberFromString(value, 'IS')
  return phone ? phone.isValid() : false
}

const childSchema = z.object({
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
        .refine((v) => isValidPhone(v))
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

const parentSchema = z.object({
  nationalIdInfo: z
    .object({
      nationalId: z.string().optional(),
      name: z.string().optional(),
      email: z.string().email().optional().or(z.literal('')),
      phone: z
        .string()
        .refine((v) => isValidPhone(v))
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

const expectantParentsSchema = z.object({
  knowsParentNationalIds: z
    .enum([KnowsParentNationalId.YES, KnowsParentNationalId.NO])
    .optional(),
  parent1: parentSchema.optional(),
  parent2: parentSchema.optional(),
})

export const dataSchema = z.object({
  child: childSchema.optional(),
  expectantParents: expectantParentsSchema.optional(),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
