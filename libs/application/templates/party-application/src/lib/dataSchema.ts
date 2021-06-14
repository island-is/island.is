import * as z from 'zod'
import { m } from './messages'

const EndorsementSchema = z.object({
  id: z.string(),
  date: z.string(),
  name: z.string(),
  nationalId: z.string(),
  address: z.string(),
  hasWarning: z.boolean(),
  bulkImported: z.boolean(),
})

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
  selectedEndorsements: z.array(z.string()).optional(), //todo: validate
})

export type SchemaFormValues = z.infer<typeof dataSchema>
export type Endorsement = z.TypeOf<typeof EndorsementSchema>
