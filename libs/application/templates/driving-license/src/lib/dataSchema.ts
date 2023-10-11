import { z } from 'zod'
import { YES, NO } from './constants'
import { B_FULL, B_TEMP } from '../shared/constants'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { hasYes } from '@island.is/application/core'

const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

export const dataSchema = z.object({
  type: z.array(z.enum(['car', 'trailer', 'motorcycle'])).nonempty(),
  approveExternalData: z.boolean().refine((v) => v),
  jurisdiction: z.string().min(1),
  healthDeclaration: z
    .object({
      answers: z.object({
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
      attachment: z.array(FileSchema),
    })
    .refine(
      ({ answers, attachment }) => {
        return hasYes(answers) ? attachment.length > 0 : true
      },
      {
        path: ['attachment'],
      },
    ),
  contactGlassesMismatch: z.boolean(),
  healthDeclarationAge65: z.object({
    attachment: z.array(FileSchema).nonempty(),
  }),
  willBringQualityPhoto: z.union([
    z.array(z.enum([YES, NO])).nonempty(),
    z.enum([YES, NO]),
  ]),
  requirementsMet: z.boolean().refine((v) => v),
  certificate: z.array(z.enum([YES, NO])).nonempty(),
  applicationFor: z.enum([B_FULL, B_TEMP]),
  email: z.string().email(),
  phone: z.string().refine((v) => isValidPhoneNumber(v)),
  drivingInstructor: z.string().min(1),
  drivingLicenseInOtherCountry: z.enum([YES, NO]),
  drivingLicenseDeprivedOrRestrictedInOtherCountry: z.union([
    z.array(z.enum([YES, NO])).nonempty(),
    z.enum([YES, NO]),
  ]),
  hasHealthRemarks: z.enum([YES, NO]),
})
