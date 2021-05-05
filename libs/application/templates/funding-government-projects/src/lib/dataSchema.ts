import * as z from 'zod'
import { error } from './messages'

const emailRegex = /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i
const isValidEmail = (value: string) => emailRegex.test(value)

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
})

export type FundingGovernmentProjects = z.TypeOf<
  typeof FundingGovernmentProjectsSchema
>
