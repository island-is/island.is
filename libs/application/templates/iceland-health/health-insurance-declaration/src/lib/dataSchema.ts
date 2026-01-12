import { applicantInformationSchema } from '@island.is/application/ui-forms'
import { z } from 'zod'
import { ApplicantType } from '../shared/constants'
import { errors } from './messages'

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

export type File = z.infer<typeof FileSchema>

export const HealthInsuranceDeclarationSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: applicantInformationSchema(),
  isHealthInsured: z.boolean(),
  hasSpouse: z.boolean(),
  hasChildren: z.boolean(),
  studentOrTouristRadioFieldTourist: z.enum([
    ApplicantType.STUDENT,
    ApplicantType.TOURIST,
  ]),
  residencyTouristRadioField: z
    .string()
    .or(z.undefined())
    .refine((v) => !!v),
  residencyStudentSelectField: z
    .string()
    .or(z.undefined())
    .refine((v) => !!v),
  selectedApplicants: z
    .object({
      registerPersonsApplicantCheckboxField: z.string().array().optional(),
      registerPersonsSpouseCheckboxField: z.string().array().optional(),
      registerPersonsChildrenCheckboxField: z.string().array().optional(),
    })
    .superRefine((v, ctx) => {
      if (
        !v.registerPersonsApplicantCheckboxField?.length &&
        !v.registerPersonsSpouseCheckboxField?.length &&
        !v.registerPersonsChildrenCheckboxField?.length
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['registerPersonsApplicantCheckboxField'],
          params: errors.fields.noSelectedApplicant,
        })
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['registerPersonsChildrenCheckboxField'],
          params: errors.fields.noSelectedApplicant,
        })
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['registerPersonsSpouseCheckboxField'],
          params: errors.fields.noSelectedApplicant,
        })
        return false
      }
      return true
    }),
  educationConfirmationFileUploadField: FileSchema.array().refine(
    (v) => v.length > 0,
  ),
  period: z
    .object({
      dateFieldFrom: z
        .string()
        .min(1)
        .refine((v) => !!v && v.trim().length > 0),
      dateFieldTo: z
        .string()
        .min(1)
        .refine((v) => !!v && v.trim().length > 0),
    })
    .superRefine((v, ctx) => {
      const start = new Date(v.dateFieldFrom)
      const end = new Date(v.dateFieldTo)
      if (start > end) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['dateFieldFrom'],
          params: errors.fields.endDateBeforeStart,
        })
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['dateFieldTo'],
          params: errors.fields.startDateAfterEnd,
        })
        return false
      }
      return true
    }),
})

export type HealthInsuranceDeclaration = z.TypeOf<
  typeof HealthInsuranceDeclarationSchema
>
