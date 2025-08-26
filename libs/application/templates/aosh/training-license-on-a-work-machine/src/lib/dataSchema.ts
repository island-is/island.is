import { z } from 'zod'
import * as kennitala from 'kennitala'
import { isValidEmail, isValidPhoneNumber } from '../utils'

const InformationSchema = z.object({
  nationalId: z
    .string()
    .refine((nationalId) => nationalId && kennitala.isValid(nationalId)),
  name: z.string().min(1),
  address: z.string().min(1),
  postCode: z.string().min(1),
  email: z.string().email(),
  phone: z.string().refine((v) => isValidPhoneNumber(v)),
  driversLicenseNumber: z.string().min(1),
})

export const CertificateOfTenureSchema = z.object({
  practicalRight: z.string().min(1),
  machineNumber: z.string().min(1),
  machineType: z.string().min(1),
  dateFrom: z.string().min(1),
  dateTo: z.string().min(1),
  tenureInHours: z.string().min(1),
  isContractor: z.array(z.string().optional()),
  licenseCategoryPrefix: z.string().optional(),
  unknownMachineType: z.boolean().optional(),
  unknownPracticalRight: z.boolean().optional(),
  alreadyHaveTrainingLicense: z.boolean().optional(),
  wrongPracticalRight: z.boolean().optional(),
  wrongPracticalRightWithInfo: z.boolean().optional(),
  machineTypeDoesNotMatch: z.boolean().optional(),
})

const AssigneeInformationSchema = z.object({
  company: z.object({
    nationalId: z
      .string()
      .refine((nationalId) => nationalId && kennitala.isCompany(nationalId)),
    name: z.string().min(1),
  }),
  assignee: z.object({
    nationalId: z
      .string()
      .refine((nationalId) => nationalId && kennitala.isPerson(nationalId)),
    name: z.string().min(1),
    email: z.string().refine((email) => isValidEmail(email)),
    phone: z.string().refine((phone) => isValidPhoneNumber(phone)),
  }),
  workMachine: z.array(z.string()).min(1),
  isSameAsApplicant: z.boolean().refine((val) => !val),
})

export const TrainingLicenseOnAWorkMachineAnswersSchema = z.object({
  information: InformationSchema,
  certificateOfTenure: z.array(CertificateOfTenureSchema),
  validCertificateOfTenure: z.boolean().optional(),
  assigneeInformation: z.array(AssigneeInformationSchema),
  rejected: z.boolean().optional(),
  approved: z.array(z.string()).optional(),
})

export type TrainingLicenseOnAWorkMachineAnswers = z.TypeOf<
  typeof TrainingLicenseOnAWorkMachineAnswersSchema
>
