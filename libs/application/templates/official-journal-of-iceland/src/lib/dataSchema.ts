import { z } from 'zod'
import { error } from './messages'
import { InputFields } from './types'
import {
  TypeIds,
  INSTITUTION_INDEX,
  MEMBER_INDEX,
  FileNames,
  AnswerOption,
} from './constants'

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

const getPath = (path: string) => path.split('.').slice(1)

export const dataSchema = z.object({
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
      department: z.string().optional(),
      type: z.string().optional(),
      title: z.string().optional(),
      document: z.string().optional(),
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
      type: z.string().optional(),
      signature: z.string().optional(),
      regular: z
        .array(
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
        )
        .optional(),
      committee: z
        .object({
          institution: z.string(),
          date: z.string(),
          chairman: z.object({
            above: z.string(),
            name: z.string(),
            below: z.string(),
            after: z.string(),
          }),
          members: z.array(
            z.object({
              name: z.string(),
              below: z.string(),
            }),
          ),
        })
        .optional(),
      additional: z.string().optional(),
    })
    .superRefine((signature, ctx) => {
      switch (signature.type) {
        case 'regular':
          signature.regular?.forEach((institution, index) => {
            // required fields are institution, date, member.name

            if (!institution.institution) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                params: error.emptyFieldError,
                path: InputFields.signature.regular.institution
                  .replace(INSTITUTION_INDEX, `${index}`)
                  .split('.')
                  .slice(1),
              })
            }

            if (!institution.date) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                params: error.emptyFieldError,
                path: InputFields.signature.regular.date
                  .replace(INSTITUTION_INDEX, `${index}`)
                  .split('.')
                  .slice(1),
              })
            }

            institution.members?.forEach((member, memberIndex) => {
              if (!member.name) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  params: error.emptyFieldError,
                  path: InputFields.signature.regular.members.name
                    .replace(INSTITUTION_INDEX, `${index}`)
                    .replace(MEMBER_INDEX, `${memberIndex}`)
                    .split('.')
                    .slice(1),
                })
              }
            })
          })

          break
        case 'committee':
          // required fields are institution, date, chairman.name, members.name

          if (!signature.committee?.institution) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              params: error.emptyFieldError,
              path: getPath(InputFields.signature.committee.institution),
            })
          }

          if (!signature.committee?.date) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              params: error.emptyFieldError,
              path: getPath(InputFields.signature.committee.date),
            })
          }

          if (!signature.committee?.chairman.name) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              params: error.emptyFieldError,
              path: getPath(InputFields.signature.committee.chairman.name),
            })
          }

          signature.committee?.members?.forEach((member, index) => {
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
          break
      }
    }),
  attachments: z.object({
    files: z.array(FileSchema),
    fileNames: z.enum([FileNames.ADDITIONS, FileNames.DOCUMENT]),
  }),
  publishing: z.object({
    date: z.string().optional(),
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
