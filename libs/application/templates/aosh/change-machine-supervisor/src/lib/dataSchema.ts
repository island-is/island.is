import { z } from 'zod'
import * as kennitala from 'kennitala'

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
    .refine(
      ({ nationalId, isOwner }) => {
        return isOwner[0] === 'ownerIsSupervisor' || nationalId !== ''
      },
      { path: ['nationalId'] },
    )
    .refine(
      ({ name, isOwner }) => {
        return isOwner[0] === 'ownerIsSupervisor' || name !== ''
      },
      { path: ['name'] },
    )
    .refine(
      ({ email, isOwner }) => {
        return isOwner[0] === 'ownerIsSupervisor' || email !== ''
      },
      { path: ['email'] },
    )
    .refine(
      ({ phone, isOwner }) => {
        return isOwner[0] === 'ownerIsSupervisor' || phone !== ''
      },
      { path: ['phone'] },
    ),
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
