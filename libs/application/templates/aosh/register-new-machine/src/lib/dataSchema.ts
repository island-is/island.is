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

const BasicInformationSchema = z.object({
  type: z.string(),
  model: z.string(),
  category: z.string(),
  subcategory: z.string(),
  productionCountry: z.string(),
  productionYear: z.string(),
  productionNumber: z.string(),
  markedCE: z.string(),
  preRegistration: z.string(),
  isUsed: z.string(),
  location: z.string(),
  cargoFileNumber: z.string(),
})

export const NewMachineAnswersSchema = z.object({
  importerInformation: z.object({
    importer: PersonInformationSchema,
    isOwnerOtherThanImporter: z.enum([YES, NO]),
    owner: PersonInformationSchema.optional(),
  }),
  operatorInformation: z.object({
    operator: PersonInformationSchema.optional(),
    hasOperator: z.enum([YES, NO]),
  }),
  machine: z.object({
    machineType: z
      .object({
        type: z.string(),
        model: z.string(),
      })
      .optional(),
    basicInformation: BasicInformationSchema.optional(),
    streetRegistration: z
      .object({
        shouldApply: z.enum([YES, NO]),
        size: z.enum(['A', 'B', 'D']),
      })
      .optional(),
  }),

  approveExternalData: z.boolean(),
})

export type NewMachineAnswers = z.TypeOf<typeof NewMachineAnswersSchema>
export type PersonInformation = z.TypeOf<typeof PersonInformationSchema>
export type BasicInformation = z.TypeOf<typeof BasicInformationSchema>
