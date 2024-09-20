import { z } from 'zod'
import * as kennitala from 'kennitala'

// const TimeRefine = z.object({
//   from: z.string().refine((x) => (x ? isValid24HFormatTime(x) : false), {
//     params: error.invalidValue,
//   }),
//   to: z.string().refine((x) => (x ? isValid24HFormatTime(x) : false), {
//     params: error.invalidValue,
//   }),
// })

// const OpeningHoursRefine = z.object({
//   weekdays: TimeRefine,
//   weekends: TimeRefine,
// })

// const Time = z.object({
//   from: z.string().optional(),
//   to: z.string().optional(),
// })

const option = z.object({
  value: z.string(),
  label: z.string(),
})

const accidentSchema = z.object({
  accidentLocation: z.object({
    value: z.string(),
    label: z.string(),
  }),
  accidentLocationParentGroup: option.optional(),
})

const companySchema = z.object({
  nationalId: z
    .string()
    .refine(
      (nationalId) =>
        nationalId && nationalId.length !== 0 && kennitala.isValid(nationalId),
    ),
})

const employeeSchema = z.object({
  victimsOccupation: option,
  victimsOccupationMajor: option.optional().nullish(),
  victimsOccupationSubMajor: option.optional().nullish(),
  victimsOccupationMinor: option.optional().nullish(),
  victimsOccupationUnit: option.optional().nullish(),
})

const companyLaborProtectionSchema = z.object({
  workhealthAndSafetyOccupation: z.array(z.string()).optional(),
})

const projectPurchaseSchema = z.object({
  nationalId: z
    .string()
    .optional()
    .refine(
      (nationalId) =>
        !nationalId || (nationalId.length > 0 && kennitala.isValid(nationalId)),
      {
        message: 'Invalid nationalId',
      },
    ),
})

export const WorkAccidentNotificationAnswersSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v), // TODO ?
  companyInformation: companySchema,
  companyLaborProtection: companyLaborProtectionSchema,
  accident: accidentSchema,
  employee: employeeSchema,
  projectPurchase: projectPurchaseSchema,
})

export type WorkAccidentNotification = z.TypeOf<
  typeof WorkAccidentNotificationAnswersSchema
>
