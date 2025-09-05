import { z } from 'zod'

export const plateDeliverySchema = z.object({
  type: z.enum(['CurrentAddress', 'OtherAddress']),
})

const otherAddressSchema = z.object({
  address: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  recipient: z.string().optional(),
})

export const MachineAnswersSchema = z.object({
  machine: z
    .object({
      id: z.string().optional(),
      date: z.string().optional(),
      type: z.string().optional(),
      plate: z.string().optional(),
      subType: z.string().optional(),
      category: z.string().optional(),
      regNumber: z.string().optional(),
      ownerNumber: z.string().optional(),
      findVehicle: z.boolean().optional(),
      isValid: z.boolean().optional(),
    })
    .refine(({ isValid, findVehicle }) => {
      return (findVehicle && isValid) || !findVehicle
    })
    .refine((obj) => Object.keys(obj).length > 0),
  contact: z.object({
    name: z.string().min(1),
    email: z.string().email().min(1),
    phone: z.string(),
  }),
  licencePlate: z.object({
    size: z.enum(['A', 'B', 'D']),
  }),
  plateDelivery: plateDeliverySchema
    .merge(otherAddressSchema)
    .refine(
      ({ address, type }) => {
        return type !== 'OtherAddress' || address !== ''
      },
      { path: ['address'] },
    )
    .refine(
      ({ postalCode, type }) => {
        return type !== 'OtherAddress' || postalCode !== ''
      },
      { path: ['postalCode'] },
    )
    .refine(
      ({ city, type }) => {
        return type !== 'OtherAddress' || city !== ''
      },
      { path: ['city'] },
    )
    .refine(
      ({ recipient, type }) => {
        return type !== 'OtherAddress' || recipient !== ''
      },
      { path: ['recipient'] },
    ),
  approveExternalData: z.boolean().refine((v) => v),
})

export type MachineAnswers = z.TypeOf<typeof MachineAnswersSchema>
