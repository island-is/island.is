import { z } from 'zod'
import * as kennitala from 'kennitala'

const UserSchemaBase = z.object({
  nationalId: z
    .string()
    .refine(
      (nationalId) =>
        nationalId &&
        nationalId.length !== 0 &&
        kennitala.isValid(nationalId) &&
        (kennitala.isCompany(nationalId) ||
          kennitala.info(nationalId).age >= 18),
    ),
  name: z.string().min(1),
})

export const UserInformationSchema = z.intersection(
  UserSchemaBase,
  z.object({
    approved: z.boolean().optional(),
  }),
)

const ParticipantSchema = z.object({
  name: z.string().min(1),
  ssn: z.string().min(1),
})

export const SeminarAnswersSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: UserInformationSchema,
  participantList: z.array(ParticipantSchema),
})

export type SeminarAnswers = z.TypeOf<typeof SeminarAnswersSchema>
