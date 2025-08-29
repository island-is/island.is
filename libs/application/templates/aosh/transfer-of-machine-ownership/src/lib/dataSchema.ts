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
  phone: z
    .string()
    .min(1)
    .refine((phone) => {
      const countryCodeIS = phone.startsWith('+354')
      return countryCodeIS ? phone.length === 11 : true
    }),
})

const RemovableUserSchemaBase = z
  .object({
    nationalId: z.string().optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z
      .string()
      .optional()
      .refine((phone) => {
        const countryCodeIS = phone?.startsWith('+354')
        return countryCodeIS && phone ? phone?.length === 11 : true
      }),
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

export const OperatorSchema = RemovableUserSchemaBase

export const RejecterSchema = z.object({
  regNumber: z.string(),
  name: z.string(),
  nationalId: z.string(),
  type: z.enum(['buyer']),
})

export const MachineAnswersSchema = z.object({
  buyer: UserInformationSchema,
  seller: UserInformationSchema,
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
      paymentRequiredForOwnerChange: z.boolean().optional(),
      findVehicle: z.boolean().optional(),
      isValid: z.boolean().optional(),
    })
    .refine(({ isValid, findVehicle }) => {
      return (findVehicle && isValid) || !findVehicle
    }),
  location: z.object({
    address: z.string(),
    postCode: z.number().optional(),
    moreInfo: z.string(),
  }),
  buyerOperator: OperatorSchema,
  approveExternalData: z.boolean().refine((v) => v),
  rejecter: RejecterSchema,
})

export type MachineAnswers = z.TypeOf<typeof MachineAnswersSchema>
