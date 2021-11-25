import * as z from 'zod'
import { m } from './messages'

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
})

export const GeneralPetitionSchema = z.object({
  approveTermsAndConditions: z
    .boolean()
    .refine(
      (v) => v,
      m.validationMessages.approveTerms.defaultMessage as string,
    ),
  documents: z.array(FileSchema).optional(),
  listName: z
    .string()
    .refine(
      (p) => p.trim().length > 0,
      m.validationMessages.listName.defaultMessage as string,
    ),
  aboutList: z
    .string()
    .refine(
      (p) => p.trim().length > 0,
      m.validationMessages.aboutList.defaultMessage as string,
    ),
  dateTil: z
    .string()
    .refine(
      (p) => p.trim().length > 0,
      m.validationMessages.date.defaultMessage as string,
    ),
  dateFrom: z
    .string()
    .refine(
      (p) => p.trim().length > 0,
      m.validationMessages.date.defaultMessage as string,
    ),
})

export type File = z.TypeOf<typeof FileSchema>
export type GeneralPetition = z.TypeOf<typeof GeneralPetitionSchema>
