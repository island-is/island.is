import { z } from 'zod'
import { B_FULL_RENEWAL_65, B_TEMP, B_FULL } from '../utils/constants'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { Pickup } from '../types'
import { NO, YES } from '@island.is/application/core'
import { m } from './messages'

const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

export const dataSchema = z.object({
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
  selectLicensePhoto: z.string().optional(),
  healthCertificate: z
    .array(z.object({ name: z.string(), key: z.string() }))
    .refine((files) => files.length > 0, {
      params: m.healthCertificateRequired,
    })
    .optional(),
  requirementsMet: z.boolean().refine((v) => v),
  applicationFor: z.enum([B_FULL, B_TEMP, B_FULL_RENEWAL_65]),
  email: z.string().email(),
  phone: z.string().refine((v) => isValidPhoneNumber(v)),
  // Only collected for B_TEMP (the instructor screen is hidden for B_FULL /
  // B_FULL_RENEWAL_65). Under partial validation this already gives the intended
  // per-type behaviour: enforced non-empty for B_TEMP (present + `.min(1)`),
  // skipped when absent for the other types. It is deliberately NOT expressed as
  // a cross-field rule — that requires a top-level `superRefine`, which converts
  // `dataSchema` to a ZodEffects and flips the shared validator from partial to
  // full-schema validation on every save (libs/application/core/src/validation/
  // validators.ts), breaking the draft flow.
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
  // Submission-contract constants written as `true` by hidden inputs in the
  // draft form (sectionRequirements.ts). The shared driving-license
  // submission service branches on these frozen answers to pick the RLS
  // endpoint; this app only runs the current flow, so they are always true.
  // Required-ness of `healthCertificate` for the 65+ flow is enforced at the
  // field level (`.refine((files) => files.length > 0)` on `healthCertificate`
  // above) — when the user reaches the upload screen the field renders as an
  // empty array, the field-level refine fires, and the user can't advance
  // without uploading.
  is65RenewalRedesignEnabled: z.boolean().optional(),
  isBTempRedesignEnabled: z.boolean().optional(),
  isBFullRedesignEnabled: z.boolean().optional(),
})
