import { z } from 'zod'
import * as kennitala from 'kennitala'
import { VehicleMileage } from '../shared'
import { error } from './messages'
import { isValidMobileNumber } from '../utils'

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
  phone: z
    .string()
    .min(1)
    .refine((phone) => isValidMobileNumber(phone)),
})

const RemovableUserSchemaBase = z
  .object({
    nationalId: z.string().optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    wasRemoved: z.string().optional(),
    needsAgeValidation: z.boolean().optional(),
  })
  .refine(
    ({ nationalId, wasRemoved, needsAgeValidation }) => {
      return (
        wasRemoved === 'true' ||
        (nationalId &&
          nationalId.length !== 0 &&
          kennitala.isValid(nationalId) &&
          (kennitala.isCompany(nationalId) ||
            (needsAgeValidation ? kennitala.info(nationalId).age >= 18 : true)))
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
      requireMileage: z.boolean().optional(),
      mileageReading: z.string().optional(),
      value: z.string().optional(),
    })
    .refine(
      (x: VehicleMileage) => {
        if (x.requireMileage) {
          return (
            (x.value !== undefined &&
              x.value !== '' &&
              parseInt(x.value?.split(' ')[0]) > 0 &&
              x.mileageReading === undefined) ||
            Number(x.value) >= Number(x.mileageReading)
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
        message: error.invalidMileage.defaultMessage,
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
