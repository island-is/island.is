import { ZodError, ZodIssue, ZodOptional, ZodString, z } from 'zod'
import * as kennitala from 'kennitala'
import { Supervisor } from '../shared'

interface SupervisorData {
  nationalId: string
  name: string
  email: string
  phone: string
  isOwner: string[]
}

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

export const OperatorSchema = z.intersection(
  RemovableUserSchemaBase,
  z.object({
    approved: z.boolean().optional(),
  }),
)

export const RejecterSchema = z.object({
  regNumber: z.string(),
  name: z.string(),
  nationalId: z.string(),
  type: z.enum(['buyer']),
})
function createZodIssue(path: string[], message: string): ZodIssue {
  return {
    path,
    message,
    code: 'custom',
  }
}

export const MachineAnswersSchema = z.object({
  machine: z.object({
    id: z.string().optional(),
    date: z.string().optional(),
    type: z.string().optional(),
    plate: z.string().optional(),
    subType: z.string().optional(),
    category: z.string().optional(),
    regNumber: z.string().optional(),
    ownerNumber: z.string().optional(),
  }),
  pickMachine: z.object({
    index: z.string().optional(),
    id: z.string().min(1),
  }),
  supervisor: z
    .object({
      nationalId: z
        .string()
        .optional()
        .refine(
          (nationalId) =>
            (nationalId &&
              kennitala.isValid(nationalId) &&
              (kennitala.isCompany(nationalId) ||
                kennitala.info(nationalId).age >= 18)) ||
            nationalId === '',
        ),
      name: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
      isOwner: z.array(z.string()),
    })
    .refine((data) => {
      const { isOwner, ...rest } = data

      if (isOwner[0] !== 'ownerIsSupervisor') {
        if (rest.nationalId === '')
          throw new ZodError([
            createZodIssue(['nationalId'], 'Kennitala þarf að vera fyllt út'),
          ])
        if (rest.name === '')
          throw new ZodError([
            createZodIssue(['name'], 'Nafn þarf að vera fyllt út'),
          ])
        if (rest.email === '')
          throw new ZodError([
            createZodIssue(['email'], 'Netfang þarf að vera fyllt út'),
          ])
        if (rest?.phone === '' || rest.phone?.length !== 11)
          throw new ZodError([
            createZodIssue(
              ['phone'],
              `Símanúmer þarf að vera fyllt út ${rest?.phone}`,
            ),
          ])
      }

      return true
    }),
  approveExternalData: z.boolean(),
  location: z
    .object({
      address: z.string().optional(),
      postalCode: z
        .string()
        .optional()
        .refine(
          (data): data is string =>
            typeof data === 'string' &&
            !isNaN(Number(data)) &&
            (data.length === 3 || data.length === 0),
        ),
      moreInfo: z.string().optional(),
    })
    .optional(),
})

export type MachineAnswers = z.TypeOf<typeof MachineAnswersSchema>
