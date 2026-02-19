import { z } from 'zod'
import * as kennitala from 'kennitala'
import { isValidPhoneNumber } from '../utils/isValidPhoneNumber'
import { YesOrNoEnum } from '@island.is/application/core'
import { m } from './messages'
import { COURSE_HAS_CHARGE_ITEM_CODE } from '../utils/constants'

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
  participantList: z.array(participantSchema).min(1),
  courseSelect: z.string().min(1),
  dateSelect: z.string().min(1),
  [COURSE_HAS_CHARGE_ITEM_CODE]: z.boolean().optional(),
  payment: paymentSchema.optional(),
  userInformation: userInformationSchema,
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
