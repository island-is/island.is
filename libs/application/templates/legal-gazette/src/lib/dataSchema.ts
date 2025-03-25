import { z } from 'zod'
import { m } from './messages'
import { YesOrNoEnum } from '@island.is/application/core'

export const legalGazetteDataSchema = z.object({
  requirements: z.object({
    approval: z
      .array(z.nativeEnum(YesOrNoEnum))
      .refine(
        (value) =>
          value.length === 1 && value.every((v) => v === YesOrNoEnum.YES),
        {
          params: m.requirements.approval.checkboxError,
        },
      ),
  }),
  advert: z.object({
    legalEntity: z
      .string()
      .nullable()
      .refine((value) => value && value.length > 0, {
        params: m.requirements.legalEntity.selectError,
      }),
  }),
})
