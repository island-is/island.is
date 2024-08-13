import { NO, YES } from '@island.is/application/types'
import { z } from 'zod'
import { NEW, USED } from '../shared/types'

const PersonInformationSchema = z.object({
  name: z.string().min(1),
  nationalId: z.string().min(1),
  address: z.string().min(1),
  postCode: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().min(1),
})

const BasicInformationSchema = z.object({
  productionCountry: z.string().min(1),
  productionYear: z.string().min(1),
  productionNumber: z.string().min(1),
  markedCE: z.enum([YES, NO]).refine((v) => v.length > 0),
  preRegistration: z.enum([YES, NO]).refine((v) => v.length > 0),
  isUsed: z.enum([NEW, USED]).refine((v) => v.length > 0),
  location: z.string().min(1),
  cargoFileNumber: z.string().min(1),
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
        registerToTraffic: z.enum([YES, NO]).refine((v) => v.length > 0),
        size: z.enum(['1', '2', '3']),
      })
      .optional(),
  }),
  techInfo: z.array(
    z.object({
      value: z.string().optional(),
      variableName: z.string().optional(),
    }),
  ),
})

export type NewMachineAnswers = z.TypeOf<typeof NewMachineAnswersSchema>
export type PersonInformation = z.TypeOf<typeof PersonInformationSchema>
export type BasicInformation = z.TypeOf<typeof BasicInformationSchema>
export type AboutMachine = z.TypeOf<typeof AboutMachineSchema>
