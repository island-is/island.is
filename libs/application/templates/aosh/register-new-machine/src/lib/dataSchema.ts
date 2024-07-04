import { NO, YES } from '@island.is/application/types'
import { z } from 'zod'

const PersonInformationSchema = z.object({
  name: z.string(),
  nationalId: z.string(),
  address: z.string(),
  postCode: z.string(),
  phone: z.string(),
  email: z.string(),
})

export const NewMachineAnswersSchema = z.object({
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
  importerInformation: z.object({
    importer: PersonInformationSchema,
    isOwnerOtherThanImporter: z.enum([YES, NO]),
    owner: PersonInformationSchema.optional(),
  }),
  operatorInformation: z.object({
    operator: PersonInformationSchema.optional(),
    hasOperator: z.enum([YES, NO]),
  }),
  deregister: z.object({
    date: z.string(),
    status: z.enum(['Temporary', 'Permanent']),
    fateOfMachine: z.string().optional(),
  }),

  approveExternalData: z.boolean(),
})

export type NewMachineAnswers = z.TypeOf<typeof NewMachineAnswersSchema>
