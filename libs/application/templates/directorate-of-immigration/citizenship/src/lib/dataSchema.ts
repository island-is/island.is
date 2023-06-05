import { string, z } from 'zod'
import * as kennitala from 'kennitala'

const UserSchemaBase = z.object({
  nationalId: z
    .string()
    .refine(
      (nationalId) =>
        nationalId &&
        nationalId.length !== 0 &&
        kennitala.isValid(nationalId) &&
        (kennitala.isCompany(nationalId) ||
          kennitala.info(nationalId).age >= 18),
    ),
  name: z.string().min(1),
  address: z.string().min(1),
  postalCode: z.string().min(1),
  email: z.string().min(1),
  phone: z.string().min(1),
  citizenship: z.string().min(1),
  dateHomeRegistration: z.string().min(1),
  birthCountry: z.string().min(1),
})

export const UserInformationSchema = z.intersection(
  UserSchemaBase,
  z.object({
    approved: z.boolean().optional(),
  }),
)

const ResidenceConditionSchema = z.object({
  radio: z.string().min(1)
})

export const ParentInformationSchema = z.object({
  nationalId: z
  .string()
  .refine(
    (nationalId) =>
      nationalId &&
      nationalId.length !== 0 &&
      kennitala.isValid(nationalId) &&
      (kennitala.isCompany(nationalId) ||
        kennitala.info(nationalId).age >= 18),
  ),
  name: z.string().min(1),
})

export const CitizenshipSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  userInformation: UserInformationSchema,
  selectedChildren: z.array(z.string()).optional(),
  residenceCondition: ResidenceConditionSchema,
  parents: z.array(z.string()).optional(),
  spouse: z.string().min(1)
})

export type Citizenship = z.TypeOf<typeof CitizenshipSchema>