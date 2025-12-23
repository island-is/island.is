import { z } from 'zod'
import * as kennitala from 'kennitala'
import { isValidPhoneNumber } from '../utils/isValidPhoneNumber'
import { YesOrNoEnum } from '@island.is/application/core'

const nationalIdWithNameSchema = z.object({
  nationalId: z
    .string()
    .refine(
      (nationalId) =>
        nationalId && nationalId.length !== 0 && kennitala.isValid(nationalId),
    ),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z
    .string()
    .min(1)
    .refine((v) => isValidPhoneNumber(v)),
})

const participantSchema = z.object({
  nationalIdWithName: nationalIdWithNameSchema,
})

export const dataSchema = z.object({
  userIsPayingAsIndividual: z.nativeEnum(YesOrNoEnum).default(YesOrNoEnum.YES),
  participantList: z.array(participantSchema).min(1),
  courseSelect: z.string().min(1),
  dateSelect: z.string().min(1),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
