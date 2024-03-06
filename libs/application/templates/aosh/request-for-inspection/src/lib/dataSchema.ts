import { z } from 'zod'

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
  approveExternalData: z.boolean(),
  location: z.object({
    address: z.string(),
    postalCode: z
      .string()
      .refine(
        (data): data is string =>
          typeof data === 'string' &&
          !isNaN(Number(data)) &&
          (data.length === 3 || data.length === 0),
      ),
    comment: z.string(),
  }),
  contactInformation: z.object({
    name: z.string(),
    phoneNumber: z.string(),
    email: z.string(),
  }),
})

export type MachineAnswers = z.TypeOf<typeof MachineAnswersSchema>
