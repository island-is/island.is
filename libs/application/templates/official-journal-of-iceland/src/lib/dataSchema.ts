import { z } from 'zod'
import { error } from './messages'
import { AnswerOption, InputFields } from './types'
import {
  Ministries,
  REGLUGERDIR_ID,
  UNDIRSKRIFT_RADHERRA_ID,
} from './constants'

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
      path: [InputFields.prerequisites.approveExternalData.split('.')[1]],
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
      signatureContents: z.string().refine((v) => v && v.length > 0, {
        params: error.emptyFieldError,
      }),
      signatureDate: z.string().optional(), // only if singatureType is ministry
      signatureMinistry: z.string().optional(), // only if singatureType is ministry
    })
    .superRefine((caseSchema, ctx) => {
      if (caseSchema.category === REGLUGERDIR_ID) {
        if (!caseSchema.subCategory) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            params: error.emptyFieldError,
            path: [InputFields.case.subCategory.split('.')[1]],
          })
        }
      }

      if (caseSchema.signatureType === UNDIRSKRIFT_RADHERRA_ID) {
        if (!caseSchema.signatureDate?.length) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            params: error.emptyFieldError,
            path: [InputFields.case.signatureDate.split('.')[1]],
          })
        }

        if (!caseSchema.signatureMinistry) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            params: error.emptyFieldError,
            path: [InputFields.case.signatureMinistry.split('.')[1]],
          })
        }

        if (
          !caseSchema.signatureMinistry ||
          !Ministries.includes(caseSchema.signatureMinistry)
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            params: error.invalidMinsitry,
            path: [InputFields.case.signatureMinistry.split('.')[1]],
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
          path: [InputFields.publishingPreferences.date.split('.')[1]],
        })
      }
    }),
})

export type answerSchemas = z.infer<typeof dataSchema>
