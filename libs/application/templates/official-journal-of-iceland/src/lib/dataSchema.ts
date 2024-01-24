import { z } from 'zod'
import { error } from './messages'
import { AnswerOption, InputFields } from './types'
import { REGLUGERDIR_ID } from './constants'

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})
export const dataSchema = z.object({
  prerequisites: z
    .object({
      approveExternalData: z.string(),
    })
    .refine((schema) => schema.approveExternalData === AnswerOption.YES, {
      params: error.dataGathering,
      path: InputFields.prerequisites.approveExternalData.split('.').slice(1),
    }),
  case: z
    .object({
      department: z.string().refine((v) => v && v.length > 0, {
        params: error.emptyFieldError,
      }),
      category: z.string().refine((v) => v && v.length > 0, {
        params: error.emptyFieldError,
      }),
      subCategory: z.string().optional(),
      title: z.string().refine((v) => v && v.length > 0, {
        params: error.emptyFieldError,
      }),
      template: z.string().refine((v) => v && v.length > 0, {
        params: error.emptyFieldError,
      }),
      documentContents: z.string().refine((v) => v && v.length > 0, {
        params: error.emptyFieldError,
      }),
      signatureType: z.string().refine((v) => v && v.length > 0, {
        params: error.emptyFieldError,
      }),
      signatureContent: z.string().optional(),
      signature: z.object({
        regular: z.array(
          z.object({
            institution: z.string(),
            date: z.string(),
            members: z.array(
              z.object({
                textAbove: z.string().optional(),
                name: z.string(),
                textBelow: z.string().optional(),
                textAfter: z.string().optional(),
              }),
            ),
          }),
        ),
        committee: z.object({
          institution: z.string(),
          date: z.string(),
          chairman: z.object({
            textAbove: z.string().optional(),
            name: z.string(),
            textBelow: z.string().optional(),
            textAfter: z.string().optional(),
          }),
          members: z.object({
            name: z.string(),
            textBelow: z.string().optional(),
          }),
        }),
        additionalSignature: z.string().optional(),
      }),
    })
    .superRefine((caseSchema, ctx) => {
      if (caseSchema.category === REGLUGERDIR_ID) {
        if (!caseSchema.subCategory) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            params: error.emptyFieldError,
            path: InputFields.case.subCategory.split('.').slice(1),
          })
        }
      }
    }),
  additionsAndDocuments: z.object({
    files: z.array(FileSchema),
    fileNames: z.enum(['additions', 'documents']),
  }),
  publishingPreferences: z
    .object({
      date: z.string(),
      fastTrack: z.enum([AnswerOption.YES, AnswerOption.NO]),
      communicationChannels: z.array(
        z.object({
          email: z.string(),
          phone: z.string(),
        }),
      ),
      message: z.string().optional(),
    })
    .superRefine((schema, ctx) => {
      if (!schema.date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: error.emptyFieldError,
          path: InputFields.publishingPreferences.date.split('.').slice(1),
        })
      }
    }),
})

export type answerSchemas = z.infer<typeof dataSchema>
