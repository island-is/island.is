import { z } from 'zod'
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
  residenceInIcelandLastChangeDate: z.string().optional(),
  birthCountry: z.string().optional(),
})

export const UserInformationSchema = z.intersection(
  UserSchemaBase,
  z.object({
    approved: z.boolean().optional(),
  }),
)

export const EnergyFundsSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  userInformation: UserInformationSchema,
  selectVehicle: z.object({
    vehicle: z.string().optional(),
    plate: z.string().min(1),
    color: z.string().optional(),
  }),
})

export type EnergyFunds = z.TypeOf<typeof EnergyFundsSchema>
