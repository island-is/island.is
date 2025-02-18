import { z } from 'zod'
import { m } from './messages'
import * as nationalId from 'kennitala'

const nationalIdAndName = z.object({
  name: z.string(),
  nationalId: z.string().refine((v) => nationalId.isPerson(v), {
    params: m.nationalIdValidationError,
  }),
})

export const dataSchema = z.object({
  /* Gagnaöflun */
  approveExternalData: z.boolean().refine((v) => v),

  /* Upplýsingar */
  applicant: z.object({
    name: z.string(),
    nationalId: z.string(),
    phone: z.string().min(11),
    email: z.string().email(),
  }),
  collection: z.object({
    dateFrom: z.string(),
    dateTil: z.string(),
  }),
  list: z.object({
    name: z.string(),
    nationalId: z.string(),
    letter: z.string(),
  }),

  /* Kjördæmi */
  constituency: z.array(z.string()).refine((arr) => arr.length >= 1, {
    params: m.constituencyValidationError,
  }),
})

export type ParliamentaryCreateListSchema = z.TypeOf<typeof dataSchema>
