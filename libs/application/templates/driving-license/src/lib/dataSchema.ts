import { z } from 'zod'
import { YES, NO, B_FULL_RENEWAL_65, BE, B_TEMP, B_FULL } from './constants'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

export const dataSchema = z.object({
  type: z.array(z.enum(['car', 'trailer', 'motorcycle'])).nonempty(),
  approveExternalData: z.boolean().refine((v) => v),
  jurisdiction: z.string().min(1),
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
  //TODO: Remove when RLS/SGS supports health certificate in BE license
  healthDeclarationValidForBELicense: z
    .array(z.string())
    .refine((v) => v === undefined || v.length === 0),
  contactGlassesMismatch: z.boolean(),
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
})
