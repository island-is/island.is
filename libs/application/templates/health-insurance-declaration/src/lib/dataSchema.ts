import { applicantInformationSchema } from '@island.is/application/ui-forms'
import { z } from 'zod'
import { ApplicantType } from '../shared/constants'

export const HealthInsuranceDeclarationSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: applicantInformationSchema(),
  isHealthInsured: z.boolean(),
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
  registerPersonsSpouseCheckboxField: z.string().array(),
  registerPersonsChildrenCheckboxField: z.string().array(),
  educationConfirmationFileUploadField: z
    .object({
      name: z.string(),
      key: z.string(),
      url: z.string().optional(),
    })
    .array()
    .refine((v) => v.length > 0),
  period: z
    .object({
      dateFieldTo: z
        .string()
        .min(1)
        .refine((v) => !!v && v.trim().length > 0),
      dateFieldFrom: z
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
        })
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['dateFieldTo'],
        })
        return false
      }
      return true
    }),
})

export type HealthInsuranceDeclaration = z.TypeOf<
  typeof HealthInsuranceDeclarationSchema
>
