import { z } from 'zod'
import { AssessmentAnswer } from '../utils/constants'

// One answer per question. Questions come from the API, so answers are stored in
// a record keyed by question id rather than as named fields. Completeness (every
// question answered) is enforced in the assessment field, since the set of
// questions is only known at runtime.
const assessmentAnswerSchema = z.object({
  answerValue: z.nativeEnum(AssessmentAnswer).optional(),
  remark: z.string().optional(),
})

export const dataSchema = z.object({
  // Consent checkbox on the intro screen. Rendered as a checkbox field, so the
  // value is an array that must contain the single ticked option.
  approveExternalData: z.array(z.string()).refine((v) => v.length > 0),
  assessment: z.record(assessmentAnswerSchema).optional(),
  // Applicant must tick the "answers are to the best of my knowledge"
  // confirmation on the overview before the self-assessment can be submitted.
  assessmentConfirmation: z.boolean().refine((v) => v, {
    params: {},
  }),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
