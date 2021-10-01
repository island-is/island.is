import * as z from 'zod'
import { B_FULL, B_TEMP, YES, NO } from './constants'

export const dataSchema = z.object({
  type: z.array(z.enum(['car', 'trailer', 'motorcycle'])).nonempty(),
  subType: z.array(z.string()).nonempty(),
  approveExternalData: z.boolean().refine((v) => v),
  juristiction: z.string(),
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
  teacher: z.string().nonempty(),
  willBringQualityPhoto: z.union([
    z.array(z.enum([YES, NO])).nonempty(),
    z.enum([YES, NO]),
  ]),
  requirementsMet: z.boolean().refine((v) => v),
  certificate: z.array(z.enum([YES, NO])).nonempty(),
  applicationFor: z.enum([B_FULL, B_TEMP]),
  email: z.string().email(),
  drivingInstructor: z.string().nonempty(),
  drivingLicenseInOtherCountry: z.enum([YES, NO]),
  drivingLicenseDeprivedOrRestrictedInOtherCountry: z.union([
    z.array(z.enum([YES, NO])).nonempty(),
    z.enum([YES, NO]),
  ]),
})
