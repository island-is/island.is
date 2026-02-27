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
  willBringQualityPhoto: z
    .union([z.array(z.enum([YES, NO])).nonempty(), z.enum([YES, NO])])
    .optional(),
  healthCertificate: z.array(z.object({ name: z.string(), key: z.string() })).optional(),
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
})
