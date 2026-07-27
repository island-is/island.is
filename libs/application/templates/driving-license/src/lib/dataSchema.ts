import { z } from 'zod'
import { B_FULL_RENEWAL_65, BE, B_TEMP, B_FULL } from './constants'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { Pickup } from './types'
import { NO, YES } from '@island.is/application/core'
import { m } from './messages'

const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

export const dataSchema = z.object({
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
  applicationFor: z.enum([B_FULL, B_TEMP, BE, B_FULL_RENEWAL_65]),
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
  // Captured into answers via a hidden input during prerequisites so
  // subsection conditions in the draft form can branch on the redesign flag.
  // Required-ness of `healthCertificate` for the redesigned 65+ flow is
  // enforced at the field level (`.refine((files) => files.length > 0)` on
  // `healthCertificate` above) — when the user reaches the upload screen the
  // field is rendered as an empty array, the field-level refine fires, and
  // the user can't advance without uploading. A cross-field `superRefine` was
  // tried first but fired prematurely at the prerequisites→draft transition,
  // before the user had reached the upload screen, blocking advance.
  is65RenewalRedesignEnabled: z.boolean().optional(),
  // Captured into answers via a hidden input during prerequisites so the
  // B-temp photo selector / eligibility gating and the submission service can
  // branch on the redesign flag. Same mechanism as is65RenewalRedesignEnabled.
  isBTempRedesignEnabled: z.boolean().optional(),
})
