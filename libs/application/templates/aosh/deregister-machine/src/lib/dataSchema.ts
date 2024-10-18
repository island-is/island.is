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
  deregister: z.object({
    date: z.string(),
    status: z.enum(['Temporary', 'Permanent']),
    fateOfMachine: z.string().optional(),
  }),

  approveExternalData: z.boolean().refine((v) => v),
})

export type MachineAnswers = z.TypeOf<typeof MachineAnswersSchema>
