import { z } from 'zod'
import { error } from './messages'
import { AnswerOption } from './types'

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})
export const dataSchema = z.object({
  approveExternalData: z.string().refine((v) => v === AnswerOption.YES, {
    params: error.dataGathering,
  }),
  case: z.object({
    department: z.string(),
    category: z.string(),
    // subCategory: z.string().optional(),
    title: z.string(),
    template: z.string().optional(),
    documentContents: z.string(),
    signatureType: z.string(),
    signatureContents: z.string(),
    // signatureDate: z.string(),
    // ministry: z.string(),
    // preferedPublicationDate: z.string(),
    // fastTrack: z.boolean(),
  }),
  additionsAndDocuments: z.object({
    files: z.array(FileSchema),
    fileNames: z.enum(['additions', 'documents']),
  }),
  publishingPreferences: z.object({
    date: z.string(),
    fastTrack: z.enum([AnswerOption.YES, AnswerOption.NO]).refine((v) => v),
    communicationChannels: z.array(
      z.object({
        email: z.string(),
        phone: z.string(),
      }),
    ),
    message: z.string(),
  }),
})

export type answerSchemas = z.infer<typeof dataSchema>
