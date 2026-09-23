import { FormValue } from '@island.is/application/types'
import { dataSchema } from '../lib/dataSchema'

/**
 * The application system never validates answers against the full data schema.
 * Screens are validated one at a time as the applicant steps through the form,
 * and the submit endpoint only validates the answers sent with the submit
 * request itself. A SUBMIT event fired against a draft that was never filled
 * in (e.g. a duplicate submit from the prerequisites step) would therefore
 * send a nearly empty application to Tryggingastofnun.
 *
 * This schema is a final safeguard, checked right before the application is
 * sent. It intentionally only covers sections that every applicant must
 * complete regardless of application type, confirmation type or external
 * data, so that a legitimately completed application can never be rejected:
 * - The four confirmation sections and the sections only shown for first
 *   applications are conditional on external data and are excluded.
 * - Sections where every answer is optional are excluded since they cannot
 *   distinguish a completed application from an empty one.
 */
const submissionSchema = dataSchema.pick({
  applicantInfo: true,
  paymentInfo: true,
  questions: true,
  selfAssessmentQuestionsOne: true,
})

/**
 * Returns the top-level answer sections that are missing or invalid for
 * submission to Tryggingastofnun. An empty array means the application is
 * safe to send.
 */
export const getIncompleteAnswerSections = (answers: FormValue): string[] => {
  const result = submissionSchema.safeParse(answers)

  if (result.success) {
    return []
  }

  return [
    ...new Set(result.error.issues.map((issue) => String(issue.path[0] ?? ''))),
  ]
}
