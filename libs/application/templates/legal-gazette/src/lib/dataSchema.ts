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
  signature: z.object({
    location: z.string().refine((val) => val.length > 0, {
      params: m.errors.emptyLocation,
    }),
    date: z.string().refine((val) => val && val.length > 0, {
      params: m.errors.emptySignatureDate,
    }),
    name: z.string().refine((val) => val.length > 0, {
      params: m.errors.emptySignatureName,
    }),
  }),
  publishing: z.object({
    dates: z.array(z.object({ date: z.string() })),
  }),
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
