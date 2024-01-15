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
  email: z.string().min(1),
  phone: z.string().min(1),
})

const RemovableUserSchemaBase = z
  .object({
    nationalId: z.string().optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    wasRemoved: z.string().optional(),
  })
  .refine(
    ({ nationalId, wasRemoved }) => {
      return (
        wasRemoved === 'true' ||
        (nationalId &&
          nationalId.length !== 0 &&
          kennitala.isValid(nationalId) &&
          (kennitala.isCompany(nationalId) ||
            kennitala.info(nationalId).age >= 18))
      )
    },
    { path: ['nationalId'] },
  )
  .refine(
    ({ name, wasRemoved }) => {
      return wasRemoved === 'true' || (name && name.length > 0)
    },
    { path: ['name'] },
  )
  .refine(
    ({ email, wasRemoved }) => {
      return wasRemoved === 'true' || (email && email.length > 0)
    },
    { path: ['email'] },
  )
  .refine(
    ({ phone, wasRemoved }) => {
      return wasRemoved === 'true' || (phone && phone.length > 0)
    },
    { path: ['phone'] },
  )

export const UserInformationSchema = z.intersection(
  UserSchemaBase,
  z.object({
    approved: z.boolean().optional(),
  }),
)

export const CoOwnerAndOperatorSchema = z.intersection(
  RemovableUserSchemaBase,
  z.object({
    approved: z.boolean().optional(),
    type: z.enum(['operator', 'coOwner']),
  }),
)

export const RejecterSchema = z.object({
  plate: z.string(),
  name: z.string(),
  nationalId: z.string(),
  type: z.enum(['buyer', 'buyerCoOwner', 'sellerCoOwner', 'operator']),
})

export const TransferOfVehicleOwnershipSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  findVehicle: z.object({
    plate: z.string().refine((v) => v.length === 5),
  }),
  pickVehicle: z.object({
    vehicle: z.string().optional(),
    plate: z.string().min(1),
    color: z.string().optional(),
    type: z.string().min(1),
  }),
  vehicle: z.object({
    salePrice: z
      .string()
      .optional()
      .refine(
        (p) => p === undefined || p === '' || parseInt(p?.split(' ')[0]) >= 0,
      ),
    date: z.string().min(1),
  }),
  vehicleMileage: z
    .object({
      isRequired: z.boolean().optional(),
      value: z.string().optional(),
    })
    .refine(
      (x) => {
        if (x.isRequired) {
          return (
            x.value !== undefined &&
            x.value !== '' &&
            parseInt(x.value?.split(' ')[0]) > 0
          )
        } else {
          return (
            x.value === undefined ||
            x.value === '' ||
            parseInt(x.value?.split(' ')[0]) >= 0
          )
        }
      },
      {
        path: ['value'],
      },
    ),
  seller: UserInformationSchema,
  sellerCoOwner: z.array(UserInformationSchema),
  buyer: UserInformationSchema,
  buyerCoOwnerAndOperator: z.array(CoOwnerAndOperatorSchema).optional(),
  buyerMainOperator: z.object({
    nationalId: z.string(),
  }),
  insurance: z.object({
    value: z.string(),
    name: z.string(),
  }),
  rejecter: RejecterSchema,
})

export type TransferOfVehicleOwnership = z.TypeOf<
  typeof TransferOfVehicleOwnershipSchema
>
