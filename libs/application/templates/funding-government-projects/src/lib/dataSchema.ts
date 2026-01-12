import { z } from 'zod'
import { error } from './messages'
import { EMAIL_REGEX } from '@island.is/application/core'

const isValidEmail = (value: string) => EMAIL_REGEX.test(value)

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

export const FundingGovernmentProjectsSchema = z.object({
  organizationOrInstitutionName: z
    .string()
    .nonempty(error.general.nameError.defaultMessage),
  contacts: z.array(
    z.object({
      name: z.string().nonempty(error.general.nameError.defaultMessage),
      phoneNumber: z.string().refine((v) => v && v.length >= 7, {
        params: error.general.invalidPhoneNumber,
      }),
      email: z.string().refine((v) => isValidEmail(v), {
        params: error.general.invalidEmail,
      }),
    }),
  ),
  project: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    cost: z.string().min(1),
    refundableYears: z.number(),
    attachments: z.array(FileSchema).nonempty(),
  }),
})

export type FundingGovernmentProjects = z.TypeOf<
  typeof FundingGovernmentProjectsSchema
>
