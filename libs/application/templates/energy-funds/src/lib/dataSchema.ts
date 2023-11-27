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
})

export const EnergyFundsSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  userInformation: UserSchemaBase,
  selectVehicle: z.object({
    plate: z.string().min(1),
    vin: z.string().min(1),
  }),
  vehicleDetails: z.object({
    price: z
      .string()
      .min(1)
      .refine((x) => {
        return parseInt(x) <= 10000000
      }),
    firstRegistrationDate: z.string().min(1),
    // newRegistrationDate: z.string().min(1) // TODO: ætti þetta ekki að vera?
  }),
  grant: z.object({
    bankNumber: z.string().min(1),
  }),
})

export type EnergyFunds = z.TypeOf<typeof EnergyFundsSchema>
