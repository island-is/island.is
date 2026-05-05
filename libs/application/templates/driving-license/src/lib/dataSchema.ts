import { z } from 'zod'
import {
  B_FULL_RENEWAL_65,
  BE,
  B_TEMP,
  B_FULL,
  B_ADVANCED,
  AdvancedLicense,
} from './constants'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { Pickup } from './types'
import { NO, YES } from '@island.is/application/core'
import { m } from './messages'

const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

const baseSchema = z.object({
  type: z.array(z.enum(['car', 'trailer', 'motorcycle'])).nonempty(),
  approveExternalData: z.boolean().refine((v) => v),
  delivery: z
    .object({
      deliveryMethod: z.enum([Pickup.POST, Pickup.DISTRICT]).optional(),
      jurisdiction: z.string().nullish(),
    })
    .refine(({ deliveryMethod, jurisdiction }) => {
      return deliveryMethod === Pickup.DISTRICT ? !!jurisdiction : true
    }),
  healthDeclaration: z.object({
    usesContactGlasses: z.enum([YES, NO]),
    hasReducedPeripheralVision: z.enum([YES, NO]),
    hasEpilepsy: z.enum([YES, NO]),
    hasHeartDisease: z.enum([YES, NO]),
    hasMentalIllness: z.enum([YES, NO]),
    usesMedicalDrugs: z.enum([YES, NO]),
    isAlcoholic: z.enum([YES, NO]),
    hasDiabetes: z.enum([YES, NO]),
    isDisabled: z.enum([YES, NO]),
    hasOtherDiseases: z.enum([YES, NO]),
  }),
  contactGlassesMismatch: z.boolean(),
  selectLicensePhoto: z.string().optional(),
  healthCertificate: z
    .array(z.object({ name: z.string(), key: z.string() }))
    .refine((files) => files.length > 0, {
      params: m.healthCertificateRequired,
    })
    .optional(),
  willBringQualityPhoto: z.union([
    z.array(z.enum([YES, NO])).nonempty(),
    z.enum([YES, NO]),
  ]),
  requirementsMet: z.boolean().refine((v) => v),
  certificate: z.array(z.enum([YES, NO])).nonempty(),
  applicationFor: z.enum([B_FULL, B_TEMP, BE, B_FULL_RENEWAL_65, B_ADVANCED]),
  advancedLicense: z
    .array(z.enum(Object.values(AdvancedLicense) as [string, ...string[]]))
    .nonempty()
    .refine((value) => {
      return value.length > 0
    }),
  email: z.string().email(),
  phone: z.string().refine((v) => isValidPhoneNumber(v)),
  drivingInstructor: z.string().min(1),
  otherCountry: z
    .object({
      drivingLicenseInOtherCountry: z.enum([YES, NO]),
      drivingLicenseDeprivedOrRestrictedInOtherCountry: z
        .array(z.string())
        .optional(),
    })
    .refine(
      ({
        drivingLicenseInOtherCountry,
        drivingLicenseDeprivedOrRestrictedInOtherCountry,
      }) => {
        return drivingLicenseInOtherCountry === YES
          ? !!drivingLicenseDeprivedOrRestrictedInOtherCountry &&
              drivingLicenseDeprivedOrRestrictedInOtherCountry.length > 0
          : true
      },
      { path: ['drivingLicenseDeprivedOrRestrictedInOtherCountry'] },
    ),
  hasHealthRemarks: z.enum([YES, NO]),
  is65RenewalRedesignEnabled: z.boolean().optional(),
})

// When the redesigned 65+ flow is active, healthCertificate must be a
// non-empty array. The field-level refine inside baseSchema only validates
// the shape of files when present; this enforces "must upload" at the form
// level. Treat missing flag as false so legacy 65+ drafts continue to pass.
//
// Two important details:
//   1. We chain `.partial()` BEFORE `.superRefine` so every field becomes
//      optional in the schema itself. The application framework detects
//      ZodEffects schemas (via `instanceof`) and calls `.parse(answers)`
//      directly — WITHOUT applying its own `.partial()` wrap. So if the
//      base were not partial here, every required field would fail
//      validation before the user has filled them in. Field-level refines
//      still fire on values that ARE present.
//   2. The framework's `Schema` type is `ZodObject<any>`, but `.superRefine`
//      returns `ZodEffects`. We cast back to the base type to satisfy the
//      static type; at runtime both expose `.parse` / `.safeParse`, and the
//      framework dispatches correctly via its `instanceof ZodEffects` check.
export const dataSchema = baseSchema.partial().superRefine((data, ctx) => {
  const isRedesigned65 =
    data.applicationFor === B_FULL_RENEWAL_65 &&
    data.is65RenewalRedesignEnabled === true
  if (!isRedesigned65) return
  const files = data.healthCertificate
  if (!files || files.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['healthCertificate'],
      params: m.healthCertificateRequired,
    })
  }
}) as unknown as typeof baseSchema
