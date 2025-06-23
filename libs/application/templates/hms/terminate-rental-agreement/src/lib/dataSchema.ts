import { z } from 'zod'
import { TerminationTypes } from '../types'

const fileSchema = z.object({ key: z.string(), name: z.string() })

const applicantSchema = z.object({
  address: z.string().refine((v) => !!v),
  city: z.string().refine((v) => !!v),
  email: z.string().refine((v) => !!v),
  name: z.string().refine((v) => !!v),
  nationalId: z.string().refine((v) => !!v),
  phoneNumber: z.string().refine((v) => !!v),
  postalCode: z.string().refine((v) => !!v),
})

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: applicantSchema,
  rentalAgreement: z.object({
    answer: z.string().min(1),
  }),
  terminationType: z.object({
    answer: z.nativeEnum(TerminationTypes),
  }),
  // bound termination
  boundTermination: z.object({
    boundTerminationDate: z.string().refine((x) => x.trim().length > 0),
  }),
  // unbound termination
  unboundTermination: z.object({
    unboundTerminationDate: z.string().refine((x) => x.trim().length > 0),
    unboundTerminationReason: z.string().refine((v) => !!v),
  }),
  // cancelation
  cancelation: z.object({
    cancelationDate: z.string().refine((x) => x.trim().length > 0),
    cancelationReason: z.string().refine((v) => !!v),
  }),

  fileUpload: z.array(fileSchema).length(1),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
