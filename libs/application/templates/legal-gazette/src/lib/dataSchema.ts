import { z } from 'zod'
import { m } from './messages'
import { YesOrNoEnum } from '@island.is/application/core'

export const legalGazetteDataSchema = z.object({
  application: z.object({
    typeId: z.string().refine((val) => val && val.length > 0, {
      params: m.errors.emptyType,
    }),
    categoryId: z.string().refine((val) => val && val.length > 0, {
      params: m.errors.emptyCategory,
    }),
    caption: z.string().refine((val) => val.length > 0, {
      params: m.errors.emptyString,
    }),
    html: z.string().refine((val) => val.length > 0, {
      params: m.errors.emptyHtml,
    }),
  }),
  signature: z
    .object({
      location: z.string().optional(),
      date: z.string().optional(),
      name: z.string().optional(),
      onBehalfOf: z.string().optional(),
    })
    .refine(({ name, date, location }) => Boolean(name || date || location), {
      params: m.errors.emptySignature,
      path: ['name'],
    }),
  publishing: z
    .object({
      withSpecificDates: z.nativeEnum(YesOrNoEnum),
      dates: z.array(z.object({ date: z.string().optional() })),
    })
    .refine(
      (val) => {
        if (val.withSpecificDates === YesOrNoEnum.YES) {
          return val.dates.length > 0 && val.dates.every((d) => d.date)
        }

        return true
      },
      {
        path: ['dates', '0', 'date'],
        params: m.errors.emptyPublishingDates,
      },
    ),
  communication: z.object({
    channels: z
      .array(
        z.object({
          email: z.string().email(),
          phone: z.string().optional(),
        }),
      )
      .refine((val) => val.length > 0, {
        params: m.errors.emptyChannel,
      }),
  }),
})
