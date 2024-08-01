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
  productionCountry: z.string(),
  productionYear: z.string(),
  productionNumber: z.string(),
  markedCE: z.string(),
  preRegistration: z.string(),
  isUsed: z.string(),
  location: z.string(),
  cargoFileNumber: z.string(),
})

const AboutMachineSchema = z.object({
  type: z.string().optional(),
  model: z.string().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  fromService: z.boolean().optional(),
})

export const NewMachineAnswersSchema = z.object({
  approveExternalData: z.boolean(),
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
        type: z.string().optional(),
        model: z.string().optional(),
      })
      .optional(),
    aboutMachine: AboutMachineSchema.optional(),
    basicInformation: BasicInformationSchema.optional(),
    streetRegistration: z
      .object({
        registerToTraffic: z.enum([YES, NO]),
        size: z.enum(['A', 'B', 'D']),
      })
      .optional(),
  }),
})

export type NewMachineAnswers = z.TypeOf<typeof NewMachineAnswersSchema>
export type PersonInformation = z.TypeOf<typeof PersonInformationSchema>
export type BasicInformation = z.TypeOf<typeof BasicInformationSchema>
export type AboutMachine = z.TypeOf<typeof AboutMachineSchema>
