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
  responsiblePersonName: z.string().nonempty(),
  responsiblePersonEmail: z.string().nonempty(),
  partyLetter: z.string().nonempty(),
  partyName: z.string().nonempty(),
  reasonForReject: z.string().optional(),
  endorsements: z.array(z.string()), // todo validate
})
export type SchemaFormValues = z.infer<typeof dataSchema>
