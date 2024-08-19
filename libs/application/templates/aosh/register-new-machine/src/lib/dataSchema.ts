import { NO, YES } from '@island.is/application/types'
import { z } from 'zod'
import { NEW, USED } from '../shared/types'
import * as kennitala from 'kennitala'

const PersonInformationSchema = z.object({
  name: z.string().min(1),
  nationalId: z
    .string()
    .refine((nationalId) => nationalId && kennitala.isValid(nationalId)),
  address: z.string().min(1),
  postCode: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().min(1),
})

const BasicInformationSchema = z.object({
  productionCountry: z.string().min(1),
  productionYear: z.string().min(1),
  productionNumber: z.string().min(1),
  markedCE: z.enum([YES, NO]),
  preRegistration: z.enum([YES, NO]).refine((v) => v.length > 0),
  isUsed: z.enum([NEW, USED]),
  location: z.string().min(1),
  cargoFileNumber: z.string().min(1),
})

const AboutMachineSchema = z.object({
  type: z.string().optional(),
  model: z.string().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  registrationNumberPrefix: z.string().optional(),
  fromService: z.boolean().optional(),
})

const TechInfoSchema = z.object({
  value: z.string().optional(),
  variableName: z.string().optional(),
  label: z.string().optional(),
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
        size: z.enum(['1', '2', '3']),
      })
      .optional(),
  }),
  techInfo: z.array(TechInfoSchema),
})

export type NewMachineAnswers = z.TypeOf<typeof NewMachineAnswersSchema>
export type PersonInformation = z.TypeOf<typeof PersonInformationSchema>
export type BasicInformation = z.TypeOf<typeof BasicInformationSchema>
export type AboutMachine = z.TypeOf<typeof AboutMachineSchema>
export type TechInfo = z.TypeOf<typeof TechInfoSchema>
