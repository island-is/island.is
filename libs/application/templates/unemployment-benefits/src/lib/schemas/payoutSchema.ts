import { YES, YesOrNoEnum } from '@island.is/application/core'
import { z } from 'zod'

export const payoutSchema = z
  .object({
    bankAccount: z.object({
      bankNumber: z.string().min(1),
      ledger: z.string().min(1),
      accountNumber: z.string().min(1),
    }),
    payToUnion: z
      .nativeEnum(YesOrNoEnum)
      .refine((v) => Object.values(YesOrNoEnum).includes(v)),
    union: z
      .preprocess((val) => {
        if (!val) {
          return ''
        }
        return val
      }, z.string())
      .optional(),
    pensionFund: z.string().min(1),
    payPrivatePensionFund: z
      .nativeEnum(YesOrNoEnum)
      .refine((v) => Object.values(YesOrNoEnum).includes(v)),
    privatePensionFund: z
      .preprocess((val) => {
        if (!val) {
          return ''
        }
        return val
      }, z.string())
      .optional(),
    privatePensionFundPercentage: z
      .preprocess((val) => {
        if (!val) {
          return ''
        }
        return val
      }, z.string())
      .optional(),
  })
  .refine(
    ({ payToUnion, union }) => {
      return payToUnion === YES ? !!union : true
    },
    {
      path: ['union'],
    },
  )
  .refine(
    ({ payPrivatePensionFund, privatePensionFund }) => {
      return payPrivatePensionFund === YES ? !!privatePensionFund : true
    },
    {
      path: ['privatePensionFund'],
    },
  )
  .refine(
    ({ payPrivatePensionFund, privatePensionFundPercentage }) => {
      return payPrivatePensionFund === YES
        ? !!privatePensionFundPercentage
        : true
    },
    {
      path: ['privatePensionFundPercentage'],
    },
  )
