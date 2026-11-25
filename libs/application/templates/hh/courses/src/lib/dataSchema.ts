import { z } from 'zod'
import * as kennitala from 'kennitala'
import { isValidPhoneNumber } from '../utils/isValidPhoneNumber'
import { YesOrNoEnum } from '@island.is/application/core'
import { m } from './messages'
import { MAX_PARTICIPANTS_PER_APPLICATION } from '../utils/constants'

const paymentSchema = z
  .object({
    userIsPayingAsIndividual: z
      .nativeEnum(YesOrNoEnum)
      .default(YesOrNoEnum.YES),
    companyPayment: z
      .object({
        nationalId: z.union([z.string().min(1), z.literal(''), z.undefined()]),
        name: z.union([z.string().min(1), z.literal(''), z.undefined()]),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    const { userIsPayingAsIndividual, companyPayment } = data
    if (userIsPayingAsIndividual === YesOrNoEnum.YES) {
      return
    }
    if (
      userIsPayingAsIndividual === YesOrNoEnum.NO &&
      (!companyPayment?.nationalId ||
        !companyPayment?.name ||
        companyPayment.nationalId.length === 0 ||
        companyPayment.name.length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        params: m.payer.payerValidationError,
        path: ['companyPayment', 'nationalId'],
      })
    }
  })

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
  workplace: z.string().optional(),
  jobTitle: z.string().optional(),
})

const userInformationSchema = z.object({
  name: z.string().min(1),
  nationalId: z.string().min(1),
  email: z.string().email(),
  phone: z
    .string()
    .min(1)
    .refine((v) => isValidPhoneNumber(v)),
  healthcenter: z.string().optional(),
})

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  participantList: z
    .array(participantSchema)
    .min(1)
    .max(MAX_PARTICIPANTS_PER_APPLICATION)
    .superRefine((participants, ctx) => {
      const seen = new Set<string>()
      participants.forEach((participant, index) => {
        const nationalId = participant.nationalIdWithName.nationalId
        if (seen.has(nationalId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            params: m.participant.duplicateNationalIdError,
            path: [index, 'nationalIdWithName', 'nationalId'],
          })
        }
        seen.add(nationalId)
      })
    }),
  courseSelect: z.string().min(1),
  dateSelect: z.string().min(1),
  payment: paymentSchema.optional(),
  userInformation: userInformationSchema,
  workplace: z.string().optional(),
  jobTitle: z.string().optional(),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
