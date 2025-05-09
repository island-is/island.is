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
  application: z.object({
    caption: z.string().refine((val) => val.length > 0, {
      params: m.errors.emptyString,
    }),
    html: z.string().refine((val) => val.length > 0, {
      params: m.errors.emptyHtml,
    }),
  }),
  publication: z.object({
    date: z.string().refine((val) => {
      try {
        const now = new Date()
        const date = new Date(val)

        if (
          date.getTime() < now.getTime() ||
          date.getTime() > now.setFullYear(now.getFullYear() + 1)
        ) {
          return false
        }
        return true
      } catch (e) {
        return false
      }
    }),
  }),
})
