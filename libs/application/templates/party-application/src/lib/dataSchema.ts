import * as z from 'zod'
import { m } from './messages'

export const dataSchema = z.object({
  constituency: z
    .string()
    .refine((v) => v, m.validation.selectConstituency.defaultMessage as string),
  approveDisclaimer: z.boolean().refine((v) => v, {
    message: m.validation.approveTerms.defaultMessage as string,
  }),
  supremeCourtContact: z.string().nonempty(),
})
export type SchemaFormValues = z.infer<typeof dataSchema>
