import { z } from 'zod'
import * as kennitala from 'kennitala'
import { isValidPhoneNumber } from '../utils'
import { CertificateType } from '../utils/constants'

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

const applicantSchema = z.object({
  name: z.string().min(1),
  nationalId: z
    .string()
    .refine((nationalId) => nationalId && kennitala.isValid(nationalId)),
  address: z.string().min(1),
  postalCode: z.string().optional(), // Missing postalCode on dev .min(1),
  city: z.string().min(1),
  phoneNumber: z.string().refine((v) => isValidPhoneNumber(v)),
  email: z.string().email(),
})

const certificateTypeSchema = z.object({
  type: z.nativeEnum(CertificateType),
})

const uploadImageSchema = z.object({
  file: z.array(FileSchema),
})

export const IssuanceOfCertificateAnswersSchema = z.object({
  applicant: applicantSchema,
  certificateType: certificateTypeSchema,
  uploadImage: uploadImageSchema,
})

export type IssuanceOfCertificateAnswers = z.TypeOf<
  typeof IssuanceOfCertificateAnswersSchema
>
