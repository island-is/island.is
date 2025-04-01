import { z } from 'zod'
import * as kennitala from 'kennitala'
import { isValidEmail, isValidPhoneNumber } from '../utils'
import { YES } from '@island.is/application/core'

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
  licenseCategoryPrefix: z.string().optional(),
  unknownMachineType: z.boolean().optional(),
  unknownPracticalRight: z.boolean().optional(),
  alreadyHaveTrainingLicense: z.boolean().optional(),
  wrongPracticalRight: z.boolean().optional(),
  wrongPracticalRightWithInfo: z.boolean().optional(),
  listOfPossiblePracticalRights: z.array(z.string()).optional(),
})

const AssigneeInformationSchema = z
  .object({
    company: z.object({
      nationalId: z.string().optional(),
      name: z.string().optional(),
    }),
    assignee: z.object({
      nationalId: z.string().optional(),
      name: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
    }),
    isContractor: z.array(z.string().optional()),
  })
  .refine(
    ({ company, isContractor }) => {
      if (isContractor.includes(YES)) return true
      return company.nationalId && kennitala.isCompany(company.nationalId)
    },
    {
      path: ['company', 'nationalId'],
    },
  )
  .refine(
    ({ company, isContractor }) => {
      if (isContractor.includes(YES)) return true
      return company.name && company.name.length > 0
    },
    {
      path: ['company', 'name'],
    },
  )
  .refine(
    ({ assignee, isContractor }) => {
      if (isContractor.includes(YES)) return true
      return assignee.nationalId && kennitala.isPerson(assignee.nationalId)
    },
    {
      path: ['assignee', 'nationalId'],
    },
  )
  .refine(
    ({ assignee, isContractor }) => {
      if (isContractor.includes(YES)) return true
      return assignee.name && assignee.name.length > 0
    },
    {
      path: ['assignee', 'name'],
    },
  )
  .refine(
    ({ assignee, isContractor }) => {
      if (isContractor.includes(YES)) return true
      return assignee.email && isValidEmail(assignee.email)
    },
    {
      path: ['assignee', 'email'],
    },
  )
  .refine(
    ({ assignee, isContractor }) => {
      if (isContractor.includes(YES)) return true
      return assignee.phone && isValidPhoneNumber(assignee.phone)
    },
    {
      path: ['assignee', 'phone'],
    },
  )

export const TrainingLicenseOnAWorkMachineAnswersSchema = z.object({
  information: InformationSchema,
  certificateOfTenure: z.array(CertificateOfTenureSchema),
  assigneeInformation: AssigneeInformationSchema,
  rejected: z.boolean().optional(),
})

export type TrainingLicenseOnAWorkMachineAnswers = z.TypeOf<
  typeof TrainingLicenseOnAWorkMachineAnswersSchema
>
