import { z } from 'zod'
import { YES, NO } from './constants'
import { B_FULL, B_TEMP } from '../shared/constants'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

const declaration = z
  .object({
    answer: z.enum([YES, NO]),
    attachment: z.array(FileSchema).optional(),
  })
  .refine(
    ({ answer, attachment }) => {
      return answer === YES ? attachment && attachment?.length > 0 : true
    },
    {
      path: ['attachment'],
    },
  )

const glassesDeclaration = z
  .object({
    answer: z.enum([YES, NO]),
    attachment: z.array(FileSchema).optional(),
    mismatch: z.boolean(),
  })
  .refine(
    ({ answer, attachment, mismatch }) => {
      return answer === YES || mismatch
        ? attachment && attachment?.length > 0
        : true
    },
    {
      path: ['attachment'],
    },
  )

export const dataSchema = z.object({
  type: z.array(z.enum(['car', 'trailer', 'motorcycle'])).nonempty(),
  approveExternalData: z.boolean().refine((v) => v),
  jurisdiction: z.string().min(1),
  healthDeclaration: z.object({
    usesContactGlasses: glassesDeclaration,
    hasReducedPeripheralVision: declaration,
    hasEpilepsy: declaration,
    hasHeartDisease: declaration,
    hasMentalIllness: declaration,
    usesMedicalDrugs: declaration,
    isAlcoholic: declaration,
    hasDiabetes: declaration,
    isDisabled: declaration,
    hasOtherDiseases: declaration,
  }),
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
