import { z } from 'zod'
import { error } from './messages'
import { AnswerOption, InputFields } from './types'
import { TypeIds, INSTITUTION_INDEX, MEMBER_INDEX } from './constants'

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

const getPath = (path: string) => path.split('.').slice(1)

export const dataSchema = z.object({
  test: z.object({
    name: z.string().refine((v) => v && v.length, {
      params: error.emptyFieldError,
    }),
    department: z.string().refine((v) => v && v.length, {
      params: error.emptyFieldError,
    }),
    job: z.string().refine((v) => v && v.length, {
      params: error.emptyFieldError,
    }),
  }),
  requirements: z
    .object({
      approveExternalData: z.string(),
    })
    .refine((schema) => schema.approveExternalData === AnswerOption.YES, {
      params: error.dataGathering,
      path: getPath(InputFields.requirements.approveExternalData),
    }),
  advert: z
    .object({
      department: z.string().refine((v) => v && v.length),
      type: z.string().refine((v) => v && v.length),
      title: z.string().refine((v) => v && v.length, {
        params: error.emptyFieldError,
      }),
      document: z.string().refine((v) => v && v.length),
      template: z.string().optional(),
      subType: z.string().optional(),
    })
    .superRefine((advert, ctx) => {
      if (advert.type === TypeIds.REGLUGERDIR) {
        if (!advert.subType) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            params: error.emptyFieldError,
            path: getPath(InputFields.advert.subType),
          })
        }
      }
    }),
  signature: z
    .object({
      type: z.string(),
      signature: z.string(),
      regular: z.array(
        z.object({
          institution: z.string(),
          date: z.string(),
          members: z.array(
            z.object({
              above: z.string(),
              name: z.string(),
              below: z.string(),
              after: z.string(),
            }),
          ),
        }),
      ),
      committee: z.object({
        institution: z.string(),
        date: z.string(),
        chairman: z.object({
          textAbove: z.string(),
          name: z.string(),
          textBelow: z.string(),
          textAfter: z.string(),
        }),
        members: z.array(
          z.object({
            name: z.string(),
            textBelow: z.string(),
          }),
        ),
      }),
      additional: z.string().optional(),
    })
    .superRefine((signature, ctx) => {
      if (signature.type === 'regular') {
        // required fields are institution and members name
        signature.regular?.forEach((signature, institutionIndex) => {
          if (!signature.institution) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              params: error.emptyFieldError,
              path: InputFields.signature.regular.institution
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
                path: InputFields.signature.regular.members.name
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
        if (!signature.committee.institution) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            params: error.emptyFieldError,
            path: InputFields.signature.committee.institution
              .split('.')
              .slice(1),
          })

          // check name of members
          signature.committee.members?.forEach((member, index) => {
            if (!member.name) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                params: error.emptyFieldError,
                path: InputFields.signature.committee.members.name
                  .replace(MEMBER_INDEX, `${index}`)
                  .split('.')
                  .slice(1),
              })
            }
          })
        }

        if (!signature.committee.chairman.name) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            params: error.emptyFieldError,
            path: InputFields.signature.committee.chairman.name
              .split('.')
              .slice(1),
          })
        }

        signature.committee.members?.forEach((member, index) => {
          if (!member.name) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              params: error.emptyFieldError,
              path: InputFields.signature.committee.members.name
                .replace(MEMBER_INDEX, `${index}`)
                .split('.')
                .slice(1),
            })
          }
        })
      }
    }),
  additionsAndDocuments: z.object({
    files: z.array(FileSchema),
    fileNames: z.enum(['additions', 'documents']),
  }),
  publishing: z.object({
    date: z.string(),
    fastTrack: z.enum([AnswerOption.YES, AnswerOption.NO]),
    contentCategories: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      }),
    ),
    communicationChannels: z.array(
      z.object({
        email: z.string(),
        phone: z.string(),
      }),
    ),
    message: z.string().optional(),
  }),
})

export type answerSchemas = z.infer<typeof dataSchema>
