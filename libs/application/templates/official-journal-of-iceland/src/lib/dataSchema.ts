import { z } from 'zod'
import { error } from './messages'
import { AnswerOption, InputFields } from './types'
import { INSTITUTION_INDEX, MEMBER_INDEX, REGLUGERDIR_ID } from './constants'

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
      template: z.string().optional(),
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
            members: z
              .array(
                z.object({
                  textAbove: z.string().optional(),
                  name: z.string(),
                  textBelow: z.string().optional(),
                  textAfter: z.string().optional(),
                }),
              )
              .optional(),
          }),
        ),
        committee: z.object({
          institution: z.string(),
          date: z.string().optional(),
          chairman: z.object({
            textAbove: z.string().optional(),
            name: z.string(),
            textBelow: z.string().optional(),
            textAfter: z.string().optional(),
          }),
          members: z
            .array(
              z.object({
                name: z.string(),
                textBelow: z.string().optional(),
              }),
            )
            .optional(),
        }),
        additionalSignature: z.string().optional(),
      }),
    })
    .superRefine((caseSchema, ctx) => {
      if (caseSchema.signatureType === 'regular') {
        // required fields are institution and members name
        caseSchema.signature.regular?.forEach((signature, institutionIndex) => {
          if (!signature.institution) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              params: error.emptyFieldError,
              path: InputFields.case.signature.regular.institution
                .replace(INSTITUTION_INDEX, `${institutionIndex}`)
                .split('.')
                .slice(1),
            })
          }

          signature.members?.forEach((member, memberIndex) => {
            if (!member.name) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                params: error.emptyFieldError,
                path: InputFields.case.signature.regular.members.name
                  .replace(INSTITUTION_INDEX, `${institutionIndex}`)
                  .replace(MEMBER_INDEX, `${memberIndex}`)
                  .split('.')
                  .slice(1),
              })
            }
          })
        })
      } else {
        // required fields are institution and chairman name and members name
        if (!caseSchema.signature.committee.institution) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            params: error.emptyFieldError,
            path: InputFields.case.signature.committee.institution
              .split('.')
              .slice(1),
          })

          // check name of members
          caseSchema.signature.committee.members?.forEach((member, index) => {
            console.log('member', member)
            if (!member.name) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                params: error.emptyFieldError,
                path: InputFields.case.signature.committee.members.name
                  .replace(MEMBER_INDEX, `${index}`)
                  .split('.')
                  .slice(1),
              })
            }
          })
        }

        if (!caseSchema.signature.committee.chairman.name) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            params: error.emptyFieldError,
            path: InputFields.case.signature.committee.chairman.name
              .split('.')
              .slice(1),
          })
        }

        caseSchema.signature.committee.members?.forEach((member, index) => {
          if (!member.name) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              params: error.emptyFieldError,
              path: InputFields.case.signature.committee.members.name
                .replace(MEMBER_INDEX, `${index}`)
                .split('.')
                .slice(1),
            })
          }
        })
      }

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
