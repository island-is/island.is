import * as z from 'zod'
import { B_FULL, B_TEMP } from './constants'

export const dataSchema = z.object({
  type: z.array(z.enum(['car', 'trailer', 'motorcycle'])).nonempty(),
  subType: z.array(z.string()).nonempty(),
  approveExternalData: z.boolean().refine((v) => v),
  juristiction: z.string(),
  healthDeclaration: z.object({
    usesContactGlasses: z.enum(['yes', 'no']),
    hasReducedPeripheralVision: z.enum(['yes', 'no']),
    hasEpilepsy: z.enum(['yes', 'no']),
    hasHeartDisease: z.enum(['yes', 'no']),
    hasMentalIllness: z.enum(['yes', 'no']),
    usesMedicalDrugs: z.enum(['yes', 'no']),
    isAlcoholic: z.enum(['yes', 'no']),
    hasDiabetes: z.enum(['yes', 'no']),
    isDisabled: z.enum(['yes', 'no']),
    hasOtherDiseases: z.enum(['yes', 'no']),
  }),
  teacher: z.string().nonempty(),
  willBringQualityPhoto: z.union([
    z.array(z.enum(['yes', 'no'])).nonempty(),
    z.enum(['yes', 'no']),
  ]),
  requirementsMet: z.boolean().refine((v) => v),
  certificate: z.array(z.enum(['yes', 'no'])).nonempty(),
  applicationFor: z.enum([B_FULL, B_TEMP]),
  email: z.string().email(),
  drivingInstructor: z.string().nonempty(),
})
