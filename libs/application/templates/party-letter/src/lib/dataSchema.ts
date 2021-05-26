import * as z from 'zod'
import { m } from './messages'
import { ACTIVE_PARTIES } from '../fields/PartyLetter'

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
})

const EndorsementSchema = z.object({
  id: z.string(),
  date: z.string(),
  name: z.string(),
  nationalId: z.string(),
  address: z.string(),
  hasWarning: z.boolean(),
})

export const PartyLetterSchema = z.object({
  approveTermsAndConditions: z
    .boolean()
    .refine(
      (v) => v,
      m.validationMessages.approveTerms.defaultMessage as string,
    ),
  ssd: z.string().refine((p) => {
    return p.trim().length > 0
  }, m.validationMessages.ssd.defaultMessage as string),
  partyLetter: z
    .string()
    .refine((p) => {
      return p.trim().length === 1
    }, m.validationMessages.partyLetterSingle.defaultMessage as string)
    .refine((p) => {
      return ACTIVE_PARTIES.filter((x) => p === x.letter).length === 0
    }, m.validationMessages.partyLetterOccupied.defaultMessage as string),
  partyName: z
    .string()
    .refine(
      (p) => p.trim().length > 0,
      m.validationMessages.partyName.defaultMessage as string,
    ),
  includePapers: z.array(z.string()).optional(),
  smu: z.string().optional(),
  endorsements: z.array(EndorsementSchema).optional(), //todo: validate
  endorsementsWithWarning: z.array(EndorsementSchema).optional(),
  email: z
    .string()
    .email(m.validationMessages.emailInvalid.defaultMessage as string),
  documents: z.array(FileSchema).optional(),
})

export type Endorsement = z.TypeOf<typeof EndorsementSchema>
export type File = z.TypeOf<typeof FileSchema>
export type PartyLetter = z.TypeOf<typeof PartyLetterSchema>
