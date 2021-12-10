import * as z from 'zod'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  address: z.string(),
  city: z.string(),
  email: z.string().email().nonempty(),
  phone: z.string().nonempty(),
  name: z.string(),
  validityPeriod: z.string(),
  deliveryMethod: z.string().nonempty(),
  photoAttachment: z.string(),
  attachmentFileName: z.string(),
  jurisdiction: z.string(),
  nationalId: z.string(),
  qualityPhoto: z.enum(['yes', 'no']),
  /*healthDeclaration: z.object({
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
  }),*/
})
