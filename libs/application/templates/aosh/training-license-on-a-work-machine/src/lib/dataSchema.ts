import { z } from 'zod'
import * as kennitala from 'kennitala'
import { isValidPhoneNumber } from '../utils'

const InformationSchema = z.object({
  nationalId: z
    .string()
    .refine((nationalId) => nationalId && kennitala.isValid(nationalId)),
  name: z.string().min(1),
  address: z.string().min(1),
  postCode: z.string().min(1),
  email: z.string().email(),
  phone: z.string().refine((v) => isValidPhoneNumber(v)),
  machineLicenseNumber: z.string(), // TODO: Add validation if any
  driversLicenseNumber: z.string(), // TODO: Add validation if any
  driversLicenseDate: z.string(), // TODO: Add validation if any
})

const CertificateOfTenureSchema = z.object({
  // certificateOfTenure: z.string(), // TODO: Add validation if any
})

const AssigneeInformationSchema = z.object({
  companyNationalId: z
    .string()
    .refine((nationalId) => nationalId && kennitala.isValid(nationalId)),
  companyName: z.string().min(1),
  assigneeNationalId: z
    .string()
    .refine((nationalId) => nationalId && kennitala.isValid(nationalId)),
  assigneeName: z.string().min(1),
  assigneeEmail: z.string().email(),
  assigneePhone: z.string().refine((v) => isValidPhoneNumber(v)),
})

export const TrainingLicenseOnAWorkMachineAnswersSchema = z.object({
  information: InformationSchema,
  // certificateOfTenure: CertificateOfTenureSchema,
  assigneeInformation: AssigneeInformationSchema,
})

export type TrainingLicenseOnAWorkMachineAnswers = z.TypeOf<
  typeof TrainingLicenseOnAWorkMachineAnswersSchema
>
