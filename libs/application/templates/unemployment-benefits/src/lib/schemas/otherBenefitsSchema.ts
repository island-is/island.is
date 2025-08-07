import { z } from 'zod'
import { FileSchema } from './fileSchema'
import { YesOrNoEnum } from '@island.is/application/core'

export const otherBenefitsSchema = z.object({
  receivingBenefits: z
    .nativeEnum(YesOrNoEnum)
    .refine((v) => Object.values(YesOrNoEnum).includes(v)),
  payments: z
    .array(
      z.object({
        typeOfPayment: z
          .preprocess((val) => {
            if (!val) {
              return ''
            }
            return val
          }, z.string())
          .optional(),
        paymentAmount: z.string().optional(),
        payer: z.string().optional(),
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
        file: z.array(FileSchema).optional(),
      }),
    )
    .optional(),
})
